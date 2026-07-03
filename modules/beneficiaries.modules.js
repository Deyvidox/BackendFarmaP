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
            b.occupation,
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
                    'disease_id', bd.disease_id,
                    'nombre', d.name,
                    'fechaDiagnostico', bd.diagnosis_date,
                    'estado', bd.current_status,
                    'tratamiento', bd.current_treatment,
                    'observaciones', bd.observations
                ))
                  FROM beneficiary_diseases bd
                 LEFT JOIN diseases d ON d.id = bd.disease_id
                 WHERE bd.beneficiary_id = b.id),
                '[]'::json
            ) AS enfermedades,
            COALESCE(
                (SELECT json_agg(json_build_object(
                    'id', bv.id,
                    'vulnerability_type_id', bv.vulnerability_type_id,
                    'nombre', vt.name,
                    'puntos', vt.priority_points,
                    'observaciones', bv.observations
                ))
                 FROM beneficiary_vulnerabilities bv
                 LEFT JOIN vulnerability_types vt ON vt.id = bv.vulnerability_type_id
                 WHERE bv.beneficiary_id = b.id),
                '[]'::json
            ) AS vulnerabilidades,
            COALESCE(
                (SELECT json_agg(json_build_object(
                    'id', bm.id,
                    'medicine_id', m.id,
                    'nombre_comercial', m.commercial_name,
                    'nombre_generico', m.generic_name,
                    'dosis', bm.dosage_instructions
                ))
                 FROM beneficiary_medicines bm
                 LEFT JOIN medicines m ON m.id = bm.medicine_id
                 WHERE bm.beneficiary_id = b.id),
                '[]'::json
            ) AS medicinas_requeridas
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
            c.parish,
            DATE_PART('year', AGE(b.birth_date)) AS age,
            COALESCE(
                (SELECT json_agg(json_build_object(
                    'id', bd.id,
                    'disease_id', bd.disease_id,
                    'nombre', d.name,
                    'fechaDiagnostico', bd.diagnosis_date,
                    'estado', bd.current_status,
                    'tratamiento', bd.current_treatment,
                    'observaciones', bd.observations
                ))
                 FROM beneficiary_diseases bd
                 LEFT JOIN diseases d ON d.id = bd.disease_id
                 WHERE bd.beneficiary_id = b.id),
                '[]'::json
            ) AS enfermedades,
            COALESCE(
                (SELECT json_agg(json_build_object(
                    'id', bv.id,
                    'vulnerability_type_id', bv.vulnerability_type_id,
                    'nombre', vt.name,
                    'puntos', vt.priority_points,
                    'observaciones', bv.observations
                ))
                 FROM beneficiary_vulnerabilities bv
                 INNER JOIN vulnerability_types vt ON vt.id = bv.vulnerability_type_id
                 WHERE bv.beneficiary_id = b.id),
                '[]'::json
            ) AS vulnerabilidades,
            COALESCE(
                (SELECT json_agg(json_build_object(
                    'id', bm.id,
                    'medicine_id', m.id,
                    'nombre_comercial', m.commercial_name,
                    'nombre_generico', m.generic_name,
                    'dosis', bm.dosage_instructions
                ))
                 FROM beneficiary_medicines bm
                 LEFT JOIN medicines m ON m.id = bm.medicine_id
                 WHERE bm.beneficiary_id = b.id),
                '[]'::json
            ) AS medicinas_requeridas
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
            dependents, occupation, priority_level, status,
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
        data.occupation || null,
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
            occupation = $13,
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
        data.occupation || null,
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

