import Joi from "joi"

const medicineDetailSchema = Joi.object({
    "medicine_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El medicamento es obligatorio'
    }),
    "quantity": Joi.number().integer().min(1).required().messages({
        'number.min': 'La cantidad debe ser al menos 1'
    }),
    "priority": Joi.string().valid('BAJA', 'MEDIA', 'ALTA', 'CRITICA').optional().default('MEDIA'),
    "justification": Joi.string().optional().allow('', null)
})

export const CreateProviderRequestValidated = Joi.object({
    "provider_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El proveedor es obligatorio'
    }),
    "request_date": Joi.string().optional().allow(null),
    "required_date": Joi.string().optional().allow(null),
    "request_type": Joi.string().valid('EMERGENCIA', 'RUTINARIA', 'PROYECTO', 'REPOSICION').optional().default('RUTINARIA'),
    "general_priority": Joi.string().valid('BAJA', 'MEDIA', 'ALTA', 'URGENTE').optional().default('MEDIA'),
    "general_justification": Joi.string().optional().allow('', null),
    "responsible_name": Joi.string().optional().allow('', null),
    "department": Joi.string().valid('FARMACIA', 'ALMACEN', 'ADMINISTRACION', 'DIRECCION', '').optional().allow(null),
    "status": Joi.string().valid('PENDIENTE', 'ENVIADA', 'EN_REVISION', 'APROBADA_INTERNA', 'APROBADA', 'RECHAZADA', 'COMPLETADA').optional().default('PENDIENTE'),
    "observations": Joi.string().optional().allow('', null),
    "medicines": Joi.array().items(medicineDetailSchema).min(1).required().messages({
        'array.min': 'Debe agregar al menos un medicamento'
    })
})

export const UpdateProviderRequestValidated = Joi.object({
    "status": Joi.string().valid('PENDIENTE', 'ENVIADA', 'EN_REVISION', 'APROBADA_INTERNA', 'APROBADA', 'RECHAZADA', 'COMPLETADA').required().messages({
        'any.only': 'El estado no es válido',
        'any.required': 'El estado es obligatorio'
    }),
    "observations": Joi.string().optional().allow('', null)
})
