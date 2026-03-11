/* eslint-disable */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Logging in as admin...');
    // Login as admin
    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@madrasah.com',
        password: 'admin123'
    });

    if (loginError) {
        console.error('Login failed:', loginError.message);
        process.exit(1);
    }

    console.log('Seeding academic years...');

    const years = [
        { name: '2025/2026', start_date: '2025-07-01', end_date: '2026-06-30', is_active: true },
        { name: '2024/2025', start_date: '2024-07-01', end_date: '2025-06-30', is_active: false }
    ];

    for (const year of years) {
        // Check if exists
        const { data: existing } = await supabase
            .from('academic_years')
            .select('id')
            .eq('name', year.name)
            .single();

        if (!existing) {
            const { error } = await supabase
                .from('academic_years')
                .insert(year);

            if (error) console.error('Error seeding year:', year.name, error.message);
            else console.log('Seeded year:', year.name);
        } else {
            console.log('Year already exists:', year.name);
        }
    }
}

seed();
