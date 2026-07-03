import { Router } from "express"
import Messages from "../messages.js"
import {
    GetBeneficiariesControl,
    GetBeneficiaryByIdControl,
    CreateBeneficiaryControl,
    UpdateBeneficiaryControl,
    DeleteBeneficiaryControl,
    SaveBeneficiaryMedicalHistoryControl,
    SaveBeneficiaryMedicinesControl,
    AddBeneficiaryDiseaseControl,
    AddBeneficiaryVulnerabilityControl,
    GetBeneficiariesByMedicineControl
} from "../controllers/beneficiaries.controller.js"

const routes = Router()

routes.get("/", GetBeneficiariesControl, Messages)
routes.post("/", CreateBeneficiaryControl, Messages)
routes.post("/:id/medical-history", SaveBeneficiaryMedicalHistoryControl, Messages)
routes.post("/:id/medicines", SaveBeneficiaryMedicinesControl, Messages)
routes.post("/:id/diseases", AddBeneficiaryDiseaseControl, Messages)
routes.post("/:id/vulnerabilities", AddBeneficiaryVulnerabilityControl, Messages)

// Nueva ruta: obtener beneficiarios por medicamento
routes.get("/medicine/:medicineId", GetBeneficiariesByMedicineControl, Messages)

routes.get("/:id", GetBeneficiaryByIdControl, Messages)
routes.put("/:id", UpdateBeneficiaryControl, Messages)
routes.delete("/:id", DeleteBeneficiaryControl, Messages)

export default routes