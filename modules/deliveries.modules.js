import database from "../database.js"
import { randomUUID } from "crypto"

export const GetDeliveries = async () => {
    const sql = `
        SELECT
            e.id,
            e.delivery_date,
            TO_CHAR(e.delivery_date, 'HH24:MI') AS delivery_time,
            e.delivery_type,
            e.delivery_point,
            e.delivery_witness AS witness_receptor,
            e.estimated_next_delivery AS next_estimated_delivery,
            e.digital_signature,
            e.observations,
            e.status,
            e.created_at,
            u.first_name || ' ' || u.last_name AS responsible_name,
            b.first_name || ' ' || b.last_name AS beneficiary_name,
            b.identification_number AS beneficiary_cedula,
            med_sub.medicine_name,
            COALESCE(dd_sub.total_quantity, 0) AS total_quantity
        FROM deliveries e
        LEFT JOIN users u ON u.id = e.delivery_user_id
        LEFT JOIN requests r ON r.id = e.request_id
        LEFT JOIN beneficiaries b ON b.id = r.beneficiary_id
        LEFT JOIN LATERAL (
            SELECT m.commercial_name AS medicine_name
            FROM request_details rd
            JOIN medicines m ON m.id = rd.medicine_id
            WHERE rd.request_id = e.request_id
            ORDER BY rd.created_at ASC
            LIMIT 1
        ) med_sub ON true
        LEFT JOIN LATERAL (
            SELECT COALESCE(SUM(dd.delivered_quantity), 0) AS total_quantity
            FROM delivery_details dd
            WHERE dd.delivery_id = e.id
        ) dd_sub ON true
        ORDER BY e.created_at DESC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetDeliveryById = async (id) => {
    const sql = `
        SELECT e.*, 
               e.delivery_witness AS witness_receptor,
               e.estimated_next_delivery AS next_estimated_delivery,
               u.first_name || ' ' || u.last_name AS responsible_name,
               b.first_name || ' ' || b.last_name AS beneficiary_name
        FROM deliveries e
        LEFT JOIN users u ON u.id = e.delivery_user_id
        LEFT JOIN requests r ON r.id = e.request_id
        LEFT JOIN beneficiaries b ON b.id = r.beneficiary_id
        WHERE e.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const CreateDelivery = async (data) => {
    const id = randomUUID()
    const sql = `
        INSERT INTO deliveries (
            id, request_id, delivery_user_id,
            delivery_date, delivery_type, delivery_point, delivery_witness,
            estimated_next_delivery, digital_signature, observations, status,
            created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
        RETURNING id, status, created_at
    `
    let devType = 'Pickup Point';
    if (data.delivery_type === 'HomeDelivery') devType = 'Home Delivery';
    else if (data.delivery_type === 'HealthCenter') devType = 'Health Center';
    else if (data.delivery_type === 'Community') devType = 'Health Center';

    let devStatus = 'Scheduled';
    if (data.status === 'OnTheWay') devStatus = 'In Transit';
    else if (data.status === 'Delivered') devStatus = 'Delivered';
    else if (data.status === 'Cancelled') devStatus = 'Cancelled';
    else if (data.status === 'Failed') devStatus = 'Failed';
    else if (data.status === 'Pending') devStatus = 'Scheduled';

    const values = [
        id,
        data.supply_request_id || null,
        data.delivery_user_id || null,
        data.delivery_date || new Date(),
        devType,
        data.delivery_point || null,
        data.witness_receptor || null,
        data.next_estimated_delivery || null,
        data.digital_signature || null,
        data.observations || null,
        devStatus
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const DeleteDelivery = async (id) => {
    const sql = `
        UPDATE deliveries
        SET status = 'Cancelled', updated_at = NOW()
        WHERE id = $1
        RETURNING id, status
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const UpdateDelivery = async (id, data) => {
    const sql = `
        UPDATE deliveries SET
            status = $1, observations = $2, digital_signature = $3,
            delivery_witness = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING id, status
    `
    let devStatus = 'Scheduled';
    if (data.status === 'OnTheWay') devStatus = 'In Transit';
    else if (data.status === 'Delivered') devStatus = 'Delivered';
    else if (data.status === 'Cancelled') devStatus = 'Cancelled';
    else if (data.status === 'Failed') devStatus = 'Failed';
    else if (data.status === 'Pending') devStatus = 'Scheduled';

    const values = [devStatus, data.observations || null, data.digital_signature || null, data.witness_receptor || null, id]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}
