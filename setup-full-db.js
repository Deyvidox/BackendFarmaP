import pg from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log('🌱 Starting Full Database Setup for FarmaPatria...');
  
  // 1. Connect to default 'postgres' database first to check/create the target database
  const initPool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    const dbCheck = await initPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (dbCheck.rowCount === 0) {
      console.log(`Database "${process.env.DB_NAME}" does not exist. Creating it...`);
      await initPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Database "${process.env.DB_NAME}" created successfully.`);
    } else {
      console.log(`Database "${process.env.DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Error checking/creating database:', err.message);
    await initPool.end();
    process.exit(1);
  } finally {
    await initPool.end();
  }

  // 2. Connect to the target 'farmapatria' database
  const dbPool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Check if tables already exist by checking a common table like "users"
    const tableCheck = await dbPool.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users'"
    );

    if (tableCheck.rowCount === 0) {
      console.log('Running SQL schema from FarmaPatria.sql...');
      const sqlPath = path.join(__dirname, 'FarmaPatria.sql');
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');

      // Execute the entire SQL script
      await dbPool.query(sqlContent);
      console.log('✅ DDL Schema, indexes, and foreign keys created successfully.');
    } else {
      console.log('Tables already exist. Skipping FarmaPatria.sql execution.');
    }

    // 3. Seed: Administrator role and admin user
    console.log('Seeding initial data...');
    const permissions = JSON.stringify({
      users: { create: true, read: true, update: true, delete: true },
      beneficiaries: { create: true, read: true, update: true, delete: true },
      medicines: { create: true, read: true, update: true, delete: true },
      donations: { create: true, read: true, update: true, delete: true },
      requests: { create: true, read: true, update: true, delete: true },
      deliveries: { create: true, read: true, update: true, delete: true },
      reports: { create: true, read: true },
    });

    // Check if role 'Administrator' already exists
    const roleCheck = await dbPool.query("SELECT id FROM roles WHERE name = 'Administrator'");
    let finalRoleId;
    if (roleCheck.rowCount === 0) {
      const roleId = randomUUID();
      await dbPool.query(
        `INSERT INTO roles (id, name, description, permissions, created_at, updated_at)
         VALUES ($1, 'Administrator', 'Administrador del sistema con acceso completo', $2, NOW(), NOW())`,
        [roleId, permissions]
      );
      finalRoleId = roleId;
      console.log("✅ Role 'Administrator' created.");
    } else {
      finalRoleId = roleCheck.rows[0].id;
      await dbPool.query(
        `UPDATE roles SET permissions = $1, updated_at = NOW() WHERE id = $2`,
        [permissions, finalRoleId]
      );
      console.log("✅ Role 'Administrator' updated.");
    }

    // Create Admin user
    const userId = randomUUID();
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await dbPool.query(
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
    console.log("✅ Admin user 'admin' created/updated.");

    console.log('\n🎉 DATABASE FULLY READY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  📧 Email:    admin@farmapatria.com');
    console.log('  👤 Username: admin');
    console.log('  🔑 Password: Admin123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error setting up schema/seed:', err.message);
    await dbPool.end();
    process.exit(1);
  }
}

run();
