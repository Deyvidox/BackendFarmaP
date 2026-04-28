import { Router } from "express";
import * as MedicationController from "../controllers/medication.controller.js";
import { MedicationValidator } from "../validates/medication.validation.js";
// IMPORTANTE: Importa tu configuración personalizada desde libs
import upload from "../libs/upload.js"; 
import { verifyToken } from "../authorization.js";

const router = Router();

// Obtener todas los medicamentos (incluye filtro por categorías)
router.get("/", verifyToken, MedicationController.GetAllMedicationsControl);

// Crear: Ahora usa 'upload' que viene de tu carpeta libs
router.post(
    "/", 
    verifyToken,
    upload.single("image"), // Aquí se procesa la imagen según tus reglas en libs
    MedicationValidator, 
    MedicationController.CreateMedicationControl
);

// Actualizar
router.put(
    "/:id", 
    verifyToken,
    upload.single("image"), 
    MedicationValidator, 
    MedicationController.UpdateMedicationControl
);

router.delete("/:id", verifyToken, MedicationController.DeleteMedicationControl);

export default router;