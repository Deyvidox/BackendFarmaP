import Joi from "joi"

export const CreateBeneficiaryValidated = Joi.object({
    "first_name": Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'Mínimo 2 caracteres'
    }),
    "last_name": Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El apellido es obligatorio'
    }),
    "identification_number": Joi.string()
        .pattern(/^[VEJ]-\d{6,8}$/)
        .required()
        .messages({
            'string.pattern.base': 'La cédula debe comenzar con V-, E- o J- seguido de 6 a 8 dígitos (ej: V-12345678)',
            'any.required': 'La cédula es obligatoria'
        }),
    "birth_date": Joi.date().iso().required().messages({
        'date.base': 'La fecha de nacimiento no es válida',
        'any.required': 'La fecha de nacimiento es obligatoria'
    }),
    "gender": Joi.string().valid('M', 'F', 'O').required().messages({
        'any.only': 'El género debe ser M, F u O',
        'any.required': 'El género es obligatorio'
    }),
    "community_id": Joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.guid': 'La comunidad no es un UUID válido',
        'any.required': 'La comunidad es obligatoria'
    }),
    "detailed_address": Joi.string().optional().allow('', null),
    "phone_personal": Joi.string()
        .pattern(/^\+58\s?\d{3}\s?\d{7}$/)
        .required()
        .messages({
            'string.pattern.base': 'El teléfono debe ser formato +58 412 1234567 o +584121234567',
            'any.required': 'El teléfono es obligatorio'
        }),
    "email": Joi.string().email().required().messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es obligatorio'
    }),
    "emergency_contact": Joi.string().optional().allow('', null),
    "emergency_phone": Joi.string()
        .pattern(/^\+58\s?\d{3}\s?\d{7}$/)
        .optional().allow('', null)
        .messages({
            'string.pattern.base': 'El teléfono de emergencia debe ser formato +58 412 1234567'
        }),
    "dependents": Joi.number().integer().min(0).optional().default(0),
    "occupation": Joi.string().optional().allow('', null),
    "priority_level": Joi.string().valid('Low', 'Medium', 'High', 'Critical').required().messages({
        'any.only': 'La prioridad debe ser Low, Medium, High o Critical',
        'any.required': 'La prioridad es obligatoria'
    })
})

export const UpdateBeneficiaryValidated = CreateBeneficiaryValidated

export const AddDiseaseValidated = Joi.object({
    "disease_id": Joi.string().required().messages({
        'string.empty': 'El ID de la enfermedad o su nombre es obligatorio'
    }),
    "diagnosis_date": Joi.string().optional().allow('', null),
    "current_status": Joi.string().optional().allow('', null),
    "current_treatment": Joi.string().optional().allow('', null),
    "observations": Joi.string().optional().allow('', null)
})

export const AddVulnerabilityValidated = Joi.object({
    "vulnerability_type_id": Joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.empty': 'El ID de la vulnerabilidad es obligatorio'
    }),
    "observations": Joi.string().optional().allow('', null)
})