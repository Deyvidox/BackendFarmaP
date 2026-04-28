import { requestSchema, RequestIdValidated } from "../validates/request.validation.js";
import { GetAllRequests, CreateRequest, UpdateRequest, DeleteRequest } from "../modules/request.model.js";

export const GetRequestsControl = async (req, res, next) => {
    try {
        const { search } = req.query;
        const { results, data } = await GetAllRequests(search);
        req.message = {
            type: "Successfully",
            message: { context: "Solicitudes recuperadas", count: results, requests: data },
            status: 200
        };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const CreateRequestControl = async (req, res, next) => {
    try {
        const val = requestSchema.safeParse(req.body);
        if (!val.success) {
            req.message = { type: "Validation", message: val.error.errors.map(e => e.message).join(", "), status: 400 };
            return next();
        }
        const { beneficiario_id, enfermedad_id, tipo_solicitud, diagnostico_principal, institucion_salud, medico_tratante, prioridad_medica, usuario_receptor_id } = val.data;
        const { data } = await CreateRequest(beneficiario_id, enfermedad_id, tipo_solicitud, diagnostico_principal, institucion_salud, medico_tratante, prioridad_medica, usuario_receptor_id);
        req.message = { type: "Successfully", message: { context: "Solicitud creada", data }, status: 201 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const UpdateRequestControl = async (req, res, next) => {
    try {
        const idVal = RequestIdValidated.safeParse({ id: req.params.id });
        const dataVal = requestSchema.safeParse(req.body);
        if (!idVal.success || !dataVal.success) {
            req.message = { type: "Validation", message: "ID o datos inválidos", status: 400 };
            return next();
        }
        const { results, data } = await UpdateRequest(req.params.id, dataVal.data);
        if (results === 0) {
            req.message = { type: "Error", message: "Solicitud no encontrada", status: 404 };
            return next();
        }
        req.message = { type: "Successfully", message: { context: "Solicitud actualizada", data }, status: 200 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const DeleteRequestControl = async (req, res, next) => {
    try {
        const { results } = await DeleteRequest(req.params.id);
        req.message = results > 0 
            ? { type: "Successfully", message: "Solicitud eliminada", status: 200 }
            : { type: "Error", message: "Solicitud no encontrada", status: 404 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};