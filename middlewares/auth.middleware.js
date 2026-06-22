import JWT from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const AuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ type: "Unauthorized", message: "Token no proporcionado" })
        }

        const token = authHeader.split(" ")[1]
        const decoded = JWT.verify(token, process.env.SECRET)
        req.user = decoded
        return next()
    } catch (err) {
        return res.status(401).json({ type: "Unauthorized", message: "Token inválido o expirado" })
    }
}
