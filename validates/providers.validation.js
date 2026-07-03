import Joi from "joi"

export const CreateProviderValidated = Joi.object({
    "name": Joi.string().min(2).max(200).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'Mínimo 2 caracteres'
    }),
    "rif_cedula": Joi.string().max(20).required().messages({
        'string.empty': 'El RIF es obligatorio'
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
    "status": Joi.string().valid('Active', 'Inactive').optional().default('Active')
})

export const UpdateProviderValidated = CreateProviderValidated.append({
    "status": Joi.string().valid('Active', 'Inactive').optional()
})