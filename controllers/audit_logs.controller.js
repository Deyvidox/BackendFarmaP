import { GetAuditLogs } from "../modules/audit_logs.modules.js"
import { GetAuditLogsValidated } from "../validates/audit_logs.validation.js"

export const GetAuditLogsControl = async (req, res, next) => {
    try {
        const { error, value } = GetAuditLogsValidated.validate(req.query)
        if (error) {
            req.message = { type: "Validation", message: error.details, status: 400 }
            return next()
        }
        const { results, data } = await GetAuditLogs(value)
        req.message = {
            type: "Successfully",
            message: {
                context: "Bitácora de auditoría obtenida exitosamente",
                count: results,
                ...data
            },
            status: 200
        }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}