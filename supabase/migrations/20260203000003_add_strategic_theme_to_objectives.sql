-- Add strategic_theme_id to objectives table
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS strategic_theme_id UUID REFERENCES strategic_themes(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_objectives_strategic_theme ON objectives(strategic_theme_id);
