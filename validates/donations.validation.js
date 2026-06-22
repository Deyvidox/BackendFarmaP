import Joi from "joi"

export const CreateDonationValidated = Joi.object({
    "donor_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El donante es obligatorio'
    }),
    "donation_type_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El tipo de donación es obligatorio'
    }),
    "receiver_user_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null),
    "reception_date": Joi.string().optional().allow(null),
    "documentation_date": Joi.string().optional().allow(null),
    "document_number": Joi.string().optional().allow('', null),
    "estimated_total_value": Joi.number().min(0).optional().allow(null),
    "destination_warehouse": Joi.string().optional().allow('', null),
    "transport_conditions": Joi.string().optional().allow('', null),
    "observations": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Received', 'InProcess', 'Verified', 'Rejected').optional().default('Received')
})

export const UpdateDonationValidated = Joi.object({
    "status": Joi.string().valid('Received', 'InProcess', 'Verified', 'Rejected').required(),
    "observations": Joi.string().optional().allow('', null),
    "destination_warehouse": Joi.string().optional().allow('', null),
    "transport_conditions": Joi.string().optional().allow('', null)
})

