import { Router } from "express"
import Messages from "../messages.js"
import {
    GetMedicinesControl,
    GetMedicineByIdControl,
    CreateMedicineControl,
    UpdateMedicineControl,
    DeleteMedicineControl,
    GetMedicineAlertsControl,
    GetInventoryControl
} from "../controllers/medicines.controller.js"

const routes = Router()

routes.get("/", GetMedicinesControl, Messages)
routes.get("/alerts", GetMedicineAlertsControl, Messages)
routes.get("/inventory", GetInventoryControl, Messages)
routes.get("/:id", GetMedicineByIdControl, Messages)
routes.post("/", CreateMedicineControl, Messages)
routes.put("/:id", UpdateMedicineControl, Messages)
routes.delete("/:id", DeleteMedicineControl, Messages)

export default routes
