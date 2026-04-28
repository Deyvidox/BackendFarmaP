import { GetRoles } from "../modules/roles.modules.js"

export const GetRolesControl = async (req, res, next) => {
    console.log('📥 Solicitando lista de roles...');
    
    try {
        const { results, data } = await GetRoles();

        req.message = {
            type: "Successfully",
            message: {
                context: "Roles obtenidos exitosamente",
                count: results,
                roles: data
            },
            status: 200
        }
        return next()

    } catch (err) {
        console.error('🔥 ERROR en GetRolesControl:', err.message);
        
        req.message = {
            type: "Error",
            message: "Error al obtener los roles",
            status: 500
        }
        return next()
    }
}