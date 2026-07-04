import Joi from "joi"

export const CreateDeliveryValidated = Joi.object({
    "supply_request_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null).messages({
        'string.guid': 'La solicitud de suministro seleccionada no es válida'
    }),
    "delivery_user_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null).messages({
        'string.guid': 'El responsable de entrega seleccionado no es válido'
    }),
    "beneficiary_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null).messages({
        'string.guid': 'El beneficiario seleccionado no es válido'
    }),
    "delivery_date": Joi.string().optional().allow(null),
    "delivery_type": Joi.string().valid('HomeDelivery', 'HealthCenter', 'Community', 'Pickup').optional().default('Scheduled').messages({
        'any.only': 'El tipo de entrega no es válido'
    }),
    "delivery_point": Joi.string().optional().allow('', null),
    "witness_receptor": Joi.string().optional().allow('', null),
    "next_estimated_delivery": Joi.string().optional().allow(null),
    "digital_signature": Joi.string().optional().allow('', null),
    "observations": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Scheduled', 'OnTheWay', 'Delivered', 'Cancelled', 'Pending').optional().default('Scheduled').messages({
        'any.only': 'El estado de la entrega no es válido'
    })
})

export const UpdateDeliveryValidated = Joi.object({
    "status": Joi.string().valid('Scheduled', 'OnTheWay', 'Delivered', 'Cancelled', 'Pending').required().messages({
        'any.only': 'El estado de la entrega no es válido',
        'any.required': 'El estado es obligatorio',
        'string.empty': 'El estado es obligatorio'
    }),
    "observations": Joi.string().optional().allow('', null),
    "digital_signature": Joi.string().optional().allow('', null),
    "witness_receptor": Joi.string().optional().allow('', null)
})
