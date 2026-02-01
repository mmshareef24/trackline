-- Add organization_id to all module tables for multi-tenant support
-- Also clears existing data (demo data) as requested

BEGIN;

-- 1. Projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
DELETE FROM projects; -- Clear demo/orphaned data

-- 2. Finance
ALTER TABLE finance_transactions ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
DELETE FROM finance_transactions;

-- 3. Sales
ALTER TABLE sales_opportunities ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
DELETE FROM sales_opportunities;

-- 4. Supply Chain
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE supply_orders ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
DELETE FROM inventory_items;
DELETE FROM supply_orders;

-- 5. Production
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE production_metrics ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
DELETE FROM production_orders;
DELETE FROM production_metrics;

-- 6. KPIs & Knowledge
ALTER TABLE module_kpis ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
DELETE FROM module_kpis;
DELETE FROM knowledge_articles;

COMMIT;
