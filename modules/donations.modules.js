import database from "../database.js"
import { randomUUID } from "crypto"

export const GetDonations = async () => {
    const sql = `
        SELECT
            d.id,
            d.reception_date,
            d.documentation_date,
            d.document_number,
            d.estimated_total_value,
            d.destination_warehouse,
            d.transport_conditions,
            d.observations,
            d.status,
            d.created_at,
            dn.id AS donor_id,
            dn.name AS donor_name,
            dn.rif_cedula,
            dt.name AS donation_type
        FROM donations d
        LEFT JOIN donors dn ON dn.id = d.donor_id
        LEFT JOIN donation_types dt ON dt.id = d.donation_type_id
        ORDER BY d.created_at DESC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetDonationById = async (id) => {
    const sql = `
        SELECT d.*, dn.name AS donor_name, dn.rif_cedula, dt.name AS donation_type
        FROM donations d
        LEFT JOIN donors dn ON dn.id = d.donor_id
        LEFT JOIN donation_types dt ON dt.id = d.donation_type_id
        WHERE d.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const CreateDonation = async (data) => {
    const client = await database.connect()
    try {
        await client.query('BEGIN')

        const donationId = randomUUID()
        const donationSql = `
            INSERT INTO donations (
                id, donor_id, donation_type_id, receiver_user_id,
                reception_date, documentation_date, document_number,
                estimated_total_value, destination_warehouse, transport_conditions,
                observations, status, created_at, updated_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
            RETURNING id, status, created_at
        `
        const donationValues = [
            donationId,
            data.donor_id,
            data.donation_type_id,
            data.receiver_user_id || null,
            data.reception_date || new Date(),
            data.documentation_date || null,
            data.document_number || null,
            data.estimated_total_value || null,
            data.destination_warehouse || null,
            data.transport_conditions || null,
            data.observations || null,
            data.status || 'Received'
        ]
        await client.query(donationSql, donationValues)

        if (data.medicines && data.medicines.length > 0) {
            for (const med of data.medicines) {
                const lotId = randomUUID()
                await client.query(`
                    INSERT INTO medicine_lots (
                        id, medicine_id, lot_number, expiration_date,
                        total_units, donation_id, status, warehouse_location,
                        created_at, updated_at
                    ) VALUES ($1,$2,$3,$4,$5,$6,'Available',$7,NOW(),NOW())
                `, [lotId, med.medicine_id, med.lot_number, med.expiration_date, med.quantity, donationId, data.destination_warehouse || 'San Cristóbal'])

                const inventoryId = randomUUID()
                await client.query(`
                    INSERT INTO inventories (
                        id, lot_id, location,
                        total_quantity, available_quantity, reserved_quantity, delivered_quantity,
                        minimum_stock, maximum_stock, status, last_movement, created_at, updated_at
                    ) VALUES ($1,$2,$3,$4,$4,0,0,10,1000,'Optimal',NOW(),NOW(),NOW())
                `, [inventoryId, lotId, data.destination_warehouse || 'San Cristóbal', med.quantity])

                const movementId = randomUUID()
                await client.query(`
                    INSERT INTO inventory_movements (
                        id, inventory_id, movement_type, quantity,
                        previous_quantity, new_quantity, user_id, motive,
                        reference_id, reference_type, created_at
                    ) VALUES ($1,$2,'Entry',$3,0,$3,$4,'Donación recibida',$5,'donation',NOW())
                `, [movementId, inventoryId, med.quantity, data.receiver_user_id || null, donationId])
            }
        }

        await client.query('COMMIT')
        return { results: 1, data: { id: donationId } }
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}

export const UpdateDonation = async (id, data) => {
    const sql = `
        UPDATE donations SET
            status = COALESCE($1, status),
            observations = COALESCE($2, observations),
            reception_date = COALESCE($3, reception_date),
            document_number = COALESCE($4, document_number),
            updated_at = NOW()
        WHERE id = $5
        RETURNING id, status
    `
    const values = [
        data.status || null,
        data.observations || null,
        data.reception_date || null,
        data.document_number || null,
        id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const DeleteDonation = async (id) => {
    const sql = `DELETE FROM donations WHERE id = $1 RETURNING id`
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const GetDonors = async () => {
    // Mostrar todos los donantes, sin filtrar por estado
    const sql = `
        SELECT d.id, d.name, d.rif_cedula, d.main_contact, d.contact_phone, d.contact_email, d.status,
               dt.name AS donor_type
        FROM donors d
        LEFT JOIN donor_types dt ON dt.id = d.donor_type_id
        ORDER BY d.name ASC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const CreateDonor = async (data) => {
    const id = randomUUID()
    const sql = `
        INSERT INTO donors (
            id, name, rif_cedula, main_contact, contact_phone,
            contact_email, address, donation_frequency, donor_type_id,
            status, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Active',NOW(),NOW())
        RETURNING id, name, rif_cedula, status, created_at
    `
    const values = [
        id,
        data.name,
        data.rif_cedula || null,
        data.main_contact || null,
        data.contact_phone || null,
        data.contact_email || null,
        data.address || null,
        data.donation_frequency || null,
        data.donor_type_id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const UpdateDonor = async (id, data) => {
    const sql = `
        UPDATE donors SET
            name = $1,
            rif_cedula = $2,
            main_contact = $3,
            contact_phone = $4,
            contact_email = $5,
            address = $6,
            donation_frequency = $7,
            donor_type_id = $8,
            status = COALESCE($9::donor_status, 'Active'::donor_status),
            updated_at = NOW()
        WHERE id = $10
        RETURNING id, name, status
    `
    const values = [
        data.name,
        data.rif_cedula,
        data.main_contact,
        data.contact_phone,
        data.contact_email,
        data.address || null,
        data.donation_frequency || null,
        data.donor_type_id,
        data.status || null,    // <-- se pasa como texto, el cast se hace en la consulta
        id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

// DeleteDonor ahora es eliminación física
export const DeleteDonor = async (id) => {
    const sql = `DELETE FROM donors WHERE id = $1 RETURNING id, name`
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}