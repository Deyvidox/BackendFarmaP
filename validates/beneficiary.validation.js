import Joi from "joi"

export const BeneficiaryRegisterValidated = Joi.object({
    "cedula": Joi.string()
        .pattern(/^[VEJvej0-9\-\s]{5,20}$/)
        .required()
        .messages({
            'string.empty': 'La cédula es obligatoria',
            'string.pattern.base': 'Formato de cédula inválido. Use V/E/J seguido de números'
        }),
    
    "nombres": Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            'string.empty': 'Los nombres son obligatorios',
            'string.min': 'Los nombres deben tener al menos 2 caracteres',
            'string.max': 'Los nombres no pueden exceder 100 caracteres',
            'string.pattern.base': 'Los nombres solo pueden contener letras y espacios'
        }),
    
    "apellidos": Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            'string.empty': 'Los apellidos son obligatorios',
            'string.min': 'Los apellidos deben tener al menos 2 caracteres',
            'string.max': 'Los apellidos no pueden exceder 100 caracteres',
            'string.pattern.base': 'Los apellidos solo pueden contener letras y espacios'
        }),
    
    "fecha_nacimiento": Joi.date()
        .max('now')
        .required()
        .messages({
            'date.base': 'Fecha de nacimiento inválida',
            'date.max': 'La fecha no puede ser futura',
            'any.required': 'La fecha de nacimiento es obligatoria'
        }),
    
    "genero": Joi.string()
        .valid('M', 'F')
        .required()
        .messages({
            'any.only': 'El género debe ser M o F',
            'any.required': 'El género es obligatorio'
        }),
    
    "comunidad_id": Joi.string()
        .uuid()
        .required()
        .messages({
            'string.uuid': 'ID de comunidad inválido',
            'any.required': 'La comunidad es obligatoria'
        }),
    
    "direccion_detallada": Joi.string()
        .min(5)
        .max(500)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'La dirección debe tener al menos 5 caracteres',
            'string.max': 'La dirección no puede exceder 500 caracteres'
        }),
    
    "telefono_personal": Joi.string()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .required()
        .messages({
            'string.empty': 'El teléfono personal es obligatorio',
            'string.pattern.base': 'Formato de teléfono inválido'
        }),
    
    "email": Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
            'string.empty': 'El correo es obligatorio',
            'string.email': 'Correo electrónico inválido'
        }),
    
    "contacto_emergencia": Joi.string()
        .min(2)
        .max(150)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'El contacto de emergencia debe tener al menos 2 caracteres',
            'string.max': 'El contacto de emergencia no puede exceder 150 caracteres'
        }),
    
    "telefono_emergencia": Joi.string()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .optional()
        .allow('', null)
        .messages({
            'string.pattern.base': 'Formato de teléfono de emergencia inválido'
        }),
    
    "personas_dependientes": Joi.number()
        .integer()
        .min(0)
        .optional()
        .allow(null)
        .messages({
            'number.base': 'Las personas dependientes deben ser un número',
            'number.integer': 'Las personas dependientes deben ser un número entero',
            'number.min': 'Las personas dependientes no pueden ser negativas'
        }),
    
    "ingresos_mensuales": Joi.number()
        .precision(2)
        .min(0)
        .optional()
        .allow(null)
        .messages({
            'number.base': 'Los ingresos mensuales deben ser un número',
            'number.min': 'Los ingresos mensuales no pueden ser negativos'
        }),
    
    "nivel_prioridad": Joi.string()
        .max(20)
        .optional()
        .allow('', null)
        .messages({
            'string.max': 'El nivel de prioridad no puede exceder 20 caracteres'
        })
})

export const UpdateBeneficiaryValidated = Joi.object({
    'nombres': Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'Los nombres deben tener al menos 2 caracteres',
            'string.max': 'Los nombres no pueden exceder 100 caracteres',
            'string.pattern.base': 'Los nombres solo pueden contener letras y espacios'
        }),
    
    'apellidos': Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'Los apellidos deben tener al menos 2 caracteres',
            'string.max': 'Los apellidos no pueden exceder 100 caracteres',
            'string.pattern.base': 'Los apellidos solo pueden contener letras y espacios'
        }),
    
    'telefono_personal': Joi.string()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .optional()
        .allow('', null)
        .messages({
            'string.pattern.base': 'Formato de teléfono inválido'
        }),
    
    'direccion_detallada': Joi.string()
        .min(5)
        .max(500)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'La dirección debe tener al menos 5 caracteres',
            'string.max': 'La dirección no puede exceder 500 caracteres'
        }),
    
    'fecha_nacimiento': Joi.date()
        .max('now')
        .optional()
        .allow('', null)
        .messages({
            'date.base': 'Fecha de nacimiento inválida',
            'date.max': 'La fecha no puede ser futura'
        }),
    
    'id': Joi.string()
        .uuid()
        .required()
        .messages({
            'string.uuid': 'ID de beneficiario inválido',
            'any.required': 'El ID es obligatorio'
        })
})

export const SearchBeneficiariesValidated = Joi.object({
    'search': Joi.string()
        .min(1)
        .max(100)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'El término de búsqueda debe tener al menos 1 carácter',
            'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
        }),
    
    'limit': Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .default(10)
        .messages({
            'number.base': 'El límite debe ser un número',
            'number.integer': 'El límite debe ser un número entero',
            'number.min': 'El límite debe ser al menos 1',
            'number.max': 'El límite no puede ser mayor a 100'
        })
})

export const BeneficiaryIdValidated = Joi.object({
    'id': Joi.string()
        .uuid()
        .required()
        .messages({
            'string.uuid': 'ID de beneficiario inválido',
            'any.required': 'El ID es obligatorio'
        })
})