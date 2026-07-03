import Joi from "joi"

export const CreateDonationValidated = Joi.object({
    "donor_id": Joi.string().guid({ version: ['uuidv4'] }).required(),
    "donation_type_id": Joi.string().guid({ version: ['uuidv4'] }).required(),
    "receiver_user_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null),
    "reception_date": Joi.string().isoDate().optional().allow(null),
    "documentation_date": Joi.string().isoDate().optional().allow(null),
    "document_number": Joi.string().optional().allow('', null),
    "estimated_total_value": Joi.number().min(0).optional().allow(null),
    "destination_warehouse": Joi.string().optional().allow('', null),
    "transport_conditions": Joi.string().optional().allow('', null),
    "observations": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Received', 'Inspected', 'InProcess', 'Accepted', 'Rejected', 'Quarantined').optional().default('Received'),
    "medicines": Joi.array().items(
        Joi.object({
            medicine_id: Joi.string().guid({ version: ['uuidv4'] }).required(),
            quantity: Joi.number().integer().min(1).required(),
            lot_number: Joi.string().required(),
            expiration_date: Joi.string().isoDate().required()
        })
    ).min(1).required()
})

export const UpdateDonationValidated = Joi.object({
    "status": Joi.string().valid('Received', 'Inspected', 'InProcess', 'Accepted', 'Rejected', 'Quarantined').optional(),
    "observations": Joi.string().optional().allow('', null),
    "reception_date": Joi.string().isoDate().optional().allow(null),
    "document_number": Joi.string().optional().allow('', null)
}).unknown(true)