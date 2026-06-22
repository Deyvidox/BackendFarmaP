import database from "../database.js"

export const Login = async (login) => {
    const sql = `SELECT u."password", u.id, r.permissions
    FROM users AS u
    INNER JOIN roles AS r ON r.id = u.role_id
    WHERE (u.username = $1 OR u.email = $2) AND u.status = 'Active';`

    const { rowCount, rows } = await database.query(sql, [login, login])
    return { "results": rowCount, "data": rows[0] }
}