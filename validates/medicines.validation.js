import Joi from "joi"

export const CreateMedicineValidated = Joi.object({
    "commercial_name": Joi.string().min(2).max(200).required().messages({
        'string.empty': 'El nombre comercial es obligatorio',
        'any.required': 'El nombre comercial es obligatorio',
        'string.min': 'El nombre comercial debe tener al menos 2 caracteres',
        'string.max': 'El nombre comercial no puede exceder 200 caracteres'
    }),
    "pharmaceutical_form_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'La forma farmacéutica es obligatoria',
        'any.required': 'La forma farmacéutica es obligatoria',
        'string.guid': 'La forma farmacéutica seleccionada no es válida'
    }),
    "laboratory_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El laboratorio es obligatorio',
        'any.required': 'El laboratorio es obligatorio',
        'string.guid': 'El laboratorio seleccionado no es válido'
    }),
    "category_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'La categoría es obligatoria',
        'any.required': 'La categoría es obligatoria',
        'string.guid': 'La categoría seleccionada no es válida'
    }),
    "national_code": Joi.string().optional().allow('', null),
    "generic_name": Joi.string().optional().allow('', null),
    "active_principle": Joi.string().optional().allow('', null),
    "concentration": Joi.string().optional().allow('', null),
    "administration_route": Joi.string().optional().allow('', null),
    "sanitary_registration": Joi.string().optional().allow('', null),
    "requires_prescription": Joi.boolean().optional().default(false),
    "storage_conditions": Joi.string().optional().allow('', null),
    "storage_temperature": Joi.string().optional().allow('', null),
    "unit_measure": Joi.string().optional().allow('', null),
    "units_per_presentation": Joi.number().integer().min(1).optional().default(1).messages({
        'number.base': 'Las unidades por presentación deben ser un número',
        'number.min': 'Las unidades por presentación deben ser al menos 1'
    })
})

export const UpdateMedicineValidated = CreateMedicineValidated

export const CreateInventoryMovementValidated = Joi.object({
    "lot_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'string.empty': 'El lote es obligatorio',
        'any.required': 'El lote es obligatorio',
        'string.guid': 'El lote seleccionado no es válido'
    }),
    "movement_type": Joi.string().valid('Entry', 'Exit', 'Adjustment').required().messages({
        'any.only': 'El tipo de movimiento debe ser Entrada, Salida o Ajuste',
        'any.required': 'El tipo de movimiento es obligatorio',
        'string.empty': 'El tipo de movimiento es obligatorio'
    }),
    "quantity": Joi.number().integer().required().messages({
        'number.base': 'La cantidad debe ser un número',
        'any.required': 'La cantidad es obligatoria'
    }),
    "motive": Joi.string().required().messages({
        'string.empty': 'El motivo es obligatorio',
        'any.required': 'El motivo es obligatorio'
    }),
    "user_id": Joi.string().guid({ version: ['uuidv4'] }).required().messages({
        'any.required': 'El usuario es obligatorio',
        'string.guid': 'El usuario seleccionado no es válido'
    })
})
