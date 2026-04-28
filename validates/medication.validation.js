import { check, validationResult } from "express-validator";

export const MedicationValidator = [
    check("codigo_nacional")
        .notEmpty().withMessage("El código nacional es requerido"),
    check("nombre_comercial")
        .notEmpty().withMessage("El nombre comercial es requerido"),
    check("forma_farmaceutica_id")
        .notEmpty().withMessage("Debe seleccionar una forma farmacéutica"),
    check("laboratorio_id")
        .notEmpty().withMessage("El laboratorio es obligatorio"),
    check("categoria_medicamento_id")
        .notEmpty().withMessage("La categoría es obligatoria"),
    
    // Función que procesa los resultados de arriba (sustituye al helper)
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ 
                success: false, 
                errors: errors.array().map(err => ({ message: err.msg })) 
            });
        }
        next();
    }
];