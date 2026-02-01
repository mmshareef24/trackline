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
