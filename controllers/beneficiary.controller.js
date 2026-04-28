import bcrypt from "bcrypt"
import { 
    BeneficiaryRegisterValidated, 
    SearchBeneficiariesValidated, 
    UpdateBeneficiaryValidated, 
    BeneficiaryIdValidated 
} from "../validates/beneficiary.validation.js"
import { 
    BeneficiaryRegister, 
    DeactivateBeneficiary, 
    GetAllBeneficiaries, 
    GetBeneficiaryById, 
    RegisterUnique, 
    SearchBeneficiaries, 
    UpdateBeneficiary 
} from "../modules/beneficiary.modules.js"

export const BeneficiaryRegisterControl = async (req, res, next) => {
    console.log('📥 ======= NUEVA SOLICITUD DE REGISTRO DE BENEFICIARIO =======');
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    try {
        // 1. Validación con Joi
        console.log('🔍 1. Iniciando validación Joi...');
        const { error, value } = BeneficiaryRegisterValidated.validate(req.body);

        if (error) {
            console.log('❌ Validación Joi fallida:', error.details);
            const errorMessages = error.details.map(d => d.message).join(', ');
            req.message = { 
                "type": "Validation", 
                "message": errorMessages, 
                "status": 400 
            }
            console.log('📤 Enviando respuesta de error de validación');
            return next()
        }
        
        console.log('✅ 1. Validación Joi exitosa');

        // 2. Verificar unicidad de datos
        console.log('🔍 2. Verificando unicidad de datos...');
        const unique = await RegisterUnique(
            value.cedula, 
            value.telefono_personal, 
            value.email
        );

        if (unique.results > 0) {
            console.log('❌ Datos duplicados encontrados');
            req.message = {
                "type": "Conflict", 
                "message": "Ya existe un beneficiario con estos datos (cédula, teléfono o correo)",
                "status": 400
            }
            return next()
        }
        console.log('✅ 2. Datos únicos verificados');

        // 3. Registrar beneficiario
        console.log('📝 3. Registrando beneficiario en base de datos...');
        const { results, data } = await BeneficiaryRegister(
            value.cedula, value.nombres, value.apellidos, value.fecha_nacimiento,
            value.genero, value.comunidad_id, value.direccion_detallada, value.telefono_personal,
            value.email, value.contacto_emergencia, value.telefono_emergencia,
            value.personas_dependientes, value.ingresos_mensuales, value.nivel_prioridad
        );

        if (results === 0) {
            console.log('❌ No se pudo registrar el beneficiario');
            req.message = {
                type: "Error", 
                message: "No se pudo registrar el beneficiario", 
                status: 400 
            }
            return next()
        }

        console.log('🎉 3. Beneficiario registrado exitosamente:', data.beneficiario_id);
        req.message = {
            type: "Successfully", 
            message: {
                context: "Registro completado exitosamente",
                count: results, 
                beneficiary: {
                    id: data.beneficiario_id,
                    cedula: data.cedula,
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    email: data.email,
                    createdAt: data.created_at
                }
            },
            status: 201
        }
        console.log('📤 ======= REGISTRO DE BENEFICIARIO COMPLETADO =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR NO CONTROLADO en BeneficiaryRegisterControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = { 
            type: "Error", 
            message: err.message, 
            status: 400 
        }
        return next()
    }
}

