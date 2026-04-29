-- =============================================
-- FarmaPatria - Schema Adaptado + Datos Seed
-- Ejecutar: psql -U postgres -d farmapatria -f seed.sql
-- =============================================

-- 1. Agregar columnas faltantes que el backend necesita
-- La tabla Tbl_Usuario necesita: UsuID, UsuContrasena, UsuNombre, UsuCorreo, UsuEstado, UsuFechaRegistro
-- La tabla Cat_Rol necesita: RolPermisos

-- Agregar RolPermisos a Cat_Rol
DO $$ BEGIN
  ALTER TABLE "Cat_Rol" ADD COLUMN IF NOT EXISTS "RolPermisos" varchar(50);
EXCEPTION WHEN others THEN NULL;
END $$;

-- Agregar columnas faltantes a Tbl_Usuario
DO $$ BEGIN
  ALTER TABLE "Tbl_Usuario" ADD COLUMN IF NOT EXISTS "UsuContrasena" varchar(200);
EXCEPTION WHEN others THEN NULL;
END $$;

-- El backend usa "UsuID" pero el schema tiene "UsuarioID"
-- El backend usa "UsuNombre" pero schema tiene "UsuNombres"  
-- El backend usa "UsuCorreo" pero schema tiene "UsuCorreo" (ok)
-- El backend usa "UsuEstado" = 'Active' pero schema default es 'ACTIVO'
-- Solucion: crear VIEWs o aliases no es ideal. Mejor agregar columnas alias.

-- =============================================
-- 2. DATOS DE CATÁLOGOS
-- =============================================

-- Roles
INSERT INTO "Cat_Rol" ("RolID", "RolNombre", "RolDescripcion", "RolEstado", "RolPermisos") VALUES
  ('a1b2c3d4-1111-1111-1111-111111111111', 'Administrador', 'Acceso completo al sistema', 'ACTIVO', 'admin'),
  ('a1b2c3d4-2222-2222-2222-222222222222', 'Farmacéutico', 'Gestión de medicamentos e inventario', 'ACTIVO', 'pharmacist'),
  ('a1b2c3d4-3333-3333-3333-333333333333', 'Operador', 'Registro de beneficiarios y solicitudes', 'ACTIVO', 'operator')
ON CONFLICT ("RolNombre") DO UPDATE SET "RolPermisos" = EXCLUDED."RolPermisos";

-- Tipos de Donante
INSERT INTO "Cat_TipoDonante" ("TipoDonanteID", "TDonanteNombre", "TDonanteDescripcion") VALUES
  ('b1000000-0001-0001-0001-000000000001', 'Laboratorio Farmacéutico', 'Donaciones de laboratorios'),
  ('b1000000-0001-0001-0001-000000000002', 'ONG', 'Organizaciones no gubernamentales'),
  ('b1000000-0001-0001-0001-000000000003', 'Gobierno', 'Instituciones gubernamentales'),
  ('b1000000-0001-0001-0001-000000000004', 'Persona Natural', 'Donaciones individuales')
ON CONFLICT ("TDonanteNombre") DO NOTHING;

-- Tipos de Donación
INSERT INTO "Cat_TipoDonacion" ("TipoDonacionID", "TDonacionNombre", "TDonacionDescripcion") VALUES
  ('c1000000-0001-0001-0001-000000000001', 'Medicamentos', 'Donación de medicamentos'),
  ('c1000000-0001-0001-0001-000000000002', 'Insumos Médicos', 'Donación de insumos'),
  ('c1000000-0001-0001-0001-000000000003', 'Equipos', 'Donación de equipos médicos')
ON CONFLICT ("TDonacionNombre") DO NOTHING;

-- Comunidades (Venezuela)
INSERT INTO "Cat_Comunidad" ("ComunidadID", "ComNombre", "ComParroquia", "ComMunicipio", "ComEstadoRegion") VALUES
  ('d1000000-0001-0001-0001-000000000001', 'Barrio Sucre', 'Catia', 'Libertador', 'Distrito Capital'),
  ('d1000000-0001-0001-0001-000000000002', 'Urb. El Paraíso', 'El Paraíso', 'Libertador', 'Distrito Capital'),
  ('d1000000-0001-0001-0001-000000000003', 'Sector Los Próceres', 'San Juan', 'Libertador', 'Distrito Capital'),
  ('d1000000-0001-0001-0001-000000000004', 'Comunidad La Vega', 'La Vega', 'Libertador', 'Distrito Capital'),
  ('d1000000-0001-0001-0001-000000000005', 'Barrio 23 de Enero', '23 de Enero', 'Libertador', 'Distrito Capital')
