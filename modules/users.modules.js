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

const checkUniqueFields = async (data, excludeId = null) => {
    const errors = []
    if (data.email) {
        const query = excludeId
            ? 'SELECT id FROM users WHERE email = $1 AND id <> $2'
            : 'SELECT id FROM users WHERE email = $1'
        const values = excludeId ? [data.email, excludeId] : [data.email]
        const { rows } = await database.query(query, values)
        if (rows.length > 0) errors.push('El email ya está registrado')
    }
    if (data.identification_number) {
        const query = excludeId
            ? 'SELECT id FROM users WHERE identification_number = $1 AND id <> $2'
            : 'SELECT id FROM users WHERE identification_number = $1'
        const values = excludeId ? [data.identification_number, excludeId] : [data.identification_number]
        const { rows } = await database.query(query, values)
        if (rows.length > 0) errors.push('La cédula/RIF ya está registrada')
    }
    if (data.phone) {
        const query = excludeId
            ? 'SELECT id FROM users WHERE phone = $1 AND id <> $2'
            : 'SELECT id FROM users WHERE phone = $1'
        const values = excludeId ? [data.phone, excludeId] : [data.phone]
        const { rows } = await database.query(query, values)
        if (rows.length > 0) errors.push('El teléfono ya está registrado')
    }
    if (errors.length > 0) throw new Error(errors.join('. '))
}

export const UpdateUser = async (id, userData) => {
    await checkUniqueFields(userData, id)
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
    // Eliminación física
    const sql = `DELETE FROM users WHERE id = $1 RETURNING id, username`
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const GetUserProfile = async (id) => {
    const sql = `
        SELECT 
            u.id, u.identification_number, u.first_name, u.last_name,
            u.email, u.phone, u.address, u.username, u.status,
            u.position, u.department, u.date_of_birth, u.created_at, u.last_access,
            u.role_id, r.name AS role_name
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.id = $1
    `
    const { rows, rowCount } = await database.query(sql, [id])
    return { results: rowCount, data: rows[0] }
}

export const UpdateUserProfile = async (id, userData) => {
    await checkUniqueFields(userData, id)
    const sql = `
        UPDATE users SET
            first_name = $1,
            last_name = $2,
            email = $3,
            phone = $4,
            address = $5,
            updated_at = NOW()
        WHERE id = $6
        RETURNING id, username, email, first_name, last_name, phone, address, 
                  identification_number, date_of_birth, position, department, status
    `
    const values = [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone || null,
        userData.address || null,
        id
    ]
    const { rows, rowCount } = await database.query(sql, values)
    return { results: rowCount, data: rows[0] }
}

export const GetUserStats = async () => {
    const totalSql = `SELECT COUNT(*) AS total FROM users`
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