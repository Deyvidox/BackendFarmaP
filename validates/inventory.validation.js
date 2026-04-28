import { z } from "zod";

// Validamos que el LoteID sea un UUID válido
export const validateLoteId = (req, res, next) => {
    const { lote_id } = req.params;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89abAB][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!lote_id || !uuidRegex.test(lote_id)) {
        return res.status(400).json({ 
            success: false, 
            message: "The provided LoteID is not valid." 
        });
    }
    next();
};

// Validación opcional para el cuerpo del inventario (Zod)
export const inventorySchema = z.object({
    lote_id: z.string().uuid("LoteID must be a valid UUID"),
    med_id: z.string().uuid("MedID must be a valid UUID"),
    ubicacion: z.string().min(1, "Location is required"),
    cantidad_total: z.coerce.number().min(0, "Total quantity must be non-negative"),
    fecha_caducidad: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid expiration date"),
    estado: z.enum(['Available', 'Expired', 'Damaged', 'In Use']),
    usuario_registro: z.string().uuid("User ID must be a valid UUID")
});

export const validateInventoryUpdateBody = (req, res, next) => {
    try {
        // En multipart/form-data, req.body llega como strings, zod.coerce los arregla
        inventorySchema.partial().parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            errors: error.errors.map(e => e.message) 
        });
    }
};