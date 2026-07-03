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
    "identification_number": Joi.string().pattern(/^[VEJ]-\d{6,8}$/).optional().allow('', null).messages({
        'string.pattern.base': 'Cédula/RIF inválida (formato: V-12345678)'
    }),
    "phone": Joi.string().pattern(/^\+58\s?\d{3}\s?\d{7}$/).optional().allow('', null).messages({
        'string.pattern.base': 'Teléfono inválido (formato: +58 412 1234567)'
    }),
    "address": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Active', 'Inactive', 'Suspended').optional(),
    "position": Joi.string().optional().allow('', null),
    "department": Joi.string().optional().allow('', null)
})