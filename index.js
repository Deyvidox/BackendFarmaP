import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

// Conexión a Base de Datos
import database from "./database.js"; 

// Importación de Rutas
import inventoryRoutes from "./routes/inventory.routes.js";
import medicationRoutes from "./routes/medication.routes.js"; // <--- Nueva ruta integrada
import requestRoutes from "./routes/request.routes.js";
import RegisterRoutes from "./routes/register.routes.js";
import RolesRoutes from "./routes/roles.routes.js";
import LoginRoutes from "./routes/login.routes.js";
import BeneficiaryRoutes from "./routes/beneficiary.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// --- PREPARACIÓN DEL SERVIDOR ---

// Asegurar que la carpeta 'uploads' exista para Multer
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middlewares
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (por si necesitas ver las fotos temporales)
app.use("/uploads", express.static(uploadDir));

// --- DEFINICIÓN DE RUTAS ---
app.use("/api/inventory", inventoryRoutes);
app.use("/api/medications", medicationRoutes); // <--- Endpoint para Medicamentos y Filtros
app.use("/api/requests", requestRoutes);
app.use("/api/beneficiaries", BeneficiaryRoutes);
app.use("/login", LoginRoutes);
app.use("/register", RegisterRoutes);
app.use("/roles", RolesRoutes);

// Verificación de inicio de servicios
try {
    await database.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL establecida");
    console.log("☁️  Cloudinary configurado correctamente");
} catch (err) {
    console.error("❌ Error en la inicialización:", err.message);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor FarmaPatria corriendo en http://localhost:${PORT}`);
    console.log(`📅 Sistema activo: ${new Date().toLocaleDateString()}`);
});