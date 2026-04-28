export const ChangePassword = async (userId, newPassword) => {
    const sql = `UPDATE users 
                 SET password = $1, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2
                 RETURNING id, email;`;

    const { rowCount, rows } = await database.query(sql, [newPassword, userId]);

    return { 
        "changed": rowCount > 0, 
        "data": rows[0] || null 
    };
}