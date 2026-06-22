import Joi from "joi"

export const CreateRequestValidated = Joi.object({
    "beneficiary_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El beneficiario es obligatorio'
    }),
    "disease_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null),
    "responsible_user_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null),
    "request_date": Joi.string().optional().allow(null),
    "required_date": Joi.string().optional().allow(null),
    "type": Joi.string().valid('Emergency', 'Routine', 'Project', 'Replenishment', 'New', 'Renewal').optional().default('Routine'),
    "general_priority": Joi.string().valid('Low', 'Medium', 'High', 'Urgent', 'Emergency').optional().default('Medium'),
    "general_justification": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Pending', 'Sent', 'InReview', 'ApprovedInternal', 'Approved', 'Rejected', 'Completed').optional().default('Pending'),
    "observations": Joi.string().optional().allow('', null)
})

export const UpdateRequestValidated = Joi.object({
    "status": Joi.string().valid('Pending', 'Sent', 'InReview', 'ApprovedInternal', 'Approved', 'Rejected', 'Completed').required(),
    "observations": Joi.string().optional().allow('', null)
})

