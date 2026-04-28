import database from "../database.js";

export const BeneficiaryRegister = async (
    cedula, nombres, apellidos, fecha_nacimiento, genero,
    comunidad_id, direccion_detallada, telefono_personal, email,
    contacto_emergencia, telefono_emergencia, personas_dependientes,
    ingresos_mensuales, nivel_prioridad
) => {
    console.log('📝 Ejecutando INSERT en tabla Tbl_Beneficiario...');
    
    const sql = `
        INSERT INTO "Tbl_Beneficiario" (
            "BenCedula", "BenNombres", "BenApellidos", "BenFechaNacimiento", "BenGenero",
            "ComunidadID", "BenDireccionDetallada", "BenTelefonoPersonal", "BenEmail",
            "BenContactoEmergencia", "BenTelefonoEmergencia", "BenPersonasDependientes",
            "BenIngresosMensuales", "BenNivelPrioridad", "BenEstado", "BenFechaRegistro",
            "BenCreado", "BenActualizado"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'ACTIVO', CURRENT_DATE, NOW(), NOW())
        RETURNING 
            "BeneficiarioID", "BenCedula", "BenNombres", "BenApellidos", "BenFechaNacimiento",
            "BenGenero", "ComunidadID", "BenDireccionDetallada", "BenTelefonoPersonal",
            "BenEmail", "BenContactoEmergencia", "BenTelefonoEmergencia",
            "BenPersonasDependientes", "BenIngresosMensuales", "BenNivelPrioridad",
            "BenEstado", "BenFechaRegistro", "BenCreado"
    `;

    const values = [
        cedula, nombres, apellidos, fecha_nacimiento, genero,
        comunidad_id, direccion_detallada, telefono_personal, email,
        contacto_emergencia, telefono_emergencia, personas_dependientes,
        ingresos_mensuales, nivel_prioridad
    ];

    console.log('📊 Valores SQL para registro:', values.map(v => v || 'NULL'));
    
    try {
        const { rows, rowCount } = await database.query(sql, values);
        console.log('✅ Registro exitoso, filas afectadas:', rowCount);
        
        return { 
            "results": rowCount, 
            "data": rows[0] 
        };
    } catch (err) {
        console.error('❌ ERROR en BeneficiaryRegister:', err.message);
        
        // Manejo de errores específicos de PostgreSQL
        if (err.code === '23505') { // Violación de unique constraint
            if (err.detail.includes('BenCedula')) {
                throw new Error('La cédula ya existe');
            } else if (err.detail.includes('BenEmail')) {
                throw new Error('El correo electrónico ya existe');
            }
        }
        
        throw err;
    }
};

export const RegisterUnique = async (cedula, telefono_personal, email) => {
    console.log('🔍 Verificando unicidad de datos...');
    
    let sql = `SELECT COUNT(*) as count FROM "Tbl_Beneficiario" WHERE "BenEstado" = 'ACTIVO' AND (`;
    const params = [];
    let conditions = [];
    let paramIndex = 1;

    if (cedula && cedula.trim() !== '') {
        conditions.push(`"BenCedula" = $${paramIndex}`);
        params.push(cedula.trim());
        paramIndex++;
    }

    if (telefono_personal && telefono_personal.trim() !== '') {
        conditions.push(`"BenTelefonoPersonal" = $${paramIndex}`);
        params.push(telefono_personal.trim());
        paramIndex++;
    }

    if (email && email.trim() !== '') {
        conditions.push(`"BenEmail" = $${paramIndex}`);
        params.push(email.trim());
        paramIndex++;
    }

    if (conditions.length === 0) {
        return { "results": 0 };
    }

    sql += conditions.join(' OR ') + ')';
    console.log('📊 SQL de verificación:', sql);
    console.log('📊 Parámetros:', params);

    try {
        const { rows } = await database.query(sql, params);
        const count = parseInt(rows[0].count);
        console.log('📊 Beneficiarios duplicados encontrados:', count);
        
        return { "results": count };
    } catch (err) {
        console.error('❌ ERROR en RegisterUnique:', err.message);
        throw err;
    }
};

