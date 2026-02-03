
-- Migration to Enable Row Level Security (RLS) for Multi-Tenancy

-- 1. Create helper function to get current user's organization ID
-- SECURITY DEFINER ensures this runs with owner privileges, bypassing RLS on 'users' table to avoid recursion
CREATE OR REPLACE FUNCTION get_my_org_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT organization_id FROM users WHERE id = auth.uid());
END;
$$;

-- 2. Create helper function to get all accessible organization IDs (recursive down)
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

-- 3. Enable RLS on all multi-tenant tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE objective_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_result_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiative_updates ENABLE ROW LEVEL SECURITY;
-- HR & IT Modules
ALTER TABLE hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_open_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_assets ENABLE ROW LEVEL SECURITY;

-- 4. Define Policies

-- === Organizations ===
-- Users can view their own organization and any descendant organizations
CREATE POLICY "Users can view accessible organizations"
ON organizations FOR SELECT
USING (id IN (SELECT get_accessible_org_ids()));

-- Users can update accessible organizations (e.g. Parent Admin updating Child Org)
CREATE POLICY "Users can update accessible organizations"
ON organizations FOR UPDATE
USING (id IN (SELECT get_accessible_org_ids()));

-- Users can delete accessible organizations
CREATE POLICY "Users can delete accessible organizations"
ON organizations FOR DELETE
USING (id IN (SELECT get_accessible_org_ids()));

-- Users can insert new organizations if they are children of accessible organizations
CREATE POLICY "Users can create child organizations"
ON organizations FOR INSERT
WITH CHECK (parent_id IN (SELECT get_accessible_org_ids()));


-- === Strategic Themes ===
-- Users can view themes of their org and descendants
CREATE POLICY "Users can view accessible strategic themes"
ON strategic_themes FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- Users can manage strategic themes in accessible orgs
CREATE POLICY "Users can manage strategic themes"
ON strategic_themes FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- === Departments ===
CREATE POLICY "Users can view accessible departments"
ON departments FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can manage departments in accessible orgs"
ON departments FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- === Teams ===
CREATE POLICY "Users can view accessible teams"
ON teams FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can manage teams in accessible orgs"
ON teams FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- === Objectives ===
CREATE POLICY "Users can view accessible objectives"
ON objectives FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can manage objectives in accessible orgs"
ON objectives FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- === Key Results ===
-- Visibility depends on the parent objective (which is filtered by accessible orgs)
CREATE POLICY "Users can view key results of accessible objectives"
ON key_results FOR SELECT
USING (objective_id IN (SELECT id FROM objectives));

-- Manage KRs for accessible objectives
CREATE POLICY "Users can manage key results"
ON key_results FOR ALL
USING (objective_id IN (SELECT id FROM objectives));

-- === Initiatives ===
CREATE POLICY "Users can view initiatives of accessible objectives"
ON initiatives FOR SELECT
USING (objective_id IN (SELECT id FROM objectives));

CREATE POLICY "Users can manage initiatives"
ON initiatives FOR ALL
USING (objective_id IN (SELECT id FROM objectives));

-- === Updates (Objectives, KRs, Initiatives) ===
-- Objective Updates
CREATE POLICY "Users can view objective updates"
ON objective_updates FOR SELECT
USING (objective_id IN (SELECT id FROM objectives));

CREATE POLICY "Users can manage objective updates"
ON objective_updates FOR ALL
USING (objective_id IN (SELECT id FROM objectives));

-- Key Result Updates
CREATE POLICY "Users can view key result updates"
ON key_result_updates FOR SELECT
USING (key_result_id IN (SELECT id FROM key_results));

CREATE POLICY "Users can manage key result updates"
ON key_result_updates FOR ALL
USING (key_result_id IN (SELECT id FROM key_results));

-- Initiative Updates
CREATE POLICY "Users can view initiative updates"
ON initiative_updates FOR SELECT
USING (initiative_id IN (SELECT id FROM initiatives));

CREATE POLICY "Users can manage initiative updates"
ON initiative_updates FOR ALL
USING (initiative_id IN (SELECT id FROM initiatives));

-- === Users ===
-- Users can view themselves
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (id = auth.uid());

-- Users can view colleagues in accessible organizations
CREATE POLICY "Users can view colleagues in accessible organizations"
ON users FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (id = auth.uid());

-- Users can manage other users in accessible organizations (Admin function)
-- Note: 'manage' includes INSERT/UPDATE/DELETE
CREATE POLICY "Users can manage colleagues in accessible organizations"
ON users FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- === HR Module ===
CREATE POLICY "Users can view accessible hr employees"
ON hr_employees FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can manage hr employees in accessible orgs"
ON hr_employees FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can view accessible hr positions"
ON hr_open_positions FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can manage hr positions in accessible orgs"
ON hr_open_positions FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

-- === IT Module ===
CREATE POLICY "Users can view accessible it tickets"
ON it_tickets FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can manage it tickets in accessible orgs"
ON it_tickets FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can view accessible it assets"
ON it_assets FOR SELECT
USING (organization_id IN (SELECT get_accessible_org_ids()));

CREATE POLICY "Users can manage it assets in accessible orgs"
ON it_assets FOR ALL
USING (organization_id IN (SELECT get_accessible_org_ids()));
