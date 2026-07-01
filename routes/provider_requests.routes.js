import { Router } from "express"
import Messages from "../messages.js"
import {
    GetProviderRequestsControl,
    GetProviderRequestByIdControl,
    CreateProviderRequestControl,
    UpdateProviderRequestControl,
    DeleteProviderRequestControl
} from "../controllers/provider_requests.controller.js"

const routes = Router()

routes.get("/", GetProviderRequestsControl, Messages)
routes.get("/:id", GetProviderRequestByIdControl, Messages)
routes.post("/", CreateProviderRequestControl, Messages)
routes.put("/:id", UpdateProviderRequestControl, Messages)
routes.delete("/:id", DeleteProviderRequestControl, Messages)

export default routes
