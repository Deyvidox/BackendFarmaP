import Joi from "joi"

export const CreateMedicineValidated = Joi.object({
    "commercial_name": Joi.string().min(2).max(200).required().messages({
        'string.empty': 'El nombre comercial es obligatorio'
    }),
    "pharmaceutical_form_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'La forma farmacéutica es obligatoria'
    }),
    "laboratory_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El laboratorio es obligatorio'
    }),
    "category_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'La categoría es obligatoria'
    }),
    "national_code": Joi.string().optional().allow('', null),
    "generic_name": Joi.string().optional().allow('', null),
    "active_principle": Joi.string().optional().allow('', null),
    "concentration": Joi.string().optional().allow('', null),
    "administration_route": Joi.string().optional().allow('', null),
    "sanitary_registration": Joi.string().optional().allow('', null),
    "requires_prescription": Joi.boolean().optional().default(false),
    "storage_conditions": Joi.string().optional().allow('', null),
    "storage_temperature": Joi.string().optional().allow('', null),
    "unit_measure": Joi.string().optional().allow('', null),
    "units_per_presentation": Joi.number().integer().min(1).optional().default(1)
})

export const UpdateMedicineValidated = CreateMedicineValidated
