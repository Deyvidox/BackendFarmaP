import database from "../database.js"
import { randomUUID } from "crypto"

export const GetRequests = async () => {
    const sql = `
        SELECT
            r.id,
            r.request_date,
            r.request_type,
            r.general_priority,
            r.general_justification,
            r.status,
            r.observations,
            r.created_at,
            p.name AS provider_name,
            p.rif_cedula AS provider_rif,
            r.responsible_name,
            r.department,
            COUNT(rd.id) AS total_medicines,
            COALESCE(SUM(rd.quantity), 0) AS total_units
        FROM requests r
        LEFT JOIN providers p ON p.id = r.provider_id
        LEFT JOIN request_details rd ON rd.request_id = r.id
        GROUP BY r.id, p.name, p.rif_cedula
        ORDER BY r.created_at DESC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetRequestById = async (id) => {
    const sql = `
        SELECT r.*, p.name AS provider_name, p.rif_cedula AS provider_rif
        FROM requests r
        LEFT JOIN providers p ON p.id = r.provider_id
        WHERE r.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const CreateRequest = async (data) => {
    const client = await database.connect()
    try {
        await client.query('BEGIN')

        // 1. Insertar la solicitud
        const requestId = randomUUID()
        const sql = `
            INSERT INTO requests (
                id, provider_id, request_type, request_date, required_date,
                general_priority, general_justification, responsible_name, department,
                status, observations, created_at, updated_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
            RETURNING id, status, created_at
        `
        const values = [
            requestId,
            data.provider_id,
            data.request_type,
            data.request_date || new Date(),
            data.required_date || null,
            data.general_priority || 'MEDIA',
            data.general_justification || null,
            data.responsible_name,
            data.department || null,
            data.status || 'PENDIENTE',
            data.observations || null
        ]
        await client.query(sql, values)

        // 2. Insertar los medicamentos solicitados (sin lote aún)
        if (data.medicines && data.medicines.length > 0) {
            for (const med of data.medicines) {
                const detailId = randomUUID()
                await client.query(`
                    INSERT INTO request_details (
                        id, request_id, medicine_id, quantity,
                        priority, justification, created_at
                    ) VALUES ($1,$2,$3,$4,$5,$6,NOW())
                `, [detailId, requestId, med.medicine_id, med.quantity, med.priority || 'MEDIA', med.justification || null])
            }
        }

        await client.query('COMMIT')
        return { results: 1, data: { id: requestId } }
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}

export const UpdateRequest = async (id, data) => {
    const client = await database.connect()
    try {
        await client.query('BEGIN')

        // 1. Actualizar cabecera
        const sql = `
            UPDATE requests SET
                status = $1,
                observations = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING id, status, provider_id
        `
        const { rows } = await client.query(sql, [data.status, data.observations || null, id])
        if (rows.length === 0) {
            await client.query('ROLLBACK')
            throw new Error('Solicitud no encontrada')
        }

        // 2. Si el estado cambia a COMPLETADA, procesar los medicamentos recibidos
        if (data.status === 'COMPLETADA') {
            if (!data.medicines || data.medicines.length === 0) {
                await client.query('ROLLBACK')
                throw new Error('Para completar la solicitud debe enviar los medicamentos recibidos con lote y vencimiento')
            }

            for (const med of data.medicines) {
                // Crear lote
                const lotId = randomUUID()
                await client.query(`
                    INSERT INTO medicine_lots (
                        id, medicine_id, lot_number, expiration_date,
                        total_units, quality_status, status, warehouse_location,
                        created_at, updated_at
                    ) VALUES ($1,$2,$3,$4,$5,'Available','Available','San Cristóbal',NOW(),NOW())
                `, [lotId, med.medicine_id, med.lot_number, med.expiration_date, med.quantity])

                // Crear inventario inicial
                const inventoryId = randomUUID()
                await client.query(`
                    INSERT INTO inventories (
                        id, lot_id, medicine_id, location,
                        total_quantity, available_quantity, reserved_quantity, delivered_quantity,
                        minimum_stock, maximum_stock, status, last_movement, created_at, updated_at
                    ) VALUES ($1,$2,$3,$4,$5,$5,0,0,10,1000,'Optimal',NOW(),NOW(),NOW())
                `, [inventoryId, lotId, med.medicine_id, 'San Cristóbal', med.quantity])

                // Registrar movimiento de entrada
                const movementId = randomUUID()
                await client.query(`
                    INSERT INTO inventory_movements (
                        id, inventory_id, movement_type, quantity,
                        previous_quantity, new_quantity, user_id, motive, document_reference, created_at
                    ) VALUES ($1,$2,'ENTRY',$3,0,$3,$4,'Solicitud completada','SOL-' || $5,NOW())
                `, [movementId, inventoryId, med.quantity, data.receiver_user_id || null, id.substring(0, 8).toUpperCase()])
            }
        }

        await client.query('COMMIT')
        return { results: 1, data: rows[0] }
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}