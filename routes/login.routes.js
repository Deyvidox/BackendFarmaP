import { Router } from "express"
import { LoginControl } from "../controllers/login.controller.js"
import Messages from "../messages.js"

const routes = Router()

routes.post("/", LoginControl, Messages)

export default routes