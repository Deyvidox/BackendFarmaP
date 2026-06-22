import { Router } from "express"
import Messages from "../messages.js"
import {
    GetDonationsControl,
    GetDonationByIdControl,
    CreateDonationControl,
    UpdateDonationControl,
    DeleteDonationControl,
    GetDonorsControl
} from "../controllers/donations.controller.js"

const routes = Router()

routes.get("/", GetDonationsControl, Messages)
routes.get("/donors", GetDonorsControl, Messages)
routes.get("/:id", GetDonationByIdControl, Messages)
routes.post("/", CreateDonationControl, Messages)
routes.put("/:id", UpdateDonationControl, Messages)
routes.delete("/:id", DeleteDonationControl, Messages)

export default routes
