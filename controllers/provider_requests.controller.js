import { GetProviderRequests, GetProviderRequestById, CreateProviderRequest, UpdateProviderRequest, DeleteProviderRequest } from "../modules/provider_requests.modules.js"
import { CreateProviderRequestValidated, UpdateProviderRequestValidated } from "../validates/provider_requests.validation.js"

export const GetProviderRequestsControl = async (req, res, next) => {
    try {
        const { results, data } = await GetProviderRequests()
        req.message = { type: "Successfully", message: { count: results, providerRequests: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetProviderRequestByIdControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await GetProviderRequestById(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Solicitud a proveedor no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { providerRequest: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateProviderRequestControl = async (req, res, next) => {
    try {
        const { error, value } = CreateProviderRequestValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await CreateProviderRequest(value)
        req.message = { type: "Successfully", message: { text: "Solicitud a proveedor registrada exitosamente", providerRequest: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateProviderRequestControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UpdateProviderRequestValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await UpdateProviderRequest(id, value)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Solicitud a proveedor no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Solicitud a proveedor actualizada", providerRequest: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteProviderRequestControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await DeleteProviderRequest(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Solicitud a proveedor no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Solicitud a proveedor eliminada", providerRequest: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

