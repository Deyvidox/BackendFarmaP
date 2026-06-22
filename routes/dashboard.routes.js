import { Router } from "express"
import Messages from "../messages.js"
import { GetDashboardStatsControl } from "../controllers/dashboard.controller.js"

const routes = Router()

routes.get("/stats", GetDashboardStatsControl, Messages)

export default routes
