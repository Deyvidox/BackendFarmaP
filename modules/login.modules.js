import database from "../database.js"

export const Login = async (username) => {
    const sql = `SELECT u."UsuContrasena", u."UsuID", r."RolPermisos"
    FROM public.Tbl_Usuario AS u
    INNER JOIN public.Cat_Rol AS r ON r."RolID" = u."RolID"
    WHERE u."UsuCorreo" = $1 AND u."UsuEstado" = 'Active';`

    const { rowCount, rows } = await database.query(sql, [username])
    return { "results": rowCount, "data": rows[0] }
}