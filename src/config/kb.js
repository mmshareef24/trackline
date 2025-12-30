export const kbArticles = [
  {
    id: 'getting-started',
    title: 'Getting Started with JASCO Insight',
    summary: 'Overview of login, navigation, and key dashboards.',
    tags: ['intro', 'navigation'],
    content: `
Welcome to JASCO Insight.

1) Sign in to access your dashboards.
2) Use the top header for search, notifications, and profile.
3) Key pages:
   - Analytics & Reporting: company-wide metrics.
   - Balanced Scorecard: four perspectives plus Supply Chain.
   - Module pages: Production, Project, Finance, Sales, Supply Chain.

Tip: Start with the Balanced Scorecard to review overall performance.
    `,
  },
  {
    id: 'balanced-scorecard',
    title: 'Balanced Scorecard Basics',
    summary: 'Perspectives, KPI tiles, drill-downs, and CSV export.',
    tags: ['scorecard', 'kpi'],
    content: `
The Balanced Scorecard shows KPIs grouped by perspectives:
- Financial, Customer, Internal, Learning & Growth, and Supply Chain.

• Click a KPI tile to drill down into its module page.
• Targets are displayed on KPI tiles.
• Use the Export CSV button to download current KPIs.

Mapping: KPIs are sourced from modules as configured in src/config/kpis.js.
    `,
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain Module Overview',
    summary: 'Inbound/outbound logistics, inventory turns, OTIF, and lead times.',
    tags: ['supply-chain', 'logistics'],
    content: `
Supply Chain KPIs include inventory levels, turns, OTIF, and lead times.
From the Balanced Scorecard, open the Supply Chain perspective and click a tile to drill down.
Focus areas: vendor performance, warehouse throughput, and delivery reliability.
    `,
  },
  {
    id: 'drilldown-export',
    title: 'Drill-down and CSV Export',
    summary: 'Navigate to module pages and export KPIs.',
    tags: ['navigation', 'export'],
    content: `
• Click KPI tiles to navigate to the correct module page.
• Export CSV from Balanced Scorecard to share with stakeholders.
• CSV includes KPI labels, values, units, targets, and module information.
    `,
  },
  {
    id: 'ai-tips',
    title: 'AI Assistant Tips',
    summary: 'Ask practical questions and get step-by-step guidance.',
    tags: ['ai', 'assistant'],
    content: `
Examples:
- "What KPIs should I check before the weekly review?"
- "Guide me to export Finance KPIs to CSV."
- "Explain Inventory Turns and how to improve it."

If the assistant does not respond, ensure OPENAI_API_KEY is configured in deployment.
    `,
  },
  {
    id: 'roles-permissions',
    title: 'User Roles & Permissions',
    summary: 'Access control for dashboards and actions.',
    tags: ['auth', 'permissions'],
    content: `
Access to pages is protected. Sign in to view dashboards.
Roles determine who can create objectives, update progress, and view sensitive KPIs.
Contact your administrator to adjust roles and permissions.
    `,
  },
];

export default kbArticles;