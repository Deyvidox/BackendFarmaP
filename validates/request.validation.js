import { z } from "zod";

export const requestSchema = z.object({
    beneficiario_id: z.string().uuid("ID de beneficiario inválido"),
    enfermedad_id: z.string().uuid("ID de enfermedad inválido").optional().nullable(),
    tipo_solicitud: z.enum(['NUEVA', 'RENOVACION']).default('NUEVA'),
    diagnostico_principal: z.string().min(1, "Diagnóstico principal requerido"),
    institucion_salud: z.string().min(1, "Institución de salud requerida"),
    medico_tratante: z.string().min(1, "Médico tratante requerido"),
    prioridad_medica: z.string().min(1, "Prioridad médica requerida"),
    usuario_receptor_id: z.string().uuid("ID de usuario receptor inválido"),
});

export const RequestIdValidated = z.object({
    id: z.string().uuid("El ID debe ser un UUID válido")
});