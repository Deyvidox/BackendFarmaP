import database from "../database.js";

export const GetAllRequests = async (search = '') => {
    let sql = `
        SELECT 
            s."SolicitudID", 
            s."SolCreado" AS fecha_creacion,
            s."SolEstado" AS estado, 
            s."SolTipoSolicitud" AS tipo_solicitud,
            s."SolDiagnosticoPrincipal" AS diagnostico,
            b."BenNombres" || ' ' || b."BenApellidos" AS nombre_beneficiario,
            e."EnfNombre" AS nombre_enfermedad
        FROM "Tbl_Solicitud" s
        LEFT JOIN "Tbl_Beneficiario" b ON s."BeneficiarioID" = b."BeneficiarioID"
        LEFT JOIN "Cat_Enfermedad" e ON s."EnfermedadID" = e."EnfermedadID"`;

    const params = [];
    if (search) {
        sql += ` WHERE b."BenNombres" ILIKE $1 OR b."BenApellidos" ILIKE $1 OR e."EnfNombre" ILIKE $1`;
        params.push(`%${search}%`);
    }

    sql += ` ORDER BY s."SolCreado" DESC;`;
    const { rows, rowCount } = await database.query(sql, params);
    return { results: rowCount, data: rows };
};

export const CreateRequest = async (beneficiario_id, enfermedad_id, tipo_solicitud, diagnostico_principal, institucion_salud, medico_tratante, prioridad_medica, usuario_receptor_id) => {
    const sql = `INSERT INTO "Tbl_Solicitud" ("BeneficiarioID", "EnfermedadID", "SolTipoSolicitud", "SolDiagnosticoPrincipal", "SolInstitucionSalud", "SolMedicoTratante", "SolPrioridadMedica", "UsuarioReceptorID", "SolEstado", "SolCreado", "SolActualizado")
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDIENTE', NOW(), NOW())
                 RETURNING "SolicitudID", "SolEstado", "SolTipoSolicitud";`;
    const { rows, rowCount } = await database.query(sql, [beneficiario_id, enfermedad_id, tipo_solicitud, diagnostico_principal, institucion_salud, medico_tratante, prioridad_medica, usuario_receptor_id]);
    return { results: rowCount, data: rows[0] };
};

export const UpdateRequest = async (id, data) => {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.enfermedad_id !== undefined) {
        fields.push(`"EnfermedadID" = $${paramIndex}`);
        values.push(data.enfermedad_id);
        paramIndex++;
    }
    if (data.tipo_solicitud !== undefined) {
        fields.push(`"SolTipoSolicitud" = $${paramIndex}`);
        values.push(data.tipo_solicitud);
        paramIndex++;
    }
    if (data.diagnostico_principal !== undefined) {
        fields.push(`"SolDiagnosticoPrincipal" = $${paramIndex}`);
        values.push(data.diagnostico_principal);
        paramIndex++;
    }
    if (data.institucion_salud !== undefined) {
        fields.push(`"SolInstitucionSalud" = $${paramIndex}`);
        values.push(data.institucion_salud);
        paramIndex++;
    }
    if (data.medico_tratante !== undefined) {
        fields.push(`"SolMedicoTratante" = $${paramIndex}`);
        values.push(data.medico_tratante);
        paramIndex++;
    }
    if (data.prioridad_medica !== undefined) {
        fields.push(`"SolPrioridadMedica" = $${paramIndex}`);
        values.push(data.prioridad_medica);
        paramIndex++;
    }

    if (fields.length === 0) {
        throw new Error('No hay campos para actualizar');
    }

    fields.push(`"SolActualizado" = NOW()`);
    values.push(id);

    const sql = `UPDATE "Tbl_Solicitud" SET ${fields.join(', ')} WHERE "SolicitudID" = $${paramIndex} RETURNING *;`;
    const { rows, rowCount } = await database.query(sql, values);
    return { results: rowCount, data: rows[0] };
};

export const DeleteRequest = async (id) => {
    const sql = `DELETE FROM "Tbl_Solicitud" WHERE "SolicitudID" = $1 RETURNING *;`;
    const { rowCount } = await database.query(sql, [id]);
    return { results: rowCount };
};