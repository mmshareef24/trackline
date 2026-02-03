
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listColumns() {
  console.log('Listing columns for organizations table...');
  
  // We can't query information_schema easily with supabase-js client on the client side usually
  // But we can select * and see what keys we get
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
  } else {
    if (data && data.length > 0) {
        console.log('Available columns:', Object.keys(data[0]));
    } else {
        console.log('No data found to infer columns.');
    }
  }
}

listColumns();
