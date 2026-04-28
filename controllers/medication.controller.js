import * as MedicationModel from "../modules/medication.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";

export const GetAllMedicationsControl = async (req, res) => {
    try {
        const result = await MedicationModel.GetAllMedications(req.query);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const CreateMedicationControl = async (req, res) => {
    let tempPath = req.file ? req.file.path : null;
    try {
        const data = { ...req.body };
        
        if (tempPath) {
            const uploadRes = await cloudinary.uploader.upload(tempPath, { folder: "farma_medications" });
            data.image_url = uploadRes.secure_url;
            await fs.unlink(tempPath);
        }

        const result = await MedicationModel.CreateMedication(data);
        return res.status(201).json({ success: true, data: result });
    } catch (error) {
        if (tempPath && fs.existsSync(tempPath)) await fs.unlink(tempPath);
        return res.status(500).json({ success: false, message: "Error al registrar medicamento: " + error.message });
    }
};

export const UpdateMedicationControl = async (req, res) => {
    let tempPath = req.file ? req.file.path : null;
    try {
        const { id } = req.params;
        const data = { ...req.body };

        if (tempPath) {
            const uploadRes = await cloudinary.uploader.upload(tempPath, { folder: "farma_medications" });
            data.image_url = uploadRes.secure_url;
            await fs.unlink(tempPath);
        }

        const result = await MedicationModel.UpdateMedication(id, data);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        if (tempPath && fs.existsSync(tempPath)) await fs.unlink(tempPath);
        return res.status(500).json({ success: false, message: "Error al actualizar el medicamento. Verifique los datos." });
    }
};

export const DeletePetControl = async (req, res) => {
    try {
        const { id } = req.params;
        await PetModel.DeletePet(id);
        return res.status(200).json({ success: true, message: "Mascota eliminada correctamente." });
    } catch (error) {
        // Captura el error de integridad referencial del SQL (Error 23503)
        if (error.code === '23503') {
            return res.status(400).json({ 
                success: false, 
                message: "No se puede eliminar: la mascota tiene historial o citas vinculadas." 
            });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};