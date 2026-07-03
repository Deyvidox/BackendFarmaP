import Joi from "joi"

export const GetAuditLogsValidated = Joi.object({
    "module": Joi.string().optional().allow('', null),
    "action": Joi.string().optional().allow('', null),
    "user_id": Joi.string().guid({ version: ['uuidv4'] }).optional().allow('', null),
    "start_date": Joi.date().iso().optional().allow(null),
    "end_date": Joi.date().iso().optional().allow(null),
    "page": Joi.number().integer().min(1).optional().default(1),
    "limit": Joi.number().integer().min(1).max(100).optional().default(20)
})