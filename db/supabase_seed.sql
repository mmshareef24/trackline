-- Trackline OKR Database Schema (Supabase Postgres)
-- Supabase-compatible version using pgcrypto's gen_random_uuid() for UUID defaults.

-- Extensions (Supabase supports pgcrypto; uuid-ossp may be unavailable)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
CREATE TYPE status_enum AS ENUM ('not_started','in_progress','at_risk','completed','archived');
CREATE TYPE priority_enum AS ENUM ('low','medium','high');
CREATE TYPE metric_type_enum AS ENUM ('percentage','number','currency','boolean');
CREATE TYPE initiative_type_enum AS ENUM ('project','task','experiment','feature');
CREATE TYPE update_type_enum AS ENUM ('milestone','risk','blocker','comment');
CREATE TYPE sentiment_enum AS ENUM ('positive','neutral','negative');
CREATE TYPE role_enum AS ENUM ('admin','manager','contributor','viewer');

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