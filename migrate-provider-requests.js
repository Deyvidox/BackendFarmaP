import database from "./database.js";

/**
 * Script de migración para crear las tablas de Solicitudes a Proveedores.
 * Ejecutar con: node migrate-provider-requests.js
 */

const migrate = async () => {
    try {
        console.log("🔄 Iniciando migración: Solicitudes a Proveedores...\n");

        // 1. Crear enums
        const enums = [
            `DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_request_status') THEN
                    CREATE TYPE provider_request_status AS ENUM ('PENDIENTE', 'ENVIADA', 'EN_REVISION', 'APROBADA_INTERNA', 'APROBADA', 'RECHAZADA', 'COMPLETADA');
                END IF;
            END $$`,
            `DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_request_type') THEN
                    CREATE TYPE provider_request_type AS ENUM ('EMERGENCIA', 'RUTINARIA', 'PROYECTO', 'REPOSICION');
                END IF;
            END $$`,
            `DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_priority') THEN
                    CREATE TYPE provider_priority AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'URGENTE', 'CRITICA');
                END IF;
            END $$`,
            `DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_detail_status') THEN
                    CREATE TYPE provider_detail_status AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'ENTREGADO', 'CANCELADO');
                END IF;
            END $$`
        ];

        for (const sql of enums) {
            await database.query(sql);
        }
        console.log("✅ Enums creados");

        // 2. Crear tabla provider_requests
        await database.query(`
            CREATE TABLE IF NOT EXISTS provider_requests (
                id uuid PRIMARY KEY,
                provider_id uuid NOT NULL,
                request_date date DEFAULT (current_date),
                required_date date,
                request_type provider_request_type DEFAULT 'RUTINARIA',
                general_priority provider_priority DEFAULT 'MEDIA',
                general_justification text,
                responsible_name varchar(200),
                department varchar(100),
                status provider_request_status DEFAULT 'PENDIENTE',
                observations text,
                created_at timestamp,
                updated_at timestamp
            )
        `);
        console.log("✅ Tabla provider_requests creada");

        // 3. Crear tabla provider_request_details
        await database.query(`
            CREATE TABLE IF NOT EXISTS provider_request_details (
                id uuid PRIMARY KEY,
                provider_request_id uuid NOT NULL,
                medicine_id uuid NOT NULL,
                requested_quantity integer NOT NULL,
                priority provider_priority DEFAULT 'MEDIA',
                justification text,
                status provider_detail_status DEFAULT 'PENDIENTE',
                created_at timestamp,
                updated_at timestamp
            )
        `);
        console.log("✅ Tabla provider_request_details creada");

        // 4. Crear índice único
        await database.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_provider_request_details_unique 
            ON provider_request_details (provider_request_id, medicine_id)
        `);
        console.log("✅ Índice único creado");

        // 5. Foreign keys
        const fks = [
            {
                table: 'provider_requests',
                column: 'provider_id',
                ref_table: 'donors',
                name: 'fk_provider_requests_provider'
            },
            {
                table: 'provider_request_details',
                column: 'provider_request_id',
                ref_table: 'provider_requests',
                name: 'fk_provider_request_details_request'
            },
            {
                table: 'provider_request_details',
                column: 'medicine_id',
                ref_table: 'medicines',
                name: 'fk_provider_request_details_medicine'
            }
        ];

        for (const fk of fks) {
            await database.query(`
                DO $$ BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.table_constraints 
                        WHERE constraint_name = '${fk.name}'
                    ) THEN
                        ALTER TABLE ${fk.table} ADD CONSTRAINT ${fk.name}
                        FOREIGN KEY (${fk.column}) REFERENCES ${fk.ref_table} (id)
                        DEFERRABLE INITIALLY IMMEDIATE;
                    END IF;
                END $$
            `);
        }
        console.log("✅ Foreign keys creadas");

        console.log("\n🎉 Migración completada exitosamente!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("  📋 Tablas: provider_requests, provider_request_details");
        console.log("  🔗 API:    /provider-requests");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error en la migración:", err.message);
        console.error(err);
        process.exit(1);
    }
};

migrate();