ON CONFLICT ("ComunidadID") DO NOTHING;

-- Laboratorios
INSERT INTO "Cat_Laboratorio" ("LaboratorioID", "LabNombre", "LabRIFCedula", "LabTelefono", "LabEmail") VALUES
  ('e1000000-0001-0001-0001-000000000001', 'Laboratorios Vargas S.A.', 'J-00012345-0', '0212-5551234', 'contacto@labvargas.com'),
  ('e1000000-0001-0001-0001-000000000002', 'Genéricos Venezolanos C.A.', 'J-00067890-1', '0212-5555678', 'info@genvzla.com'),
  ('e1000000-0001-0001-0001-000000000003', 'FarmaVida C.A.', 'J-00098765-2', '0212-5559012', 'ventas@farmavida.com')
ON CONFLICT ("LabRIFCedula") DO NOTHING;

-- Formas Farmacéuticas
INSERT INTO "Cat_FormaFarmaceutica" ("FormaFarmaceuticaID", "FFarmNombre", "FFarmDescripcion") VALUES
  ('f1000000-0001-0001-0001-000000000001', 'Tableta', 'Forma sólida oral'),
  ('f1000000-0001-0001-0001-000000000002', 'Cápsula', 'Cápsula de gelatina'),
  ('f1000000-0001-0001-0001-000000000003', 'Jarabe', 'Solución oral líquida'),
  ('f1000000-0001-0001-0001-000000000004', 'Inyectable', 'Solución para inyección'),
  ('f1000000-0001-0001-0001-000000000005', 'Crema', 'Forma tópica'),
  ('f1000000-0001-0001-0001-000000000006', 'Suspensión', 'Suspensión oral')
ON CONFLICT ("FFarmNombre") DO NOTHING;

-- Categorías de Medicamento
INSERT INTO "Cat_CategoriaMedicamento" ("CategoriaMedicamentoID", "CMedNombre", "CMedDescripcion", "CMedPrioridadDistribucion") VALUES
  ('g1000000-0001-0001-0001-000000000001', 'Antihipertensivos', 'Medicamentos para presión arterial', 10),
  ('g1000000-0001-0001-0001-000000000002', 'Antidiabéticos', 'Medicamentos para diabetes', 10),
  ('g1000000-0001-0001-0001-000000000003', 'Analgésicos', 'Alivio del dolor', 7),
  ('g1000000-0001-0001-0001-000000000004', 'Antibióticos', 'Tratamiento de infecciones', 8),
  ('g1000000-0001-0001-0001-000000000005', 'Antiinflamatorios', 'Reducción de inflamación', 6),
  ('g1000000-0001-0001-0001-000000000006', 'Vitaminas y Suplementos', 'Suplementos nutricionales', 4)
ON CONFLICT ("CMedNombre") DO NOTHING;

-- Enfermedades
INSERT INTO "Cat_Enfermedad" ("EnfermedadID", "EnfCodigoCIE", "EnfNombre", "EnfTipo", "EnfDescripcion") VALUES
  ('h1000000-0001-0001-0001-000000000001', 'I10', 'Hipertensión Arterial', 'Crónica', 'Presión arterial elevada'),
  ('h1000000-0001-0001-0001-000000000002', 'E11', 'Diabetes Mellitus Tipo 2', 'Crónica', 'Diabetes tipo 2'),
  ('h1000000-0001-0001-0001-000000000003', 'J06', 'Infección Respiratoria Aguda', 'Aguda', 'IRA superior'),
  ('h1000000-0001-0001-0001-000000000004', 'M54', 'Dolor Lumbar', 'Crónica', 'Lumbago'),
  ('h1000000-0001-0001-0001-000000000005', 'K29', 'Gastritis', 'Crónica', 'Inflamación gástrica')
ON CONFLICT ("EnfCodigoCIE") DO NOTHING;

