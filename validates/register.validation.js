import Joi from "joi"

export const RegisterValidated = Joi.object({
    "first_name": Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            'string.empty': 'El nombre es obligatorio',
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder 100 caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras y espacios'
        }),

    "last_name": Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'El apellido debe tener al menos 2 caracteres',
            'string.max': 'El apellido no puede exceder 100 caracteres',
            'string.pattern.base': 'El apellido solo puede contener letras y espacios'
        }),

    "identification_number": Joi.string()
        .pattern(/^[VEJvej0-9\-\s]{5,20}$/)
        .optional()
        .allow('', null)
        .messages({
            'string.pattern.base': 'Formato de identificación inválido. Use V/E/J seguido de números'
        }),

    "date_of_birth": Joi.date()
        .max('now')
        .optional()
        .allow(null)
        .messages({
            'date.base': 'Fecha de nacimiento inválida',
            'date.max': 'La fecha no puede ser futura'
        }),

    "phone": Joi.string()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .optional()
        .allow('', null)
        .messages({
            'string.pattern.base': 'Formato de teléfono inválido'
        }),

    "address": Joi.string()
        .min(5)
        .max(500)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'La dirección debe tener al menos 5 caracteres',
            'string.max': 'La dirección no puede exceder 500 caracteres'
        }),

    "username": Joi.string()
        .min(4)
        .max(50)
        .pattern(/^[A-Za-z0-9._-]+$/)
        .required()
        .messages({
            'string.empty': 'El usuario es obligatorio',
            'string.min': 'El usuario debe tener al menos 4 caracteres',
            'string.max': 'El usuario no puede exceder 50 caracteres',
            'string.pattern.base': 'Solo letras, números, puntos, guiones y guiones bajos'
        }),

    "email": Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gob', 've'] } })
        .required()
        .messages({
            'string.empty': 'El correo es obligatorio',
            'string.email': 'Correo electrónico inválido'
        }),

    "password": Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
        .required()
        .messages({
            'string.empty': 'La contraseña es obligatoria',
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una letra y un número'
        }),

    "status": Joi.string()
        .valid('Active', 'Inactive', 'Suspended')
        .optional()
        .default('Active')
        .messages({
            'any.only': 'El estado debe ser Active, Inactive o Suspended'
        }),

    "role_id": Joi.string()
        .guid({ version: ['uuidv4'] })
        .optional()
        .allow('', null)
        .messages({
            'string.guid': 'El rol seleccionado no es válido'
        })
})