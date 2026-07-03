import database from "../database.js"

export const GetAuditLogs = async (filters = {}) => {
    const { module, action, user_id, start_date, end_date, page = 1, limit = 20 } = filters
    const offset = (page - 1) * limit

    let conditions = []
    let values = []
    let paramCount = 1

    if (module) {
        conditions.push(`a.module = $${paramCount++}`)
        values.push(module)
    }
    if (action) {
        conditions.push(`a.action = $${paramCount++}`)
        values.push(action)
    }
    if (user_id) {
        conditions.push(`a.user_id = $${paramCount++}`)
        values.push(user_id)
    }
    if (start_date) {
        conditions.push(`a.created_at >= $${paramCount++}`)
        values.push(start_date)
    }
    if (end_date) {
        conditions.push(`a.created_at <= $${paramCount++}`)
        values.push(end_date)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const countSql = `SELECT COUNT(*) AS total FROM audit_logs a ${whereClause}`
    const dataSql = `
        SELECT 
            a.id, 
            a.module, 
            a.action, 
            a.affected_entity, 
            a.entity_id,
            a.previous_data, 
            a.new_data, 
            a.client_ip, 
            a.user_agent,
            a.created_at,
            u.first_name || ' ' || u.last_name AS user_name,
            u.email AS user_email
        FROM audit_logs a
        LEFT JOIN users u ON u.id = a.user_id
        ${whereClause}
        ORDER BY a.created_at DESC
        LIMIT $${paramCount++} OFFSET $${paramCount++}
    `

    const countValues = [...values]
    const dataValues = [...values, limit, offset]

    const [countResult, dataResult] = await Promise.all([
        database.query(countSql, countValues),
        database.query(dataSql, dataValues)
    ])

    const total = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)

    return {
        results: dataResult.rowCount,
        data: {
            logs: dataResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    }
}