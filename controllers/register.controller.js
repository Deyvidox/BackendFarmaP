import { Register } from "../modules/register.modules.js"
import { RegisterValidated } from "../validates/register.validation.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import database from "../database.js"
import crypto from "crypto"

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

        // Verificar si el email ya existe
        const { results: emailExists } = await checkEmailExists(value.usu_correo)
        if (emailExists > 0) {
            req.message = { 
                "type": "Conflict", 
                "message": "The email is already registered", 
                "status": 409 
            }
            return next()
        }

        // Hashear la contraseña
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(value.password, saltRounds)

        // Generar UsuID
        const usu_id = crypto.randomUUID()

        // Preparar datos para registro
        const userData = {
            usu_id,
            rol_id: value.rol_id,
            usu_nombre: value.usu_nombre,
            usu_correo: value.usu_correo,
            usu_contrasena: hashedPassword,
            usu_estado: 'Active'
        }

        // Registrar usuario
        const { results, data } = await Register(userData)

        if (results === 0) {
            req.message = { 
                "type": "Error", 
                "message": "Could not register the user", 
                "status": 500 
            }
            return next()
        }

        req.message = {
            "type": "Successfully", 
            "message": {
                text: "User registered successfully",
                userId: data.UsuID,
                name: data.UsuNombre,
                email: data.UsuCorreo
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
const checkEmailExists = async (email) => {
    const sql = `SELECT COUNT(*) FROM public.Tbl_Usuario WHERE "UsuCorreo" = $1 AND "UsuEstado" = 'Active'`
    const { rows } = await database.query(sql, [email])
    return { "results": parseInt(rows[0].count) }
}