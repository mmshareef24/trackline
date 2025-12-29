import React, { useMemo, useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { getModuleKpis } from '../../utils/kpiConfig';
import { formatValue, formatTrend, trendClass, formatDelta, deltaClass } from '../../utils/kpiFormat';
import ModuleObjectives from '../../components/ModuleObjectives';
import ModuleObjectivesList from '../../components/ModuleObjectivesList';

const ProjectModule = () => {
  const { isCollapsed } = useSidebar();
  const [portfolio, setPortfolio] = useState('Corporate');
  const [status, setStatus] = useState('All');
  const [timeframe, setTimeframe] = useState('Q1 2025');

  const portfolioOptions = [
    { value: 'Corporate', label: 'Corporate' },
    { value: 'IT', label: 'IT' },
    { value: 'Operations', label: 'Operations' },
  ];

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'On Track', label: 'On Track' },
    { value: 'At Risk', label: 'At Risk' },
    { value: 'Delayed', label: 'Delayed' },
  ];

  const timeframeOptions = [
    { value: 'Q1 2025', label: 'Q1 2025' },
    { value: 'Q2 2025', label: 'Q2 2025' },
    { value: 'FY 2025', label: 'FY 2025' },
  ];

  const defaultKpis = [
    { label: 'Active Projects', value: '18', icon: 'FolderKanban', trend: 3 },
    { label: 'On Track', value: '12', icon: 'CheckCircle2', trend: 1 },
    { label: 'At Risk', value: '4', icon: 'AlertTriangle', trend: -1 },
    { label: 'Budget Used', value: '62%', icon: 'Wallet', trend: 2 },
  ];
  const kpis = getModuleKpis('project', defaultKpis);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTopOnly, setShowTopOnly] = useState(true);

  const categories = useMemo(() => {
    const set = new Set();
    kpis.forEach(k => set.add(k.category || 'General'));
    return ['All', ...Array.from(set)];
  }, [kpis]);

  const displayKpis = useMemo(() => {
    const filtered = selectedCategory === 'All' ? kpis : kpis.filter(k => (k.category || 'General') === selectedCategory);
    const pinned = filtered.filter(k => k.pinned);
    const others = filtered.filter(k => !k.pinned).sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const ordered = [...pinned, ...others];
    return showTopOnly ? ordered.slice(0, 8) : ordered;
  }, [kpis, selectedCategory, showTopOnly]);

  const projects = [
    { id: 'PRJ-101', name: 'ERP Upgrade', owner: 'A. Khan', status: 'On Track', due: '2025-03-15', budgetUsed: 58 },
    { id: 'PRJ-102', name: 'New Warehouse Setup', owner: 'S. Patel', status: 'At Risk', due: '2025-04-10', budgetUsed: 71 },
    { id: 'PRJ-103', name: 'Salesforce Rollout', owner: 'M. Lee', status: 'Delayed', due: '2025-02-28', budgetUsed: 43 },
    { id: 'PRJ-104', name: 'Quality Initiative', owner: 'R. Ahmed', status: 'On Track', due: '2025-05-01', budgetUsed: 22 },
  ];

  const statusBadge = (s) => {
    switch (s) {
      case 'On Track': return 'border-success text-success bg-success/10';
      case 'At Risk': return 'border-warning text-warning bg-warning/10';
      case 'Delayed': return 'border-error text-error bg-error/10';
      default: return 'border-border text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Project Module</h1>
              <p className="text-muted-foreground">Portfolio overview, status, and budgets</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select options={portfolioOptions} value={portfolio} onChange={setPortfolio} placeholder="Portfolio" />
              <Select options={statusOptions} value={status} onChange={setStatus} placeholder="Status" />
              <Select options={timeframeOptions} value={timeframe} onChange={setTimeframe} placeholder="Timeframe" />
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Category</label>
                <select
                  className="bg-card border border-border rounded px-2 py-1 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <label className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
                  <input
                    type="checkbox"
                    checked={showTopOnly}
                    onChange={(e) => setShowTopOnly(e.target.checked)}
                  />
                  Top 8
                </label>
              </div>
              {/* Quick category chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`text-xs px-2 py-1 rounded border ${selectedCategory === c ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <Button variant="outline" icon={<Icon name="Download" />} iconPosition="left">Export</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayKpis.map((kpi, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name={kpi.icon} size={18} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${trendClass(kpi.trend)}`}>
                    {formatTrend(kpi.trend)}
                  </span>
                </div>
                <div className="text-xl font-semibold text-foreground">{formatValue(kpi.value, kpi.unit)}</div>
                {kpi.target !== undefined && kpi.target !== null && (
                  <div className="mt-1 text-xs text-muted-foreground">Target: {formatValue(kpi.target, kpi.unit)}</div>
                )}
                {typeof kpi.value === 'number' && typeof kpi.target === 'number' && (
                  <div className={`mt-0.5 text-xs ${deltaClass(kpi.value - kpi.target)}`}>Δ {formatDelta(kpi.value - kpi.target, kpi.unit)}</div>
                )}
              </div>
            ))}
          </div>

          {/* Module Objectives */}
          <ModuleObjectives moduleKey="project" moduleLabel="Project" />
          {/* Module Objectives List */}
          <ModuleObjectivesList moduleKey="project" moduleLabel="Project" />

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="KanbanSquare" size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground">Projects</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">New Project</Button>
                <Button variant="ghost" size="sm" iconName="Filter" iconPosition="left">Filter</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="px-4 py-3 text-muted-foreground font-medium">ID</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Name</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Owner</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Due</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Budget Used</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-b border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{p.id}</td>
                      <td className="px-4 py-3 text-foreground">{p.name}</td>
                      <td className="px-4 py-3 text-foreground">{p.owner}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(p.status)}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.due}</td>
                      <td className="px-4 py-3 text-foreground">{p.budgetUsed}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileText" size={18} className="text-muted-foreground" />
              <h2 className="text-lg font-medium text-foreground">Notes</h2>
            </div>
            <p className="text-sm text-muted-foreground">Capture project highlights, risks, and decisions.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectModule;