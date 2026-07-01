import database from "./database.js";

async function migrate() {
    try {
        console.log("Starting migration...");
        // Add occupation column if not exists
        await database.query(`
            ALTER TABLE beneficiaries 
            ADD COLUMN IF NOT EXISTS occupation varchar(100);
        `);
        console.log("Column occupation added.");

        // Set existing records to "Jubilado"
        await database.query(`
            UPDATE beneficiaries 
            SET occupation = 'Jubilado' 
            WHERE occupation IS NULL;
        `);
        console.log("Existing records updated to Jubilado.");

        // Drop monthly_income column
        await database.query(`
            ALTER TABLE beneficiaries 
            DROP COLUMN IF EXISTS monthly_income;
        `);
        console.log("Column monthly_income dropped.");

        console.log("Migration completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit();
    }
}

migrate();
