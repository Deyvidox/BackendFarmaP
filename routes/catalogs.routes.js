import { Router } from "express"
import Messages from "../messages.js"
import {
    GetCommunitiesControl,
    CreateCommunityControl,
    GetLaboratoriesControl,
    GetPharmaceuticalFormsControl,
    GetMedicineCategoriesControl,
    GetDonorTypesControl,
    GetDonationTypesControl,
    GetVulnerabilityTypesControl,
    GetDiseasesControl
} from "../controllers/catalogs.controller.js"

const routes = Router()

routes.get("/communities", GetCommunitiesControl, Messages)
routes.post("/communities", CreateCommunityControl, Messages)
routes.get("/laboratories", GetLaboratoriesControl, Messages)
routes.get("/pharmaceutical-forms", GetPharmaceuticalFormsControl, Messages)
routes.get("/medicine-categories", GetMedicineCategoriesControl, Messages)
routes.get("/donor-types", GetDonorTypesControl, Messages)
routes.get("/donation-types", GetDonationTypesControl, Messages)
routes.get("/vulnerability-types", GetVulnerabilityTypesControl, Messages)
routes.get("/diseases", GetDiseasesControl, Messages)

export default routes
