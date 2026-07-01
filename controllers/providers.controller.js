import { GetProviders, GetProviderById, CreateProvider, UpdateProvider, DeleteProvider } from "../modules/providers.modules.js"
import { CreateProviderValidated, UpdateProviderValidated } from "../validates/providers.validation.js"

export const GetProvidersControl = async (req, res, next) => {
    try {
        const { results, data } = await GetProviders()
        req.message = { type: "Successfully", message: { count: results, providers: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetProviderByIdControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await GetProviderById(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Proveedor no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { provider: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateProviderControl = async (req, res, next) => {
    try {
        const { error, value } = CreateProviderValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await CreateProvider(value)
        req.message = { type: "Successfully", message: { text: "Proveedor registrado", provider: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateProviderControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UpdateProviderValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await UpdateProvider(id, value)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Proveedor no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Proveedor actualizado", provider: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteProviderControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await DeleteProvider(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Proveedor no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Proveedor eliminado", provider: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}
