import { Router } from "express"
import Messages from "../messages.js"
import { GetRolesControl } from "../controllers/roles.controller.js"

const routes = Router()

routes.get("/", GetRolesControl, Messages)

export default routes