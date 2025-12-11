-- Cleanup script to remove Objectives, Key Results, Initiatives, Updates,
-- and related attachments for a single organization, while PRESERVING
-- users, teams, and departments.
--
-- Usage:
-- 1) Set the organization name below (default 'Default Org').
-- 2) Run in Supabase SQL editor.
--
-- Notes:
-- - This targets one org by name; adjust if you prefer by id.
-- - It removes attachments that are linked ONLY to the deleted entities.
-- - It keeps users/teams/departments intact.

BEGIN;

-- Change this to your target organization name
WITH org AS (
  SELECT id FROM organizations WHERE name = 'Default Org'
),
org_objectives AS (
  SELECT id FROM objectives WHERE organization_id = (SELECT id FROM org)
),
org_key_results AS (
  SELECT id FROM key_results WHERE objective_id IN (SELECT id FROM org_objectives)
),
org_initiatives AS (
  SELECT id FROM initiatives WHERE objective_id IN (SELECT id FROM org_objectives)
),
obj_attach AS (
  SELECT attachment_id FROM objective_attachments WHERE objective_id IN (SELECT id FROM org_objectives)
),
kr_attach AS (
  SELECT attachment_id FROM key_result_attachments WHERE key_result_id IN (SELECT id FROM org_key_results)
),
init_attach AS (
  SELECT attachment_id FROM initiative_attachments WHERE initiative_id IN (SELECT id FROM org_initiatives)
),
all_attach AS (
  SELECT attachment_id FROM obj_attach
  UNION
  SELECT attachment_id FROM kr_attach
  UNION
  SELECT attachment_id FROM init_attach
)

-- Remove update rows linked to org objectives/KRs/initiatives
DELETE FROM objective_updates
WHERE objective_id IN (SELECT id FROM org_objectives);

DELETE FROM key_result_updates
WHERE key_result_id IN (SELECT id FROM org_key_results);

DELETE FROM initiative_updates
WHERE initiative_id IN (SELECT id FROM org_initiatives);

-- Remove attachment link rows first
DELETE FROM objective_attachments
WHERE objective_id IN (SELECT id FROM org_objectives);

DELETE FROM key_result_attachments
WHERE key_result_id IN (SELECT id FROM org_key_results);

DELETE FROM initiative_attachments
WHERE initiative_id IN (SELECT id FROM org_initiatives);

-- Remove attachments that were linked to deleted entities
DELETE FROM attachments
WHERE id IN (SELECT attachment_id FROM all_attach);

-- Remove initiatives, KRs, and objectives (order matters to avoid FK errors)
DELETE FROM initiatives
WHERE id IN (SELECT id FROM org_initiatives);

DELETE FROM key_results
WHERE id IN (SELECT id FROM org_key_results);

DELETE FROM objectives
WHERE id IN (SELECT id FROM org_objectives);

COMMIT;