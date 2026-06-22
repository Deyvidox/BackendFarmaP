import { GetMedicines, GetMedicineById, CreateMedicine, UpdateMedicine, DeleteMedicine, GetMedicineAlerts, GetInventory } from "../modules/medicines.modules.js"
import { CreateMedicineValidated, UpdateMedicineValidated } from "../validates/medicines.validation.js"

export const GetMedicinesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetMedicines()
        req.message = { type: "Successfully", message: { count: results, medicines: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetMedicineByIdControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await GetMedicineById(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Medicamento no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { medicine: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateMedicineControl = async (req, res, next) => {
    try {
        const { error, value } = CreateMedicineValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await CreateMedicine(value)
        req.message = { type: "Successfully", message: { text: "Medicamento registrado exitosamente", medicine: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateMedicineControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UpdateMedicineValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await UpdateMedicine(id, value)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Medicamento no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Medicamento actualizado", medicine: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteMedicineControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await DeleteMedicine(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Medicamento no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Medicamento desactivado", medicine: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetMedicineAlertsControl = async (req, res, next) => {
    try {
        const { results, data } = await GetMedicineAlerts()
        req.message = { type: "Successfully", message: { count: results, alerts: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetInventoryControl = async (req, res, next) => {
    try {
        const { results, data } = await GetInventory()
        req.message = { type: "Successfully", message: { count: results, inventory: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}
