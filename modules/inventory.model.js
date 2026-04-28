import database from "../database.js";

// Obtener inventario con filtros funcionales (Búsqueda y Estado)
export const GetAllInventory = async (filters = {}) => {
    const { search, estado, lote_id } = filters;
    let sql = `SELECT i.*, m.MedNombre, m.MedPrincipioActivo FROM public.Tbl_Inventario i JOIN public.Tbl_Medicamento m ON i.MedID = m.MedID WHERE 1=1`;
    const params = [];

    if (lote_id) {
        params.push(lote_id);
        sql += ` AND i.LoteID = $${params.length}`;
    } else {
        if (search) {
            params.push(`%${search}%`);
            sql += ` AND m.MedNombre ILIKE $${params.length}`;
        }
        if (estado && estado !== "") {
            params.push(estado);
            sql += ` AND i.InvEstado = $${params.length}`;
        }
    }
    sql += ` ORDER BY i.InvFechaRegistro DESC;`;
    const { rows } = await database.query(sql, params);
    return rows;
};

// Crear nuevo lote de inventario
export const CreateInventory = async (d) => {
    const sql = `INSERT INTO public.Tbl_Inventario (LoteID, MedID, InvUbicacion, InvCantidadTotal, InvFechaCaducidad, InvEstado, InvImagen, InvUsuarioRegistro, InvFechaRegistro) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *;`;
    
    const values = [
        d.lote_id, 
        d.med_id, 
        d.ubicacion, 
        parseInt(d.cantidad_total), 
        d.fecha_caducidad, 
        d.estado, 
        d.image_url || null,
        d.usuario_registro
    ];
    const { rows } = await database.query(sql, values);
    return rows[0];
};

// Actualizar lote de inventario
export const UpdateInventory = async (lote_id, d) => {
    const sql = `
        UPDATE public.Tbl_Inventario 
        SET InvUbicacion = COALESCE($1, InvUbicacion), 
            InvCantidadTotal = COALESCE($2, InvCantidadTotal), 
            InvFechaCaducidad = COALESCE($3, InvFechaCaducidad), 
            InvEstado = COALESCE($4, InvEstado), 
            InvImagen = COALESCE($5, InvImagen),
            InvFechaActualizacion = NOW(),
            InvUsuarioActualizacion = $6
        WHERE LoteID = $7 
        RETURNING *;
    `;
    const values = [
        d.ubicacion || null, 
        d.cantidad_total ? parseInt(d.cantidad_total) : null, 
        d.fecha_caducidad || null, 
        d.estado || null, 
        d.image_url || null, 
        d.usuario_actualizacion,
        lote_id
    ];
    const { rows } = await database.query(sql, values);
    return rows[0];
};

export const GetInventoryById = async (lote_id) => {
    const sql = `SELECT i.*, m.MedNombre, m.MedPrincipioActivo FROM public.Tbl_Inventario i JOIN public.Tbl_Medicamento m ON i.MedID = m.MedID WHERE i.LoteID = $1;`;
    const { rows } = await database.query(sql, [lote_id]);
    return rows[0];
};

export const DeleteInventory = async (lote_id) => {
    return await database.query(`DELETE FROM public.Tbl_Inventario WHERE LoteID = $1;`, [lote_id]);
};