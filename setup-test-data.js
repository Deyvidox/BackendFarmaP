import database from "./database.js";
import { randomUUID } from "crypto";

const insertTestData = async () => {
    try {
        console.log("🌱 Insertando datos de prueba completos en la base de datos...\n");

        // 1. Obtener un usuario de la base de datos
        const userRes = await database.query("SELECT id FROM users LIMIT 1");
        if (userRes.rows.length === 0) {
            console.error("❌ No hay usuarios en la base de datos. Ejecuta primero 'node setup-db.js'");
            process.exit(1);
        }
        const userId = userRes.rows[0].id;

        // Limpiar tablas secundarias para evitar duplicados en pruebas
        await database.query("DELETE FROM inventory_movements CASCADE");
        await database.query("DELETE FROM inventories CASCADE");
        await database.query("DELETE FROM delivery_details CASCADE");
        await database.query("DELETE FROM deliveries CASCADE");
        await database.query("DELETE FROM request_details CASCADE");
        await database.query("DELETE FROM requests CASCADE");
        await database.query("DELETE FROM medicine_lots CASCADE");
        await database.query("DELETE FROM donations CASCADE");
        await database.query("DELETE FROM medicines CASCADE");
        await database.query("DELETE FROM beneficiaries CASCADE");
        await database.query("DELETE FROM donors CASCADE");
        await database.query("DELETE FROM communities CASCADE");
        await database.query("DELETE FROM laboratories CASCADE");
        await database.query("DELETE FROM pharmaceutical_forms CASCADE");
        await database.query("DELETE FROM medicine_categories CASCADE");
        await database.query("DELETE FROM donor_types CASCADE");
        await database.query("DELETE FROM donation_types CASCADE");
        await database.query("DELETE FROM vulnerability_types CASCADE");
        await database.query("DELETE FROM diseases CASCADE");

        // 2. Auxiliares
        const comId = randomUUID();
        await database.query(
            `INSERT INTO communities (id, name, parish, municipality, state_region, status)
             VALUES ($1, 'Los Olivos', 'Altagracia', 'Libertador', 'Distrito Capital', 'Active')`,
            [comId]
        );

        const labId = randomUUID();
        await database.query(
            `INSERT INTO laboratories (id, name, status)
             VALUES ($1, 'Laboratorios Pfizer C.A.', 'Active')`,
            [labId]
        );

        const formId = randomUUID();
        await database.query(
            `INSERT INTO pharmaceutical_forms (id, name, description, status)
             VALUES ($1, 'Tableta', 'Comprimido sólido', 'Active')`,
            [formId]
        );

        const catId = randomUUID();
        await database.query(
            `INSERT INTO medicine_categories (id, name, description, status)
             VALUES ($1, 'Analgésico', 'Medicamentos para aliviar el dolor', 'Active')`,
            [catId]
        );

        const donorTypeId = randomUUID();
        await database.query(
            `INSERT INTO donor_types (id, name, description, status)
             VALUES ($1, 'Privado', 'Laboratorios y farmacias privadas', 'Active')`,
            [donorTypeId]
        );

        const donationTypeId = randomUUID();
        await database.query(
            `INSERT INTO donation_types (id, name, description, status)
             VALUES ($1, 'Medicamentos', 'Donación física de medicinas', 'Active')`,
            [donationTypeId]
        );

        const disId = randomUUID();
        await database.query(
            `INSERT INTO diseases (id, name, description, codigo_cie, status)
             VALUES ($1, 'Hipertensión Arterial', 'Presión arterial alta crónica', 'I10', 'Active')`,
            [disId]
        );

        console.log("✅ Tablas auxiliares inicializadas");

        // 3. Donantes y Beneficiarios
        const donorId = randomUUID();
        await database.query(
            `INSERT INTO donors (id, donor_type_id, name, rif_cedula, main_contact, contact_phone, contact_email, address, status)
             VALUES ($1, $2, 'Pfizer Venezuela', 'J-301234567', 'Carlos Mendoza', '04121234567', 'contacto@pfizer.com', 'Av. Principal Caracas', 'Active')`,
            [donorId, donorTypeId]
        );

        const benId1 = randomUUID();
        await database.query(
            `INSERT INTO beneficiaries (id, identification_number, first_name, last_name, birth_date, gender, community_id, detailed_address, phone_personal, email, priority_level, status)
             VALUES ($1, 'V-12345678', 'María', 'González', '1965-05-15', 'F', $2, 'Calle 3, Casa 15', '04141234567', 'maria@gmail.com', 'High', 'Active')`,
            [benId1, comId]
        );

        const benId2 = randomUUID();
        await database.query(
            `INSERT INTO beneficiaries (id, identification_number, first_name, last_name, birth_date, gender, community_id, detailed_address, phone_personal, email, priority_level, status)
             VALUES ($1, 'V-23456789', 'Carlos', 'Rodríguez', '1980-08-20', 'M', $2, 'Calle Principal, Apto 2B', '04169876543', 'carlos@gmail.com', 'Medium', 'Active')`,
            [benId2, comId]
        );

        console.log("✅ Donantes y beneficiarios creados");

        // 4. Medicamentos
        const medId1 = randomUUID();
        await database.query(
            `INSERT INTO medicines (id, national_code, commercial_name, generic_name, active_principle, concentration, pharmaceutical_form_id, laboratory_id, category_id, requires_prescription, status)
             VALUES ($1, 'MED-001', 'Paracetamol 500mg', 'Paracetamol', 'Paracetamol', '500 mg', $2, $3, $4, false, 'Active')`,
            [medId1, formId, labId, catId]
        );

        const medId2 = randomUUID();
        await database.query(
            `INSERT INTO medicines (id, national_code, commercial_name, generic_name, active_principle, concentration, pharmaceutical_form_id, laboratory_id, category_id, requires_prescription, status)
             VALUES ($1, 'MED-002', 'Losartán 50mg', 'Losartán', 'Losartán Potásico', '50 mg', $2, $3, $4, true, 'Active')`,
            [medId2, formId, labId, catId]
        );

        console.log("✅ Medicamentos creados");

        // 5. Donaciones e Inventario
        const donId = randomUUID();
        await database.query(
            `INSERT INTO donations (id, donor_id, donation_type_id, receiver_user_id, reception_date, document_number, estimated_total_value, status, destination_warehouse)
             VALUES ($1, $2, $3, $4, CURRENT_DATE, 'DON-2026-001', 500.00, 'Received', 'Almacén Central')`,
            [donId, donorId, donationTypeId, userId]
        );

        const lotId1 = randomUUID();
        await database.query(
            `INSERT INTO medicine_lots (id, medicine_id, donation_id, lot_number, expiration_date, total_units, quality_status, status, inspector_user_id, inspection_date)
             VALUES ($1, $2, $3, 'LOTE-A123', NOW() + INTERVAL '45 days', 1000, 'Optimal', 'Available', $4, NOW())`,
            [lotId1, medId1, donId, userId]
        );

        const lotId2 = randomUUID();
        await database.query(
            `INSERT INTO medicine_lots (id, medicine_id, donation_id, lot_number, expiration_date, total_units, quality_status, status, inspector_user_id, inspection_date)
             VALUES ($1, $2, $3, 'LOTE-B456', NOW() - INTERVAL '5 days', 500, 'Expired', 'Expired', $4, NOW())`,
            [lotId2, medId2, donId, userId]
        );

        const invId1 = randomUUID();
        await database.query(
            `INSERT INTO inventories (id, lot_id, total_quantity, available_quantity, reserved_quantity, delivered_quantity, minimum_stock, maximum_stock, location, status)
             VALUES ($1, $2, 1000, 700, 100, 200, 100, 1500, 'Estante A1', 'Optimal')`,
            [invId1, lotId1]
        );

        const invId2 = randomUUID();
        await database.query(
            `INSERT INTO inventories (id, lot_id, total_quantity, available_quantity, reserved_quantity, delivered_quantity, minimum_stock, maximum_stock, location, status)
             VALUES ($1, $2, 500, 0, 0, 500, 50, 600, 'Estante B2', 'Out of Stock')`,
            [invId2, lotId2]
        );

        console.log("✅ Donaciones, Lotes e Inventario creados");

        // 6. Solicitudes y Entregas
        const reqId = randomUUID();
        await database.query(
            `INSERT INTO requests (id, beneficiary_id, disease_id, receiver_user_id, request_date, status, medical_priority)
             VALUES ($1, $2, $3, $4, CURRENT_DATE, 'Approved', 'High')`,
            [reqId, benId1, disId, userId]
        );

        await database.query(
            `INSERT INTO request_details (id, request_id, medicine_id, requested_quantity, approved_quantity, status)
             VALUES ($1, $2, $3, 10, 10, 'Approved')`,
            [randomUUID(), reqId, medId1]
        );

        const delId = randomUUID();
        await database.query(
            `INSERT INTO deliveries (id, request_id, delivery_user_id, delivery_date, delivery_type, status)
             VALUES ($1, $2, $3, CURRENT_DATE + INTERVAL '2 days', 'Pickup Point', 'Scheduled')`,
            [delId, reqId, userId]
        );

        await database.query(
            `INSERT INTO delivery_details (id, delivery_id, lot_id, delivered_quantity)
             VALUES ($1, $2, $3, 10)`,
            [randomUUID(), delId, lotId1]
        );

        console.log("✅ Solicitudes y Entregas creadas");

        console.log("\n🎉 ¡Datos de prueba insertados con éxito!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error insertando datos de prueba:", err.message);
        console.error(err);
        process.exit(1);
    }
};

insertTestData();