-- Tipos de Vulnerabilidad
INSERT INTO "Cat_TipoVulnerabilidad" ("TipoVulnerabilidadID", "TVulnerabilidadNombre", "TVulnerabilidadPuntosPrioridad") VALUES
  ('i1000000-0001-0001-0001-000000000001', 'Adulto Mayor (+65 años)', 8),
  ('i1000000-0001-0001-0001-000000000002', 'Discapacidad Física', 9),
  ('i1000000-0001-0001-0001-000000000003', 'Madre Soltera', 7),
  ('i1000000-0001-0001-0001-000000000004', 'Pobreza Extrema', 10)
ON CONFLICT ("TVulnerabilidadNombre") DO NOTHING;

-- =============================================
-- 3. USUARIOS (con contraseña hasheada)
-- Password para todos: "Admin123"
-- bcrypt hash de "Admin123" con 10 rounds
-- =============================================

INSERT INTO "Tbl_Usuario" ("UsuarioID", "RolID", "UsuCedula", "UsuNombres", "UsuApellidos", "UsuCorreo", "UsuTelefono", "UsuCargo", "UsuDepartamento", "UsuEstado", "UsuContrasena") VALUES
  ('u1000000-0001-0001-0001-000000000001', 'a1b2c3d4-1111-1111-1111-111111111111', 'V-12345678', 'Carlos', 'Rodríguez', 'admin@farmapatria.com', '0412-1234567', 'Director', 'Administración', 'Active', '$2b$10$NH5i9ianMmQkIOSZj0PmKeVl5AeSucFeAyU.8Lpyoqo77aFTXtQq2'),
  ('u1000000-0001-0001-0001-000000000002', 'a1b2c3d4-2222-2222-2222-222222222222', 'V-23456789', 'María', 'González', 'farmacia@farmapatria.com', '0414-2345678', 'Farmacéutica Jefe', 'Farmacia', 'Active', '$2b$10$NH5i9ianMmQkIOSZj0PmKeVl5AeSucFeAyU.8Lpyoqo77aFTXtQq2'),
  ('u1000000-0001-0001-0001-000000000003', 'a1b2c3d4-3333-3333-3333-333333333333', 'V-34567890', 'José', 'Martínez', 'operador@farmapatria.com', '0416-3456789', 'Operador de Campo', 'Operaciones', 'Active', '$2b$10$NH5i9ianMmQkIOSZj0PmKeVl5AeSucFeAyU.8Lpyoqo77aFTXtQq2')
ON CONFLICT ("UsuCedula") DO NOTHING;

-- =============================================
-- 4. MEDICAMENTOS
-- =============================================

INSERT INTO "Tbl_Medicamento" ("MedicamentoID", "MedCodigoNacional", "MedNombreComercial", "MedNombreGenerico", "MedPrincipioActivo", "MedConcentracion", "FormaFarmaceuticaID", "MedViaAdministracion", "LaboratorioID", "CategoriaMedicamentoID", "MedRegistroSanitario", "MedRequiereReceta", "MedUnidadMedida", "MedCantidadPorPresentacion") VALUES
  ('m1000000-0001-0001-0001-000000000001', 'MED-001', 'Losartán 50mg', 'Losartán Potásico', 'Losartán', '50mg', 'f1000000-0001-0001-0001-000000000001', 'Oral', 'e1000000-0001-0001-0001-000000000001', 'g1000000-0001-0001-0001-000000000001', 'RS-2024-001', true, 'Tableta', 30),
  ('m1000000-0001-0001-0001-000000000002', 'MED-002', 'Metformina 850mg', 'Metformina Clorhidrato', 'Metformina', '850mg', 'f1000000-0001-0001-0001-000000000001', 'Oral', 'e1000000-0001-0001-0001-000000000002', 'g1000000-0001-0001-0001-000000000002', 'RS-2024-002', true, 'Tableta', 30),
  ('m1000000-0001-0001-0001-000000000003', 'MED-003', 'Acetaminofén 500mg', 'Paracetamol', 'Acetaminofén', '500mg', 'f1000000-0001-0001-0001-000000000001', 'Oral', 'e1000000-0001-0001-0001-000000000001', 'g1000000-0001-0001-0001-000000000003', 'RS-2024-003', false, 'Tableta', 20),
  ('m1000000-0001-0001-0001-000000000004', 'MED-004', 'Amoxicilina 500mg', 'Amoxicilina', 'Amoxicilina', '500mg', 'f1000000-0001-0001-0001-000000000002', 'Oral', 'e1000000-0001-0001-0001-000000000003', 'g1000000-0001-0001-0001-000000000004', 'RS-2024-004', true, 'Cápsula', 21),
  ('m1000000-0001-0001-0001-000000000005', 'MED-005', 'Ibuprofeno 400mg', 'Ibuprofeno', 'Ibuprofeno', '400mg', 'f1000000-0001-0001-0001-000000000001', 'Oral', 'e1000000-0001-0001-0001-000000000002', 'g1000000-0001-0001-0001-000000000005', 'RS-2024-005', false, 'Tableta', 20)
