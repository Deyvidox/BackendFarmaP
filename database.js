// db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Opción 1: Usando DATABASE_URL de Supabase (recomendado)
const databaseConfig = process.env.DATABASE_URL 
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false // Importante para Supabase
          }
      }
    : // Opción 2: Variables individuales (para compatibilidad)
      {
          user: process.env.USER || 'postgres',
          host: process.env.HOST || 'localhost',
          database: process.env.DATABASE || 'postgres',
          password: String(process.env.PASSWORD || ''),
          port: parseInt(process.env.PORT_DB) || 5432,
          ssl: process.env.HOST?.includes('supabase') ? { rejectUnauthorized: false } : false
      };

const database = new Pool({
    ...databaseConfig,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 20, // Número máximo de conexiones en el pool
});

database.on('connect', () => {
    console.log('✅ Conexión a PostgreSQL/Supabase establecida');
});

database.on('error', (err) => {
    console.error('❌ Error inesperado en el pool:', err.message);
});

// Función para probar la conexión
async function testConnection() {
    try {
        const client = await database.connect();
        console.log('✅ Conexión exitosa a la base de datos');
        
        // Opcional: Hacer una consulta de prueba
        const result = await client.query('SELECT version()');
        console.log('✅ Versión de PostgreSQL:', result.rows[0].version);
        
        client.release();
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.log('💡 Asegúrate de que:');
        console.log('   1. DATABASE_URL está configurada en .env');
        console.log('   2. La IP está en la allowlist de Supabase');
        console.log('   3. Las credenciales son correctas');
    }
}

// Ejecutar prueba de conexión al iniciar
testConnection();

export default database;