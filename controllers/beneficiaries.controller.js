import { GetBeneficiaries, GetBeneficiaryById, CreateBeneficiary, UpdateBeneficiary, DeleteBeneficiary } from "../modules/beneficiaries.modules.js"
import { CreateBeneficiaryValidated, UpdateBeneficiaryValidated } from "../validates/beneficiaries.validation.js"

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
