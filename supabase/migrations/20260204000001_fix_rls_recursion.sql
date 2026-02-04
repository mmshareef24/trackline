-- Fix infinite recursion in users RLS policy
-- The issue is that get_my_org_id() queries the users table, which triggers the "Users can view colleagues" policy,
-- which calls get_accessible_org_ids(), which calls get_my_org_id(), creating an infinite loop.

-- 1. Drop the problematic policy
DROP POLICY IF EXISTS "Users can view colleagues in accessible organizations" ON users;

-- 2. Re-create the policy with a check to prevent recursion
-- We exclude the current user (id != auth.uid()) because they are already covered by "Users can view own profile"
-- and this prevents the recursive check when get_my_org_id() runs.
CREATE POLICY "Users can view colleagues in accessible organizations"
ON users FOR SELECT
USING (
  id != auth.uid() 
  AND 
  organization_id IN (SELECT get_accessible_org_ids())
);

-- 3. Fix Organization Creation Policy
-- Allow users to create a root organization (parent_id is null) if they don't have one
DROP POLICY IF EXISTS "Users can create child organizations" ON organizations;

CREATE POLICY "Users can create organizations"
ON organizations FOR INSERT
WITH CHECK (
  -- Allow creating root orgs (parent_id is null)
  parent_id IS NULL 
  OR 
  -- Allow creating child orgs if you have access to parent
  parent_id IN (SELECT get_accessible_org_ids())
);
