import { Router } from "express"
import Messages from "../messages.js"
import {
    GetRequestsControl,
    GetRequestByIdControl,
    CreateRequestControl,
    UpdateRequestControl
} from "../controllers/requests.controller.js"

const routes = Router()

routes.get("/", GetRequestsControl, Messages)
routes.get("/:id", GetRequestByIdControl, Messages)
routes.post("/", CreateRequestControl, Messages)
routes.put("/:id", UpdateRequestControl, Messages)

export default routes
