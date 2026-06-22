import { GetUsers, GetUserById, UpdateUser, DeleteUser, GetUserStats } from "../modules/users.modules.js"
import { UpdateUserValidated } from "../validates/users.validation.js"

export const GetUsersControl = async (req, res, next) => {
    try {
        const { results, data } = await GetUsers()
        req.message = {
            type: "Successfully",
            message: { context: "Usuarios obtenidos exitosamente", count: results, users: data },
            status: 200
        }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetUserByIdControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await GetUserById(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { user: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateUserControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UpdateUserValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await UpdateUser(id, value)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        req.message = {
            type: "Successfully",
            message: { text: "Usuario actualizado exitosamente", user: data },
            status: 200
        }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteUserControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await DeleteUser(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Usuario no encontrado", status: 404 }
            return next()
        }
        req.message = {
            type: "Successfully",
            message: { text: "Usuario eliminado exitosamente", user: data },
            status: 200
        }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetUserStatsControl = async (req, res, next) => {
    try {
        const { data } = await GetUserStats()
        req.message = { type: "Successfully", message: { stats: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}
