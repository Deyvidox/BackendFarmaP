import database from "../database.js"

export const Register = async (userData) => {
    console.log('📝 Ejecutando SQL INSERT en tabla Tbl_Usuario...')
    
    const sql = `
        INSERT INTO public."Tbl_Usuario" (
            "UsuarioID", 
            "RolID", 
            "UsuNombres", 
            "UsuCorreo", 
            "UsuContrasena", 
            "UsuEstado", 
            "UsuCreado"
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING "UsuarioID" AS "UsuID", "UsuNombres" AS "UsuNombre", "UsuCorreo", "UsuCreado" AS "UsuFechaRegistro"
    `

    const values = [
        userData.usu_id,
        userData.rol_id,
        userData.usu_nombre,
        userData.usu_correo,
        userData.usu_contrasena,
        userData.usu_estado
    ]

    console.log('📊 Valores SQL:', values.map((v, i) => `$${i+1}: ${v !== null ? v : 'NULL'}`).join(', '))
    
    try {
        const result = await database.query(sql, values)
        console.log('✅ INSERT exitoso, filas afectadas:', result.rowCount)
        console.log('📄 Datos retornados:', result.rows[0])
        
        return { 
            "results": result.rowCount, 
            "data": result.rows[0] 
        }
    } catch (err) {
        console.error('❌ ERROR en Register module:', err)
        console.error('❌ SQL error detail:', err.message)
        
        // Si es un error de duplicado, podemos identificarlo mejor
        if (err.code === '23505') { // Código de violación de unique constraint en PostgreSQL
            const detail = err.detail || ''
            if (detail.includes('username')) {
                throw new Error('El nombre de usuario ya existe')
            } else if (detail.includes('email')) {
                throw new Error('El correo electrónico ya existe')
            } else if (detail.includes('identification_number')) {
                throw new Error('El número de identificación ya existe')
            }
        }
        
        throw err
    }
}