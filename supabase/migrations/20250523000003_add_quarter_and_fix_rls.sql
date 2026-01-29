
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS quarter_name TEXT;

-- Disable RLS to ensure no permission issues during prototype
ALTER TABLE objectives DISABLE ROW LEVEL SECURITY;
ALTER TABLE key_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
