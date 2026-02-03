
-- 0. Ensure helper functions exist (Dependencies from previous migration)
-- These are required for the policies below.

CREATE OR REPLACE FUNCTION get_my_org_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT organization_id FROM users WHERE id = auth.uid());
END;
$$;

CREATE OR REPLACE FUNCTION get_accessible_org_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH RECURSIVE org_tree AS (
    -- Base case: User's own organization
    SELECT id FROM organizations WHERE id = get_my_org_id()
    UNION
    -- Recursive case: Children of accessible organizations
    SELECT o.id FROM organizations o
    INNER JOIN org_tree ot ON o.parent_id = ot.id
  )
  SELECT id FROM org_tree;
$$;

-- 1. Create roles table for dynamic role management
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}'::jsonb, -- Stores module-level access and specific permissions
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- 2. Add role_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;

-- 3. Enable RLS on roles
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for roles
CREATE POLICY "Users can view roles in accessible orgs"
ON roles FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can manage roles in accessible orgs"
ON roles FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- 5. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
