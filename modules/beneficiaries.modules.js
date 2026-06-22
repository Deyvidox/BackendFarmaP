import database from "../database.js"
import { randomUUID } from "crypto"

export const GetBeneficiaries = async () => {
    console.log('📝 Obteniendo beneficiarios...')
    const sql = `
        SELECT
            b.id,
            b.identification_number,
            b.first_name,
            b.last_name,
            b.birth_date,
            b.gender,
            b.phone_personal,
            b.email,
            b.emergency_contact,
            b.emergency_phone,
            b.detailed_address,
            b.dependents,
            b.monthly_income,
            b.priority_level,
            b.status,
            b.registration_date,
            b.created_at,
            c.name AS community_name,
            c.municipality,
            c.parish,
            DATE_PART('year', AGE(b.birth_date)) AS age,
            COALESCE(
                (SELECT json_agg(json_build_object(
                    'id', bd.id,
                    'nombre', d.name,
                    'fechaDiagnostico', bd.diagnosis_date,
                    'estado', bd.current_status,
                    'tratamiento', bd.current_treatment,
                    'observaciones', bd.observations
                ))
                 FROM beneficiary_diseases bd
                 INNER JOIN diseases d ON d.id = bd.disease_id
                 WHERE bd.beneficiary_id = b.id),
                '[]'::json
            ) AS enfermedades,
            COALESCE(
                (SELECT json_agg(json_build_object(
                    'id', bv.id,
                    'nombre', vt.name,
                    'puntos', vt.priority_points,
                    'observaciones', bv.observations
                ))
                 FROM beneficiary_vulnerabilities bv
                 INNER JOIN vulnerability_types vt ON vt.id = bv.vulnerability_type_id
                 WHERE bv.beneficiary_id = b.id),
                '[]'::json
            ) AS vulnerabilidades
        FROM beneficiaries b
        LEFT JOIN communities c ON c.id = b.community_id
        WHERE b.status = 'Active'
        ORDER BY b.created_at DESC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetBeneficiaryById = async (id) => {
    const sql = `
        SELECT
            b.*,
            c.name AS community_name,
            c.municipality,
            DATE_PART('year', AGE(b.birth_date)) AS age
        FROM beneficiaries b
        LEFT JOIN communities c ON c.id = b.community_id
        WHERE b.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const CreateBeneficiary = async (data) => {
    const id = randomUUID()
    const sql = `
        INSERT INTO beneficiaries (
            id, identification_number, first_name, last_name,
            birth_date, gender, community_id, detailed_address,
            phone_personal, email, emergency_contact, emergency_phone,
            dependents, monthly_income, priority_level, status,
            registration_date, created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, 'Active', CURRENT_DATE, NOW(), NOW()
        )
        RETURNING id, first_name, last_name, identification_number, created_at
    `
    const values = [
        id,
        data.identification_number || null,
        data.first_name,
        data.last_name,
        data.birth_date || null,
        data.gender || null,
        data.community_id || null,
        data.detailed_address || null,
        data.phone_personal || null,
        data.email || null,
        data.emergency_contact || null,
        data.emergency_phone || null,
        data.dependents || 0,
        data.monthly_income || null,
        data.priority_level || 'Low'
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const UpdateBeneficiary = async (id, data) => {
    const sql = `
        UPDATE beneficiaries SET
            identification_number = $1,
            first_name = $2,
            last_name = $3,
            birth_date = $4,
            gender = $5,
            community_id = $6,
            detailed_address = $7,
            phone_personal = $8,
            email = $9,
            emergency_contact = $10,
            emergency_phone = $11,
            dependents = $12,
            monthly_income = $13,
            priority_level = $14,
            updated_at = NOW()
        WHERE id = $15
        RETURNING id, first_name, last_name
    `
    const values = [
        data.identification_number || null,
        data.first_name,
        data.last_name,
        data.birth_date || null,
        data.gender || null,
        data.community_id || null,
        data.detailed_address || null,
        data.phone_personal || null,
        data.email || null,
        data.emergency_contact || null,
        data.emergency_phone || null,
        data.dependents || 0,
        data.monthly_income || null,
        data.priority_level || 'Low',
        id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const DeleteBeneficiary = async (id) => {
    const sql = `UPDATE beneficiaries SET status = 'Inactive', updated_at = NOW() WHERE id = $1 RETURNING id, first_name, last_name`
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}
