import database from "../database.js"

export const GetUsers = async () => {
    console.log('📝 Obteniendo lista de usuarios...')
    const sql = `
        SELECT 
            u.id,
            u.identification_number,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.address,
            u.username,
            u.status,
            u.position,
            u.department,
            u.created_at,
            u.last_access,
            r.id AS role_id,
            r.name AS role_name
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.status != 'Inactive'
        ORDER BY u.created_at DESC
    `
    const { rows, rowCount } = await database.query(sql)
    return { results: rowCount, data: rows }
}

export const GetUserById = async (id) => {
    const sql = `
        SELECT 
            u.id, u.identification_number, u.first_name, u.last_name,
            u.email, u.phone, u.address, u.username, u.status,
            u.position, u.department, u.created_at, u.role_id,
            r.name AS role_name
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const UpdateUser = async (id, userData) => {
    const sql = `
        UPDATE users SET
            first_name = $1,
            last_name = $2,
            email = $3,
            phone = $4,
            address = $5,
            role_id = $6,
            status = $7,
            position = $8,
            department = $9,
            identification_number = $10,
            updated_at = NOW()
        WHERE id = $11
        RETURNING id, username, email, first_name, last_name, status
    `
    const values = [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone || null,
        userData.address || null,
        userData.role_id,
        userData.status || 'Active',
        userData.position || null,
        userData.department || null,
        userData.identification_number || null,
        id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const DeleteUser = async (id) => {
    const sql = `
        UPDATE users SET status = 'Inactive', updated_at = NOW()
        WHERE id = $1
        RETURNING id, username
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const GetUserStats = async () => {
    const sql = `
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE u.status = 'Active') AS active,
            COUNT(*) FILTER (WHERE u.status = 'Inactive') AS inactive,
            COUNT(*) FILTER (WHERE u.status = 'Suspended') AS suspended,
            json_object_agg(r.name, role_counts.cnt) AS by_role
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id,
        LATERAL (
            SELECT r2.name, COUNT(*) AS cnt
            FROM users u2
            INNER JOIN roles r2 ON r2.id = u2.role_id
            WHERE u2.status != 'Inactive'
            GROUP BY r2.name
        ) AS role_counts
        WHERE u.status != 'Inactive'
    `
    // Simpler version
    const totalSql = `SELECT COUNT(*) AS total FROM users WHERE status != 'Inactive'`
    const activeSql = `SELECT COUNT(*) AS count FROM users WHERE status = 'Active'`
    const inactiveSql = `SELECT COUNT(*) AS count FROM users WHERE status = 'Inactive'`
    const suspendedSql = `SELECT COUNT(*) AS count FROM users WHERE status = 'Suspended'`
    const byRoleSql = `
        SELECT r.name AS role, COUNT(u.id) AS count
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.status = 'Active'
        GROUP BY r.name
    `

    const [total, active, inactive, suspended, byRole] = await Promise.all([
        database.query(totalSql),
        database.query(activeSql),
        database.query(inactiveSql),
        database.query(suspendedSql),
        database.query(byRoleSql)
    ])

    return {
        results: 1,
        data: {
            total: parseInt(total.rows[0].total),
            active: parseInt(active.rows[0].count),
            inactive: parseInt(inactive.rows[0].count),
            suspended: parseInt(suspended.rows[0].count),
            byRole: byRole.rows
        }
    }
}
