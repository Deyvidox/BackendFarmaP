import Joi from "joi"

export const UpdateUserValidated = Joi.object({
    "first_name": Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'any.required': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
    "last_name": Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El apellido es obligatorio',
        'any.required': 'El apellido es obligatorio',
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede exceder 100 caracteres'
    }),
    "email": Joi.string().email().required().messages({
        'string.email': 'Correo electrónico inválido',
        'string.empty': 'El correo es obligatorio',
        'any.required': 'El correo es obligatorio'
    }),
    "role_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.guid': 'El rol seleccionado no es válido',
        'any.required': 'El rol es obligatorio',
        'string.empty': 'El rol es obligatorio'
    }),
    "identification_number": Joi.string().pattern(/^[VEJ]-\d{6,8}$/).optional().allow('', null).messages({
        'string.pattern.base': 'Cédula/RIF inválida (formato: V-12345678)'
    }),
    "phone": Joi.string().pattern(/^(?:\+58|0)\s?\d{3}\s?\d{7}$/).optional().allow('', null).messages({
        'string.pattern.base': 'Teléfono inválido (formato: +58 412 1234567 o 0412 1234567)'
    }),
    "address": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Active', 'Inactive', 'Suspended').optional().messages({
        'any.only': 'El estado debe ser Activo, Inactivo o Suspendido'
    }),
    "position": Joi.string().optional().allow('', null),
    "department": Joi.string().optional().allow('', null)
})