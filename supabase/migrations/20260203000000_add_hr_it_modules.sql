-- 8. HR Module
CREATE TABLE IF NOT EXISTS hr_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  department TEXT,
  position TEXT,
  status TEXT, -- Active, Terminated, On Leave
  hire_date DATE,
  termination_date DATE,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_open_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_code TEXT,
  title TEXT NOT NULL,
  department TEXT,
  status TEXT, -- Open, Closed, On Hold
  applicants_count INT DEFAULT 0,
  posted_date DATE,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. IT Module
CREATE TABLE IF NOT EXISTS it_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT, -- Low, Medium, High, Critical
  status TEXT, -- Open, In Progress, Resolved, Closed
  assignee TEXT,
  requester TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  resolved_date TIMESTAMPTZ,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS it_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_tag TEXT,
  name TEXT NOT NULL,
  type TEXT, -- Laptop, Monitor, Server, License
  status TEXT, -- In Use, Available, Maintenance, Retired
  assigned_to TEXT,
  purchase_date DATE,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for these new tables as per prototype pattern
ALTER TABLE hr_employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE hr_open_positions DISABLE ROW LEVEL SECURITY;
ALTER TABLE it_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE it_assets DISABLE ROW LEVEL SECURITY;
