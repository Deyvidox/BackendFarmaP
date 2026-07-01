import { GetDeliveries, GetDeliveryById, CreateDelivery, UpdateDelivery, DeleteDelivery } from "../modules/deliveries.modules.js"
import { CreateDeliveryValidated, UpdateDeliveryValidated } from "../validates/deliveries.validation.js"

export const GetDeliveriesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetDeliveries()
        req.message = { type: "Successfully", message: { count: results, deliveries: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetDeliveryByIdControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await GetDeliveryById(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Entrega no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { delivery: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateDeliveryControl = async (req, res, next) => {
    try {
        const { error, value } = CreateDeliveryValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await CreateDelivery(value)
        req.message = { type: "Successfully", message: { text: "Entrega registrada exitosamente", delivery: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateDeliveryControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UpdateDeliveryValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await UpdateDelivery(id, value)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Entrega no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Entrega actualizada", delivery: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteDeliveryControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await DeleteDelivery(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Entrega no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Entrega cancelada exitosamente", delivery: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const NotifyDeliveryControl = async (req, res, next) => {
    try {
        const { id } = req.params
        // Placeholder for real notification logic
        req.message = { type: "Successfully", message: { text: "Notificación enviada exitosamente al responsable y beneficiario" }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}