export const UpdateBeneficiaryControl = async (req, res, next) => {
    console.log('📥 ======= ACTUALIZACIÓN DE BENEFICIARIO =======');
    console.log('📥 ID beneficiario:', req.params.id);
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    try {
        // 1. Validación con Joi
        console.log('🔍 1. Validando datos de actualización...');
        const { error } = UpdateBeneficiaryValidated.validate({
            'nombres': req.body.nombres || '',
            'apellidos': req.body.apellidos || '',
            'telefono_personal': req.body.telefono_personal || '',
            'direccion_detallada': req.body.direccion_detallada || '',
            'fecha_nacimiento': req.body.fecha_nacimiento || '',
            'id': req.params.id
        });

        if (error) {
            console.log('❌ Validación fallida:', error.details);
            req.message = { 
                "type": "Validation", 
                "message": error.details.map(d => d.message).join(', '), 
                "status": 400 
            }
            return next()
        }
        console.log('✅ 1. Validación exitosa');

        // 2. Verificar si el beneficiario existe
        console.log('🔍 2. Verificando existencia del beneficiario...');
        const beneficiary = await GetBeneficiaryById(req.params.id);

        if (!beneficiary) {
            console.log('❌ Beneficiario no encontrado');
            req.message = {
                "type": "NotFound",
                "message": "Beneficiario no encontrado",
                "status": 404
            }
            return next()
        }
        console.log('✅ 2. Beneficiario encontrado:', beneficiary.cedula);

        // 3. Actualizar beneficiario
        console.log('📝 3. Actualizando beneficiario...');
        const { results, data } = await UpdateBeneficiary(req.params.id, req.body);

        if (results == 0) {
            console.log('❌ No se pudo actualizar el beneficiario');
            req.message = {
                "type": "Error",
                "message": "No se pudo actualizar el beneficiario",
                "status": 404
            }
            return next()
        }

        console.log('✅ 3. Beneficiario actualizado exitosamente');
        req.message = {
            type: "Successfully",
            message: {
                context: "Beneficiario actualizado exitosamente",
                beneficiary: data
            },
            status: 200
        }
        console.log('📤 ======= ACTUALIZACIÓN COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en UpdateBeneficiaryControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const DeactivateBeneficiaryControl = async (req, res, next) => {
    console.log('📥 ======= DESACTIVACIÓN DE BENEFICIARIO =======');
    console.log('📥 ID beneficiario:', req.params.id);
    
    try {
        const beneficiaryId = req.params.id;

        if (!beneficiaryId) {
            console.log('❌ ID de beneficiario no proporcionado');
            req.message = {
                "type": "Validation",
                "message": "Se requiere el ID del beneficiario",
                "status": 400
            }
            return next()
        }

        console.log('🔍 Validando ID de beneficiario...');
        const { error } = BeneficiaryIdValidated.validate({ "id": beneficiaryId });
        
        if (error) {
            console.log('❌ ID inválido:', error.details);
            req.message = {
                "type": "Validation",
                "message": "ID de beneficiario inválido",
                "status": 400
            }
            return next()
        }

        console.log('🗑️ Desactivando beneficiario...');
        const result = await DeactivateBeneficiary(beneficiaryId);

        if (result.results === 0) {
            console.log('❌ Beneficiario no encontrado o ya desactivado');
            req.message = {
                "type": "NotFound",
                "message": "Beneficiario no encontrado o ya desactivado",
                "status": 404
            }
            return next()
        }

        console.log('✅ Beneficiario desactivado exitosamente');
        req.message = {
            type: "Successfully",
            message: {
                context: "Beneficiario desactivado exitosamente",
                beneficiary: result.data
            },
            status: 200
        }
        console.log('📤 ======= DESACTIVACIÓN COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en DeactivateBeneficiaryControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const SearchBeneficiariesControl = async (req, res, next) => {
    console.log('📥 ======= BÚSQUEDA DE BENEFICIARIOS =======');
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    try {
        const { error, value } = SearchBeneficiariesValidated.validate(req.body)

        if (error) {
            console.log('❌ Validación fallida:', error.details);
            req.message = {
                "type": "Validation",
                "message": error.details.map(d => d.message).join(', '),
                "status": 400
            }
            return next()
        }

        console.log('🔍 Buscando beneficiarios con término:', value.search || '(vacío)');
        const { results, data } = await SearchBeneficiaries(value.search, value.limit);

        if (results == 0) {
            console.log('ℹ️ No se encontraron beneficiarios');
            req.message = {
                "type": "Successfully",
                "message": {
                    context: "No se encontraron beneficiarios",
                    count: 0,
                    beneficiaries: []
                },
                "status": 200
            }
            return next()
        }

        console.log('✅ Beneficiarios encontrados:', results);
        req.message = {
            type: "Successfully",
            message: {
                context: "Búsqueda completada exitosamente",
                count: results,
                beneficiaries: data
            },
            status: 200
        }
        console.log('📤 ======= BÚSQUEDA COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en SearchBeneficiariesControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const GetAllBeneficiariesControl = async (req, res, next) => {
    console.log('📥 ======= OBTENIENDO TODOS LOS BENEFICIARIOS =======');
    console.log('📥 Query params:', req.query);
    
    try {
        const { page, limit, status } = req.query;

        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const statusFilter = status || null;

        if (pageNum < 1) {
            console.log('❌ Número de página inválido');
            req.message = {
                "type": "Validation",
                "message": "El número de página debe ser mayor a 0",
                "status": 400
            }
            return next()
        }

        if (limitNum < 1 || limitNum > 100) {
            console.log('❌ Límite inválido');
            req.message = {
                "type": "Validation",
                "message": "El límite debe estar entre 1 y 100",
                "status": 400
            }
            return next()
        }

        if (statusFilter && !['ACTIVO', 'INACTIVO'].includes(statusFilter)) {
            console.log('❌ Filtro de estado inválido:', statusFilter);
            req.message = {
                "type": "Validation",
                "message": "Filtro de estado inválido. Use: ACTIVO o INACTIVO",
                "status": 400
            }
            return next()
        }

        console.log('📋 Obteniendo beneficiarios...');
        console.log('📊 Parámetros:', { page: pageNum, limit: limitNum, status: statusFilter });
        
        const result = await GetAllBeneficiaries(pageNum, limitNum, statusFilter);

        console.log('✅ Beneficiarios obtenidos:', result.data.length);
        req.message = {
            type: "Successfully",
            message: {
                context: "Beneficiarios obtenidos exitosamente",
                count: result.data.length,
                pagination: result.pagination,
                beneficiaries: result.data
            },
            status: 200
        }
        console.log('📤 ======= OBTENCIÓN COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en GetAllBeneficiariesControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const GetBeneficiaryByIdControl = async (req, res, next) => {
    console.log('📥 ======= OBTENIENDO BENEFICIARIO POR ID =======');
    console.log('📥 ID beneficiario:', req.params.id);
    
    try {
        const { error, value } = BeneficiaryIdValidated.validate({ "id": req.params.id })

        if (error) {
            console.log('❌ Validación de ID fallida');
            req.message = {
                "type": "Validation",
                "message": "Se requiere un ID de beneficiario válido",
                "status": 400
            }
            return next()
        }

        console.log('🔍 Buscando beneficiario ID:', value.id);
        const beneficiary = await GetBeneficiaryById(value.id);

        if (!beneficiary) {
            console.log('❌ Beneficiario no encontrado');
            req.message = {
                "type": "NotFound",
                "message": "Beneficiario no encontrado",
                "status": 404
            }
            return next()
        }

        console.log('✅ Beneficiario encontrado:', beneficiary.cedula);
        req.message = {
            type: "Successfully",
            message: {
                context: "Beneficiario obtenido exitosamente",
                beneficiary: beneficiary
            },
            status: 200
        }
        console.log('📤 ======= OBTENCIÓN COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en GetBeneficiaryByIdControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}