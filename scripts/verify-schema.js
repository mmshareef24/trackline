
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking if settings column exists in organizations table...');
  
  // Try to select the settings column
  const { data, error } = await supabase
    .from('organizations')
    .select('settings')
    .limit(1);

  if (error) {
    console.error('Error selecting settings column:', error.message);
    if (error.message.includes('does not exist')) {
        console.log('VERDICT: Column "settings" is MISSING.');
    } else {
        console.log('VERDICT: Unknown error, possibly RLS or connectivity.');
    }
  } else {
    console.log('Success! Column "settings" exists.');
    console.log('Data sample:', data);
  }
}

checkSchema();
