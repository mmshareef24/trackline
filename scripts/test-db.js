import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Testing connection to:', supabaseUrl)

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('organizations').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Connection failed:', error.message)
      if (error.code) console.error('Error code:', error.code)
      if (error.hint) console.error('Hint:', error.hint)
    } else {
      console.log('Connection successful! Database is reachable.')
      console.log('Successfully queried "organizations" table.')
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testConnection()
