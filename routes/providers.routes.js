import { Router } from "express"
import Messages from "../messages.js"
import {
    GetProvidersControl,
    GetProviderByIdControl,
    CreateProviderControl,
    UpdateProviderControl,
    DeleteProviderControl
} from "../controllers/providers.controller.js"

const routes = Router()

routes.get("/", GetProvidersControl, Messages)
routes.get("/:id", GetProviderByIdControl, Messages)
routes.post("/", CreateProviderControl, Messages)
routes.put("/:id", UpdateProviderControl, Messages)
routes.delete("/:id", DeleteProviderControl, Messages)

export default routes
