import Joi from "joi"

export const UpdateUserValidated = Joi.object({
    "first_name": Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres'
    }),
    "last_name": Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El apellido es obligatorio'
    }),
    "email": Joi.string().email().required().messages({
        'string.email': 'Correo electrónico inválido',
        'string.empty': 'El correo es obligatorio'
    }),
    "role_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.guid': 'El rol seleccionado no es válido'
    }),
    "identification_number": Joi.string().optional().allow('', null),
    "phone": Joi.string().optional().allow('', null),
    "address": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Active', 'Inactive', 'Suspended').optional(),
    "position": Joi.string().optional().allow('', null),
    "department": Joi.string().optional().allow('', null)
})
