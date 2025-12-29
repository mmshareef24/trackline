import React, { useMemo, useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import Icon from '../../components/AppIcon';
import { getModuleKpis } from '../../utils/kpiConfig';
import { formatValue, formatTrend, trendClass, formatDelta, deltaClass } from '../../utils/kpiFormat';

const ExecutiveDashboard = () => {
  const { isCollapsed } = useSidebar();
  const defaultKpis = [
    { label: 'Total Cost per MT', value: '—', unit: 'sar_per_mt', category: 'Financial', priority: 10, icon: 'Receipt', trend: 0 },
    { label: 'Revenue per MT', value: '—', unit: 'sar_per_mt', category: 'Financial', priority: 9, icon: 'Banknote', trend: 0 },
    { label: 'EBITDA per MT', value: '—', unit: 'sar_per_mt', category: 'Financial', priority: 9, icon: 'Percent', trend: 0 },
    { label: 'Energy Consumption per MT', value: '—', unit: 'kwh_per_mt', category: 'Energy', priority: 8, icon: 'Flame', trend: 0 },
    { label: 'CO₂ Emissions per MT', value: '—', unit: 'tco2_per_mt', category: 'Environment', priority: 7, icon: 'Cloud', trend: 0 },
    { label: 'Overall Equipment Effectiveness (OEE)', value: '—', unit: 'percent', category: 'Production', priority: 10, icon: 'Gauge', trend: 0 },
  ];
  const kpis = getModuleKpis('executive', defaultKpis);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Executive Dashboard</h1>
              <p className="text-muted-foreground">Cross-module KPIs for leadership visibility</p>
            </div>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </main>
    </div>
  );
};

export default ExecutiveDashboard;