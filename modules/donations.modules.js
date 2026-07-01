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
    const id = randomUUID()
    const sql = `
        INSERT INTO donations (
            id, donor_id, donation_type_id, receiver_user_id,
            reception_date, documentation_date, document_number,
            estimated_total_value, destination_warehouse, transport_conditions,
            observations, status, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
        RETURNING id, status, created_at
    `
    const values = [
        id,
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
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const UpdateDonation = async (id, data) => {
    const sql = `
        UPDATE donations SET
            status = $1, observations = $2, destination_warehouse = $3,
            transport_conditions = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING id, status
    `
    const values = [
        data.status, data.observations || null,
        data.destination_warehouse || null, data.transport_conditions || null, id
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
    const sql = `
        SELECT d.id, d.name, d.rif_cedula, d.main_contact, d.contact_phone, d.contact_email, d.status,
               dt.name AS donor_type
        FROM donors d
        LEFT JOIN donor_types dt ON dt.id = d.donor_type_id
        WHERE d.status = 'Active'
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
            updated_at = NOW()
        WHERE id = $9
        RETURNING id, name, status
    `
    const values = [
        data.name,
        data.rif_cedula || null,
        data.main_contact || null,
        data.contact_phone || null,
        data.contact_email || null,
        data.address || null,
        data.donation_frequency || null,
        data.donor_type_id,
        id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const DeleteDonor = async (id) => {
    const sql = `UPDATE donors SET status = 'Inactive', updated_at = NOW() WHERE id = $1 RETURNING id, name`
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

