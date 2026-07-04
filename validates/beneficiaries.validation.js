import Joi from "joi"

export const CreateBeneficiaryValidated = Joi.object({
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
    "identification_number": Joi.string()
        .pattern(/^[VEJ]-\d{6,8}$/)
        .required()
        .messages({
            'string.pattern.base': 'La cédula debe comenzar con V-, E- o J- seguido de 6 a 8 dígitos (ej: V-12345678)',
            'any.required': 'La cédula es obligatoria',
            'string.empty': 'La cédula es obligatoria'
        }),
    "birth_date": Joi.date().iso().required().messages({
        'date.base': 'La fecha de nacimiento no es válida',
        'any.required': 'La fecha de nacimiento es obligatoria'
    }),
    "gender": Joi.string().valid('M', 'F', 'O').required().messages({
        'any.only': 'El género debe ser M, F u O',
        'any.required': 'El género es obligatorio',
        'string.empty': 'El género es obligatorio'
    }),
    "community_id": Joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.guid': 'La comunidad seleccionada no es válida',
        'any.required': 'La comunidad es obligatoria',
        'string.empty': 'La comunidad es obligatoria'
    }),
    "detailed_address": Joi.string().optional().allow('', null),
    "phone_personal": Joi.string()
        .pattern(/^\+58\s?\d{3}\s?\d{7}$/)
        .required()
        .messages({
            'string.pattern.base': 'El teléfono debe ser formato +58 412 1234567 o +584121234567',
            'any.required': 'El teléfono es obligatorio',
            'string.empty': 'El teléfono es obligatorio'
        }),
    "email": Joi.string().email().required().messages({
        'string.email': 'Debe ser un correo electrónico válido',
        'any.required': 'El correo electrónico es obligatorio',
        'string.empty': 'El correo electrónico es obligatorio'
    }),
    "emergency_contact": Joi.string().optional().allow('', null),
    "emergency_phone": Joi.string()
        .pattern(/^\+58\s?\d{3}\s?\d{7}$/)
        .optional().allow('', null)
        .messages({
            'string.pattern.base': 'El teléfono de emergencia debe ser formato +58 412 1234567'
        }),
    "dependents": Joi.number().integer().min(0).optional().default(0).messages({
        'number.base': 'Los dependientes deben ser un número',
        'number.min': 'Los dependientes no pueden ser negativos'
    }),
    "occupation": Joi.string().optional().allow('', null),
    "priority_level": Joi.string().valid('Low', 'Medium', 'High', 'Critical').required().messages({
        'any.only': 'La prioridad debe ser Baja, Media, Alta o Crítica',
        'any.required': 'La prioridad es obligatoria',
        'string.empty': 'La prioridad es obligatoria'
    })
})

export const UpdateBeneficiaryValidated = CreateBeneficiaryValidated

export const AddDiseaseValidated = Joi.object({
    "disease_id": Joi.string().required().messages({
        'string.empty': 'La enfermedad es obligatoria',
        'any.required': 'La enfermedad es obligatoria'
    }),
    "diagnosis_date": Joi.string().optional().allow('', null),
    "current_status": Joi.string().optional().allow('', null),
    "current_treatment": Joi.string().optional().allow('', null),
    "observations": Joi.string().optional().allow('', null)
})

export const AddVulnerabilityValidated = Joi.object({
    "vulnerability_type_id": Joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.empty': 'El tipo de vulnerabilidad es obligatorio',
        'any.required': 'El tipo de vulnerabilidad es obligatorio',
        'string.guid': 'El tipo de vulnerabilidad seleccionado no es válido'
    }),
    "observations": Joi.string().optional().allow('', null)
})