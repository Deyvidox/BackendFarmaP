CREATE TABLE "Cat_Rol" (
  "RolID" uuid PRIMARY KEY,
  "RolNombre" varchar(50) UNIQUE NOT NULL,
  "RolDescripcion" text,
  "RolEstado" varchar(20) DEFAULT 'ACTIVO',
  "RolCreado" timestamp DEFAULT (now()),
  "RolActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Cat_TipoDonante" (
  "TipoDonanteID" uuid PRIMARY KEY,
  "TDonanteNombre" varchar(50) UNIQUE NOT NULL,
  "TDonanteDescripcion" text,
  "TDonanteEstado" varchar(20) DEFAULT 'ACTIVO',
  "TDonanteCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Cat_TipoDonacion" (
  "TipoDonacionID" uuid PRIMARY KEY,
  "TDonacionNombre" varchar(50) UNIQUE NOT NULL,
  "TDonacionDescripcion" text,
  "TDonacionEstado" varchar(20) DEFAULT 'ACTIVO',
  "TDonacionCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Cat_TipoVulnerabilidad" (
  "TipoVulnerabilidadID" uuid PRIMARY KEY,
  "TVulnerabilidadNombre" varchar(100) UNIQUE NOT NULL,
  "TVulnerabilidadDescripcion" text,
  "TVulnerabilidadPuntosPrioridad" integer DEFAULT 0,
  "TVulnerabilidadEstado" varchar(20) DEFAULT 'ACTIVO',
  "TVulnerabilidadCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Cat_Comunidad" (
  "ComunidadID" uuid PRIMARY KEY,
  "ComNombre" varchar(100) NOT NULL,
  "ComParroquia" varchar(100) NOT NULL,
  "ComMunicipio" varchar(100) NOT NULL,
  "ComEstadoRegion" varchar(100) NOT NULL,
  "ComDescripcion" text,
  "ComEstado" varchar(20) DEFAULT 'ACTIVO',
  "ComCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Cat_Laboratorio" (
  "LaboratorioID" uuid PRIMARY KEY,
  "LabNombre" varchar(200) NOT NULL,
  "LabRIFCedula" varchar(20) UNIQUE,
  "LabTelefono" varchar(20),
  "LabEmail" varchar(150),
  "LabDireccion" text,
  "LabEstado" varchar(20) DEFAULT 'ACTIVO',
  "LabCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Cat_FormaFarmaceutica" (
  "FormaFarmaceuticaID" uuid PRIMARY KEY,
  "FFarmNombre" varchar(100) UNIQUE NOT NULL,
  "FFarmDescripcion" text,
  "FFarmCondicionesAlmacenamiento" text,
  "FFarmEstado" varchar(20) DEFAULT 'ACTIVO',
  "FFarmCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Cat_CategoriaMedicamento" (
  "CategoriaMedicamentoID" uuid PRIMARY KEY,
  "CMedNombre" varchar(100) UNIQUE NOT NULL,
  "CMedDescripcion" text,
  "CMedPrioridadDistribucion" integer DEFAULT 0,
  "CMedEstado" varchar(20) DEFAULT 'ACTIVO',
  "CMedCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Cat_Enfermedad" (
  "EnfermedadID" uuid PRIMARY KEY,
  "EnfCodigoCIE" varchar(20) UNIQUE,
  "EnfNombre" varchar(200) NOT NULL,
  "EnfTipo" varchar(50),
  "EnfDescripcion" text,
  "EnfTratamientoBase" text,
  "EnfEstado" varchar(20) DEFAULT 'ACTIVO',
  "EnfCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Usuario" (
  "UsuarioID" uuid PRIMARY KEY,
  "RolID" uuid NOT NULL,
  "UsuCedula" varchar(20) UNIQUE,
  "UsuNombres" varchar(100) NOT NULL,
  "UsuApellidos" varchar(100) NOT NULL,
  "UsuCorreo" varchar(150) UNIQUE,
  "UsuTelefono" varchar(20),
  "UsuCargo" varchar(100),
  "UsuDepartamento" varchar(100),
  "UsuEstado" varchar(20) DEFAULT 'ACTIVO',
  "UsuUltimoAcceso" timestamp,
  "UsuCreado" timestamp DEFAULT (now()),
  "UsuActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Donante" (
  "DonanteID" uuid PRIMARY KEY,
  "TipoDonanteID" uuid NOT NULL,
  "DonNombre" varchar(200) NOT NULL,
  "DonRIFCedula" varchar(20) UNIQUE,
  "DonContactoPrincipal" varchar(150),
  "DonTelefonoContacto" varchar(20),
  "DonEmailContacto" varchar(150),
  "DonDireccion" text,
  "DonFrecuenciaDonacion" varchar(50),
  "DonEstado" varchar(20) DEFAULT 'ACTIVO',
  "DonObservaciones" text,
  "DonCreado" timestamp DEFAULT (now()),
  "DonActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Beneficiario" (
  "BeneficiarioID" uuid PRIMARY KEY,
  "BenCedula" varchar(20) UNIQUE,
  "BenNombres" varchar(100) NOT NULL,
  "BenApellidos" varchar(100) NOT NULL,
  "BenFechaNacimiento" date,
  "BenGenero" varchar(1),
  "ComunidadID" uuid,
  "BenDireccionDetallada" text,
  "BenTelefonoPersonal" varchar(20),
  "BenEmail" varchar(150),
  "BenContactoEmergencia" varchar(150),
  "BenTelefonoEmergencia" varchar(20),
  "BenPersonasDependientes" integer DEFAULT 0,
  "BenIngresosMensuales" decimal(10,2),
  "BenNivelPrioridad" varchar(20),
  "BenEstado" varchar(20) DEFAULT 'ACTIVO',
  "BenFechaRegistro" date DEFAULT (current_date),
  "BenCreado" timestamp DEFAULT (now()),
  "BenActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Medicamento" (
  "MedicamentoID" uuid PRIMARY KEY,
  "MedCodigoNacional" varchar(50) UNIQUE,
  "MedNombreComercial" varchar(200) NOT NULL,
  "MedNombreGenerico" varchar(200),
  "MedPrincipioActivo" varchar(200),
  "MedConcentracion" varchar(100),
  "FormaFarmaceuticaID" uuid NOT NULL,
  "MedViaAdministracion" varchar(100),
  "LaboratorioID" uuid NOT NULL,
  "CategoriaMedicamentoID" uuid NOT NULL,
  "MedRegistroSanitario" varchar(100),
  "MedRequiereReceta" boolean DEFAULT false,
  "MedCondicionesAlmacenamiento" text,
  "MedTemperaturaAlmacenamiento" varchar(50),
  "MedUnidadMedida" varchar(50),
  "MedCantidadPorPresentacion" integer DEFAULT 1,
  "MedEstado" varchar(20) DEFAULT 'ACTIVO',
  "MedCreado" timestamp DEFAULT (now()),
  "MedActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Donacion" (
  "DonacionID" uuid PRIMARY KEY,
  "DonanteID" uuid NOT NULL,
  "TipoDonacionID" uuid NOT NULL,
  "DonNumeroDocumento" varchar(100) UNIQUE,
  "DonFechaRecepcion" date NOT NULL,
  "DonFechaDocumentacion" date,
  "DonValorEstimadoTotal" decimal(12,2),
  "UsuarioReceptorID" uuid NOT NULL,
  "DonAlmacenDestino" varchar(100),
  "DonCondicionesTransporte" varchar(200),
  "DonEstado" varchar(20) DEFAULT 'RECIBIDO',
  "DonObservaciones" text,
  "DonCreado" timestamp DEFAULT (now()),
  "DonActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_LoteMedicamento" (
  "LoteID" uuid PRIMARY KEY,
  "MedicamentoID" uuid NOT NULL,
  "LotNumeroLote" varchar(100) NOT NULL,
  "LotFechaFabricacion" date,
  "LotFechaVencimiento" date NOT NULL,
  "LotCantidadUnidades" integer NOT NULL,
  "DonacionID" uuid,
  "LotEstadoCalidad" varchar(50) DEFAULT 'OPTIMO',
  "LotObservacionesCalidad" text,
  "UsuarioInspectorID" uuid,
  "LotFechaInspeccion" date,
  "LotUbicacionAlmacen" varchar(100),
  "LotEstado" varchar(20) DEFAULT 'DISPONIBLE',
  "LotCreado" timestamp DEFAULT (now()),
  "LotActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Solicitud" (
  "SolicitudID" uuid PRIMARY KEY,
  "BeneficiarioID" uuid NOT NULL,
  "EnfermedadID" uuid,
  "SolTipoSolicitud" varchar(20) DEFAULT 'NUEVA',
  "SolFechaSolicitud" date DEFAULT (current_date),
  "SolDiagnosticoPrincipal" varchar(200),
  "SolInstitucionSalud" varchar(200),
  "SolMedicoTratante" varchar(200),
  "SolPrioridadMedica" varchar(20),
  "UsuarioReceptorID" uuid NOT NULL,
  "SolEstado" varchar(20) DEFAULT 'PENDIENTE',
  "SolFechaRevision" date,
  "UsuarioRevisorID" uuid,
  "SolObservacionesRevision" text,
  "SolCreado" timestamp DEFAULT (now()),
  "SolActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_DetalleSolicitud" (
  "DetalleSolicitudID" uuid PRIMARY KEY,
  "SolicitudID" uuid NOT NULL,
  "MedicamentoID" uuid NOT NULL,
  "DtSolCantidadSolicitada" integer NOT NULL,
  "DtSolCantidadAprobada" integer DEFAULT 0,
  "DtSolFrecuenciaEntrega" varchar(50),
  "DtSolDuracionTratamientoDias" integer,
  "DtSolJustificacionMedica" text,
  "DtSolEstado" varchar(20) DEFAULT 'PENDIENTE',
  "DtSolObservaciones" text,
  "DtSolCreado" timestamp DEFAULT (now()),
  "DtSolActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Entrega" (
  "EntregaID" uuid PRIMARY KEY,
  "SolicitudID" uuid NOT NULL,
  "EntFechaEntrega" date NOT NULL,
  "EntTipoEntrega" varchar(50),
  "EntPuntoEntrega" varchar(100),
  "UsuarioEntregaID" uuid NOT NULL,
  "EntEstado" varchar(20) DEFAULT 'PROGRAMADA',
  "EntObservaciones" text,
  "EntFirmaDigital" text,
  "EntTestigoEntrega" varchar(150),
  "EntProximaEntregaEstimada" date,
  "EntCreado" timestamp DEFAULT (now()),
  "EntActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_DetalleEntrega" (
  "DetalleEntregaID" uuid PRIMARY KEY,
  "EntregaID" uuid NOT NULL,
  "LoteID" uuid NOT NULL,
  "DtEntCantidadEntregada" integer NOT NULL,
  "DtEntPrecioReferenciaUnitario" decimal(10,2),
  "DtEntObservaciones" text,
  "DtEntCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Inventario" (
  "InventarioID" uuid PRIMARY KEY,
  "LoteID" uuid NOT NULL,
  "InvUbicacion" varchar(100) NOT NULL,
  "InvCantidadTotal" integer NOT NULL,
  "InvCantidadDisponible" integer NOT NULL,
  "InvCantidadReservada" integer DEFAULT 0,
  "InvCantidadEntregada" integer DEFAULT 0,
  "InvStockMinimo" integer DEFAULT 10,
  "InvStockMaximo" integer,
  "InvUltimoMovimiento" timestamp,
  "InvEstado" varchar(20) DEFAULT 'OPTIMO',
  "InvObservaciones" text,
  "InvCreado" timestamp DEFAULT (now()),
  "InvActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_MovimientoInventario" (
  "MovimientoInventarioID" uuid PRIMARY KEY,
  "InventarioID" uuid NOT NULL,
  "MovInvTipoMovimiento" varchar(50),
  "MovInvReferenciaID" uuid,
  "MovInvTipoReferencia" varchar(50),
  "MovInvCantidad" integer NOT NULL,
  "MovInvCantidadAnterior" integer NOT NULL,
  "MovInvCantidadNueva" integer NOT NULL,
  "UsuarioID" uuid NOT NULL,
  "MovInvMotivo" text,
  "MovInvObservaciones" text,
  "MovInvCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Notificacion" (
  "NotificacionID" uuid PRIMARY KEY,
  "BeneficiarioID" uuid,
  "UsuarioID" uuid,
  "NotTipoDestinatario" varchar(20) NOT NULL,
  "NotTipoNotificacion" varchar(50),
  "NotAsunto" varchar(200) NOT NULL,
  "NotMensaje" text NOT NULL,
  "NotCanalEnvio" varchar(50),
  "NotEstadoEnvio" varchar(20) DEFAULT 'PENDIENTE',
  "NotIntentosEnvio" integer DEFAULT 0,
  "NotFechaEnvio" timestamp,
  "NotFechaProgramada" timestamp,
  "NotRespuestaSistema" text,
  "NotReferenciaID" uuid,
  "NotTipoReferencia" varchar(50),
  "NotCreado" timestamp DEFAULT (now()),
  "NotActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_JornadaComunitaria" (
  "JornadaID" uuid PRIMARY KEY,
  "JorNombre" varchar(200) NOT NULL,
  "ComunidadID" uuid NOT NULL,
  "JorDireccion" text,
  "JorFechaJornada" date NOT NULL,
  "JorHoraInicio" time,
  "JorHoraFin" time,
  "ResponsableID" uuid NOT NULL,
  "JorEstado" varchar(20) DEFAULT 'PLANIFICADA',
  "JorObservaciones" text,
  "JorCreado" timestamp DEFAULT (now()),
  "JorActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_ParametroSistema" (
  "ParametroID" uuid PRIMARY KEY,
  "ParClave" varchar(100) UNIQUE NOT NULL,
  "ParValor" text NOT NULL,
  "ParTipo" varchar(50),
  "ParCategoria" varchar(100),
  "ParDescripcion" text,
  "ParEditable" boolean DEFAULT true,
  "ParCreado" timestamp DEFAULT (now()),
  "ParActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Rel_BeneficiarioVulnerabilidad" (
  "BenefVulID" uuid PRIMARY KEY,
  "BeneficiarioID" uuid NOT NULL,
  "TipoVulnerabilidadID" uuid NOT NULL,
  "BenVulComprobanteDocumento" varchar(200),
  "BenVulFechaDiagnostico" date,
  "BenVulObservaciones" text,
  "BenVulEstado" varchar(20) DEFAULT 'ACTIVO',
  "BenVulCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Rel_BeneficiarioEnfermedad" (
  "BenefEnfID" uuid PRIMARY KEY,
  "BeneficiarioID" uuid NOT NULL,
  "EnfermedadID" uuid NOT NULL,
  "BenEnfFechaDiagnostico" date,
  "BenEnfTratamientoActual" text,
  "BenEnfEstadoActual" varchar(50),
  "BenEnfObservaciones" text,
  "BenEnfCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Rel_SolicitudDocumento" (
  "SolicitudDocID" uuid PRIMARY KEY,
  "SolicitudID" uuid NOT NULL,
  "SolDocTipoDocumento" varchar(100) NOT NULL,
  "SolDocNombreArchivo" varchar(200) NOT NULL,
  "SolDocRutaArchivo" varchar(500) NOT NULL,
  "SolDocTamanoBytes" integer,
  "SolDocEstado" varchar(20) DEFAULT 'ACTIVO',
  "SolDocCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Rel_JornadaMedicamento" (
  "JornadaMedID" uuid PRIMARY KEY,
  "JornadaID" uuid NOT NULL,
  "MedicamentoID" uuid NOT NULL,
  "JorMedCantidadAsignada" integer NOT NULL,
  "JorMedCantidadEntregada" integer DEFAULT 0,
  "JorMedObservaciones" text,
  "JorMedCreado" timestamp DEFAULT (now()),
  "JorMedActualizado" timestamp DEFAULT (now())
);

CREATE TABLE "Rel_JornadaAsistencia" (
  "JornadaAsistenciaID" uuid PRIMARY KEY,
  "JornadaID" uuid NOT NULL,
  "BeneficiarioID" uuid NOT NULL,
  "JorAsisFechaAsistencia" timestamp DEFAULT (now()),
  "JorAsisMedicamentosRecibidos" json,
  "JorAsisObservaciones" text,
  "JorAsisCreado" timestamp DEFAULT (now())
);

CREATE TABLE "Tbl_Bitacora" (
  "BitacoraID" uuid PRIMARY KEY,
  "UsuarioID" uuid NOT NULL,
  "BitModulo" varchar(100) NOT NULL,
  "BitAccion" varchar(50) NOT NULL,
  "BitEntidadAfectada" varchar(100) NOT NULL,
  "BitEntidadID" uuid NOT NULL,
  "BitDetallesAnteriores" json,
  "BitDetallesNuevos" json,
  "BitIpCliente" varchar(50),
  "BitUserAgent" text,
  "BitCreado" timestamp DEFAULT (now())
);

CREATE UNIQUE INDEX ON "Tbl_LoteMedicamento" ("MedicamentoID", "LotNumeroLote");

CREATE UNIQUE INDEX ON "Tbl_DetalleSolicitud" ("SolicitudID", "MedicamentoID");

CREATE UNIQUE INDEX ON "Tbl_DetalleEntrega" ("EntregaID", "LoteID");

CREATE UNIQUE INDEX ON "Tbl_Inventario" ("LoteID", "InvUbicacion");

CREATE UNIQUE INDEX ON "Rel_BeneficiarioVulnerabilidad" ("BeneficiarioID", "TipoVulnerabilidadID");

CREATE UNIQUE INDEX ON "Rel_BeneficiarioEnfermedad" ("BeneficiarioID", "EnfermedadID");

CREATE UNIQUE INDEX ON "Rel_JornadaMedicamento" ("JornadaID", "MedicamentoID");

CREATE UNIQUE INDEX ON "Rel_JornadaAsistencia" ("JornadaID", "BeneficiarioID");

ALTER TABLE "Tbl_Usuario" ADD FOREIGN KEY ("RolID") REFERENCES "Cat_Rol" ("RolID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Donante" ADD FOREIGN KEY ("TipoDonanteID") REFERENCES "Cat_TipoDonante" ("TipoDonanteID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Beneficiario" ADD FOREIGN KEY ("ComunidadID") REFERENCES "Cat_Comunidad" ("ComunidadID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Medicamento" ADD FOREIGN KEY ("FormaFarmaceuticaID") REFERENCES "Cat_FormaFarmaceutica" ("FormaFarmaceuticaID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Medicamento" ADD FOREIGN KEY ("LaboratorioID") REFERENCES "Cat_Laboratorio" ("LaboratorioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Medicamento" ADD FOREIGN KEY ("CategoriaMedicamentoID") REFERENCES "Cat_CategoriaMedicamento" ("CategoriaMedicamentoID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Donacion" ADD FOREIGN KEY ("DonanteID") REFERENCES "Tbl_Donante" ("DonanteID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Donacion" ADD FOREIGN KEY ("TipoDonacionID") REFERENCES "Cat_TipoDonacion" ("TipoDonacionID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Donacion" ADD FOREIGN KEY ("UsuarioReceptorID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_LoteMedicamento" ADD FOREIGN KEY ("MedicamentoID") REFERENCES "Tbl_Medicamento" ("MedicamentoID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_LoteMedicamento" ADD FOREIGN KEY ("DonacionID") REFERENCES "Tbl_Donacion" ("DonacionID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_LoteMedicamento" ADD FOREIGN KEY ("UsuarioInspectorID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Solicitud" ADD FOREIGN KEY ("BeneficiarioID") REFERENCES "Tbl_Beneficiario" ("BeneficiarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Solicitud" ADD FOREIGN KEY ("EnfermedadID") REFERENCES "Cat_Enfermedad" ("EnfermedadID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Solicitud" ADD FOREIGN KEY ("UsuarioReceptorID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Solicitud" ADD FOREIGN KEY ("UsuarioRevisorID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_DetalleSolicitud" ADD FOREIGN KEY ("SolicitudID") REFERENCES "Tbl_Solicitud" ("SolicitudID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_DetalleSolicitud" ADD FOREIGN KEY ("MedicamentoID") REFERENCES "Tbl_Medicamento" ("MedicamentoID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Entrega" ADD FOREIGN KEY ("SolicitudID") REFERENCES "Tbl_Solicitud" ("SolicitudID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Entrega" ADD FOREIGN KEY ("UsuarioEntregaID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_DetalleEntrega" ADD FOREIGN KEY ("EntregaID") REFERENCES "Tbl_Entrega" ("EntregaID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_DetalleEntrega" ADD FOREIGN KEY ("LoteID") REFERENCES "Tbl_LoteMedicamento" ("LoteID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Inventario" ADD FOREIGN KEY ("LoteID") REFERENCES "Tbl_LoteMedicamento" ("LoteID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_MovimientoInventario" ADD FOREIGN KEY ("InventarioID") REFERENCES "Tbl_Inventario" ("InventarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_MovimientoInventario" ADD FOREIGN KEY ("UsuarioID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Notificacion" ADD FOREIGN KEY ("BeneficiarioID") REFERENCES "Tbl_Beneficiario" ("BeneficiarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Notificacion" ADD FOREIGN KEY ("UsuarioID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_JornadaComunitaria" ADD FOREIGN KEY ("ComunidadID") REFERENCES "Cat_Comunidad" ("ComunidadID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_JornadaComunitaria" ADD FOREIGN KEY ("ResponsableID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_BeneficiarioVulnerabilidad" ADD FOREIGN KEY ("BeneficiarioID") REFERENCES "Tbl_Beneficiario" ("BeneficiarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_BeneficiarioVulnerabilidad" ADD FOREIGN KEY ("TipoVulnerabilidadID") REFERENCES "Cat_TipoVulnerabilidad" ("TipoVulnerabilidadID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_BeneficiarioEnfermedad" ADD FOREIGN KEY ("BeneficiarioID") REFERENCES "Tbl_Beneficiario" ("BeneficiarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_BeneficiarioEnfermedad" ADD FOREIGN KEY ("EnfermedadID") REFERENCES "Cat_Enfermedad" ("EnfermedadID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_SolicitudDocumento" ADD FOREIGN KEY ("SolicitudID") REFERENCES "Tbl_Solicitud" ("SolicitudID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_JornadaMedicamento" ADD FOREIGN KEY ("JornadaID") REFERENCES "Tbl_JornadaComunitaria" ("JornadaID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_JornadaMedicamento" ADD FOREIGN KEY ("MedicamentoID") REFERENCES "Tbl_Medicamento" ("MedicamentoID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_JornadaAsistencia" ADD FOREIGN KEY ("JornadaID") REFERENCES "Tbl_JornadaComunitaria" ("JornadaID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Rel_JornadaAsistencia" ADD FOREIGN KEY ("BeneficiarioID") REFERENCES "Tbl_Beneficiario" ("BeneficiarioID") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Tbl_Bitacora" ADD FOREIGN KEY ("UsuarioID") REFERENCES "Tbl_Usuario" ("UsuarioID") DEFERRABLE INITIALLY IMMEDIATE;