export const UpdateBeneficiary = async (id, data) => {
    console.log('📝 Actualizando beneficiario ID:', id);
    console.log('📝 Datos a actualizar:', data);
    
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Construir dinámicamente la consulta UPDATE
    if (data.nombres !== undefined) {
        fields.push(`"BenNombres" = $${paramIndex}`);
        values.push(data.nombres);
        paramIndex++;
    }
    
    if (data.apellidos !== undefined) {
        fields.push(`"BenApellidos" = $${paramIndex}`);
        values.push(data.apellidos);
        paramIndex++;
    }
    
    if (data.telefono_personal !== undefined) {
        fields.push(`"BenTelefonoPersonal" = $${paramIndex}`);
        values.push(data.telefono_personal);
        paramIndex++;
    }
    
    if (data.direccion_detallada !== undefined) {
        fields.push(`"BenDireccionDetallada" = $${paramIndex}`);
        values.push(data.direccion_detallada);
        paramIndex++;
    }
    
    if (data.fecha_nacimiento !== undefined) {
        fields.push(`"BenFechaNacimiento" = $${paramIndex}`);
        values.push(data.fecha_nacimiento);
        paramIndex++;
    }

    if (fields.length === 0) {
        throw new Error('No hay campos para actualizar');
    }

    fields.push(`"BenActualizado" = NOW()`);
    values.push(id); // El ID va al final

    const sql = `
        UPDATE "Tbl_Beneficiario" 
        SET ${fields.join(', ')}
        WHERE "BeneficiarioID" = $${paramIndex} AND "BenEstado" = 'ACTIVO'
        RETURNING 
            "BeneficiarioID", "BenCedula", "BenNombres", "BenApellidos",
            "BenFechaNacimiento", "BenGenero", "ComunidadID", "BenDireccionDetallada",
            "BenTelefonoPersonal", "BenEmail", "BenContactoEmergencia",
            "BenTelefonoEmergencia", "BenPersonasDependientes", "BenIngresosMensuales",
            "BenNivelPrioridad", "BenEstado", "BenActualizado"
    `;

    console.log('📊 SQL UPDATE:', sql);
    console.log('📊 Valores UPDATE:', values);

    try {
        const { rows, rowCount } = await database.query(sql, values);
        console.log('✅ Actualización exitosa, filas afectadas:', rowCount);
        
        return { 
            "results": rowCount, 
            "data": rows[0] || null 
        };
    } catch (err) {
        console.error('❌ ERROR en UpdateBeneficiary:', err.message);
        throw err;
    }
};

export const DeactivateBeneficiary = async (beneficiaryId) => {
    console.log('🗑️ Desactivando beneficiario ID:', beneficiaryId);
    
    const sql = `
        UPDATE "Tbl_Beneficiario" 
        SET "BenEstado" = 'INACTIVO', "BenActualizado" = NOW()
        WHERE "BeneficiarioID" = $1 AND "BenEstado" = 'ACTIVO'
        RETURNING 
            "BeneficiarioID", "BenCedula", "BenNombres", "BenApellidos", "BenEstado"
    `;

    try {
        const { rows, rowCount } = await database.query(sql, [beneficiaryId]);
        console.log('✅ Beneficiario desactivado, filas afectadas:', rowCount);
        
        return {
            "results": rowCount,
            "data": rows[0] || null
        };
    } catch (err) {
        console.error('❌ ERROR en DeactivateBeneficiary:', err.message);
        throw err;
    }
};

