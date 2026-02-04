
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygzgenatdfmnmhidqcos.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnemdlbmF0ZGZtbm1oaWRxY29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjExMjAsImV4cCI6MjA4NTE5NzEyMH0.GenViHd0Jmc1StwShR7cNqNW5Sw4CJb6K4nbHJ0YVXU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listDepartments() {
  console.log('Fetching departments...');
  const { data, error } = await supabase.from('departments').select('*').order('name');
  
  if (error) {
    console.error('Error fetching departments:', error);
    return;
  }
  
  console.log(`Found ${data.length} departments:`);
  data.forEach(dept => {
    console.log(`- [${dept.id}] ${dept.name}`);
  });
}

listDepartments();
