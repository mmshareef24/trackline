-- Cleanup demo data for Trackline (Supabase Postgres)
-- Keeps the organizations row named 'Default Org' but deletes all related demo data.
-- Run in Supabase SQL Editor. Review before execution if you customized names.

BEGIN;

WITH org AS (
  SELECT id FROM organizations WHERE name = 'Default Org'
)
-- Remove update logs first (leaf tables)
DELETE FROM objective_updates WHERE objective_id IN (
  SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
);

DELETE FROM key_result_updates WHERE key_result_id IN (
  SELECT id FROM key_results WHERE objective_id IN (
    SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
  )
);

DELETE FROM initiative_updates WHERE initiative_id IN (
  SELECT id FROM initiatives WHERE objective_id IN (
    SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
  )
);

-- Remove attachment links, then any attachments uploaded by users in this org
DELETE FROM objective_attachments WHERE objective_id IN (
  SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
);

DELETE FROM key_result_attachments WHERE key_result_id IN (
  SELECT id FROM key_results WHERE objective_id IN (
    SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
  )
);

DELETE FROM initiative_attachments WHERE initiative_id IN (
  SELECT id FROM initiatives WHERE objective_id IN (
    SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
  )
);

DELETE FROM attachments WHERE uploaded_by IN (
  SELECT id FROM users WHERE organization_id = (SELECT id FROM org)
);

-- Remove KR/Initiatives/Objectives
DELETE FROM initiatives WHERE objective_id IN (
  SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
);

DELETE FROM key_results WHERE objective_id IN (
  SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
);

DELETE FROM objectives WHERE organization_id = (SELECT id FROM org);

-- Remove users, teams, departments (owners/refs will be nullified by FK rules)
DELETE FROM users WHERE organization_id = (SELECT id FROM org);

DELETE FROM teams WHERE organization_id = (SELECT id FROM org);

DELETE FROM departments WHERE organization_id = (SELECT id FROM org);

-- Optionally: clear quarters (global). Commented out by default.
-- DELETE FROM quarters;

COMMIT;

-- Verification (optional):
-- SELECT 'users' AS table, COUNT(*) FROM users WHERE organization_id = (SELECT id FROM org)
-- UNION ALL
-- SELECT 'objectives', COUNT(*) FROM objectives WHERE organization_id = (SELECT id FROM org)
-- UNION ALL
-- SELECT 'key_results', COUNT(*) FROM key_results WHERE objective_id IN (SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org))
-- UNION ALL
-- SELECT 'initiatives', COUNT(*) FROM initiatives WHERE objective_id IN (SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org));