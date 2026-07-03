import { GetRequests, GetRequestById, CreateRequest, UpdateRequest } from "../modules/requests.modules.js"
import { CreateRequestValidated, UpdateRequestValidated } from "../validates/requests.validation.js"

export const GetRequestsControl = async (req, res, next) => {
    try {
        const { results, data } = await GetRequests()
        req.message = { type: "Successfully", message: { count: results, requests: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetRequestByIdControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await GetRequestById(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Solicitud no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { request: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateRequestControl = async (req, res, next) => {
    try {
        const { error, value } = CreateRequestValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await CreateRequest(value)
        req.message = { type: "Successfully", message: { text: "Solicitud registrada exitosamente", request: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateRequestControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UpdateRequestValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await UpdateRequest(id, value)
        req.message = { type: "Successfully", message: { text: "Solicitud actualizada", request: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}