import Joi from "joi"

export const CreateProviderValidated = Joi.object({
    "name": Joi.string().min(2).max(200).required().messages({
        'string.empty': 'El nombre del proveedor es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres'
    }),
    "rif_cedula": Joi.string().max(20).optional().allow('', null),
    "main_contact": Joi.string().max(150).optional().allow('', null),
    "contact_phone": Joi.string().max(20).optional().allow('', null),
    "contact_email": Joi.string().email({ tlds: false }).max(150).optional().allow('', null),
    "address": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Active', 'Inactive').optional().default('Active')
})

export const UpdateProviderValidated = Joi.object({
    "name": Joi.string().min(2).max(200).required(),
    "rif_cedula": Joi.string().max(20).optional().allow('', null),
    "main_contact": Joi.string().max(150).optional().allow('', null),
    "contact_phone": Joi.string().max(20).optional().allow('', null),
    "contact_email": Joi.string().email({ tlds: false }).max(150).optional().allow('', null),
    "address": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Active', 'Inactive').optional()
})
