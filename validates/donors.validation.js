import Joi from "joi"

export const CreateDonorValidated = Joi.object({
    "name": Joi.string().min(2).max(200).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'Mínimo 2 caracteres'
    }),
    "rif_cedula": Joi.string().max(20).required().messages({
        'string.empty': 'La cédula/RIF es obligatoria'
    }),
    "main_contact": Joi.string().max(150).required().messages({
        'string.empty': 'El contacto principal es obligatorio'
    }),
    "contact_phone": Joi.string().max(20).required().messages({
        'string.empty': 'El teléfono es obligatorio'
    }),
    "contact_email": Joi.string().email({ tlds: false }).max(150).required().messages({
        'string.empty': 'El email es obligatorio',
        'string.email': 'Debe ser un email válido'
    }),
    "address": Joi.string().optional().allow('', null),
    "donation_frequency": Joi.string().valid('Monthly', 'Quarterly', 'Annual', 'Sporadic', 'One-time').optional().allow(null),
    "donor_type_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El tipo de donante es obligatorio'
    })
})

export const UpdateDonorValidated = CreateDonorValidated.append({
    "status": Joi.string().valid('Active', 'Inactive').optional()
})