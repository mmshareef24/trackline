export const PERMISSION_MODULES = [
  {
    key: 'objectives',
    label: 'Objectives & Key Results',
    permissions: [
      { key: 'view_objectives', label: 'View Objectives' },
      { key: 'create_objectives', label: 'Create Objectives' },
      { key: 'edit_objectives', label: 'Edit Objectives' },
      { key: 'delete_objectives', label: 'Delete Objectives' }
    ]
  },
  {
    key: 'kpis',
    label: 'KPIs',
    permissions: [
      { key: 'view_kpis', label: 'View KPIs' },
      { key: 'manage_kpis', label: 'Manage KPIs' },
      { key: 'update_kpi_values', label: 'Update Values' }
    ]
  },
  {
    key: 'initiatives',
    label: 'Initiatives',
    permissions: [
      { key: 'view_initiatives', label: 'View Initiatives' },
      { key: 'manage_initiatives', label: 'Manage Initiatives' }
    ]
  },
  {
    key: 'users',
    label: 'User Management',
    permissions: [
      { key: 'view_users', label: 'View Users' },
      { key: 'manage_users', label: 'Manage Users & Roles' }
    ]
  },
  {
    key: 'production',
    label: 'Production Module',
    permissions: [
      { key: 'view_production', label: 'View Production' },
      { key: 'manage_production', label: 'Manage Production Orders' },
      { key: 'view_production_metrics', label: 'View Metrics' }
    ]
  },
  {
    key: 'project',
    label: 'Project Module',
    permissions: [
      { key: 'view_projects', label: 'View Projects' },
      { key: 'manage_projects', label: 'Manage Projects' },
      { key: 'manage_budgets', label: 'Manage Budgets' }
    ]
  },
  {
    key: 'finance',
    label: 'Finance Module',
    permissions: [
      { key: 'view_finance', label: 'View Finance' },
      { key: 'manage_transactions', label: 'Manage Transactions' },
      { key: 'view_reports', label: 'View Financial Reports' }
    ]
  },
  {
    key: 'sales',
    label: 'Sales Module',
    permissions: [
      { key: 'view_sales', label: 'View Sales' },
      { key: 'manage_opportunities', label: 'Manage Opportunities' },
      { key: 'view_pipeline', label: 'View Pipeline' }
    ]
  },
  {
    key: 'supply_chain',
    label: 'Supply Chain Module',
    permissions: [
      { key: 'view_inventory', label: 'View Inventory' },
      { key: 'manage_orders', label: 'Manage Orders' },
      { key: 'view_logistics', label: 'View Logistics' }
    ]
  },
  {
    key: 'hr',
    label: 'HR Module',
    permissions: [
      { key: 'view_employees', label: 'View Employees' },
      { key: 'manage_employees', label: 'Manage Employees' },
      { key: 'manage_recruitment', label: 'Manage Recruitment' }
    ]
  },
  {
    key: 'it',
    label: 'IT Module',
    permissions: [
      { key: 'view_tickets', label: 'View Tickets' },
      { key: 'manage_tickets', label: 'Manage Tickets' },
      { key: 'manage_assets', label: 'Manage Assets' }
    ]
  }
];
