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

const ITModule = () => {
  const { isCollapsed } = useSidebar();
  const [department, setDepartment] = useState('All');
  const [timeframe, setTimeframe] = useState('This Month');

  const departmentOptions = [
    { value: 'All', label: 'All Departments' },
    { value: 'Infrastructure', label: 'Infrastructure' },
    { value: 'Support', label: 'Support' },
    { value: 'DevOps', label: 'DevOps' },
  ];

  const timeframeOptions = [
    { value: 'This Month', label: 'This Month' },
    { value: 'Last Month', label: 'Last Month' },
    { value: 'Quarter', label: 'Quarter' },
  ];

  const defaultKpis = [
    { label: 'System Uptime', value: '99.98%', icon: 'Server', trend: 1 },
    { label: 'Open Tickets', value: '14', icon: 'Ticket', trend: -2 },
    { label: 'Avg Resolution Time', value: '3.5 Hours', icon: 'Clock', trend: 1 },
    { label: 'Security Incidents', value: '0', icon: 'Shield', trend: 0 },
  ];
  const kpis = getModuleKpis('it', defaultKpis);

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

  const activeTickets = [
    { id: 'TKT-501', title: 'VPN Connectivity Issue', priority: 'High', assignee: 'K. Ahmed', status: 'In Progress', createdDate: '2025-02-03' },
    { id: 'TKT-502', title: 'Printer Setup - Finance', priority: 'Low', assignee: 'M. Ali', status: 'Pending', createdDate: '2025-02-02' },
    { id: 'TKT-503', title: 'ERP Login Failure', priority: 'Critical', assignee: 'S. Khan', status: 'Resolved', createdDate: '2025-02-01' },
    { id: 'TKT-504', title: 'New Laptop Request', priority: 'Medium', assignee: 'Procurement', status: 'Approved', createdDate: '2025-01-30' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">IT Module</h1>
              <p className="text-muted-foreground">Systems, support, and infrastructure metrics</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select options={departmentOptions} value={department} onChange={setDepartment} placeholder="Department" />
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
          <ModuleObjectives moduleKey="it" moduleLabel="IT" />
          {/* Module Objectives List */}
          <ModuleObjectivesList moduleKey="it" moduleLabel="IT" />

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Ticket" size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground">Active Tickets</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">New Ticket</Button>
                <Button variant="ghost" size="sm" iconName="Filter" iconPosition="left">Filter</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="px-4 py-3 text-muted-foreground font-medium">ID</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Title</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Priority</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Assignee</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTickets.map((t) => (
                    <tr key={t.id} className="border-b border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{t.id}</td>
                      <td className="px-4 py-3 text-foreground">{t.title}</td>
                      <td className="px-4 py-3 text-foreground">{t.priority}</td>
                      <td className="px-4 py-3 text-foreground">{t.assignee}</td>
                      <td className="px-4 py-3 text-foreground">{t.status}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.createdDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileText" size={18} className="text-muted-foreground" />
              <h2 className="text-lg font-medium text-foreground">IT Notes</h2>
            </div>
            <p className="text-sm text-muted-foreground">Capture incident reports and maintenance schedules.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ITModule;
