import { Login } from "../modules/login.modules.js"
import { LoginValidated } from "../validates/login.validation.js"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const LoginControl = async (req, res, next) => {
    try {
        const { error, value } = LoginValidated.validate(req.body)

        if (error) {
            req.message = { "type": "Validation", "message": error.details, "status": 400 }
            return next()
        }

        const { results, data } = await Login(value.login)

        if (results == 0) {
            req.message = { "type": "Not Found", "message": "El usuario no existe", "status": 400 }
            return next()
        }

        const { password, id, permissions } = data

        if (await bcrypt.compare(value.password, password)) {
            const payload = { id, permissions }

            const config = { "algorithm": "HS512", "expiresIn": "1d" }

            const token = JWT.sign(payload, process.env.SECRET, config)
            req.message = {
                "type": "Successfully", "message": {
                    token,
                    text: "Inicio de sesión exitoso"
                }, "status": 200
            }

            return next()
        }
        else {
            req.message = { "type": "Error", "message": "Credenciales incorrectas", "status": 400 }
            return next()
        }
    } catch (err) {
        req.message = { "type": "Error", "message": err.message, "status": 500 }
        return next()
    }
}