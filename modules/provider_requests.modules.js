import database from "../database.js"
import { randomUUID } from "crypto"

export const GetProviderRequests = async () => {
    const sql = `
        SELECT
            pr.id,
            pr.request_date,
            pr.required_date,
            pr.request_type,
            pr.general_priority,
            pr.general_justification,
            pr.responsible_name,
            pr.department,
            pr.status,
            pr.observations,
            pr.created_at,
            p.name AS provider_name,
            p.rif_cedula AS provider_rif,
            (SELECT COUNT(*) FROM provider_request_details prd WHERE prd.provider_request_id = pr.id) AS total_medicines,
            (SELECT COALESCE(SUM(prd.requested_quantity), 0) FROM provider_request_details prd WHERE prd.provider_request_id = pr.id) AS total_units
        FROM provider_requests pr
        LEFT JOIN providers p ON p.id = pr.provider_id
        ORDER BY pr.created_at DESC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetProviderRequestById = async (id) => {
    const sql = `
        SELECT pr.*,
               p.name AS provider_name, p.rif_cedula AS provider_rif
        FROM provider_requests pr
        LEFT JOIN providers p ON p.id = pr.provider_id
        WHERE pr.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])

    if (rowCount === 0) return { results: 0, data: null }

    // Obtener los detalles (medicamentos) de la solicitud
    const detailsSql = `
        SELECT prd.*,
               m.commercial_name AS medicine_name,
               m.active_principle,
               m.concentration,
               pf.name AS pharmaceutical_form
        FROM provider_request_details prd
        LEFT JOIN medicines m ON m.id = prd.medicine_id
        LEFT JOIN pharmaceutical_forms pf ON pf.id = m.pharmaceutical_form_id
        WHERE prd.provider_request_id = $1
        ORDER BY prd.created_at ASC
    `
    const details = await database.query(detailsSql, [id])

    const result = {
        ...rows[0],
        medicines: details.rows
    }

    return { results: rowCount, data: result }
}

export const CreateProviderRequest = async (data) => {
    const client = await database.connect()
    try {
        await client.query('BEGIN')

        const id = randomUUID()
        const sql = `
            INSERT INTO provider_requests (
                id, provider_id, request_date, required_date,
                request_type, general_priority, general_justification,
                responsible_name, department, status, observations,
                created_at, updated_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
            RETURNING id, status, created_at
        `
        const values = [
            id,
            data.provider_id,
            data.request_date || new Date(),
            data.required_date || null,
            data.request_type || 'RUTINARIA',
            data.general_priority || 'MEDIA',
            data.general_justification || null,
            data.responsible_name || null,
            data.department || null,
            data.status || 'PENDIENTE',
            data.observations || null
        ]
        const { rows } = await client.query(sql, values)

        // Insertar los medicamentos (detalles)
        if (data.medicines && data.medicines.length > 0) {
            const detailSql = `
                INSERT INTO provider_request_details (
                    id, provider_request_id, medicine_id,
                    requested_quantity, priority, justification,
                    status, created_at, updated_at
                ) VALUES ($1,$2,$3,$4,$5,$6,'PENDIENTE',NOW(),NOW())
            `
            for (const med of data.medicines) {
                const detailId = randomUUID()
                await client.query(detailSql, [
                    detailId,
                    id,
                    med.medicine_id,
                    med.quantity,
                    med.priority || 'MEDIA',
                    med.justification || null
                ])
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

export const UpdateProviderRequest = async (id, data) => {
    const sql = `
        UPDATE provider_requests SET
            status = $1, observations = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING id, status
    `
    const values = [
        data.status,
        data.observations || null,
        id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const DeleteProviderRequest = async (id) => {
    const client = await database.connect()
    try {
        await client.query('BEGIN')
        // Eliminar detalles primero
        await client.query(`DELETE FROM provider_request_details WHERE provider_request_id = $1`, [id])
        const { rows, rowCount } = await client.query(`DELETE FROM provider_requests WHERE id = $1 RETURNING id`, [id])
        await client.query('COMMIT')
        return { results: rowCount, data: rows[0] }
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}
