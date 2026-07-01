import { Router } from "express"
import Messages from "../messages.js"
import {
    GetDeliveriesControl,
    GetDeliveryByIdControl,
    CreateDeliveryControl,
    UpdateDeliveryControl,
    DeleteDeliveryControl,
    NotifyDeliveryControl
} from "../controllers/deliveries.controller.js"

const routes = Router()

routes.get("/", GetDeliveriesControl, Messages)
routes.get("/:id", GetDeliveryByIdControl, Messages)
routes.post("/", CreateDeliveryControl, Messages)
routes.put("/:id", UpdateDeliveryControl, Messages)
routes.delete("/:id", DeleteDeliveryControl, Messages)
routes.post("/:id/notify", NotifyDeliveryControl, Messages)

export default routes
