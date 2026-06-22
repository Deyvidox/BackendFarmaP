import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function main() {
    try {
        console.log('Connecting to database...');
        const res = await pool.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            ORDER BY table_name, ordinal_position;
        `);
        
        console.log('--- Columns ---');
        const tables = {};
        for (const row of res.rows) {
            if (!tables[row.table_name]) {
                tables[row.table_name] = [];
            }
            tables[row.table_name].push(`${row.column_name} (${row.data_type})`);
        }
        
        for (const [table, cols] of Object.entries(tables)) {
            console.log(`\nTable: ${table}`);
            console.log(`Columns: ${cols.join(', ')}`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error querying database:', err.message);
        process.exit(1);
    }
}

main();
