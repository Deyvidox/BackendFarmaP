import database from "../database.js";

// modules/medication.model.js
export const GetAllMedications = async (filters) => {
    const { categoria } = filters;
    try {
        let query = `
            SELECT 
                m."MedicamentoID", m."MedCodigoNacional", m."MedNombreComercial", m."MedNombreGenerico",
                m."MedPrincipioActivo", m."MedConcentracion", m."FormaFarmaceuticaID", m."MedViaAdministracion",
                m."LaboratorioID", m."CategoriaMedicamentoID", m."MedRegistroSanitario", m."MedRequiereReceta",
                m."MedCondicionesAlmacenamiento", m."MedTemperaturaAlmacenamiento", m."MedUnidadMedida",
                m."MedCantidadPorPresentacion", m."MedEstado", m."MedCreado", m."MedActualizado",
                f."FFarmNombre" as forma_farmaceutica, l."LabNombre" as laboratorio, c."CMedNombre" as categoria
            FROM "Tbl_Medicamento" m
            LEFT JOIN "Cat_FormaFarmaceutica" f ON m."FormaFarmaceuticaID" = f."FormaFarmaceuticaID"
            LEFT JOIN "Cat_Laboratorio" l ON m."LaboratorioID" = l."LaboratorioID"
            LEFT JOIN "Cat_CategoriaMedicamento" c ON m."CategoriaMedicamentoID" = c."CategoriaMedicamentoID"
            WHERE 1=1
        `;
        const params = [];
        if (categoria && categoria !== 'Todas') {
            params.push(categoria);
            query += ` AND c."CMedNombre" = $${params.length}`;
        }
        query += ` ORDER BY m."MedicamentoID" DESC`;
        const result = await database.query(query, params);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const CreateMedication = async (data) => {
    const { 
        codigo_nacional, nombre_comercial, nombre_generico, principio_activo, concentracion,
        forma_farmaceutica_id, via_administracion, laboratorio_id, categoria_medicamento_id,
        registro_sanitario, requiere_receta, condiciones_almacenamiento, temperatura_almacenamiento,
        unidad_medida, cantidad_por_presentacion, image_url
    } = data;
    const query = `
        INSERT INTO "Tbl_Medicamento" 
        ("MedCodigoNacional", "MedNombreComercial", "MedNombreGenerico", "MedPrincipioActivo", "MedConcentracion",
         "FormaFarmaceuticaID", "MedViaAdministracion", "LaboratorioID", "CategoriaMedicamentoID",
         "MedRegistroSanitario", "MedRequiereReceta", "MedCondicionesAlmacenamiento", "MedTemperaturaAlmacenamiento",
         "MedUnidadMedida", "MedCantidadPorPresentacion", "MedEstado", "MedCreado", "MedActualizado")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'ACTIVO', NOW(), NOW()) RETURNING *;
    `;
    const values = [
        codigo_nacional, nombre_comercial, nombre_generico, principio_activo, concentracion,
        forma_farmaceutica_id, via_administracion, laboratorio_id, categoria_medicamento_id,
        registro_sanitario, requiere_receta, condiciones_almacenamiento, temperatura_almacenamiento,
        unidad_medida, cantidad_por_presentacion
    ];
    const result = await database.query(query, values);
    return result.rows[0];
};

export const UpdateMedication = async (id, data) => {
    const { 
        nombre_comercial, nombre_generico, principio_activo, concentracion, via_administracion,
        registro_sanitario, requiere_receta, condiciones_almacenamiento, temperatura_almacenamiento,
        unidad_medida, cantidad_por_presentacion, image_url
    } = data;
    const query = `
        UPDATE "Tbl_Medicamento" 
        SET "MedNombreComercial" = COALESCE($1, "MedNombreComercial"),
            "MedNombreGenerico" = COALESCE($2, "MedNombreGenerico"),
            "MedPrincipioActivo" = COALESCE($3, "MedPrincipioActivo"),
            "MedConcentracion" = COALESCE($4, "MedConcentracion"),
            "MedViaAdministracion" = COALESCE($5, "MedViaAdministracion"),
            "MedRegistroSanitario" = COALESCE($6, "MedRegistroSanitario"),
            "MedRequiereReceta" = COALESCE($7, "MedRequiereReceta"),
            "MedCondicionesAlmacenamiento" = COALESCE($8, "MedCondicionesAlmacenamiento"),
            "MedTemperaturaAlmacenamiento" = COALESCE($9, "MedTemperaturaAlmacenamiento"),
            "MedUnidadMedida" = COALESCE($10, "MedUnidadMedida"),
            "MedCantidadPorPresentacion" = COALESCE($11, "MedCantidadPorPresentacion"),
            "MedActualizado" = NOW()
        WHERE "MedicamentoID" = $12 AND "MedEstado" = 'ACTIVO'
        RETURNING *;
    `;
    const values = [
        nombre_comercial, nombre_generico, principio_activo, concentracion, via_administracion,
        registro_sanitario, requiere_receta, condiciones_almacenamiento, temperatura_almacenamiento,
        unidad_medida, cantidad_por_presentacion, id
    ];
    const result = await database.query(query, values);
    return result.rows[0];
};
            species_id = COALESCE($6, species_id),
            image_url = COALESCE($7, image_url),
            updated_at = NOW()
        WHERE id = $8 RETURNING *;
    `;
    const result = await database.query(query, [name, breed, color, status, gender, species_id, image_url, id]);
    return result.rows[0];
};

export const DeletePet = async (id) => {
    // Intenta borrar físicamente. Si falla por FK, el controlador manejará el error.
    return await database.query("DELETE FROM public.pets WHERE id = $1", [id]);
};