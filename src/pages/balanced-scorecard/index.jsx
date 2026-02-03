import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
          <div className="mt-2 flex items-center justify-between">
            {typeof kpi?.target !== 'undefined' && (
              <div className="text-xs text-muted-foreground">Target: {kpi?.target}</div>
            )}
            {kpi?.route && (
              <Link to={kpi.route} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Icon name="ExternalLink" size={12} /> Open
              </Link>
            )}
          </div>
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
    const moduleKeys = ['finance', 'sales', 'supplyChain', 'production', 'project', 'executive'];

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

      // Supply Chain
      if (
        moduleKey === 'supplyChain' ||
        includesAny(category, ['procurement', 'inventory', 'production & logistics', 'planning & reliability']) ||
        includesAny(label, ['inventory', 'supplier', 'logistics', 'freight', 'yield'])
      ) {
        return 'supplyChain';
      }

      // Learning & Growth
      if (
        moduleKey === 'hr' ||
        includesAny(category, ['hr', 'human resources', 'workforce', 'recruitment', 'development']) ||
        includesAny(label, ['training', 'skill', 'engagement', 'certification', 'headcount', 'turnover', 'hiring'])
      ) {
        return 'learning';
      }

      // Internal Processes (default for operational metrics)
      if (
        moduleKey === 'production' ||
        moduleKey === 'project' ||
        moduleKey === 'it' ||
        includesAny(category, ['production', 'quality', 'schedule', 'cost', 'operations', 'it', 'support']) ||
        includesAny(label, ['cycle time', 'defect', 'downtime', 'throughput', 'deploy', 'uptime', 'ticket'])
      ) {
        return 'internal';
      }

      return 'internal';
    };

    const grouped = {
      financial: [],
      customer: [],
      supplyChain: [],
      internal: [],
      learning: [],
    };

    allKpis.forEach((k) => {
      const perspective = mapToPerspective(k);
      const moduleRouteMap = {
        finance: '/finance-module',
        sales: '/sales-module',
        supplyChain: '/supply-chain-module',
        production: '/production-module',
        project: '/project-module',
        hr: '/hr-module',
        it: '/it-module',
        executive: '/executive-dashboard',
      };
      grouped[perspective].push({
        label: k.label,
        value: k.value ?? '—',
        trend: k.trend,
        pinned: k.pinned ? 1 : 0,
        priority: typeof k.priority === 'number' ? k.priority : 0,
        target: k.target,
        route: moduleRouteMap[k._module],
        module: k._module,
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
      supplyChain: pickTop(grouped.supplyChain, 6),
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
              <Button
                variant="outline"
                icon={<Icon name="Download" />}
                iconPosition="left"
                onClick={() => {
                  const rows = [];
                  const pushRows = (perspectiveKey, items) => {
                    items.forEach((it) => {
                      rows.push({
                        perspective: perspectiveKey,
                        label: it.label,
                        value: it.value,
                        trend: typeof it.trend !== 'undefined' ? it.trend : '',
                        target: typeof it.target !== 'undefined' ? it.target : '',
                        module: it.module || '',
                      });
                    });
                  };
                  pushRows('Financial', data.financial || []);
                  pushRows('Customer', data.customer || []);
                  pushRows('Supply Chain', data.supplyChain || []);
                  pushRows('Internal', data.internal || []);
                  pushRows('Learning', data.learning || []);

                  const headers = ['Perspective','Label','Value','Trend','Target','Module'];
                  const escape = (val) => {
                    const s = String(val ?? '');
                    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
                      return '"' + s.replace(/"/g, '""') + '"';
                    }
                    return s;
                  };
                  const csv = [headers.join(',')]
                    .concat(rows.map(r => headers.map(h => escape(r[h.toLowerCase()])).join(',')))
                    .join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `balanced_scorecard_export_${Date.now()}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PerspectiveCard title="Financial" icon="DollarSign" kpis={data.financial} />
            <PerspectiveCard title="Customer" icon="Users" kpis={data.customer} />
            <PerspectiveCard title="Supply Chain" icon="Truck" kpis={data.supplyChain} />
            <PerspectiveCard title="Internal Processes" icon="Workflow" kpis={data.internal} />
            <PerspectiveCard title="Learning & Growth" icon="GraduationCap" kpis={data.learning} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BalancedScorecard;