import React, { useMemo, useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { getModuleKpis } from '../../utils/kpiConfig';

const PerspectiveCard = ({ title, icon, kpis = [] }) => (
  <div className="bg-card border border-border rounded-lg shadow-sm p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon name={icon} size={18} className="text-primary" />
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {kpis?.map((kpi) => (
        <div key={kpi?.label} className="p-3 rounded-md border border-border bg-muted/10">
          <div className="text-sm text-muted-foreground">{kpi?.label}</div>
          <div className="text-xl font-semibold text-foreground">{kpi?.value}</div>
          {kpi?.trend && (
            <div className={`text-xs mt-1 ${kpi?.trend > 0 ? 'text-success' : kpi?.trend < 0 ? 'text-error' : 'text-muted-foreground'}`}>{kpi?.trend > 0 ? `+${kpi?.trend}%` : `${kpi?.trend}%`} vs last period</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const BalancedScorecard = () => {
  const { isCollapsed } = useSidebar();
  const [quarter, setQuarter] = useState('Q4 2025');

  const quarterOptions = [
    { value: 'Q1 2025', label: 'Q1 2025' },
    { value: 'Q2 2025', label: 'Q2 2025' },
    { value: 'Q3 2025', label: 'Q3 2025' },
    { value: 'Q4 2025', label: 'Q4 2025' }
  ];

  // Build Balanced Scorecard data dynamically from module KPIs
  const data = useMemo(() => {
    const moduleKeys = ['finance', 'sales', 'production', 'project', 'executive'];

    const allKpis = moduleKeys.flatMap((mk) => {
      const list = getModuleKpis(mk, []);
      return (Array.isArray(list) ? list : []).map((k) => ({ ...k, _module: mk }));
    });

    const includesAny = (text, patterns) => {
      const t = (text || '').toLowerCase();
      return patterns.some((p) => t.includes(p.toLowerCase()));
    };

    const mapToPerspective = (kpi) => {
      const moduleKey = kpi._module;
      const category = kpi.category || '';
      const label = kpi.label || '';

      // Financial
      if (
        moduleKey === 'finance' ||
        includesAny(category, ['financial', 'revenue', 'margin', 'cash flow', 'pricing', 'compliance']) ||
        includesAny(label, ['revenue', 'margin', 'profit', 'income'])
      ) {
        return 'financial';
      }

      // Customer
      if (
        moduleKey === 'sales' ||
        includesAny(category, ['customer', 'order', 'sales']) ||
        includesAny(label, ['customer', 'nps', 'retention', 'on-time delivery', 'fill rate', 'order'])
      ) {
        return 'customer';
      }

      // Learning & Growth
      if (includesAny(label, ['training', 'skill', 'engagement', 'certification'])) {
        return 'learning';
      }

      // Internal Processes (default for operational metrics)
      if (
        moduleKey === 'production' ||
        moduleKey === 'project' ||
        includesAny(category, ['production', 'quality', 'schedule', 'cost', 'operations']) ||
        includesAny(label, ['cycle time', 'defect', 'downtime', 'throughput', 'deploy'])
      ) {
        return 'internal';
      }

      return 'internal';
    };

    const grouped = {
      financial: [],
      customer: [],
      internal: [],
      learning: [],
    };

    allKpis.forEach((k) => {
      const perspective = mapToPerspective(k);
      grouped[perspective].push({
        label: k.label,
        value: k.value ?? '—',
        trend: k.trend,
        pinned: k.pinned ? 1 : 0,
        priority: typeof k.priority === 'number' ? k.priority : 0,
      });
    });

    const sortByImportance = (a, b) => {
      if (b.pinned !== a.pinned) return b.pinned - a.pinned;
      return (b.priority || 0) - (a.priority || 0);
    };

    const pickTop = (arr, n = 6) => arr.sort(sortByImportance).slice(0, n);

    return {
      financial: pickTop(grouped.financial, 6),
      customer: pickTop(grouped.customer, 6),
      internal: pickTop(grouped.internal, 6),
      learning: pickTop(grouped.learning, 6),
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Balance Scorecard</h1>
              <p className="text-muted-foreground">Financial, Customer, Internal, and Learning perspectives</p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                options={quarterOptions}
                value={quarter}
                onChange={(val) => setQuarter(val)}
                placeholder="Select quarter"
              />
              <Button variant="outline" icon={<Icon name="Download" />} iconPosition="left">Export</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PerspectiveCard title="Financial" icon="DollarSign" kpis={data.financial} />
            <PerspectiveCard title="Customer" icon="Users" kpis={data.customer} />
            <PerspectiveCard title="Internal Processes" icon="Workflow" kpis={data.internal} />
            <PerspectiveCard title="Learning & Growth" icon="GraduationCap" kpis={data.learning} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BalancedScorecard;