import database from "../database.js"
import { randomUUID } from "crypto"

export const GetProviders = async () => {
    const sql = `
        SELECT p.id, p.name, p.rif_cedula, p.main_contact, p.contact_phone, p.contact_email, p.status, p.created_at
        FROM providers p
        WHERE p.status = 'Active'
        ORDER BY p.name ASC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetProviderById = async (id) => {
    const sql = `
        SELECT p.*
        FROM providers p
        WHERE p.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    if (rowCount === 0) return { results: 0, data: null }
    return { results: 1, data: rows[0] }
}

export const CreateProvider = async (data) => {
    const id = randomUUID()
    const sql = `
        INSERT INTO providers (
            id, name, rif_cedula, main_contact, contact_phone,
            contact_email, address, status, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,'Active',NOW(),NOW())
        RETURNING id, name, rif_cedula, status, created_at
    `
    const values = [
        id,
        data.name,
        data.rif_cedula || null,
        data.main_contact || null,
        data.contact_phone || null,
        data.contact_email || null,
        data.address || null
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const UpdateProvider = async (id, data) => {
    const sql = `
        UPDATE providers SET
            name = $1,
            rif_cedula = $2,
            main_contact = $3,
            contact_phone = $4,
            contact_email = $5,
            address = $6,
            status = $7,
            updated_at = NOW()
        WHERE id = $8
        RETURNING id, name, status
    `
    const values = [
        data.name,
        data.rif_cedula || null,
        data.main_contact || null,
        data.contact_phone || null,
        data.contact_email || null,
        data.address || null,
        data.status || 'Active',
        id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const DeleteProvider = async (id) => {
    const sql = `UPDATE providers SET status = 'Inactive', updated_at = NOW() WHERE id = $1 RETURNING id, name`
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}
