import {
    GetBeneficiaries,
    GetBeneficiaryById,
    CreateBeneficiary,
    UpdateBeneficiary,
    DeleteBeneficiary,
    SaveBeneficiaryMedicalHistory,
    SaveBeneficiaryMedicines,
    AddBeneficiaryDisease,
    AddBeneficiaryVulnerability,
    GetBeneficiariesByMedicine
} from "../modules/beneficiaries.modules.js"
import {
    CreateBeneficiaryValidated,
    UpdateBeneficiaryValidated,
    AddDiseaseValidated,
    AddVulnerabilityValidated
} from "../validates/beneficiaries.validation.js"

export const GetBeneficiariesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetBeneficiaries()
        req.message = { type: "Successfully", message: { context: "Beneficiarios obtenidos", count: results, beneficiaries: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetBeneficiaryByIdControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await GetBeneficiaryById(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Beneficiario no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { beneficiary: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateBeneficiaryControl = async (req, res, next) => {
    try {
        const { error, value } = CreateBeneficiaryValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await CreateBeneficiary(value)
        req.message = { type: "Successfully", message: { text: "Beneficiario registrado exitosamente", beneficiary: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateBeneficiaryControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UpdateBeneficiaryValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await UpdateBeneficiary(id, value)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Beneficiario no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Beneficiario actualizado", beneficiary: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteBeneficiaryControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await DeleteBeneficiary(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Beneficiario no encontrado", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Beneficiario eliminado", beneficiary: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const SaveBeneficiaryMedicalHistoryControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { diseases, vulnerabilities } = req.body
        await SaveBeneficiaryMedicalHistory(id, diseases || [], vulnerabilities || [])
        req.message = { type: "Successfully", message: { text: "Historial médico guardado exitosamente" }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const SaveBeneficiaryMedicinesControl = async (req, res, next) => {
    try {
        const { id } = req.params
        await SaveBeneficiaryMedicines(id, req.body)
        req.message = { type: "Successfully", message: { text: "Medicamentos asignados al historial" }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const AddBeneficiaryDiseaseControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = AddDiseaseValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await AddBeneficiaryDisease(id, value)
        req.message = { type: "Successfully", message: { text: "Enfermedad agregada exitosamente", disease: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const AddBeneficiaryVulnerabilityControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = AddVulnerabilityValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await AddBeneficiaryVulnerability(id, value)
        req.message = { type: "Successfully", message: { text: "Vulnerabilidad agregada exitosamente", vulnerability: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

// NUEVO CONTROLADOR
export const GetBeneficiariesByMedicineControl = async (req, res, next) => {
    try {
        const { medicineId } = req.params
        const { results, data } = await GetBeneficiariesByMedicine(medicineId)
        req.message = {
            type: "Successfully",
            message: {
                context: "Beneficiarios que requieren este medicamento",
                count: results,
                beneficiaries: data
            },
            status: 200
        }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}