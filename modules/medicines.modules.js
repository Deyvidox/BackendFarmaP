import database from "../database.js"
import { randomUUID } from "crypto"

export const GetMedicines = async () => {
    const sql = `
        SELECT
            m.id,
            m.national_code,
            m.commercial_name,
            m.generic_name,
            m.active_principle,
            m.concentration,
            m.administration_route,
            m.sanitary_registration,
            m.requires_prescription,
            m.storage_conditions,
            m.storage_temperature,
            m.unit_measure,
            m.units_per_presentation,
            m.status,
            m.created_at,
            pf.name AS pharmaceutical_form,
            l.name AS laboratory,
            mc.name AS category
        FROM medicines m
        LEFT JOIN pharmaceutical_forms pf ON pf.id = m.pharmaceutical_form_id
        LEFT JOIN laboratories l ON l.id = m.laboratory_id
        LEFT JOIN medicine_categories mc ON mc.id = m.category_id
        WHERE m.status = 'Active'
        ORDER BY m.commercial_name ASC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetMedicineById = async (id) => {
    const sql = `
        SELECT m.*, pf.name AS pharmaceutical_form, l.name AS laboratory, mc.name AS category
        FROM medicines m
        LEFT JOIN pharmaceutical_forms pf ON pf.id = m.pharmaceutical_form_id
        LEFT JOIN laboratories l ON l.id = m.laboratory_id
        LEFT JOIN medicine_categories mc ON mc.id = m.category_id
        WHERE m.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const CreateMedicine = async (data) => {
    const id = randomUUID()
    const sql = `
        INSERT INTO medicines (
            id, national_code, commercial_name, generic_name, active_principle,
            concentration, pharmaceutical_form_id, administration_route, laboratory_id,
            category_id, sanitary_registration, requires_prescription,
            storage_conditions, storage_temperature, unit_measure,
            units_per_presentation, status, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'Active',NOW(),NOW())
        RETURNING id, commercial_name, national_code, created_at
    `
    const values = [
        id,
        data.national_code || null,
        data.commercial_name,
        data.generic_name || null,
        data.active_principle || null,
        data.concentration || null,
        data.pharmaceutical_form_id,
        data.administration_route || null,
        data.laboratory_id,
        data.category_id,
        data.sanitary_registration || null,
        data.requires_prescription || false,
        data.storage_conditions || null,
        data.storage_temperature || null,
        data.unit_measure || null,
        data.units_per_presentation || 1
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const UpdateMedicine = async (id, data) => {
    const sql = `
        UPDATE medicines SET
            national_code = $1, commercial_name = $2, generic_name = $3,
            active_principle = $4, concentration = $5, pharmaceutical_form_id = $6,
            administration_route = $7, laboratory_id = $8, category_id = $9,
            sanitary_registration = $10, requires_prescription = $11,
            storage_conditions = $12, storage_temperature = $13,
            unit_measure = $14, units_per_presentation = $15,
            updated_at = NOW()
        WHERE id = $16
        RETURNING id, commercial_name
    `
    const values = [
        data.national_code || null, data.commercial_name, data.generic_name || null,
        data.active_principle || null, data.concentration || null, data.pharmaceutical_form_id,
        data.administration_route || null, data.laboratory_id, data.category_id,
        data.sanitary_registration || null, data.requires_prescription || false,
        data.storage_conditions || null, data.storage_temperature || null,
        data.unit_measure || null, data.units_per_presentation || 1, id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const DeleteMedicine = async (id) => {
    const sql = `UPDATE medicines SET status = 'Inactive', updated_at = NOW() WHERE id = $1 RETURNING id, commercial_name`
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const GetMedicineAlerts = async () => {
    const sql = `
        SELECT
            ml.id,
            ml.lot_number,
            ml.expiration_date,
            ml.total_units,
            ml.quality_status,
            ml.status AS lot_status,
            ml.warehouse_location,
            m.commercial_name AS medicine,
            m.generic_name,
            l.name AS laboratory,
            CURRENT_DATE AS today,
            (ml.expiration_date - CURRENT_DATE) AS days_remaining,
            CASE
                WHEN ml.expiration_date < CURRENT_DATE THEN 'VENCIDA'
                WHEN (ml.expiration_date - CURRENT_DATE) <= 30 THEN 'CRITICA'
                WHEN (ml.expiration_date - CURRENT_DATE) <= 90 THEN 'PROXIMA'
                ELSE 'SEGURA'
            END AS alert_status
        FROM medicine_lots ml
        INNER JOIN medicines m ON m.id = ml.medicine_id
        LEFT JOIN laboratories l ON l.id = m.laboratory_id
        WHERE ml.status IN ('Available', 'Reserved')
        ORDER BY ml.expiration_date ASC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetInventory = async () => {
    const sql = `
        SELECT
            i.id,
            i.location,
            i.total_quantity,
            i.available_quantity,
            i.reserved_quantity,
            i.delivered_quantity,
            i.minimum_stock,
            i.maximum_stock,
            i.status AS stock_status,
            i.last_movement,
            ml.lot_number,
            ml.expiration_date,
            ml.status AS lot_status,
            m.commercial_name AS medicine,
            m.generic_name
        FROM inventories i
        INNER JOIN medicine_lots ml ON ml.id = i.lot_id
        INNER JOIN medicines m ON m.id = ml.medicine_id
        ORDER BY i.status DESC, ml.expiration_date ASC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}
