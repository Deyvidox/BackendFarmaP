import database from "../database.js";

export const GetRoles = async () => {
    console.log('📝 Obteniendo roles de la base de datos...');
    
    const sql = `
        SELECT id, name, permissions
        FROM roles
        ORDER BY id ASC
    `;

    try {
        const { rows, rowCount } = await database.query(sql);
        console.log('✅ Roles obtenidos:', rowCount);
        
        return { 
            "results": rowCount, 
            "data": rows 
        };
    } catch (err) {
        console.error('❌ ERROR en GetRoles:', err.message);
        throw err;
    }
};