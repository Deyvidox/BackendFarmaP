import { Router } from "express"
import Messages from "../messages.js"
import { AuthMiddleware } from "../middlewares/auth.middleware.js"
import {
    GetUsersControl,
    GetUserByIdControl,
    UpdateUserControl,
    DeleteUserControl,
    GetUserStatsControl,
    GetUserProfileControl,
    UpdateUserProfileControl
} from "../controllers/users.controller.js"

const routes = Router()

// Profile routes (must be before /:id to avoid conflict)
routes.get("/profile", AuthMiddleware, GetUserProfileControl, Messages)
routes.put("/profile", AuthMiddleware, UpdateUserProfileControl, Messages)

routes.get("/", GetUsersControl, Messages)
routes.get("/stats", GetUserStatsControl, Messages)
routes.get("/:id", GetUserByIdControl, Messages)
routes.put("/:id", UpdateUserControl, Messages)
routes.delete("/:id", DeleteUserControl, Messages)

export default routes
