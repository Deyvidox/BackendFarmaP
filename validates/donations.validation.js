import Joi from "joi"

export const CreateDonationValidated = Joi.object({
    "donor_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'any.required': 'El donante es obligatorio',
        'string.empty': 'El donante es obligatorio',
        'string.guid': 'El donante seleccionado no es válido'
    }),
    "donation_type_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'any.required': 'El tipo de donación es obligatorio',
        'string.empty': 'El tipo de donación es obligatorio',
        'string.guid': 'El tipo de donación seleccionado no es válido'
    }),
    "receiver_user_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow(null).messages({
        'string.guid': 'El receptor seleccionado no es válido'
    }),
    "reception_date": Joi.string().isoDate().optional().allow(null).messages({
        'string.isoDate': 'La fecha de recepción debe tener formato válido (AAAA-MM-DD)'
    }),
    "documentation_date": Joi.string().isoDate().optional().allow(null).messages({
        'string.isoDate': 'La fecha de documentación debe tener formato válido (AAAA-MM-DD)'
    }),
    "document_number": Joi.string().optional().allow('', null),
    "estimated_total_value": Joi.number().min(0).optional().allow(null).messages({
        'number.base': 'El valor estimado debe ser un número',
        'number.min': 'El valor estimado no puede ser negativo'
    }),
    "destination_warehouse": Joi.string().optional().allow('', null),
    "transport_conditions": Joi.string().optional().allow('', null),
    "observations": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('Received', 'Inspected', 'InProcess', 'Accepted', 'Rejected', 'Quarantined').optional().default('Received').messages({
        'any.only': 'El estado de la donación no es válido'
    }),
    "medicines": Joi.array().items(
        Joi.object({
            medicine_id: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
                'any.required': 'El medicamento es obligatorio',
                'string.guid': 'El medicamento seleccionado no es válido'
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                'any.required': 'La cantidad es obligatoria',
                'number.base': 'La cantidad debe ser un número',
                'number.min': 'La cantidad debe ser al menos 1'
            }),
            lot_number: Joi.string().required().messages({
                'any.required': 'El número de lote es obligatorio',
                'string.empty': 'El número de lote es obligatorio'
            }),
            expiration_date: Joi.string().isoDate().required().messages({
                'any.required': 'La fecha de vencimiento es obligatoria',
                'string.empty': 'La fecha de vencimiento es obligatoria',
                'string.isoDate': 'La fecha de vencimiento debe tener formato válido (AAAA-MM-DD)'
            })
        })
    ).min(1).required().messages({
        'array.min': 'Debe agregar al menos un medicamento',
        'any.required': 'Los medicamentos son obligatorios'
    })
})

export const UpdateDonationValidated = Joi.object({
    "status": Joi.string().valid('Received', 'Inspected', 'InProcess', 'Accepted', 'Rejected', 'Quarantined').optional().messages({
        'any.only': 'El estado de la donación no es válido'
    }),
    "observations": Joi.string().optional().allow('', null),
    "reception_date": Joi.string().isoDate().optional().allow(null).messages({
        'string.isoDate': 'La fecha de recepción debe tener formato válido (AAAA-MM-DD)'
    }),
    "document_number": Joi.string().optional().allow('', null)
}).unknown(true)