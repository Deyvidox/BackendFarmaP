import {
    GetCommunities, CreateCommunity, GetLaboratories, GetPharmaceuticalForms,
    GetMedicineCategories, GetDonorTypes, GetDonationTypes,
    GetVulnerabilityTypes, GetDiseases
} from "../modules/catalogs.modules.js"

export const GetCommunitiesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetCommunities()
        req.message = { type: "Successfully", message: { count: results, communities: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const CreateCommunityControl = async (req, res, next) => {
    try {
        const { data } = await CreateCommunity(req.body)
        req.message = { type: "Successfully", message: data, status: 201 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetLaboratoriesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetLaboratories()
        req.message = { type: "Successfully", message: { count: results, laboratories: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetPharmaceuticalFormsControl = async (req, res, next) => {
    try {
        const { results, data } = await GetPharmaceuticalForms()
        req.message = { type: "Successfully", message: { count: results, forms: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetMedicineCategoriesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetMedicineCategories()
        req.message = { type: "Successfully", message: { count: results, categories: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetDonorTypesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetDonorTypes()
        req.message = { type: "Successfully", message: { count: results, donorTypes: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetDonationTypesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetDonationTypes()
        req.message = { type: "Successfully", message: { count: results, donationTypes: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetVulnerabilityTypesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetVulnerabilityTypes()
        req.message = { type: "Successfully", message: { count: results, vulnerabilityTypes: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}

export const GetDiseasesControl = async (req, res, next) => {
    try {
        const { results, data } = await GetDiseases()
        req.message = { type: "Successfully", message: { count: results, diseases: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}
