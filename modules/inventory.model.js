import database from "../database.js";

// Obtener inventario con filtros (Búsqueda por nombre de medicamento y Estado)
export const GetAllInventory = async (filters = {}) => {
    const { search, estado, lote_id } = filters;
    let sql = `
        SELECT i.*, 
               l."LotNumeroLote", l."LotFechaVencimiento", l."LotCantidadUnidades", l."LotEstadoCalidad",
               m."MedNombreComercial" AS "MedNombre", m."MedPrincipioActivo"
        FROM "Tbl_Inventario" i 
        JOIN "Tbl_LoteMedicamento" l ON i."LoteID" = l."LoteID"
        JOIN "Tbl_Medicamento" m ON l."MedicamentoID" = m."MedicamentoID" 
        WHERE 1=1`;
    const params = [];

    if (lote_id) {
        params.push(lote_id);
        sql += ` AND i."LoteID" = $${params.length}`;
    } else {
        if (search) {
            params.push(`%${search}%`);
            sql += ` AND m."MedNombreComercial" ILIKE $${params.length}`;
        }
        if (estado && estado !== "") {
            params.push(estado);
            sql += ` AND i."InvEstado" = $${params.length}`;
        }
    }
    sql += ` ORDER BY i."InvCreado" DESC;`;
    const { rows } = await database.query(sql, params);
    return rows;
};

// Crear registro de inventario
export const CreateInventory = async (d) => {
    const sql = `INSERT INTO "Tbl_Inventario" ("InventarioID", "LoteID", "InvUbicacion", "InvCantidadTotal", "InvCantidadDisponible", "InvEstado", "InvCreado") 
                 VALUES (gen_random_uuid(), $1, $2, $3, $3, $4, NOW()) RETURNING *;`;
    
    const values = [
        d.lote_id, 
        d.ubicacion, 
        parseInt(d.cantidad_total), 
        d.estado || 'OPTIMO'
    ];
    const { rows } = await database.query(sql, values);
    return rows[0];
};

// Actualizar inventario
export const UpdateInventory = async (lote_id, d) => {
    const sql = `
        UPDATE "Tbl_Inventario" 
        SET "InvUbicacion" = COALESCE($1, "InvUbicacion"), 
            "InvCantidadTotal" = COALESCE($2, "InvCantidadTotal"), 
            "InvCantidadDisponible" = COALESCE($3, "InvCantidadDisponible"),
            "InvEstado" = COALESCE($4, "InvEstado"), 
            "InvActualizado" = NOW()
        WHERE "LoteID" = $5 
        RETURNING *;
    `;
    const values = [
        d.ubicacion || null, 
        d.cantidad_total ? parseInt(d.cantidad_total) : null, 
        d.cantidad_disponible ? parseInt(d.cantidad_disponible) : null,
        d.estado || null, 
        lote_id
    ];
    const { rows } = await database.query(sql, values);
    return rows[0];
};

export const GetInventoryById = async (lote_id) => {
    const sql = `
        SELECT i.*, 
               l."LotNumeroLote", l."LotFechaVencimiento", l."LotCantidadUnidades",
               m."MedNombreComercial" AS "MedNombre", m."MedPrincipioActivo"
        FROM "Tbl_Inventario" i 
        JOIN "Tbl_LoteMedicamento" l ON i."LoteID" = l."LoteID"
        JOIN "Tbl_Medicamento" m ON l."MedicamentoID" = m."MedicamentoID" 
        WHERE i."LoteID" = $1;`;
    const { rows } = await database.query(sql, [lote_id]);
    return rows[0];
};

export const DeleteInventory = async (lote_id) => {
    return await database.query(`DELETE FROM "Tbl_Inventario" WHERE "LoteID" = $1;`, [lote_id]);
};