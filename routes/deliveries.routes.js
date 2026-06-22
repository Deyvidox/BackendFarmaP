import { Router } from "express"
import Messages from "../messages.js"
import {
    GetDeliveriesControl,
    GetDeliveryByIdControl,
    CreateDeliveryControl,
    UpdateDeliveryControl
} from "../controllers/deliveries.controller.js"

const routes = Router()

routes.get("/", GetDeliveriesControl, Messages)
routes.get("/:id", GetDeliveryByIdControl, Messages)
routes.post("/", CreateDeliveryControl, Messages)
routes.put("/:id", UpdateDeliveryControl, Messages)

export default routes
