import { Router } from "express"
import Messages from "../messages.js"
import {
    GetBeneficiariesControl,
    GetBeneficiaryByIdControl,
    CreateBeneficiaryControl,
    UpdateBeneficiaryControl,
    DeleteBeneficiaryControl
} from "../controllers/beneficiaries.controller.js"

const routes = Router()

routes.get("/", GetBeneficiariesControl, Messages)
routes.get("/:id", GetBeneficiaryByIdControl, Messages)
routes.post("/", CreateBeneficiaryControl, Messages)
routes.put("/:id", UpdateBeneficiaryControl, Messages)
routes.delete("/:id", DeleteBeneficiaryControl, Messages)

export default routes
