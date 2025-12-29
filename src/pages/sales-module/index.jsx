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

const SalesModule = () => {
  const { isCollapsed } = useSidebar();
  const [region, setRegion] = useState('KSA');
  const [timeframe, setTimeframe] = useState('This Month');

  const regionOptions = [
    { value: 'KSA', label: 'KSA' },
    { value: 'GCC', label: 'GCC' },
    { value: 'Export', label: 'Export' },
  ];

  const timeframeOptions = [
    { value: 'This Month', label: 'This Month' },
    { value: 'Last Month', label: 'Last Month' },
    { value: 'Quarter', label: 'Quarter' },
  ];

  const defaultKpis = [
    { label: 'Pipeline', value: 'SAR 8.4M', icon: 'Pipeline', trend: 4 },
    { label: 'Won Deals', value: '34', icon: 'Trophy', trend: 2 },
    { label: 'Conversion Rate', value: '21%', icon: 'Gauge', trend: 1 },
    { label: 'Avg Deal Size', value: 'SAR 62k', icon: 'Coins', trend: -1 },
  ];
  const kpis = getModuleKpis('sales', defaultKpis);

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

  const opportunities = [
    { id: 'OP-7001', name: 'Steel Supply - Client A', owner: 'N. Omar', stage: 'Negotiation', value: 320000, closeDate: '2025-01-20' },
    { id: 'OP-7002', name: 'Rebar Contract - Client B', owner: 'L. Khan', stage: 'Proposal', value: 540000, closeDate: '2025-02-05' },
    { id: 'OP-7003', name: 'Sheet Metal - Client C', owner: 'F. Ali', stage: 'Qualified', value: 180000, closeDate: '2025-01-30' },
    { id: 'OP-7004', name: 'Pipe Supply - Client D', owner: 'H. Rahman', stage: 'Discovery', value: 95000, closeDate: '2025-02-14' },
  ];

  const formatSAR = (n) => `SAR ${n.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Sales Module</h1>
              <p className="text-muted-foreground">Pipeline, conversion, and opportunities</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select options={regionOptions} value={region} onChange={setRegion} placeholder="Region" />
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
          <ModuleObjectives moduleKey="sales" moduleLabel="Sales" />
          {/* Module Objectives List */}
          <ModuleObjectivesList moduleKey="sales" moduleLabel="Sales" />

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Handshake" size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground">Opportunities</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">New</Button>
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
                    <th className="px-4 py-3 text-muted-foreground font-medium">Stage</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Value</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Close Date</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((o) => (
                    <tr key={o.id} className="border-b border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{o.id}</td>
                      <td className="px-4 py-3 text-foreground">{o.name}</td>
                      <td className="px-4 py-3 text-foreground">{o.owner}</td>
                      <td className="px-4 py-3 text-foreground">{o.stage}</td>
                      <td className="px-4 py-3 text-foreground">{formatSAR(o.value)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o.closeDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileText" size={18} className="text-muted-foreground" />
              <h2 className="text-lg font-medium text-foreground">Sales Notes</h2>
            </div>
            <p className="text-sm text-muted-foreground">Capture meeting outcomes and next actions.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesModule;