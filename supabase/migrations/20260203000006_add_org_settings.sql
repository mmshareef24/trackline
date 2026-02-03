-- Add settings column to organizations for storing general preferences
-- Also ensures previous columns exist just in case

BEGIN;

-- 1. Add settings column (JSONB is perfect for flexible configuration)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- 2. Ensure other columns exist (redundant safety check)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS vision TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS mission TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS "values" TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'company';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

COMMIT;

-- 3. Reload schema cache
NOTIFY pgrst, 'reload config';
