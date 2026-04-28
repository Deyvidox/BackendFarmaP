import * as InventoryModel from "../modules/inventory.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";

export const GetAllInventoryControl = async (req, res) => {
    try {
        const { search, estado } = req.query;
        const result = await InventoryModel.GetAllInventory({ search, estado });
        return res.status(200).json({ success: true, data: result, message: "Inventory retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const CreateInventoryControl = async (req, res) => {
    let tempPath = null;
    try {
        const data = { ...req.body };
        if (req.file) {
            tempPath = req.file.path;
            const uploadRes = await cloudinary.uploader.upload(tempPath, { folder: "farma_inventory" });
            data.image_url = uploadRes.secure_url;
            await fs.unlink(tempPath);
        }
        const saved = await InventoryModel.CreateInventory(data);
        return res.status(201).json({ success: true, data: saved });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) await fs.unlink(req.file.path);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const UpdateInventoryControl = async (req, res) => {
    try {
        const { lote_id } = req.params;
        const data = { ...req.body };

        if (req.file) {
            const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: "farma_inventory" });
            data.image_url = uploadRes.secure_url;
            await fs.unlink(req.file.path);
        }

        const updated = await InventoryModel.UpdateInventory(lote_id, data);
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) await fs.unlink(req.file.path);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const DeleteInventoryControl = async (req, res) => {
    try {
        const { lote_id } = req.params;
        await InventoryModel.DeleteInventory(lote_id);
        return res.status(200).json({ success: true, message: "Inventory lot deleted successfully" });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: inventory lot is in use." 
            });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const GetByIdInventoryControl = async (req, res) => {
    try {
        const product = await InventoryModel.GetInventoryById(req.params.lote_id);
        if (!product) return res.status(404).json({ success: false, message: "Inventory lot not found" });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};