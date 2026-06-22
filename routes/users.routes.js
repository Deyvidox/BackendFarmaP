import { Router } from "express"
import Messages from "../messages.js"
import {
    GetUsersControl,
    GetUserByIdControl,
    UpdateUserControl,
    DeleteUserControl,
    GetUserStatsControl
} from "../controllers/users.controller.js"

const routes = Router()

routes.get("/", GetUsersControl, Messages)
routes.get("/stats", GetUserStatsControl, Messages)
routes.get("/:id", GetUserByIdControl, Messages)
routes.put("/:id", UpdateUserControl, Messages)
routes.delete("/:id", DeleteUserControl, Messages)

export default routes
