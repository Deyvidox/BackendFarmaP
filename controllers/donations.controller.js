import { GetDonations, GetDonationById, CreateDonation, UpdateDonation, DeleteDonation, GetDonors } from "../modules/donations.modules.js"
import { CreateDonationValidated, UpdateDonationValidated } from "../validates/donations.validation.js"

export const GetDonationsControl = async (req, res, next) => {
    try {
        const { results, data } = await GetDonations()
        req.message = { type: "Successfully", message: { count: results, donations: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetDonationByIdControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await GetDonationById(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Donación no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { donation: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateDonationControl = async (req, res, next) => {
    try {
        const { error, value } = CreateDonationValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await CreateDonation(value)
        req.message = { type: "Successfully", message: { text: "Donación registrada exitosamente", donation: data }, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const UpdateDonationControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { error, value } = UpdateDonationValidated.validate(req.body)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await UpdateDonation(id, value)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Donación no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Donación actualizada", donation: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const DeleteDonationControl = async (req, res, next) => {
    try {
        const { id } = req.params
        const { results, data } = await DeleteDonation(id)
        if (results === 0) {
            req.message = { type: "Not Found", message: "Donación no encontrada", status: 404 }
            return next()
        }
        req.message = { type: "Successfully", message: { text: "Donación eliminada", donation: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetDonorsControl = async (req, res, next) => {
    try {
        const { results, data } = await GetDonors()
        req.message = { type: "Successfully", message: { count: results, donors: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}
