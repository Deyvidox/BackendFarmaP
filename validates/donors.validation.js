import Joi from "joi"

export const CreateDonorValidated = Joi.object({
    "name": Joi.string().min(2).max(200).required().messages({
        'string.empty': 'El nombre del donante es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres'
    }),
    "rif_cedula": Joi.string().max(20).optional().allow('', null),
    "main_contact": Joi.string().max(150).optional().allow('', null),
    "contact_phone": Joi.string().max(20).optional().allow('', null),
    "contact_email": Joi.string().email({ tlds: false }).max(150).optional().allow('', null),
    "address": Joi.string().optional().allow('', null),
    "donation_frequency": Joi.string().valid('Monthly', 'Quarterly', 'Annual', 'Sporadic', 'One-time').optional().allow(null),
    "donor_type_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El tipo de donante es obligatorio'
    })
})

export const UpdateDonorValidated = CreateDonorValidated
