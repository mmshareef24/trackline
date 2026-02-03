-- FIX: Ensure Multi-Company Columns Exist and Reload Schema Cache
-- Run this script in your Supabase SQL Editor to resolve the "Could not find the 'type' column" error.

BEGIN;

-- 1. Add missing columns to 'organizations' table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'company'; -- 'holding', 'subsidiary', 'business_unit'
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS vision TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS mission TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS "values" TEXT;

-- 2. Create 'strategic_themes' table if it doesn't exist
CREATE TABLE IF NOT EXISTS strategic_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_parent ON organizations(parent_id);
CREATE INDEX IF NOT EXISTS idx_strategic_themes_org ON strategic_themes(organization_id);

COMMIT;

-- 4. Force PostgREST to reload the schema cache (Must be outside transaction block in some versions, but works here for Supabase usually)
NOTIFY pgrst, 'reload config';
