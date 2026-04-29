import database from "../database.js";

export const ChangePassword = async (userId, newPassword) => {
    const sql = `UPDATE "Tbl_Usuario" 
                 SET "UsuContrasena" = $1, "UsuActualizado" = NOW()
                 WHERE "UsuarioID" = $2
                 RETURNING "UsuarioID", "UsuCorreo";`;

    const { rowCount, rows } = await database.query(sql, [newPassword, userId]);

    return { 
        "changed": rowCount > 0, 
        "data": rows[0] || null 
    };
}