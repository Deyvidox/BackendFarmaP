import { Router } from "express"
import { RegisterControl } from "../controllers/register.controller.js"
import Messages from "../messages.js"

const routes = Router()

routes.post("/", RegisterControl, Messages)

export default routes