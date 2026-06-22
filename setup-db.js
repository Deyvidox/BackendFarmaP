import database from "./database.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

/**
 * Script de inicialización de la base de datos.
 * Crea un rol Administrator y un usuario admin de prueba.
 * 
 * Credenciales de prueba:
 *   Email:    admin@farmapatria.com
 *   Username: admin
 *   Password: Admin123!
 */

const seed = async () => {
    try {
        console.log("🌱 Iniciando seed de la base de datos...\n");

        const rolesToSeed = [
            {
                name: 'Administrator',
                description: 'Administrador del sistema con acceso completo',
                permissions: {
                    users: { create: true, read: true, update: true, delete: true },
                    beneficiaries: { create: true, read: true, update: true, delete: true },
                    medicines: { create: true, read: true, update: true, delete: true },
                    donations: { create: true, read: true, update: true, delete: true },
                    requests: { create: true, read: true, update: true, delete: true },
                    deliveries: { create: true, read: true, update: true, delete: true },
                    reports: { create: true, read: true },
                }
            },
            {
                name: 'Warehouse Manager',
                description: 'Encargado de Almacén - Control de inventario y medicamentos',
                permissions: {
                    users: { create: false, read: true, update: false, delete: false },
                    beneficiaries: { create: false, read: true, update: false, delete: false },
                    medicines: { create: true, read: true, update: true, delete: false },
                    donations: { create: true, read: true, update: true, delete: false },
                    requests: { create: false, read: true, update: true, delete: false },
                    deliveries: { create: true, read: true, update: true, delete: false },
                    reports: { create: false, read: true },
                }
            },
            {
                name: 'Coordinator',
                description: 'Coordinador - Gestión y aprobación de solicitudes y entregas',
                permissions: {
                    users: { create: false, read: true, update: false, delete: false },
                    beneficiaries: { create: true, read: true, update: true, delete: false },
                    medicines: { create: false, read: true, update: false, delete: false },
                    donations: { create: false, read: true, update: false, delete: false },
                    requests: { create: true, read: true, update: true, delete: true },
                    deliveries: { create: true, read: true, update: true, delete: true },
                    reports: { create: true, read: true },
                }
            },
            {
                name: 'Social Worker',
                description: 'Trabajador Social - Registro y evaluación de beneficiarios',
                permissions: {
                    users: { create: false, read: false, update: false, delete: false },
                    beneficiaries: { create: true, read: true, update: true, delete: false },
                    medicines: { create: false, read: true, update: false, delete: false },
                    donations: { create: false, read: false, update: false, delete: false },
                    requests: { create: true, read: true, update: true, delete: false },
                    deliveries: { create: false, read: true, update: false, delete: false },
                    reports: { create: false, read: false },
                }
            },
            {
                name: 'Inspector',
                description: 'Inspector - Control de calidad y revisión de medicamentos y donaciones',
                permissions: {
                    users: { create: false, read: false, update: false, delete: false },
                    beneficiaries: { create: false, read: false, update: false, delete: false },
                    medicines: { create: false, read: true, update: true, delete: false },
                    donations: { create: false, read: true, update: true, delete: false },
                    requests: { create: false, read: false, update: false, delete: false },
                    deliveries: { create: false, read: false, update: false, delete: false },
                    reports: { create: false, read: false },
                }
            }
        ];

        for (const role of rolesToSeed) {
            const check = await database.query(`SELECT id FROM roles WHERE name = $1`, [role.name]);
            const permString = JSON.stringify(role.permissions);
            if (check.rowCount === 0) {
                const roleId = randomUUID();
                await database.query(
                    `INSERT INTO roles (id, name, description, permissions, created_at, updated_at)
                     VALUES ($1, $2, $3, $4, NOW(), NOW())`,
                    [roleId, role.name, role.description, permString]
                );
                console.log(`✅ Rol '${role.name}' creado`);
            } else {
                const roleId = check.rows[0].id;
                await database.query(
                    `UPDATE roles SET description = $1, permissions = $2, updated_at = NOW() WHERE id = $3`,
                    [role.description, permString, roleId]
                );
                console.log(`✅ Rol '${role.name}' actualizado`);
            }
        }

        // Obtener el ID del rol Administrator para el usuario admin
        const roleResult = await database.query(
            `SELECT id FROM roles WHERE name = 'Administrator'`
        );
        const finalRoleId = roleResult.rows[0].id;

        // 2. Crear usuario admin
        const userId = randomUUID();
        const hashedPassword = await bcrypt.hash("Admin123!", 10);

        await database.query(
            `INSERT INTO users (
                id, role_id, username, password, identification_number,
                first_name, last_name, email, status, created_at, updated_at
            ) VALUES ($1, $2, 'admin', $3, 'V-00000000', 'Admin', 'FarmaPatria', 'admin@farmapatria.com', 'Active', NOW(), NOW())
            ON CONFLICT (username) DO UPDATE SET 
                password = $3, 
                role_id = $2,
                updated_at = NOW()`,
            [userId, finalRoleId, hashedPassword]
        );
        console.log("✅ Usuario admin creado/actualizado");

        console.log("\n🎉 Seed completado exitosamente!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("  📧 Email:    admin@farmapatria.com");
        console.log("  👤 Username: admin");
        console.log("  🔑 Password: Admin123!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error en el seed:", err.message);
        console.error(err);
        process.exit(1);
    }
};

seed();
