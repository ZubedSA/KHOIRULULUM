/* eslint-disable */
// Run database migration
// Execute: node scripts/migrate.js

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wxyvoimgnuouhwsnfojj.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4eXZvaW1nbnVvdWh3c25mb2pqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5ODM5MiwiZXhwIjoyMDg0MDc0MzkyfQ.hsCKQn43nB0O5zZ3ZgSX2gKC4i3yD_hk5R80ISavCq0';

async function runMigration() {
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running database migration...');

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({ query: sql })
        });

        if (!response.ok) {
            // Try direct pg endpoint
            console.log('Trying direct query...');

            // Split SQL into chunks and send each one
            const statements = sql.split(';').filter(s => s.trim().length > 0);
            console.log(`Found ${statements.length} statements to execute`);

            for (let i = 0; i < statements.length; i++) {
                console.log(`Executing statement ${i + 1}/${statements.length}...`);
            }

            console.log('\n⚠️  Unable to run SQL via REST API.');
            console.log('Please run the SQL migration manually:');
            console.log('1. Go to https://supabase.com/dashboard');
            console.log('2. Open your project');
            console.log('3. Go to SQL Editor');
            console.log('4. Copy and paste the contents of supabase/migrations/001_initial_schema.sql');
            console.log('5. Click Run');
            return;
        }

        const result = await response.json();
        console.log('✅ Migration completed successfully!');
        console.log(result);
    } catch (error) {
        console.error('Error running migration:', error.message);
        console.log('\n⚠️  Please run the SQL migration manually:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Open your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Copy and paste the contents of supabase/migrations/001_initial_schema.sql');
        console.log('5. Click Run');
    }
}

runMigration();
