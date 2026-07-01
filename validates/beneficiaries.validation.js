import Joi from "joi"

export const CreateBeneficiaryValidated = Joi.object({
    "first_name": Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'Mínimo 2 caracteres'

    }),
    "last_name": Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El apellido es obligatorio'
    }),
    "identification_number": Joi.string().optional().allow('', null),
    "birth_date": Joi.string().optional().allow('', null),
    "gender": Joi.string().valid('M', 'F', 'O', '').optional().allow('', null),
    "community_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow('', null),
    "detailed_address": Joi.string().optional().allow('', null),
    "phone_personal": Joi.string().optional().allow('', null),
    "email": Joi.string().email().optional().allow('', null),
    "emergency_contact": Joi.string().optional().allow('', null),
    "emergency_phone": Joi.string().optional().allow('', null),
    "dependents": Joi.number().integer().min(0).optional().default(0),
    "occupation": Joi.string().optional().allow('', null),

    "priority_level": Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional().default('Low')
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
    "vulnerability_type_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El ID de la vulnerabilidad es obligatorio'
    }),
    "observations": Joi.string().optional().allow('', null)
})
