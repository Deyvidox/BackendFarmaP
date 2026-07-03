import Joi from "joi"

export const CreateRequestValidated = Joi.object({
    "provider_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El proveedor es obligatorio'
    }),
    "request_type": Joi.string().valid('EMERGENCIA', 'RUTINARIA', 'PROYECTO', 'REPOSICION').required(),
    "request_date": Joi.string().isoDate().optional().allow(null),
    "required_date": Joi.string().isoDate().optional().allow(null),
    "general_priority": Joi.string().valid('BAJA', 'MEDIA', 'ALTA', 'URGENTE').optional().default('MEDIA'),
    "general_justification": Joi.string().optional().allow('', null),
    "responsible_name": Joi.string().required(),
    "department": Joi.string().optional().allow('', null),
    "status": Joi.string().valid('PENDIENTE', 'ENVIADA', 'EN_REVISION', 'APROBADA_INTERNA', 'APROBADA', 'RECHAZADA', 'COMPLETADA').optional().default('PENDIENTE'),
    "observations": Joi.string().optional().allow('', null),
    // Lista de medicamentos solicitados (sin lote ni vencimiento aún)
    "medicines": Joi.array().items(
        Joi.object({
            medicine_id: Joi.string().guid({ version: ['uuidv4'] }).required(),
            quantity: Joi.number().integer().min(1).required(),
            priority: Joi.string().valid('BAJA', 'MEDIA', 'ALTA', 'CRITICA').optional().default('MEDIA'),
            justification: Joi.string().optional().allow('', null)
        })
    ).optional().default([])
})

export const UpdateRequestValidated = Joi.object({
    "status": Joi.string().valid('PENDIENTE', 'ENVIADA', 'EN_REVISION', 'APROBADA_INTERNA', 'APROBADA', 'RECHAZADA', 'COMPLETADA').required(),
    "observations": Joi.string().optional().allow('', null),
    // Al completar, se deben enviar los medicamentos con lotes reales y fecha de vencimiento
    "medicines": Joi.array().items(
        Joi.object({
            medicine_id: Joi.string().guid({ version: ['uuidv4'] }).required(),
            quantity: Joi.number().integer().min(1).required(),
            lot_number: Joi.string().required(),
            expiration_date: Joi.string().isoDate().required()
        })
    ).optional().default([])
})