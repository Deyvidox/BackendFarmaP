import database from "../database.js"
import { randomUUID } from "crypto"

/**
 * Registra una entrada en la bitácora de auditoría.
 * @param {object} params
 * @param {string} params.userId - UUID del usuario que ejecutó la acción
 * @param {string} params.module - Módulo afectado (ej: 'users', 'beneficiaries')
 * @param {string} params.action - Tipo de acción ('CREATE', 'UPDATE', 'DELETE')
 * @param {string} params.affectedEntity - Nombre de la entidad (ej: 'Usuario', 'Beneficiario')
 * @param {string} params.entityId - UUID de la entidad afectada
 * @param {object} [params.previousData] - Datos antes del cambio (opcional)
 * @param {object} [params.newData] - Datos después del cambio (opcional)
 * @param {string} [params.clientIp] - IP del cliente (opcional)
 * @param {string} [params.userAgent] - User-Agent del cliente (opcional)
 */
export const registerAudit = async ({
    userId,
    module,
    action,
    affectedEntity,
    entityId,
    previousData = null,
    newData = null,
    clientIp = null,
    userAgent = null
}) => {
    const id = randomUUID()
    const sql = `
    INSERT INTO audit_logs (
      id, user_id, module, action, affected_entity, entity_id,
      previous_data, new_data, client_ip, user_agent, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
  `
    const values = [
        id,
        userId,
        module,
        action,
        affectedEntity,
        entityId,
        previousData ? JSON.stringify(previousData) : null,
        newData ? JSON.stringify(newData) : null,
        clientIp || null,
        userAgent || null
    ]
    try {
        await database.query(sql, values)
    } catch (err) {
        console.error("Error registrando auditoría:", err)
    }
}