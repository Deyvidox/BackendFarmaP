import database from "../database.js"
import { randomUUID } from "crypto"

export const GetRequests = async () => {
    const sql = `
        SELECT
            r.id,
            r.request_date,
            r.request_type AS type,
            r.medical_priority AS general_priority,
            r.main_diagnosis AS general_justification,
            r.status,
            r.review_observations AS observations,
            r.created_at,
            r.beneficiary_id,
            b.first_name || ' ' || b.last_name AS beneficiary_name,
            u.first_name || ' ' || u.last_name AS responsible_name,
            rd.medicine_id,
            m.commercial_name AS medicine_name
        FROM requests r
        LEFT JOIN beneficiaries b ON b.id = r.beneficiary_id
        LEFT JOIN users u ON u.id = r.receiver_user_id
        LEFT JOIN request_details rd ON rd.request_id = r.id
        LEFT JOIN medicines m ON m.id = rd.medicine_id
        ORDER BY r.created_at DESC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetRequestById = async (id) => {
    const sql = `
        SELECT r.*, 
               r.request_type AS type,
               r.medical_priority AS general_priority,
               r.main_diagnosis AS general_justification,
               r.review_observations AS observations,
               b.first_name || ' ' || b.last_name AS beneficiary_name,
               u.first_name || ' ' || u.last_name AS responsible_name
        FROM requests r
        LEFT JOIN beneficiaries b ON b.id = r.beneficiary_id
        LEFT JOIN users u ON u.id = r.receiver_user_id
        WHERE r.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const CreateRequest = async (data) => {
    const id = randomUUID()
    const sql = `
        INSERT INTO requests (
            id, receiver_user_id, beneficiary_id, disease_id, request_date,
            request_type, medical_priority, main_diagnosis, status,
            review_observations, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW())
        RETURNING id, status, created_at
    `
    const reqType = data.type === 'Emergency' ? 'Emergency' : (data.type === 'Renewal' ? 'Renewal' : 'New');
    const medPriority = data.general_priority === 'Low' ? 'Low' : 
                        (data.general_priority === 'High' || data.general_priority === 'Urgent' ? 'High' : 
                         (data.general_priority === 'Emergency' ? 'Emergency' : 'Medium'));
    const reqStatus = data.status === 'InReview' ? 'Under Review' :
                      (data.status === 'ApprovedInternal' || data.status === 'Approved' ? 'Approved' :
                       (data.status === 'Rejected' ? 'Rejected' :
                        (data.status === 'Completed' ? 'Completed' : 'Pending')));

    const values = [
        id,
        data.responsible_user_id || null,
        data.beneficiary_id,
        data.disease_id || null,
        data.request_date || new Date(),
        reqType,
        medPriority,
        data.general_justification || null,
        reqStatus,
        data.observations || null
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const UpdateRequest = async (id, data) => {
    const sql = `
        UPDATE requests SET 
            status = $1, 
            review_observations = $2, 
            updated_at = NOW()
        WHERE id = $3
        RETURNING id, status
    `
    const reqStatus = data.status === 'InReview' ? 'Under Review' :
                      (data.status === 'ApprovedInternal' || data.status === 'Approved' ? 'Approved' :
                       (data.status === 'Rejected' ? 'Rejected' :
                        (data.status === 'Completed' ? 'Completed' : 'Pending')));

    const { rows, rowCount } = await database.query(sql, [reqStatus, data.observations || null, id])
    return { results: rowCount, data: rows[0] }
}
