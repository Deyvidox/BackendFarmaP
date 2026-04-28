import { Router } from "express";
import Messages from "../messages.js";
import { 
    GetRequestsControl, 
    CreateRequestControl, 
    UpdateRequestControl, 
    DeleteRequestControl 
} from "../controllers/request.controller.js";
import { verifyToken } from "../authorization.js";

const routes = Router();

routes.get("/", verifyToken, GetRequestsControl, Messages);
routes.post("/", verifyToken, CreateRequestControl, Messages);
routes.put("/:id", verifyToken, UpdateRequestControl, Messages);
routes.delete("/:id", verifyToken, DeleteRequestControl, Messages);

export default routes;