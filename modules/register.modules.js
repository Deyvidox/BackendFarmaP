import database from "../database.js"
import { randomUUID } from "crypto"

export const Register = async (userData) => {
    console.log('📝 Ejecutando SQL INSERT en tabla users...')
    
    const userId = randomUUID()

    const sql = `
        INSERT INTO users (
            id,
            role_id, 
            identification_number, 
            first_name, 
            last_name, 
            date_of_birth, 
            phone, 
            address, 
            username, 
            email, 
            password, 
            status, 
            created_at, 
            updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        RETURNING id, username, email, first_name, last_name, created_at
    `

    const values = [
        userId,
        userData.role_id,
        userData.identification_number || null,
        userData.first_name,
        userData.last_name,
        userData.date_of_birth || null,
        userData.phone || null,
        userData.address || null,
        userData.username,
        userData.email,
        userData.password,
        userData.status
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