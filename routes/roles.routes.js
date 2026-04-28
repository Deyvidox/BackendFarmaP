import { Router } from "express"
import Messages from "../messages.js"
import { GetRolesControl } from "../controllers/roles.controller.js"
import { verifyToken } from "../authorization.js"

const routes = Router()

routes.get("/", verifyToken, GetRolesControl, Messages)

export default routes