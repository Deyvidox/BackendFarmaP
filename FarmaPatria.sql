
-- DATABASE--
CREATE TYPE "user_status" AS ENUM ('Active', 'Inactive', 'Suspended');
CREATE TYPE "donor_status" AS ENUM ('Active', 'Inactive', 'Suspended');
CREATE TYPE "beneficiary_status" AS ENUM ('Active', 'Inactive', 'Suspended');
CREATE TYPE "medicine_status" AS ENUM ('Active', 'Inactive', 'Discontinued');
CREATE TYPE "donation_status" AS ENUM ('Received', 'Inspected', 'Accepted', 'Rejected', 'Quarantined');
CREATE TYPE "lot_quality_status" AS ENUM ('Optimal', 'Near Expiry', 'Damaged', 'Expired', 'In Quarantine');
CREATE TYPE "lot_status" AS ENUM ('Available', 'Reserved', 'Expired', 'Depleted', 'Quarantined');
CREATE TYPE "request_status" AS ENUM ('Pending', 'Under Review', 'Approved', 'Rejected', 'Partially Approved', 'Completed');
CREATE TYPE "request_detail_status" AS ENUM ('Pending', 'Approved', 'Rejected', 'Partially Delivered', 'Delivered', 'Cancelled');
CREATE TYPE "delivery_status" AS ENUM ('Scheduled', 'In Transit', 'Delivered', 'Cancelled', 'Failed');
CREATE TYPE "inventory_status" AS ENUM ('Optimal', 'Low Stock', 'Out of Stock', 'Overstock');
CREATE TYPE "movement_type" AS ENUM ('Entry', 'Exit', 'Transfer', 'Reservation', 'Release', 'Adjustment');
CREATE TYPE "beneficiary_priority" AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE "medical_priority" AS ENUM ('Low', 'Medium', 'High', 'Emergency');
CREATE TYPE "request_type" AS ENUM ('New', 'Renewal', 'Emergency');
CREATE TYPE "delivery_type" AS ENUM ('Home Delivery', 'Pickup Point', 'Health Center');
CREATE TYPE "document_type" AS ENUM ('Medical Prescription', 'ID Document', 'Socioeconomic Report', 'Other');
CREATE TYPE "notification_recipient_type" AS ENUM ('Beneficiary', 'User');
CREATE TYPE "notification_channel" AS ENUM ('Email', 'SMS', 'Push', 'In-App');
CREATE TYPE "notification_status" AS ENUM ('Pending', 'Sent', 'Failed', 'Delivered', 'Read');
CREATE TYPE "campaign_status" AS ENUM ('Planned', 'In Progress', 'Completed', 'Cancelled');
CREATE TYPE "donation_frequency" AS ENUM ('Monthly', 'Quarterly', 'Annual', 'Sporadic', 'One-time');
CREATE TYPE "role_name" AS ENUM ('Administrator', 'Warehouse Manager', 'Coordinator', 'Social Worker', 'Inspector');

