// Central KPI configuration. Override per module to customize cards.
// You can also set window.__KPI_CONFIG__ at runtime to override without rebuild.
// Example (in browser console):
// window.__KPI_CONFIG__ = { project: [ { label: '...', value: '...', icon: '...', trend: 1 } ] }

export default {
  project: [
    // Schedule & Cost
    { label: 'Project Completion (%)', value: '—', unit: 'percent', category: 'Schedule & Cost', priority: 10, icon: 'Percent', pinned: true, target: 100, trend: 0 },
    { label: 'Schedule Variance (Days / %)', value: '—', unit: 'days', category: 'Schedule & Cost', priority: 9, icon: 'Calendar', trend: 0 },
    { label: 'Cost Variance (%)', value: '—', unit: 'percent', category: 'Schedule & Cost', priority: 9, icon: 'Percent', trend: 0 },
    { label: 'CAPEX Utilization (%)', value: '—', unit: 'percent', category: 'Schedule & Cost', priority: 8, icon: 'Wallet', trend: 0 },
    { label: 'Cost Overrun (%)', value: '—', unit: 'percent', category: 'Schedule & Cost', priority: 8, icon: 'AlertTriangle', trend: 0 },
    // Performance & Quality
    { label: 'Milestone Achievement Rate (%)', value: '—', unit: 'percent', category: 'Performance & Quality', priority: 8, icon: 'CheckCircle2', pinned: true, target: 95, trend: 0 },
    { label: 'Change Orders Count', value: '—', unit: 'ratio', category: 'Performance & Quality', priority: 6, icon: 'FileText', trend: 0 },
    { label: 'Rework Cost (%)', value: '—', unit: 'percent', category: 'Performance & Quality', priority: 7, icon: 'Wallet', trend: 0 },
    { label: 'Contractor Performance Score', value: '—', unit: 'ratio', category: 'Performance & Quality', priority: 6, icon: 'Star', trend: 0 },
    // Risk & Compliance
    { label: 'Project Risk Exposure Index', value: '—', unit: 'ratio', category: 'Risk & Compliance', priority: 7, icon: 'Shield', trend: 0 },
    { label: 'Safety Incidents (Projects)', value: '—', unit: 'ratio', category: 'Risk & Compliance', priority: 7, icon: 'AlertTriangle', trend: 0 },
    { label: 'Permit / Compliance Delays', value: '—', unit: 'days', category: 'Risk & Compliance', priority: 6, icon: 'Shield', trend: 0 },
    // Value Realization
    { label: 'Post-Implementation ROI (%)', value: '—', unit: 'percent', category: 'Value Realization', priority: 7, icon: 'Percent', trend: 0 },
    { label: 'Payback Period (Years)', value: '—', unit: 'ratio', category: 'Value Realization', priority: 6, icon: 'Calendar', trend: 0 },
    { label: 'Energy/Cost Savings Achieved vs Planned', value: '—', unit: 'ratio', category: 'Value Realization', priority: 6, icon: 'Flame', trend: 0 },
  ],

  finance: [
    // Profitability
    { label: 'EBITDA Margin (%)', value: '—', unit: 'percent', category: 'Profitability', priority: 10, icon: 'Percent', pinned: true, target: 20, trend: 0 },
    { label: 'Operating Margin (%)', value: '—', unit: 'percent', category: 'Profitability', priority: 9, icon: 'Percent', trend: 0 },
    { label: 'Net Profit Margin (%)', value: '—', unit: 'percent', category: 'Profitability', priority: 9, icon: 'Percent', trend: 0 },
    { label: 'Cost of Production per MT', value: '—', unit: 'sar_per_mt', category: 'Profitability', priority: 8, icon: 'Receipt', trend: 0 },
    { label: 'Conversion Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Profitability', priority: 8, icon: 'Receipt', trend: 0 },
    // Cost Control
    { label: 'Fixed Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Cost Control', priority: 7, icon: 'Receipt', trend: 0 },
    { label: 'Variable Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Cost Control', priority: 7, icon: 'Receipt', trend: 0 },
    { label: 'Energy Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Cost Control', priority: 7, icon: 'Flame', trend: 0 },
    { label: 'Maintenance Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Cost Control', priority: 6, icon: 'Cog', trend: 0 },
    { label: 'Labor Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Cost Control', priority: 6, icon: 'Users', trend: 0 },
    // Working Capital
    { label: 'Cash Conversion Cycle (Days)', value: '—', unit: 'days', category: 'Working Capital', priority: 8, icon: 'RefreshCw', pinned: true, target: 60, trend: 0 },
    { label: 'Days Sales Outstanding (DSO)', value: '—', unit: 'days', category: 'Working Capital', priority: 7, icon: 'Calendar', pinned: true, target: 45, trend: 0 },
    { label: 'Days Inventory Outstanding (DIO)', value: '—', unit: 'days', category: 'Working Capital', priority: 7, icon: 'Calendar', trend: 0 },
    { label: 'Days Payables Outstanding (DPO)', value: '—', unit: 'days', category: 'Working Capital', priority: 7, icon: 'Calendar', trend: 0 },
    { label: 'Working Capital as % of Revenue', value: '—', unit: 'percent', category: 'Working Capital', priority: 6, icon: 'Percent', trend: 0 },
    // Financial Health
    { label: 'Return on Capital Employed (ROCE)', value: '—', unit: 'percent', category: 'Financial Health', priority: 7, icon: 'TrendingUp', trend: 0 },
    { label: 'Debt-to-Equity Ratio', value: '—', unit: 'ratio', category: 'Financial Health', priority: 7, icon: 'BarChart3', trend: 0 },
    { label: 'Interest Coverage Ratio', value: '—', unit: 'ratio', category: 'Financial Health', priority: 6, icon: 'Banknote', trend: 0 },
    { label: 'Current Ratio', value: '—', unit: 'ratio', category: 'Financial Health', priority: 6, icon: 'BarChart3', trend: 0 },
    { label: 'Cash Flow from Operations', value: '—', unit: 'sar', category: 'Financial Health', priority: 6, icon: 'ArrowUpRight', trend: 0 },
    // Compliance & Control
    { label: 'Budget vs Actual Variance', value: '—', unit: 'percent', category: 'Compliance & Control', priority: 6, icon: 'Percent', trend: 0 },
    { label: 'Audit Issues Count', value: '—', unit: 'ratio', category: 'Compliance & Control', priority: 5, icon: 'ClipboardAlert', trend: 0 },
    { label: 'Tax Compliance Rate', value: '—', unit: 'percent', category: 'Compliance & Control', priority: 5, icon: 'CheckCircle2', trend: 0 },
    { label: 'Forex Gain / Loss', value: '—', unit: 'sar', category: 'Compliance & Control', priority: 5, icon: 'Coins', trend: 0 },
  ],

  sales: [
    // Revenue & Volume
    { label: 'Total Sales Revenue', value: '—', unit: 'sar', category: 'Revenue & Volume', priority: 10, icon: 'Banknote', pinned: true, target: 10000000, trend: 0 },
    { label: 'Sales Volume (MT)', value: '—', unit: 'mt', category: 'Revenue & Volume', priority: 9, icon: 'BarChart3', pinned: true, target: 8000, trend: 0 },
    { label: 'Revenue per Metric Ton', value: '—', unit: 'sar_per_mt', category: 'Revenue & Volume', priority: 9, icon: 'Gauge', trend: 0 },
    { label: 'Domestic vs Export Sales (%)', value: '—', unit: 'percent', category: 'Revenue & Volume', priority: 7, icon: 'Globe', trend: 0 },
    { label: 'Product Mix Revenue', value: '—', unit: 'sar', category: 'Revenue & Volume', priority: 7, icon: 'PieChart', trend: 0 },
    // Pricing & Margins
    { label: 'Average Selling Price (ASP per MT)', value: '—', unit: 'sar_per_mt', category: 'Pricing & Margins', priority: 8, icon: 'Tag', trend: 0 },
    { label: 'Gross Margin per MT', value: '—', unit: 'sar_per_mt', category: 'Pricing & Margins', priority: 8, icon: 'Percent', trend: 0 },
    { label: 'Contribution Margin by Product', value: '—', unit: 'percent', category: 'Pricing & Margins', priority: 7, icon: 'Percent', trend: 0 },
    { label: 'Discount Rate (%)', value: '—', unit: 'percent', category: 'Pricing & Margins', priority: 6, icon: 'Percent', trend: 0 },
    { label: 'Price Realization vs Market Index', value: '—', unit: 'percent', category: 'Pricing & Margins', priority: 6, icon: 'TrendingUp', trend: 0 },
    // Customer & Order Performance
    { label: 'Order Intake (MT / Value)', value: '—', unit: 'ratio', category: 'Customer & Order', priority: 7, icon: 'ClipboardList', trend: 0 },
    { label: 'Order Fulfillment Rate (%)', value: '—', unit: 'percent', category: 'Customer & Order', priority: 8, icon: 'CheckCircle2', pinned: true, target: 95, trend: 0 },
    { label: 'On-Time Delivery (OTD %)', value: '—', unit: 'percent', category: 'Customer & Order', priority: 8, icon: 'Timer', pinned: true, target: 95, trend: 0 },
    { label: 'Customer Fill Rate (%)', value: '—', unit: 'percent', category: 'Customer & Order', priority: 7, icon: 'Users', trend: 0 },
    { label: 'Customer Complaints Rate', value: '—', unit: 'ratio', category: 'Customer & Order', priority: 6, icon: 'AlertTriangle', trend: 0 },
    { label: 'Top-10 Customer Revenue Share (%)', value: '—', unit: 'percent', category: 'Customer & Order', priority: 6, icon: 'Trophy', trend: 0 },
    // Sales Effectiveness
    { label: 'Sales Forecast Accuracy (%)', value: '—', unit: 'percent', category: 'Effectiveness', priority: 7, icon: 'Target', trend: 0 },
    { label: 'Quote-to-Order Conversion Rate (%)', value: '—', unit: 'percent', category: 'Effectiveness', priority: 7, icon: 'Handshake', trend: 0 },
    { label: 'Sales Cycle Time (Days)', value: '—', unit: 'days', category: 'Effectiveness', priority: 6, icon: 'Calendar', trend: 0 },
    { label: 'Customer Retention Rate (%)', value: '—', unit: 'percent', category: 'Effectiveness', priority: 6, icon: 'RefreshCw', trend: 0 },
  ],

  supplyChain: [
    // Procurement (Raw Materials & Consumables)
    { label: 'Raw Material Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Procurement', priority: 9, icon: 'Banknote', pinned: true, target: 1200, trend: 0 },
    { label: 'Iron Ore Consumption per MT', value: '—', unit: 'ratio', category: 'Procurement', priority: 7, icon: 'FlaskConical', trend: 0 },
    { label: 'Scrap Consumption per MT', value: '—', unit: 'ratio', category: 'Procurement', priority: 7, icon: 'RefreshCw', trend: 0 },
    { label: 'Supplier On-Time Delivery (%)', value: '—', unit: 'percent', category: 'Procurement', priority: 8, icon: 'Truck', pinned: true, target: 95, trend: 0 },
    { label: 'Purchase Price Variance (PPV)', value: '—', unit: 'percent', category: 'Procurement', priority: 7, icon: 'Percent', trend: 0 },
    { label: 'Procurement Lead Time (Days)', value: '—', unit: 'days', category: 'Procurement', priority: 7, icon: 'Timer', trend: 0 },
    // Inventory
    { label: 'Raw Material Inventory Turnover', value: '—', unit: 'ratio', category: 'Inventory', priority: 7, icon: 'RotateCcw', trend: 0 },
    { label: 'Finished Goods Inventory Turnover', value: '—', unit: 'ratio', category: 'Inventory', priority: 7, icon: 'RotateCcw', trend: 0 },
    { label: 'Inventory Days of Supply (RM / FG)', value: '—', unit: 'days', category: 'Inventory', priority: 8, icon: 'Calendar', pinned: true, target: 30, trend: 0 },
    { label: 'Inventory Carrying Cost (%)', value: '—', unit: 'percent', category: 'Inventory', priority: 7, icon: 'Wallet', trend: 0 },
    { label: 'Stock Obsolescence Rate', value: '—', unit: 'percent', category: 'Inventory', priority: 6, icon: 'Archive', trend: 0 },
    // Production & Logistics Interface
    { label: 'Material Yield (%)', value: '—', unit: 'percent', category: 'Production & Logistics', priority: 8, icon: 'Percent', trend: 0 },
    { label: 'Production Loss (%)', value: '—', unit: 'percent', category: 'Production & Logistics', priority: 7, icon: 'TrendingDown', trend: 0 },
    { label: 'Logistics Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Production & Logistics', priority: 7, icon: 'Truck', trend: 0 },
    { label: 'Inbound Freight Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Production & Logistics', priority: 6, icon: 'Truck', trend: 0 },
    { label: 'Outbound Freight Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Production & Logistics', priority: 6, icon: 'Truck', trend: 0 },
    // Planning & Reliability
    { label: 'Plan vs Actual Production (%)', value: '—', unit: 'percent', category: 'Planning & Reliability', priority: 8, icon: 'BarChart3', pinned: true, target: 98, trend: 0 },
    { label: 'Schedule Adherence (%)', value: '—', unit: 'percent', category: 'Planning & Reliability', priority: 7, icon: 'Calendar', trend: 0 },
    { label: 'Supply Chain Cost as % of Revenue', value: '—', unit: 'percent', category: 'Planning & Reliability', priority: 6, icon: 'Percent', trend: 0 },
    { label: 'Material Shortage Incidents', value: '—', unit: 'ratio', category: 'Planning & Reliability', priority: 6, icon: 'AlertCircle', trend: 0 },
  ],

  production: [
    { label: 'OEE', value: '—', unit: 'percent', category: 'Production', priority: 10, icon: 'Gauge', pinned: true, target: 85, trend: 0 },
    { label: 'Throughput', value: '—', unit: 'units', category: 'Production', priority: 8, icon: 'Activity', pinned: true, target: 10000, trend: 0 },
    { label: 'Downtime', value: '—', unit: 'hours', category: 'Production', priority: 7, icon: 'Timer', pinned: true, target: 20, trend: 0 },
    { label: 'Defect Rate', value: '—', unit: 'percent', category: 'Production', priority: 7, icon: 'AlertTriangle', pinned: true, target: 1, trend: 0 },
  ],

  // Optional: Executive Cross-Module KPIs
  executive: [
    { label: 'Total Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Financial', priority: 10, icon: 'Receipt', pinned: true, target: 1200, trend: 0 },
    { label: 'Revenue per MT', value: '—', unit: 'sar_per_mt', category: 'Financial', priority: 9, icon: 'Banknote', pinned: true, target: 2000, trend: 0 },
    { label: 'EBITDA per MT', value: '—', unit: 'sar_per_mt', category: 'Financial', priority: 9, icon: 'Percent', pinned: true, target: 300, trend: 0 },
    { label: 'Energy Consumption per MT', value: '—', unit: 'kwh_per_mt', category: 'Energy', priority: 8, icon: 'Flame', pinned: true, target: 150, trend: 0 },
    { label: 'CO₂ Emissions per MT', value: '—', unit: 'tco2_per_mt', category: 'Environment', priority: 7, icon: 'Cloud', pinned: true, target: 0.5, trend: 0 },
    { label: 'Overall Equipment Effectiveness (OEE)', value: '—', unit: 'percent', category: 'Production', priority: 10, icon: 'Gauge', pinned: true, target: 85, trend: 0 },
  ],
};