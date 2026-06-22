import { Register } from "../modules/register.modules.js"
import { RegisterValidated } from "../validates/register.validation.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import database from "../database.js"

dotenv.config()

export const RegisterControl = async (req, res, next) => {
    try {
        const { error, value } = RegisterValidated.validate(req.body)

        if (error) {
            req.message = { 
                "type": "Validation", 
                "message": error.details, 
                "status": 400 
            }
            return next()
        }

        // Verificar si el username ya existe
        const { results: usernameExists } = await checkUsernameExists(value.username)
        if (usernameExists > 0) {
            req.message = { 
                "type": "Conflict", 
                "message": "El nombre de usuario ya está registrado", 
                "status": 409 
            }
            return next()
        }

        // Verificar si el email ya existe
        const { results: emailExists } = await checkEmailExists(value.email)
        if (emailExists > 0) {
            req.message = { 
                "type": "Conflict", 
                "message": "El correo electrónico ya está registrado", 
                "status": 409 
            }
            return next()
        }

        // Verificar si el número de identificación ya existe
        if (value.identification_number) {
            const { results: idExists } = await checkIdentificationExists(value.identification_number)
            if (idExists > 0) {
                req.message = { 
                    "type": "Conflict", 
                    "message": "El número de identificación ya está registrado", 
                    "status": 409 
                }
                return next()
            }
        }

        // Determinar role_id: usar el enviado o buscar el primer rol disponible
        let roleId = value.role_id
        if (!roleId) {
            const roleResult = await database.query(`SELECT id FROM roles ORDER BY created_at ASC LIMIT 1`)
            if (roleResult.rows.length === 0) {
                req.message = { 
                    "type": "Error", 
                    "message": "No hay roles disponibles en el sistema", 
                    "status": 500 
                }
                return next()
            }
            roleId = roleResult.rows[0].id
        }

        // Hashear la contraseña
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(value.password, saltRounds)

        // Preparar datos para registro
        const userData = {
            ...value,
            password: hashedPassword,
            role_id: roleId,
            status: 'Active'
        }

        // Registrar usuario
        const { results, data } = await Register(userData)

        if (results === 0) {
            req.message = { 
                "type": "Error", 
                "message": "No se pudo registrar el usuario", 
                "status": 500 
            }
            return next()
        }

        req.message = {
            "type": "Successfully", 
            "message": {
                text: "Usuario registrado exitosamente",
                userId: data.id,
                username: data.username,
                email: data.email
            }, 
            "status": 201
        }
        return next()

    } catch (err) {
        req.message = { 
            "type": "Error", 
            "message": err.message, 
            "status": 500 
        }
        return next()
    }
}

// Funciones auxiliares
const checkUsernameExists = async (username) => {
    const sql = `SELECT COUNT(*) FROM users WHERE username = $1 AND status = 'Active'`
    const { rows } = await database.query(sql, [username])
    return { "results": parseInt(rows[0].count) }
}

const checkEmailExists = async (email) => {
    const sql = `SELECT COUNT(*) FROM users WHERE email = $1 AND status = 'Active'`
    const { rows } = await database.query(sql, [email])
    return { "results": parseInt(rows[0].count) }
}

const checkIdentificationExists = async (identification) => {
    const sql = `SELECT COUNT(*) FROM users WHERE identification_number = $1 AND status = 'Active'`
    const { rows } = await database.query(sql, [identification])
    return { "results": parseInt(rows[0].count) }
}