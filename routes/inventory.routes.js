import { Router } from "express";
import { 
    GetAllInventoryControl, 
    CreateInventoryControl, 
    UpdateInventoryControl, 
    DeleteInventoryControl, 
    GetByIdInventoryControl 
} from "../controllers/inventory.controller.js";
import upload from "../libs/upload.js"; 
import { validateLoteId, validateInventoryBody, validateInventoryUpdateBody } from "../validates/inventory.validation.js";
import { verifyToken } from "../authorization.js";

const router = Router();

// 1. Obtener todos (Maneja ?search=... y ?estado=... para los filtros)
router.get("/", verifyToken, GetAllInventoryControl);

// 2. Obtener uno por LoteID (Usamos el validador de LoteID)
router.get("/:lote_id", verifyToken, validateLoteId, GetByIdInventoryControl);

// 3. Crear Lote de Inventario (Imagen obligatoria u opcional según tu regla, aquí Multer procesa 'imagen')
router.post("/", verifyToken, upload.single("imagen"), validateInventoryBody, CreateInventoryControl);

// 4. Actualizar Lote de Inventario (Maneja actualización parcial y nueva imagen si existe)
router.put("/:lote_id", verifyToken, validateLoteId, upload.single("imagen"), validateInventoryUpdateBody, UpdateInventoryControl);

// 5. Eliminar Lote de Inventario
router.delete("/:lote_id", verifyToken, validateLoteId, DeleteInventoryControl);

export default router;