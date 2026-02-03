
-- Migration to add Multi-Company Support and Strategic Elements

-- 1. Update organizations table for hierarchy and strategy
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'company'; -- 'holding', 'subsidiary', 'business_unit'
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS vision TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS mission TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS "values" TEXT; -- "values" is a reserved word, so quote it

-- 2. Create Strategic Themes table
CREATE TABLE IF NOT EXISTS strategic_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Add index for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_organizations_parent ON organizations(parent_id);

-- 4. Add index for strategic themes
CREATE INDEX IF NOT EXISTS idx_strategic_themes_org ON strategic_themes(organization_id);

-- 5. Disable RLS for new table (for prototype speed)
ALTER TABLE strategic_themes DISABLE ROW LEVEL SECURITY;