ON CONFLICT ("MedCodigoNacional") DO NOTHING;

-- =============================================
-- 5. BENEFICIARIOS
-- =============================================

INSERT INTO "Tbl_Beneficiario" ("BeneficiarioID", "BenCedula", "BenNombres", "BenApellidos", "BenFechaNacimiento", "BenGenero", "ComunidadID", "BenDireccionDetallada", "BenTelefonoPersonal", "BenEmail", "BenContactoEmergencia", "BenTelefonoEmergencia", "BenPersonasDependientes", "BenIngresosMensuales", "BenNivelPrioridad", "BenEstado") VALUES
  ('ben00000-0001-0001-0001-000000000001', 'V-11111111', 'Ana María', 'López Pérez', '1958-03-15', 'F', 'd1000000-0001-0001-0001-000000000001', 'Calle 5, Casa 12', '0412-1111111', 'ana.lopez@email.com', 'Pedro López', '0414-9999999', 3, 150.00, 'ALTA', 'ACTIVO'),
  ('ben00000-0001-0001-0001-000000000002', 'V-22222222', 'Juan Carlos', 'Hernández Díaz', '1965-07-22', 'M', 'd1000000-0001-0001-0001-000000000002', 'Av. Principal, Edif. 3, Apto 4B', '0416-2222222', 'juan.hernandez@email.com', 'Rosa Hernández', '0412-8888888', 2, 200.00, 'MEDIA', 'ACTIVO'),
  ('ben00000-0001-0001-0001-000000000003', 'V-33333333', 'Luisa', 'Ramírez Gutiérrez', '1975-11-08', 'F', 'd1000000-0001-0001-0001-000000000003', 'Sector B, Bloque 7', '0424-3333333', 'luisa.ramirez@email.com', 'Miguel Ramírez', '0416-7777777', 4, 120.00, 'ALTA', 'ACTIVO'),
  ('ben00000-0001-0001-0001-000000000004', 'V-44444444', 'Roberto', 'Mendoza Torres', '1950-01-30', 'M', 'd1000000-0001-0001-0001-000000000004', 'Vereda 2, Casa 8', '0414-4444444', 'roberto.mendoza@email.com', 'Carmen Mendoza', '0424-6666666', 1, 100.00, 'ALTA', 'ACTIVO'),
  ('ben00000-0001-0001-0001-000000000005', 'V-55555555', 'Carmen', 'Flores Silva', '1982-05-12', 'F', 'd1000000-0001-0001-0001-000000000005', 'Calle Los Mangos, Casa 3', '0412-5555555', 'carmen.flores@email.com', 'Luis Flores', '0416-5555555', 5, 180.00, 'MEDIA', 'ACTIVO')
ON CONFLICT ("BenCedula") DO NOTHING;

-- =============================================
-- 6. DONANTES
-- =============================================

INSERT INTO "Tbl_Donante" ("DonanteID", "TipoDonanteID", "DonNombre", "DonRIFCedula", "DonContactoPrincipal", "DonTelefonoContacto", "DonEmailContacto", "DonFrecuenciaDonacion") VALUES
  ('don00000-0001-0001-0001-000000000001', 'b1000000-0001-0001-0001-000000000001', 'Laboratorios Vargas S.A.', 'J-11111111-0', 'Dr. Pedro Vargas', '0212-1234567', 'donaciones@labvargas.com', 'Mensual'),
  ('don00000-0001-0001-0001-000000000002', 'b1000000-0001-0001-0001-000000000002', 'Fundación Salud Para Todos', 'J-22222222-0', 'Lic. Rosa Méndez', '0212-2345678', 'contacto@saludparatodos.org', 'Trimestral')
ON CONFLICT ("DonRIFCedula") DO NOTHING;

SELECT 'Seed completado exitosamente' AS resultado;
