// =============================================
// FarmaPatria - Setup automático de Base de Datos
// Ejecutar: node setup-db.js
// =============================================

import pg from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const { Pool } = pg;

const databaseConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      user: process.env.USER || 'postgres',
      host: process.env.HOST || 'localhost',
      database: process.env.DATABASE || 'farmapatria',
      password: String(process.env.PASSWORD || ''),
      port: parseInt(process.env.PORT_DB) || 5432,
      ssl: process.env.HOST?.includes('supabase') ? { rejectUnauthorized: false } : false
    };

const db = new Pool({ ...databaseConfig, connectionTimeoutMillis: 10000, max: 5 });

async function run() {
  console.log('🚀 Iniciando setup de base de datos FarmaPatria...\n');
  
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL exitosa\n');
  } catch (err) {
    console.error('❌ No se pudo conectar a PostgreSQL:', err.message);
    console.log('\n💡 Opciones para configurar la base de datos:');
    console.log('   1. Instala PostgreSQL local: https://www.postgresql.org/download/');
    console.log('   2. Usa Supabase (gratis): https://supabase.com');
    console.log('   3. Usa Railway (gratis): https://railway.app');
    console.log('\n   Luego configura el .env con DATABASE_URL o las variables individuales.');
    process.exit(1);
  }

  // --- 1. CREAR TABLAS (leer del archivo SQL) ---
  console.log('📋 Creando tablas...');
  try {
    const schemaSQL = fs.readFileSync('./FarmaPatria.sql', 'utf8');
    // Dividir por sentencias y ejecutar una por una
    const statements = schemaSQL.split(';').filter(s => s.trim().length > 5);
    for (const stmt of statements) {
      try {
        await db.query(stmt + ';');
      } catch (e) {
        // Ignorar errores de "already exists"
        if (!e.message.includes('already exists') && !e.message.includes('ya existe')) {
          // Solo logear warnings, no detener
          console.log(`   ⚠️  ${e.message.substring(0, 80)}`);
        }
      }
    }
    console.log('✅ Tablas creadas/verificadas\n');
  } catch (err) {
    console.error('❌ Error creando tablas:', err.message);
  }

  // --- 2. Agregar columnas faltantes ---
  console.log('🔧 Agregando columnas faltantes...');
  const alterStatements = [
    `ALTER TABLE "Cat_Rol" ADD COLUMN IF NOT EXISTS "RolPermisos" varchar(50)`,
    `ALTER TABLE "Tbl_Usuario" ADD COLUMN IF NOT EXISTS "UsuContrasena" varchar(200)`,
  ];
  for (const stmt of alterStatements) {
    try { await db.query(stmt); } catch (e) { /* ignorar si ya existe */ }
  }
  console.log('✅ Columnas verificadas\n');

  // --- 3. INSERTAR DATOS SEED ---
  const passwordHash = await bcrypt.hash('Admin123', 10);
  console.log('🔑 Hash generado para contraseña "Admin123"\n');

  // Roles
  console.log('📝 Insertando roles...');
  const roles = [
    { id: crypto.randomUUID(), nombre: 'Administrador', desc: 'Acceso completo', permisos: 'admin' },
    { id: crypto.randomUUID(), nombre: 'Farmacéutico', desc: 'Gestión de medicamentos', permisos: 'pharmacist' },
    { id: crypto.randomUUID(), nombre: 'Operador', desc: 'Registro y solicitudes', permisos: 'operator' },
  ];
  const roleIds = {};
  for (const r of roles) {
    try {
      const res = await db.query(
        `INSERT INTO "Cat_Rol" ("RolID","RolNombre","RolDescripcion","RolEstado","RolPermisos") VALUES ($1,$2,$3,'ACTIVO',$4) ON CONFLICT ("RolNombre") DO UPDATE SET "RolPermisos"=$4 RETURNING "RolID"`,
        [r.id, r.nombre, r.desc, r.permisos]
      );
      roleIds[r.nombre] = res.rows[0].RolID;
    } catch (e) { console.log('   ⚠️', e.message.substring(0,60)); }
  }
  console.log('✅ Roles listos\n');

  // Comunidades
  console.log('📝 Insertando comunidades...');
  const comunidades = [
    { nombre: 'Barrio Sucre', parr: 'Catia', mun: 'Libertador', est: 'Distrito Capital' },
    { nombre: 'Urb. El Paraíso', parr: 'El Paraíso', mun: 'Libertador', est: 'Distrito Capital' },
    { nombre: 'Sector Los Próceres', parr: 'San Juan', mun: 'Libertador', est: 'Distrito Capital' },
    { nombre: 'Comunidad La Vega', parr: 'La Vega', mun: 'Libertador', est: 'Distrito Capital' },
    { nombre: 'Barrio 23 de Enero', parr: '23 de Enero', mun: 'Libertador', est: 'Distrito Capital' },
  ];
  const comIds = [];
  for (const c of comunidades) {
    const id = crypto.randomUUID();
    try {
      const res = await db.query(
        `INSERT INTO "Cat_Comunidad" ("ComunidadID","ComNombre","ComParroquia","ComMunicipio","ComEstadoRegion") VALUES ($1,$2,$3,$4,$5) ON CONFLICT ("ComunidadID") DO NOTHING RETURNING "ComunidadID"`,
        [id, c.nombre, c.parr, c.mun, c.est]
      );
      if (res.rows.length) comIds.push(res.rows[0].ComunidadID);
    } catch (e) { comIds.push(id); }
  }
  console.log('✅ Comunidades listas\n');

  // Laboratorios
  console.log('📝 Insertando laboratorios...');
  const labs = [
    { nombre: 'Laboratorios Vargas S.A.', rif: 'J-00012345-0' },
    { nombre: 'Genéricos Venezolanos C.A.', rif: 'J-00067890-1' },
    { nombre: 'FarmaVida C.A.', rif: 'J-00098765-2' },
  ];
  const labIds = [];
  for (const l of labs) {
    const id = crypto.randomUUID();
    try {
      const res = await db.query(
        `INSERT INTO "Cat_Laboratorio" ("LaboratorioID","LabNombre","LabRIFCedula") VALUES ($1,$2,$3) ON CONFLICT ("LabRIFCedula") DO NOTHING RETURNING "LaboratorioID"`,
        [id, l.nombre, l.rif]
      );
      labIds.push(res.rows.length ? res.rows[0].LaboratorioID : id);
    } catch (e) { labIds.push(id); }
  }
  console.log('✅ Laboratorios listos\n');

  // Formas Farmacéuticas
  console.log('📝 Insertando formas farmacéuticas...');
  const formas = ['Tableta', 'Cápsula', 'Jarabe', 'Inyectable', 'Crema', 'Suspensión'];
  const formaIds = [];
  for (const f of formas) {
    const id = crypto.randomUUID();
    try {
      const res = await db.query(
        `INSERT INTO "Cat_FormaFarmaceutica" ("FormaFarmaceuticaID","FFarmNombre") VALUES ($1,$2) ON CONFLICT ("FFarmNombre") DO NOTHING RETURNING "FormaFarmaceuticaID"`,
        [id, f]
      );
      formaIds.push(res.rows.length ? res.rows[0].FormaFarmaceuticaID : id);
    } catch (e) { formaIds.push(id); }
  }
  console.log('✅ Formas farmacéuticas listas\n');

  // Categorías Medicamento
  console.log('📝 Insertando categorías...');
  const cats = ['Antihipertensivos', 'Antidiabéticos', 'Analgésicos', 'Antibióticos', 'Antiinflamatorios', 'Vitaminas y Suplementos'];
  const catIds = [];
  for (const c of cats) {
    const id = crypto.randomUUID();
    try {
      const res = await db.query(
        `INSERT INTO "Cat_CategoriaMedicamento" ("CategoriaMedicamentoID","CMedNombre") VALUES ($1,$2) ON CONFLICT ("CMedNombre") DO NOTHING RETURNING "CategoriaMedicamentoID"`,
        [id, c]
      );
      catIds.push(res.rows.length ? res.rows[0].CategoriaMedicamentoID : id);
    } catch (e) { catIds.push(id); }
  }
  console.log('✅ Categorías listas\n');

  // Enfermedades
  console.log('📝 Insertando enfermedades...');
  const enfs = [
    { cie: 'I10', nombre: 'Hipertensión Arterial', tipo: 'Crónica' },
    { cie: 'E11', nombre: 'Diabetes Mellitus Tipo 2', tipo: 'Crónica' },
    { cie: 'J06', nombre: 'Infección Respiratoria Aguda', tipo: 'Aguda' },
    { cie: 'M54', nombre: 'Dolor Lumbar', tipo: 'Crónica' },
    { cie: 'K29', nombre: 'Gastritis', tipo: 'Crónica' },
  ];
  for (const e of enfs) {
    try {
      await db.query(
        `INSERT INTO "Cat_Enfermedad" ("EnfermedadID","EnfCodigoCIE","EnfNombre","EnfTipo") VALUES ($1,$2,$3,$4) ON CONFLICT ("EnfCodigoCIE") DO NOTHING`,
        [crypto.randomUUID(), e.cie, e.nombre, e.tipo]
      );
    } catch (er) {}
  }
  console.log('✅ Enfermedades listas\n');

  // Usuarios
  console.log('📝 Insertando usuarios...');
  const adminRolId = roleIds['Administrador'] || roles[0].id;
  const pharmaRolId = roleIds['Farmacéutico'] || roles[1].id;
  const operRolId = roleIds['Operador'] || roles[2].id;
  
  const usuarios = [
    { cedula: 'V-12345678', nombres: 'Carlos', apellidos: 'Rodríguez', correo: 'admin@farmapatria.com', rol: adminRolId, cargo: 'Director' },
    { cedula: 'V-23456789', nombres: 'María', apellidos: 'González', correo: 'farmacia@farmapatria.com', rol: pharmaRolId, cargo: 'Farmacéutica' },
    { cedula: 'V-34567890', nombres: 'José', apellidos: 'Martínez', correo: 'operador@farmapatria.com', rol: operRolId, cargo: 'Operador' },
  ];
  const userIds = [];
  for (const u of usuarios) {
    const id = crypto.randomUUID();
    try {
      const res = await db.query(
        `INSERT INTO "Tbl_Usuario" ("UsuarioID","RolID","UsuCedula","UsuNombres","UsuApellidos","UsuCorreo","UsuCargo","UsuEstado","UsuContrasena") VALUES ($1,$2,$3,$4,$5,$6,$7,'Active',$8) ON CONFLICT ("UsuCedula") DO NOTHING RETURNING "UsuarioID"`,
        [id, u.rol, u.cedula, u.nombres, u.apellidos, u.correo, u.cargo, passwordHash]
      );
      userIds.push(res.rows.length ? res.rows[0].UsuarioID : id);
    } catch (e) { userIds.push(id); }
  }
  console.log('✅ Usuarios listos\n');

  // Beneficiarios
  console.log('📝 Insertando beneficiarios...');
  const beneficiarios = [
    { ced: 'V-11111111', nom: 'Ana María', ape: 'López Pérez', nac: '1958-03-15', gen: 'F', tel: '0412-1111111', email: 'ana.lopez@email.com', dep: 3, ing: 150, pri: 'ALTA' },
    { ced: 'V-22222222', nom: 'Juan Carlos', ape: 'Hernández Díaz', nac: '1965-07-22', gen: 'M', tel: '0416-2222222', email: 'juan.hernandez@email.com', dep: 2, ing: 200, pri: 'MEDIA' },
    { ced: 'V-33333333', nom: 'Luisa', ape: 'Ramírez Gutiérrez', nac: '1975-11-08', gen: 'F', tel: '0424-3333333', email: 'luisa.ramirez@email.com', dep: 4, ing: 120, pri: 'ALTA' },
    { ced: 'V-44444444', nom: 'Roberto', ape: 'Mendoza Torres', nac: '1950-01-30', gen: 'M', tel: '0414-4444444', email: 'roberto.mendoza@email.com', dep: 1, ing: 100, pri: 'ALTA' },
    { ced: 'V-55555555', nom: 'Carmen', ape: 'Flores Silva', nac: '1982-05-12', gen: 'F', tel: '0412-5555555', email: 'carmen.flores@email.com', dep: 5, ing: 180, pri: 'MEDIA' },
  ];
  for (let i = 0; i < beneficiarios.length; i++) {
    const b = beneficiarios[i];
    try {
      await db.query(
        `INSERT INTO "Tbl_Beneficiario" ("BeneficiarioID","BenCedula","BenNombres","BenApellidos","BenFechaNacimiento","BenGenero","ComunidadID","BenTelefonoPersonal","BenEmail","BenPersonasDependientes","BenIngresosMensuales","BenNivelPrioridad","BenEstado") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'ACTIVO') ON CONFLICT ("BenCedula") DO NOTHING`,
        [crypto.randomUUID(), b.ced, b.nom, b.ape, b.nac, b.gen, comIds[i % comIds.length], b.tel, b.email, b.dep, b.ing, b.pri]
      );
    } catch (e) {}
  }
  console.log('✅ Beneficiarios listos\n');

  // Medicamentos
  console.log('📝 Insertando medicamentos...');
  const meds = [
    { cod: 'MED-001', com: 'Losartán 50mg', gen: 'Losartán Potásico', act: 'Losartán', conc: '50mg', forma: 0, via: 'Oral', lab: 0, cat: 0, rec: true, und: 'Tableta', cant: 30 },
    { cod: 'MED-002', com: 'Metformina 850mg', gen: 'Metformina Clorhidrato', act: 'Metformina', conc: '850mg', forma: 0, via: 'Oral', lab: 1, cat: 1, rec: true, und: 'Tableta', cant: 30 },
    { cod: 'MED-003', com: 'Acetaminofén 500mg', gen: 'Paracetamol', act: 'Acetaminofén', conc: '500mg', forma: 0, via: 'Oral', lab: 0, cat: 2, rec: false, und: 'Tableta', cant: 20 },
    { cod: 'MED-004', com: 'Amoxicilina 500mg', gen: 'Amoxicilina', act: 'Amoxicilina', conc: '500mg', forma: 1, via: 'Oral', lab: 2, cat: 3, rec: true, und: 'Cápsula', cant: 21 },
    { cod: 'MED-005', com: 'Ibuprofeno 400mg', gen: 'Ibuprofeno', act: 'Ibuprofeno', conc: '400mg', forma: 0, via: 'Oral', lab: 1, cat: 4, rec: false, und: 'Tableta', cant: 20 },
  ];
  for (const m of meds) {
    try {
      await db.query(
        `INSERT INTO "Tbl_Medicamento" ("MedicamentoID","MedCodigoNacional","MedNombreComercial","MedNombreGenerico","MedPrincipioActivo","MedConcentracion","FormaFarmaceuticaID","MedViaAdministracion","LaboratorioID","CategoriaMedicamentoID","MedRequiereReceta","MedUnidadMedida","MedCantidadPorPresentacion") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT ("MedCodigoNacional") DO NOTHING`,
        [crypto.randomUUID(), m.cod, m.com, m.gen, m.act, m.conc, formaIds[m.forma], m.via, labIds[m.lab], catIds[m.cat], m.rec, m.und, m.cant]
      );
    } catch (e) {}
  }
  console.log('✅ Medicamentos listos\n');

  // Tipos de donante y donación
  console.log('📝 Insertando catálogos adicionales...');
  for (const td of ['Laboratorio Farmacéutico', 'ONG', 'Gobierno', 'Persona Natural']) {
    try { await db.query(`INSERT INTO "Cat_TipoDonante" ("TipoDonanteID","TDonanteNombre") VALUES ($1,$2) ON CONFLICT ("TDonanteNombre") DO NOTHING`, [crypto.randomUUID(), td]); } catch(e) {}
  }
  for (const td of ['Medicamentos', 'Insumos Médicos', 'Equipos']) {
    try { await db.query(`INSERT INTO "Cat_TipoDonacion" ("TipoDonacionID","TDonacionNombre") VALUES ($1,$2) ON CONFLICT ("TDonacionNombre") DO NOTHING`, [crypto.randomUUID(), td]); } catch(e) {}
  }
  console.log('✅ Catálogos listos\n');

  console.log('========================================');
  console.log('🎉 Setup completado exitosamente!');
  console.log('========================================');
  console.log('\n📋 Credenciales de acceso:');
  console.log('   Admin:       admin@farmapatria.com     / Admin123');
  console.log('   Farmacia:    farmacia@farmapatria.com  / Admin123');
  console.log('   Operador:    operador@farmapatria.com  / Admin123');
  console.log('\n🚀 Ahora puedes iniciar el backend con: node index.js');

  await db.end();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