export const SaveBeneficiaryMedicalHistory = async (beneficiaryId, diseases, vulnerabilities) => {
    const client = await database.connect()
    try {
        await client.query('BEGIN')

        // 1. Clear existing diseases
        await client.query('DELETE FROM beneficiary_diseases WHERE beneficiary_id = $1', [beneficiaryId])
        // 2. Insert new diseases
        for (const d of diseases) {
            let finalDiseaseId = d.disease_id
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            if (finalDiseaseId && !uuidRegex.test(finalDiseaseId)) {
                const { rows: existingRows } = await client.query('SELECT id FROM diseases WHERE name ILIKE $1 LIMIT 1', [finalDiseaseId])
                if (existingRows.length > 0) {
                    finalDiseaseId = existingRows[0].id
                } else {
                    const newId = randomUUID()
                    await client.query('INSERT INTO diseases (id, name, type, status, created_at) VALUES ($1, $2, $3, $4, NOW())', [newId, finalDiseaseId, 'Otra', 'Active'])
                    finalDiseaseId = newId
                }
            }

            const id = randomUUID()
            await client.query(
                `INSERT INTO beneficiary_diseases (id, beneficiary_id, disease_id, diagnosis_date, current_treatment, current_status, observations, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                [id, beneficiaryId, finalDiseaseId, d.diagnosis_date || null, d.current_treatment || null, d.current_status || null, d.observations || null]
            )
        }

        // 3. Clear existing vulnerabilities
        await client.query('DELETE FROM beneficiary_vulnerabilities WHERE beneficiary_id = $1', [beneficiaryId])
        // 4. Insert new vulnerabilities
        for (const v of vulnerabilities) {
            const id = randomUUID()
            await client.query(
                `INSERT INTO beneficiary_vulnerabilities (id, beneficiary_id, vulnerability_type_id, observations, created_at)
                 VALUES ($1, $2, $3, $4, NOW())`,
                [id, beneficiaryId, v.vulnerability_type_id, v.observations || null]
            )
        }

        await client.query('COMMIT')
        return { success: true }
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}

export const SaveBeneficiaryMedicines = async (id, data) => {
    try {
        await database.query('BEGIN')
        await database.query(`DELETE FROM beneficiary_medicines WHERE beneficiary_id = $1`, [id])

        if (data.medicines && data.medicines.length > 0) {
            for (const med of data.medicines) {
                await database.query(`
                    INSERT INTO beneficiary_medicines (id, beneficiary_id, medicine_id, dosage_instructions)
                    VALUES ($1, $2, $3, $4)
                `, [randomUUID(), id, med.medicine_id, med.dosage_instructions || null])
            }
        }
        await database.query('COMMIT')
        return { results: 1 }
    } catch (error) {
        await database.query('ROLLBACK')
        throw error
    }
}

export const AddBeneficiaryDisease = async (beneficiaryId, data) => {
    let finalDiseaseId = data.disease_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (finalDiseaseId && !uuidRegex.test(finalDiseaseId)) {
        const { rows: existingRows } = await database.query('SELECT id FROM diseases WHERE name ILIKE $1 LIMIT 1', [finalDiseaseId])
        if (existingRows.length > 0) {
            finalDiseaseId = existingRows[0].id
        } else {
            const newId = randomUUID()
            await database.query('INSERT INTO diseases (id, name, type, status, created_at) VALUES ($1, $2, $3, $4, NOW())', [newId, finalDiseaseId, 'Otra', 'Active'])
            finalDiseaseId = newId
        }
    }

    const id = randomUUID()
    const sql = `
        INSERT INTO beneficiary_diseases (
            id, beneficiary_id, disease_id, diagnosis_date, current_treatment, current_status, observations, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id
    `
    const values = [
        id, beneficiaryId, finalDiseaseId, data.diagnosis_date || null, data.current_treatment || null, data.current_status || null, data.observations || null
    ]
    const { rowCount, rows } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const AddBeneficiaryVulnerability = async (beneficiaryId, data) => {
    const id = randomUUID()
    const sql = `
        INSERT INTO beneficiary_vulnerabilities (
            id, beneficiary_id, vulnerability_type_id, observations, created_at
        ) VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
    `
    const values = [
        id, beneficiaryId, data.vulnerability_type_id, data.observations || null
    ]
    const { rowCount, rows } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

// NUEVA FUNCIÓN: obtener beneficiarios por medicamento
export const GetBeneficiariesByMedicine = async (medicineId) => {
    const sql = `
        SELECT
            b.id,
            b.identification_number,
            b.first_name,
            b.last_name,
            b.phone_personal,
            b.priority_level,
            c.name AS community_name
        FROM beneficiaries b
        INNER JOIN beneficiary_medicines bm ON bm.beneficiary_id = b.id
        LEFT JOIN communities c ON c.id = b.community_id
        WHERE bm.medicine_id = $1 AND b.status = 'Active'
        ORDER BY b.last_name, b.first_name
    `
    const { rows, rowCount } = await database.query(sql, [medicineId])
    return { results: rowCount, data: rows }
}