export const SearchBeneficiaries = async (search = '', limit = 10) => {
    console.log('🔍 Buscando beneficiarios con término:', search);
    
    let sql = `
        SELECT 
            "BeneficiarioID",
            "BenCedula",
            "BenNombres",
            "BenApellidos",
            "BenFechaNacimiento",
            "BenGenero",
            "ComunidadID",
            "BenDireccionDetallada",
            "BenTelefonoPersonal",
            "BenEmail",
            "BenContactoEmergencia",
            "BenTelefonoEmergencia",
            "BenPersonasDependientes",
            "BenIngresosMensuales",
            "BenNivelPrioridad",
            "BenEstado",
            "BenFechaRegistro",
            "BenCreado",
            "BenActualizado"
        FROM "Tbl_Beneficiario"
        WHERE "BenEstado" = 'ACTIVO'
    `;
    
    const params = [];
    
    if (search && search.trim() !== '') {
        sql += ` AND (
            "BenCedula" ILIKE $1 OR 
            "BenNombres" ILIKE $1 OR 
            "BenApellidos" ILIKE $1 OR
            "BenEmail" ILIKE $1 OR
            "BenTelefonoPersonal" ILIKE $1
        )`;
        params.push(`%${search.trim()}%`);
    }
    
    sql += ` ORDER BY "BenCreado" DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    console.log('📊 SQL SEARCH:', sql);
    console.log('📊 Parámetros SEARCH:', params);

    try {
        const { rows, rowCount } = await database.query(sql, params);
        console.log('✅ Beneficiarios encontrados:', rowCount);
        
        return { 
            "results": rowCount, 
            "data": rows 
        };
    } catch (err) {
        console.error('❌ ERROR en SearchBeneficiaries:', err.message);
        throw err;
    }
};

export const GetAllBeneficiaries = async (page = 1, limit = 10, status = null) => {
    console.log('📋 Obteniendo todos los beneficiarios. Página:', page, 'Límite:', limit, 'Status:', status);
    
    const offset = (page - 1) * limit;
    
    let sql = `
        SELECT 
            "BeneficiarioID",
            "BenCedula",
            "BenNombres",
            "BenApellidos",
            "BenFechaNacimiento",
            "BenGenero",
            "ComunidadID",
            "BenDireccionDetallada",
            "BenTelefonoPersonal",
            "BenEmail",
            "BenContactoEmergencia",
            "BenTelefonoEmergencia",
            "BenPersonasDependientes",
            "BenIngresosMensuales",
            "BenNivelPrioridad",
            "BenEstado",
            "BenFechaRegistro",
            "BenCreado",
            "BenActualizado"
        FROM "Tbl_Beneficiario"
    `;
    
    const params = [];
    
    if (status) {
        sql += ` WHERE "BenEstado" = $1`;
        params.push(status);
    }
    
    // SQL para contar total
    const countSql = `SELECT COUNT(*) as total FROM "Tbl_Beneficiario" ${status ? 'WHERE "BenEstado" = $1' : ''}`;
    
    sql += ` ORDER BY "BenCreado" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    console.log('📊 SQL GET ALL:', sql);
    console.log('📊 Parámetros GET ALL:', params);

    try {
        // Ejecutar ambas consultas en paralelo
        const [beneficiariesResult, countResult] = await Promise.all([
            database.query(sql, params),
            database.query(countSql, status ? [status] : [])
        ]);

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);

        console.log('✅ Beneficiarios obtenidos:', beneficiariesResult.rowCount, 'de', total);

        return {
            "results": beneficiariesResult.rowCount,
            "data": beneficiariesResult.rows,
            "pagination": {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    } catch (err) {
        console.error('❌ ERROR en GetAllBeneficiaries:', err.message);
        throw err;
    }
};

export const GetBeneficiaryById = async (beneficiaryId) => {
    console.log('🔍 Obteniendo beneficiario por ID:', beneficiaryId);
    
    const sql = `
        SELECT 
            "BeneficiarioID",
            "BenCedula",
            "BenNombres",
            "BenApellidos",
            "BenFechaNacimiento",
            "BenGenero",
            "ComunidadID",
            "BenDireccionDetallada",
            "BenTelefonoPersonal",
            "BenEmail",
            "BenContactoEmergencia",
            "BenTelefonoEmergencia",
            "BenPersonasDependientes",
            "BenIngresosMensuales",
            "BenNivelPrioridad",
            "BenEstado",
            "BenFechaRegistro",
            "BenCreado",
            "BenActualizado"
        FROM "Tbl_Beneficiario"
        WHERE "BeneficiarioID" = $1 AND "BenEstado" = 'ACTIVO'
    `;

    try {
        const { rows, rowCount } = await database.query(sql, [beneficiaryId]);
        console.log('✅ Beneficiario encontrado:', rowCount > 0);
        
        if (rowCount === 0) {
            return null;
        }
        
        return rows[0];
    } catch (err) {
        console.error('❌ ERROR en GetBeneficiaryById:', err.message);
        throw err;
    }
};