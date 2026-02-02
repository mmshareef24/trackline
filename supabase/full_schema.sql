
-- Trackline OKR Database Schema (Supabase Postgres)
-- Combined Migration File

-- Extensions (Supabase supports pgcrypto; uuid-ossp may be unavailable)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
DO $$ BEGIN
    CREATE TYPE status_enum AS ENUM ('not_started','in_progress','at_risk','completed','archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_enum AS ENUM ('low','medium','high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE metric_type_enum AS ENUM ('percentage','number','currency','boolean','custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE initiative_type_enum AS ENUM ('project','task','experiment','feature');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE update_type_enum AS ENUM ('milestone','risk','blocker','comment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sentiment_enum AS ENUM ('positive','neutral','negative');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE role_enum AS ENUM ('admin','manager','contributor','viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Organizations (supports multi-tenant; use a single row if not needed)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, name)
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, name)
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role role_enum NOT NULL DEFAULT 'contributor',
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quarters (Q1..Q4 per year)
CREATE TABLE IF NOT EXISTS quarters (
  id SERIAL PRIMARY KEY,
  year INT NOT NULL,
  quarter SMALLINT NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  UNIQUE (year, quarter)
);

-- Objectives
CREATE TABLE IF NOT EXISTS objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  status status_enum NOT NULL DEFAULT 'not_started',
  priority priority_enum NOT NULL DEFAULT 'medium',
  quarter_id INT REFERENCES quarters(id) ON DELETE SET NULL,
  progress INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  start_date DATE,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_objectives_org_quarter_status
  ON objectives (organization_id, quarter_id, status);
CREATE INDEX IF NOT EXISTS idx_objectives_owner
  ON objectives (owner_id);

-- Key Results
CREATE TABLE IF NOT EXISTS key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  metric_type metric_type_enum NOT NULL,
  target NUMERIC,
  current NUMERIC,
  unit TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status status_enum NOT NULL DEFAULT 'not_started',
  priority priority_enum NOT NULL DEFAULT 'medium',
  quarter_id INT REFERENCES quarters(id) ON DELETE SET NULL,
  progress INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_key_results_objective
  ON key_results (objective_id);
CREATE INDEX IF NOT EXISTS idx_key_results_owner
  ON key_results (owner_id);

-- Initiatives
CREATE TABLE IF NOT EXISTS initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  initiative_type initiative_type_enum NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status status_enum NOT NULL DEFAULT 'not_started',
  priority priority_enum NOT NULL DEFAULT 'medium',
  quarter_id INT REFERENCES quarters(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  progress INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_initiatives_objective
  ON initiatives (objective_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_owner
  ON initiatives (owner_id);

-- Updates (split per-entity to preserve foreign keys and cascade behavior)
CREATE TABLE IF NOT EXISTS objective_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
  update_type update_type_enum NOT NULL,
  message TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  progress_delta INT,
  sentiment sentiment_enum,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_objective_updates_obj_created
  ON objective_updates (objective_id, created_at DESC);

CREATE TABLE IF NOT EXISTS key_result_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_result_id UUID NOT NULL REFERENCES key_results(id) ON DELETE CASCADE,
  update_type update_type_enum NOT NULL,
  message TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  progress_delta INT,
  sentiment sentiment_enum,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_key_result_updates_kr_created
  ON key_result_updates (key_result_id, created_at DESC);

CREATE TABLE IF NOT EXISTS initiative_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  update_type update_type_enum NOT NULL,
  message TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  progress_delta INT,
  sentiment sentiment_enum,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_initiative_updates_init_created
  ON initiative_updates (initiative_id, created_at DESC);

-- Optional: Attachments linked to any entity via separate tables or a polymorphic reference
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Attachment links per entity (keeps referential integrity and cascade)
CREATE TABLE IF NOT EXISTS objective_attachments (
  objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
  attachment_id UUID NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
  PRIMARY KEY (objective_id, attachment_id)
);
CREATE TABLE IF NOT EXISTS key_result_attachments (
  key_result_id UUID NOT NULL REFERENCES key_results(id) ON DELETE CASCADE,
  attachment_id UUID NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
  PRIMARY KEY (key_result_id, attachment_id)
);
CREATE TABLE IF NOT EXISTS initiative_attachments (
  initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  attachment_id UUID NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
  PRIMARY KEY (initiative_id, attachment_id)
);

-- Helpful partial indexes for filtering by status and priority
CREATE INDEX IF NOT EXISTS idx_objectives_status_in_progress
  ON objectives (quarter_id, priority) WHERE status = 'in_progress';
CREATE INDEX IF NOT EXISTS idx_key_results_status_at_risk
  ON key_results (objective_id, priority) WHERE status = 'at_risk';

-- Seed one organization and quarter rows (optional; remove if not desired)
INSERT INTO organizations (id, name)
  VALUES (gen_random_uuid(), 'Default Org')
  ON CONFLICT (name) DO NOTHING;

INSERT INTO quarters (year, quarter)
  VALUES (EXTRACT(YEAR FROM NOW())::INT, 1),
         (EXTRACT(YEAR FROM NOW())::INT, 2),
         (EXTRACT(YEAR FROM NOW())::INT, 3),
         (EXTRACT(YEAR FROM NOW())::INT, 4)
  ON CONFLICT (year, quarter) DO NOTHING;

-- Add frontend columns
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS owner_name TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS team_name TEXT;

-- Ensure org exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM organizations LIMIT 1) THEN
        INSERT INTO organizations (id, name) VALUES (gen_random_uuid(), 'Default Org');
    END IF;
END $$;

-- Add quarter name and fix RLS
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS quarter_name TEXT;

-- Disable RLS to ensure no permission issues during prototype
ALTER TABLE objectives DISABLE ROW LEVEL SECURITY;
ALTER TABLE key_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;

-- Complete Application Schema Extension

-- 1. Finance Module
CREATE TABLE IF NOT EXISTS finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT, -- e.g. TX-9001
  account TEXT NOT NULL,
  type TEXT NOT NULL, -- Invoice, Bill, Expense
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL, -- Open, Paid, Posted, Overdue
  transaction_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sales Module
CREATE TABLE IF NOT EXISTS sales_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT, -- e.g. OP-7001
  name TEXT NOT NULL,
  owner_name TEXT, 
  stage TEXT NOT NULL, -- Negotiation, Proposal, Qualified, Discovery
  value NUMERIC NOT NULL,
  close_date DATE,
  probability INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Supply Chain Module
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT,
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit TEXT,
  location TEXT,
  category TEXT,
  status TEXT,
  last_restock_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supply_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT,
  supplier_name TEXT,
  items JSONB, -- Store line items as JSON for flexibility
  total_amount NUMERIC,
  status TEXT, -- Pending, Shipped, Delivered
  expected_delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Production Module
CREATE TABLE IF NOT EXISTS production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL,
  status TEXT NOT NULL, -- Scheduled, In Progress, Completed, Quality Check
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  efficiency_rate NUMERIC, -- KPI for production
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS production_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL, -- OEE, Downtime, Scrap Rate
  value NUMERIC NOT NULL,
  unit TEXT,
  date DATE NOT NULL,
  shift TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Project Module
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT, -- Not Started, In Progress, On Hold, Completed
  priority TEXT, -- Low, Medium, High
  start_date DATE,
  end_date DATE,
  manager_name TEXT,
  budget NUMERIC,
  spent NUMERIC,
  progress INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assignee_name TEXT,
  status TEXT, -- To Do, In Progress, Done
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Dashboard / Generic Metrics (for KPI Cards across modules)
CREATE TABLE IF NOT EXISTS module_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL, -- finance, sales, supply_chain, etc.
  label TEXT NOT NULL, -- Revenue, Pipeline, etc.
  value NUMERIC,
  unit TEXT, -- SAR, %, etc.
  trend NUMERIC, -- Percentage change
  target NUMERIC,
  period TEXT, -- Jan 2025, Q1 2025
  category TEXT, -- For grouping within module
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Knowledge Base
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  author_name TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for all new tables to ensure seamless prototyping
ALTER TABLE finance_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales_opportunities DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE supply_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE production_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE module_kpis DISABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles DISABLE ROW LEVEL SECURITY;

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
