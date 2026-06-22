import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Conexión a Base de Datos
import database from "./database.js";

// Importación de Rutas existentes
import RegisterRoutes from "./routes/register.routes.js";
import RolesRoutes from "./routes/roles.routes.js";
import LoginRoutes from "./routes/login.routes.js";

// Importación de Rutas nuevas
import UsersRoutes from "./routes/users.routes.js";
import BeneficiariesRoutes from "./routes/beneficiaries.routes.js";
import MedicinesRoutes from "./routes/medicines.routes.js";
import DonationsRoutes from "./routes/donations.routes.js";
import RequestsRoutes from "./routes/requests.routes.js";
import DeliveriesRoutes from "./routes/deliveries.routes.js";
import CatalogsRoutes from "./routes/catalogs.routes.js";
import DashboardRoutes from "./routes/dashboard.routes.js";
import ProviderRequestsRoutes from "./routes/provider_requests.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- RUTAS PÚBLICAS (sin autenticación) ---
app.use("/login", LoginRoutes);
app.use("/register", RegisterRoutes);

// --- RUTAS PROTEGIDAS ---
app.use("/roles", RolesRoutes);
app.use("/users", UsersRoutes);
app.use("/beneficiaries", BeneficiariesRoutes);
app.use("/medicines", MedicinesRoutes);
app.use("/donations", DonationsRoutes);
app.use("/requests", RequestsRoutes);
app.use("/deliveries", DeliveriesRoutes);
app.use("/catalogs", CatalogsRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/provider-requests", ProviderRequestsRoutes);

// Verificación de inicio de servicios
try {
    await database.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL establecida");
} catch (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.message);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 FarmaPatria Backend corriendo en http://localhost:${PORT}`);
});