CREATE TABLE "roles" (
  "id" uuid PRIMARY KEY,
  "name" role_name NOT NULL,
  "description" text,
  "permissions" JSON,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "role_id" uuid NOT NULL,
  "username" varchar(50) UNIQUE NOT NULL,
  "password" text NOT NULL,
  "identification_number" varchar(20) UNIQUE,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(150) UNIQUE NOT NULL,
  "date_of_birth" date,
  "address" text,
  "phone" varchar(20),
  "position" varchar(100),
  "department" varchar(100),
  "status" user_status DEFAULT 'Active',
  "last_access" timestamp,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "donors" (
  "id" uuid PRIMARY KEY,
  "donor_type_id" uuid NOT NULL,
  "name" varchar(200) NOT NULL,
  "rif_cedula" varchar(20) UNIQUE,
  "main_contact" varchar(150),
  "contact_phone" varchar(20),
  "contact_email" varchar(150),
  "address" text,
  "donation_frequency" donation_frequency,
  "status" donor_status DEFAULT 'Active',
  "observations" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "beneficiaries" (
  "id" uuid PRIMARY KEY,
  "identification_number" varchar(20) UNIQUE,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "birth_date" date,
  "gender" varchar(1),
  "community_id" uuid,
  "detailed_address" text,
  "phone_personal" varchar(20),
  "email" varchar(150),
  "emergency_contact" varchar(150),
  "emergency_phone" varchar(20),
  "dependents" integer DEFAULT 0,
  "monthly_income" decimal(10,2),
  "priority_level" beneficiary_priority,
  "status" beneficiary_status DEFAULT 'Active',
  "registration_date" date DEFAULT (current_date),
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "medicines" (
  "id" uuid PRIMARY KEY,
  "national_code" varchar(50) UNIQUE,
  "commercial_name" varchar(200) NOT NULL,
  "generic_name" varchar(200),
  "active_principle" varchar(200),
  "concentration" varchar(100),
  "pharmaceutical_form_id" uuid NOT NULL,
  "administration_route" varchar(100),
  "laboratory_id" uuid NOT NULL,
  "category_id" uuid NOT NULL,
  "sanitary_registration" varchar(100),
  "requires_prescription" boolean DEFAULT false,
  "storage_conditions" text,
  "storage_temperature" varchar(50),
  "unit_measure" varchar(50),
  "units_per_presentation" integer DEFAULT 1,
  "status" medicine_status DEFAULT 'Active',
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "donor_types" (
  "id" uuid PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "donation_types" (
  "id" uuid PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "vulnerability_types" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100) UNIQUE NOT NULL,
  "description" text,
  "priority_points" integer DEFAULT 0,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "communities" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "parish" varchar(100) NOT NULL,
  "municipality" varchar(100) NOT NULL,
  "state_region" varchar(100) NOT NULL,
  "description" text,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "laboratories" (
  "id" uuid PRIMARY KEY,
  "name" varchar(200) NOT NULL,
  "rif_cedula" varchar(20) UNIQUE,
  "phone" varchar(20),
  "email" varchar(150),
  "address" text,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "pharmaceutical_forms" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100) UNIQUE NOT NULL,
  "description" text,
  "storage_conditions" text,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "medicine_categories" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100) UNIQUE NOT NULL,
  "description" text,
  "distribution_priority" integer DEFAULT 0,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "diseases" (
  "id" uuid PRIMARY KEY,
  "codigo_cie" varchar(20) UNIQUE,
  "name" varchar(200) NOT NULL,
  "type" varchar(50),
  "description" text,
  "base_treatment" text,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "system_parameters" (
  "id" uuid PRIMARY KEY,
  "key" varchar(100) UNIQUE NOT NULL,
  "value" text NOT NULL,
  "type" varchar(50),
  "category" varchar(100),
  "description" text,
  "editable" boolean DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "donations" (
  "id" uuid PRIMARY KEY,
  "donor_id" uuid NOT NULL,
  "donation_type_id" uuid NOT NULL,
  "document_number" varchar(100) UNIQUE,
  "reception_date" date NOT NULL,
  "documentation_date" date,
  "estimated_total_value" decimal(12,2),
  "receiver_user_id" uuid NOT NULL,
  "destination_warehouse" varchar(100),
  "transport_conditions" varchar(200),
  "status" donation_status DEFAULT 'Received',
  "observations" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "medicine_lots" (
  "id" uuid PRIMARY KEY,
  "medicine_id" uuid NOT NULL,
  "lot_number" varchar(100) NOT NULL,
  "manufacturing_date" date,
  "expiration_date" date NOT NULL,
  "total_units" integer NOT NULL,
  "donation_id" uuid,
  "quality_status" lot_quality_status DEFAULT 'Optimal',
  "quality_observations" text,
  "inspector_user_id" uuid,
  "inspection_date" date,
  "warehouse_location" varchar(100),
  "status" lot_status DEFAULT 'Available',
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "requests" (
  "id" uuid PRIMARY KEY,
  "beneficiary_id" uuid NOT NULL,
  "disease_id" uuid,
  "request_type" request_type DEFAULT 'New',
  "request_date" date DEFAULT (current_date),
  "main_diagnosis" varchar(200),
  "health_institution" varchar(200),
  "treating_doctor" varchar(200),
  "medical_priority" medical_priority,
  "receiver_user_id" uuid NOT NULL,
  "status" request_status DEFAULT 'Pending',
  "review_date" date,
  "reviewer_user_id" uuid,
  "review_observations" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "request_details" (
  "id" uuid PRIMARY KEY,
  "request_id" uuid NOT NULL,
  "medicine_id" uuid NOT NULL,
  "requested_quantity" integer NOT NULL,
  "approved_quantity" integer DEFAULT 0,
  "delivery_frequency" varchar(50),
  "treatment_duration_days" integer,
  "medical_justification" text,
  "status" request_detail_status DEFAULT 'Pending',
  "observations" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "deliveries" (
  "id" uuid PRIMARY KEY,
  "request_id" uuid NOT NULL,
  "delivery_date" date NOT NULL,
  "delivery_type" delivery_type,
  "delivery_point" varchar(100),
  "delivery_user_id" uuid NOT NULL,
  "status" delivery_status DEFAULT 'Scheduled',
  "observations" text,
  "digital_signature" text,
  "delivery_witness" varchar(150),
  "estimated_next_delivery" date,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "delivery_details" (
  "id" uuid PRIMARY KEY,
  "delivery_id" uuid NOT NULL,
  "lot_id" uuid NOT NULL,
  "delivered_quantity" integer NOT NULL,
  "reference_unit_price" decimal(10,2),
  "observations" text,
  "created_at" timestamp
);

CREATE TABLE "inventories" (
  "id" uuid PRIMARY KEY,
  "lot_id" uuid NOT NULL,
  "location" varchar(100) NOT NULL,
  "total_quantity" integer NOT NULL,
  "available_quantity" integer NOT NULL,
  "reserved_quantity" integer DEFAULT 0,
  "delivered_quantity" integer DEFAULT 0,
  "minimum_stock" integer DEFAULT 10,
  "maximum_stock" integer,
  "last_movement" timestamp,
  "status" inventory_status DEFAULT 'Optimal',
  "observations" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "inventory_movements" (
  "id" uuid PRIMARY KEY,
  "inventory_id" uuid NOT NULL,
  "movement_type" movement_type,
  "reference_id" uuid,
  "reference_type" varchar(50),
  "quantity" integer NOT NULL,
  "previous_quantity" integer NOT NULL,
  "new_quantity" integer NOT NULL,
  "user_id" uuid NOT NULL,
  "motive" text,
  "observations" text,
  "created_at" timestamp
);

CREATE TABLE "notifications" (
  "id" uuid PRIMARY KEY,
  "beneficiary_id" uuid,
  "user_id" uuid,
  "recipient_type" notification_recipient_type NOT NULL,
  "notification_type" varchar(50),
  "subject" varchar(200) NOT NULL,
  "message" text NOT NULL,
  "channel" notification_channel,
  "send_status" notification_status DEFAULT 'Pending',
  "send_attempts" integer DEFAULT 0,
  "sent_at" timestamp,
  "scheduled_at" timestamp,
  "system_response" text,
  "reference_id" uuid,
  "reference_type" varchar(50),
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "community_campaigns" (
  "id" uuid PRIMARY KEY,
  "name" varchar(200) NOT NULL,
  "community_id" uuid NOT NULL,
  "address" text,
  "campaign_date" date NOT NULL,
  "start_time" time,
  "end_time" time,
  "responsible_user_id" uuid NOT NULL,
  "status" campaign_status DEFAULT 'Planned',
  "observations" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "beneficiary_vulnerabilities" (
  "id" uuid PRIMARY KEY,
  "beneficiary_id" uuid NOT NULL,
  "vulnerability_type_id" uuid NOT NULL,
  "supporting_document" varchar(200),
  "diagnosis_date" date,
  "observations" text,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "beneficiary_diseases" (
  "id" uuid PRIMARY KEY,
  "beneficiary_id" uuid NOT NULL,
  "disease_id" uuid NOT NULL,
  "diagnosis_date" date,
  "current_treatment" text,
  "current_status" varchar(50),
  "observations" text,
  "created_at" timestamp
);

CREATE TABLE "request_documents" (
  "id" uuid PRIMARY KEY,
  "request_id" uuid NOT NULL,
  "document_type" document_type NOT NULL,
  "file_name" varchar(200) NOT NULL,
  "file_path" varchar(500) NOT NULL,
  "file_size_bytes" integer,
  "status" user_status DEFAULT 'Active',
  "created_at" timestamp
);

CREATE TABLE "campaign_medicines" (
  "id" uuid PRIMARY KEY,
  "campaign_id" uuid NOT NULL,
  "medicine_id" uuid NOT NULL,
  "assigned_quantity" integer NOT NULL,
  "delivered_quantity" integer DEFAULT 0,
  "observations" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "campaign_attendances" (
  "id" uuid PRIMARY KEY,
  "campaign_id" uuid NOT NULL,
  "beneficiary_id" uuid NOT NULL,
  "attendance_date" timestamp,
  "medicines_received" json,
  "observations" text,
  "created_at" timestamp
);

CREATE TYPE "provider_request_status" AS ENUM ('PENDIENTE', 'ENVIADA', 'EN_REVISION', 'APROBADA_INTERNA', 'APROBADA', 'RECHAZADA', 'COMPLETADA');
CREATE TYPE "provider_request_type" AS ENUM ('EMERGENCIA', 'RUTINARIA', 'PROYECTO', 'REPOSICION');
CREATE TYPE "provider_priority" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'URGENTE', 'CRITICA');
CREATE TYPE "provider_detail_status" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'ENTREGADO', 'CANCELADO');

CREATE TABLE "provider_requests" (
  "id" uuid PRIMARY KEY,
  "provider_id" uuid NOT NULL,
  "request_date" date DEFAULT (current_date),
  "required_date" date,
  "request_type" provider_request_type DEFAULT 'RUTINARIA',
  "general_priority" provider_priority DEFAULT 'MEDIA',
  "general_justification" text,
  "responsible_name" varchar(200),
  "department" varchar(100),
  "status" provider_request_status DEFAULT 'PENDIENTE',
  "observations" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "provider_request_details" (
  "id" uuid PRIMARY KEY,
  "provider_request_id" uuid NOT NULL,
  "medicine_id" uuid NOT NULL,
  "requested_quantity" integer NOT NULL,
  "priority" provider_priority DEFAULT 'MEDIA',
  "justification" text,
  "status" provider_detail_status DEFAULT 'PENDIENTE',
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "module" varchar(100) NOT NULL,
  "action" varchar(50) NOT NULL,
  "affected_entity" varchar(100) NOT NULL,
  "entity_id" uuid NOT NULL,
  "previous_data" json,
  "new_data" json,
  "client_ip" varchar(50),
  "user_agent" text,
  "created_at" timestamp
);

-- 3. UNIQUE INDEXES
CREATE UNIQUE INDEX ON "medicine_lots" ("medicine_id", "lot_number");
CREATE UNIQUE INDEX ON "request_details" ("request_id", "medicine_id");
CREATE UNIQUE INDEX ON "delivery_details" ("delivery_id", "lot_id");
CREATE UNIQUE INDEX ON "inventories" ("lot_id", "location");
CREATE UNIQUE INDEX ON "beneficiary_vulnerabilities" ("beneficiary_id", "vulnerability_type_id");
CREATE UNIQUE INDEX ON "beneficiary_diseases" ("beneficiary_id", "disease_id");
CREATE UNIQUE INDEX ON "campaign_medicines" ("campaign_id", "medicine_id");
CREATE UNIQUE INDEX ON "campaign_attendances" ("campaign_id", "beneficiary_id");
CREATE UNIQUE INDEX ON "provider_request_details" ("provider_request_id", "medicine_id");

-- 4. FOREIGN KEYS
ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "donors" ADD FOREIGN KEY ("donor_type_id") REFERENCES "donor_types" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "beneficiaries" ADD FOREIGN KEY ("community_id") REFERENCES "communities" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "medicines" ADD FOREIGN KEY ("pharmaceutical_form_id") REFERENCES "pharmaceutical_forms" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "medicines" ADD FOREIGN KEY ("laboratory_id") REFERENCES "laboratories" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "medicines" ADD FOREIGN KEY ("category_id") REFERENCES "medicine_categories" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "donations" ADD FOREIGN KEY ("donor_id") REFERENCES "donors" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "donations" ADD FOREIGN KEY ("donation_type_id") REFERENCES "donation_types" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "donations" ADD FOREIGN KEY ("receiver_user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "medicine_lots" ADD FOREIGN KEY ("medicine_id") REFERENCES "medicines" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "medicine_lots" ADD FOREIGN KEY ("donation_id") REFERENCES "donations" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "medicine_lots" ADD FOREIGN KEY ("inspector_user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "requests" ADD FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "requests" ADD FOREIGN KEY ("disease_id") REFERENCES "diseases" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "requests" ADD FOREIGN KEY ("receiver_user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "requests" ADD FOREIGN KEY ("reviewer_user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "request_details" ADD FOREIGN KEY ("request_id") REFERENCES "requests" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "request_details" ADD FOREIGN KEY ("medicine_id") REFERENCES "medicines" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "deliveries" ADD FOREIGN KEY ("request_id") REFERENCES "requests" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "deliveries" ADD FOREIGN KEY ("delivery_user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "delivery_details" ADD FOREIGN KEY ("delivery_id") REFERENCES "deliveries" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "delivery_details" ADD FOREIGN KEY ("lot_id") REFERENCES "medicine_lots" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "inventories" ADD FOREIGN KEY ("lot_id") REFERENCES "medicine_lots" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "inventory_movements" ADD FOREIGN KEY ("inventory_id") REFERENCES "inventories" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "inventory_movements" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "notifications" ADD FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "community_campaigns" ADD FOREIGN KEY ("community_id") REFERENCES "communities" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "community_campaigns" ADD FOREIGN KEY ("responsible_user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "beneficiary_vulnerabilities" ADD FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "beneficiary_vulnerabilities" ADD FOREIGN KEY ("vulnerability_type_id") REFERENCES "vulnerability_types" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "beneficiary_diseases" ADD FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "beneficiary_diseases" ADD FOREIGN KEY ("disease_id") REFERENCES "diseases" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "request_documents" ADD FOREIGN KEY ("request_id") REFERENCES "requests" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "campaign_medicines" ADD FOREIGN KEY ("campaign_id") REFERENCES "community_campaigns" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "campaign_medicines" ADD FOREIGN KEY ("medicine_id") REFERENCES "medicines" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "campaign_attendances" ADD FOREIGN KEY ("campaign_id") REFERENCES "community_campaigns" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "campaign_attendances" ADD FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "audit_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "provider_requests" ADD FOREIGN KEY ("provider_id") REFERENCES "donors" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "provider_request_details" ADD FOREIGN KEY ("provider_request_id") REFERENCES "provider_requests" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "provider_request_details" ADD FOREIGN KEY ("medicine_id") REFERENCES "medicines" ("id") DEFERRABLE INITIALLY IMMEDIATE;