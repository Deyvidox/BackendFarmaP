import database from "../database.js"
import { randomUUID } from "crypto"

export const CreateCommunity = async (data) => {
    const id = randomUUID()
    const sql = `
        INSERT INTO communities (
            id, name, parish, municipality, state_region, description, status, created_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, 'Active', NOW()
        )
        RETURNING *
    `
    const values = [
        id,
        data.name,
        data.parish || null,
        data.municipality || null,
        data.state_region || 'Sin especificar',
        data.description || null
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const GetCommunities = async () => {
    const sql = `SELECT id, name, parish, municipality, state_region, status FROM communities WHERE status = 'Active' ORDER BY name ASC`
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetLaboratories = async () => {
    const sql = `SELECT id, name, rif_cedula, phone, email, status FROM laboratories WHERE status = 'Active' ORDER BY name ASC`
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetPharmaceuticalForms = async () => {
    const sql = `SELECT id, name, description, status FROM pharmaceutical_forms WHERE status = 'Active' ORDER BY name ASC`
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetMedicineCategories = async () => {
    const sql = `SELECT id, name, description, distribution_priority, status FROM medicine_categories WHERE status = 'Active' ORDER BY distribution_priority DESC, name ASC`
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetDonorTypes = async () => {
    const sql = `SELECT id, name, description, status FROM donor_types WHERE status = 'Active' ORDER BY name ASC`
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetDonationTypes = async () => {
    const sql = `SELECT id, name, description, status FROM donation_types WHERE status = 'Active' ORDER BY name ASC`
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetVulnerabilityTypes = async () => {
    const sql = `SELECT id, name, description, priority_points, status FROM vulnerability_types WHERE status = 'Active' ORDER BY priority_points DESC`
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetDiseases = async () => {
    const sql = `SELECT id, codigo_cie, name, type, description FROM diseases WHERE status = 'Active' ORDER BY name ASC`
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}
