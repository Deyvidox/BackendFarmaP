import Joi from "joi"

export const CreateDeliveryValidated = Joi.object({
    "supply_request_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null),
    "delivery_user_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null),
    "beneficiary_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null),
    "delivery_date": Joi.string().optional().allow(null),
    "delivery_type": Joi.string().valid('HomeDelivery', 'HealthCenter', 'Community', 'Pickup').optional().default('Scheduled'),
    "delivery_point": Joi.string().optional().allow('', null),
    "witness_receptor": Joi.string().optional().allow('', null),
    "next_estimated_delivery": Joi.string().optional().allow(null),
    "digital_signature": Joi.string().optional().allow('', null),
    "observations": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Scheduled', 'OnTheWay', 'Delivered', 'Cancelled', 'Pending').optional().default('Scheduled')
})

export const UpdateDeliveryValidated = Joi.object({
    "status": Joi.string().valid('Scheduled', 'OnTheWay', 'Delivered', 'Cancelled', 'Pending').required(),
    "observations": Joi.string().optional().allow('', null),
    "digital_signature": Joi.string().optional().allow('', null),
    "witness_receptor": Joi.string().optional().allow('', null)
})
