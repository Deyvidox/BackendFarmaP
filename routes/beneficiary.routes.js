import { Router } from "express"
import Messages from "../messages.js"
import { BeneficiaryRegisterControl, DeactivateBeneficiaryControl, GetAllBeneficiariesControl, GetBeneficiaryByIdControl, SearchBeneficiariesControl, UpdateBeneficiaryControl } from "../controllers/beneficiary.controller.js"
import { verifyToken } from "../authorization.js"

const routes = Router()

routes.post("/register", BeneficiaryRegisterControl, Messages)
routes.post("/update/:id", verifyToken, UpdateBeneficiaryControl, Messages)
routes.delete("/delete/:id", verifyToken, DeactivateBeneficiaryControl, Messages)
routes.post("/search", verifyToken, SearchBeneficiariesControl, Messages)
routes.get("/beneficiaries", verifyToken, GetAllBeneficiariesControl, Messages)
routes.get("/search/:id", verifyToken, GetBeneficiaryByIdControl, Messages)

export default routes