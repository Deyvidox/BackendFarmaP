import { Router } from "express"
import Messages from "../messages.js"
import { GetAuditLogsControl } from "../controllers/audit_logs.controller.js"

const routes = Router()

routes.get("/", GetAuditLogsControl, Messages)

export default routes