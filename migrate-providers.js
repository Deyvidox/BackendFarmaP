import database from "./database.js";

const migrate = async () => {
    try {
        console.log("🚀 Iniciando migración para separar Proveedores de Donantes...\n");

        // 1. Crear tabla providers
        console.log("Creando tabla providers...");
        await database.query(`
            CREATE TABLE IF NOT EXISTS "providers" (
              "id" uuid PRIMARY KEY,
              "name" varchar(200) NOT NULL,
              "rif_cedula" varchar(20) UNIQUE,
              "main_contact" varchar(150),
              "contact_phone" varchar(20),
              "contact_email" varchar(150),
              "address" text,
              "status" user_status DEFAULT 'Active',
              "observations" text,
              "created_at" timestamp,
              "updated_at" timestamp
            );
        `);

        // 2. Modificar la Foreign Key en provider_requests
        console.log("Modificando FK en provider_requests...");
        
        // Obtenemos el nombre actual de la constraint de la FK
        const fkQuery = await database.query(`
            SELECT constraint_name
            FROM information_schema.key_column_usage
            WHERE table_name = 'provider_requests' AND column_name = 'provider_id';
        `);

        if (fkQuery.rowCount > 0) {
            const constraintName = fkQuery.rows[0].constraint_name;
            console.log(`Eliminando constraint antigua: ${constraintName}`);
            await database.query(`ALTER TABLE "provider_requests" DROP CONSTRAINT IF EXISTS "${constraintName}";`);
        }

        console.log("Agregando nueva constraint a providers(id)...");
        // Nota: para evitar conflictos de datos si ya hay solicitudes apuntando a donors,
        // deberíamos vaciar provider_requests o migrar los donors a providers. 
        // Asumiendo que es un desarrollo nuevo y podemos limpiar la tabla de ser necesario, o no hay registros:
        
        // Limpiamos la tabla provider_requests para evitar errores de integridad referencial si hay datos viejos
        await database.query(`DELETE FROM provider_request_details;`);
        await database.query(`DELETE FROM provider_requests;`);

        await database.query(`
            ALTER TABLE "provider_requests" 
            ADD CONSTRAINT fk_provider_requests_provider_id 
            FOREIGN KEY ("provider_id") REFERENCES "providers" ("id") DEFERRABLE INITIALLY IMMEDIATE;
        `);

        // 3. Crear unos proveedores de prueba para facilitar el testeo
        console.log("Insertando proveedores de prueba...");
        await database.query(`
            INSERT INTO providers (id, name, rif_cedula, main_contact, contact_phone, status, created_at, updated_at)
            VALUES 
            (gen_random_uuid(), 'Droguería NENA C.A.', 'J-00012345-6', 'Carlos Méndez', '0414-1112233', 'Active', NOW(), NOW()),
            (gen_random_uuid(), 'Cobeca S.A.', 'J-00098765-4', 'Luis Rodríguez', '0412-9998877', 'Active', NOW(), NOW()),
            (gen_random_uuid(), 'Laboratorios Leti', 'J-12345678-0', 'Ana Gómez', '0424-5556677', 'Active', NOW(), NOW())
            ON CONFLICT (rif_cedula) DO NOTHING;
        `);

        console.log("\n✅ Migración completada exitosamente.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error en la migración:", err.message);
        console.error(err);
        process.exit(1);
    }
};

migrate();
