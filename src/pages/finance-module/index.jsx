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

const FinanceModule = () => {
  const { isCollapsed } = useSidebar();
  const [period, setPeriod] = useState('Jan 2025');
  const [department, setDepartment] = useState('All');

  const periodOptions = [
    { value: 'Jan 2025', label: 'Jan 2025' },
    { value: 'Feb 2025', label: 'Feb 2025' },
    { value: 'Q1 2025', label: 'Q1 2025' },
  ];

  const departmentOptions = [
    { value: 'All', label: 'All' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Operations', label: 'Operations' },
    { value: 'IT', label: 'IT' },
  ];

  const defaultKpis = [
    { label: 'Revenue', value: 'SAR 4.2M', icon: 'Banknote', trend: 6 },
    { label: 'Expenses', value: 'SAR 2.9M', icon: 'Receipt', trend: -2 },
    { label: 'Gross Margin', value: '31%', icon: 'Percent', trend: 3 },
    { label: 'Cash Flow', value: 'SAR +410k', icon: 'ArrowUpRight', trend: 1 },
  ];
  const kpis = getModuleKpis('finance', defaultKpis);

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

  const transactions = [
    { id: 'TX-9001', account: 'AR - Customer A', type: 'Invoice', amount: 180000, status: 'Open', date: '2025-01-07' },
    { id: 'TX-9002', account: 'AP - Supplier B', type: 'Bill', amount: 125000, status: 'Paid', date: '2025-01-04' },
    { id: 'TX-9003', account: 'Payroll', type: 'Expense', amount: 89000, status: 'Posted', date: '2025-01-02' },
    { id: 'TX-9004', account: 'AR - Customer C', type: 'Invoice', amount: 240000, status: 'Overdue', date: '2024-12-28' },
  ];

  const statusBadge = (s) => {
    switch (s) {
      case 'Open': return 'border-warning text-warning bg-warning/10';
      case 'Paid': return 'border-success text-success bg-success/10';
      case 'Posted': return 'border-muted text-muted-foreground bg-muted/10';
      case 'Overdue': return 'border-error text-error bg-error/10';
      default: return 'border-border text-muted-foreground';
    }
  };

  const formatSAR = (n) => `SAR ${n.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Finance Module</h1>
              <p className="text-muted-foreground">Revenue, expenses, cash flow, and transactions</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select options={periodOptions} value={period} onChange={setPeriod} placeholder="Period" />
              <Select options={departmentOptions} value={department} onChange={setDepartment} placeholder="Department" />
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
          <ModuleObjectives moduleKey="finance" moduleLabel="Finance" />

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="ListOrdered" size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground">Transactions</h2>
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
                    <th className="px-4 py-3 text-muted-foreground font-medium">Account</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Type</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Amount</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{t.id}</td>
                      <td className="px-4 py-3 text-foreground">{t.account}</td>
                      <td className="px-4 py-3 text-foreground">{t.type}</td>
                      <td className="px-4 py-3 text-foreground">{formatSAR(t.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(t.status)}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileText" size={18} className="text-muted-foreground" />
              <h2 className="text-lg font-medium text-foreground">Finance Notes</h2>
            </div>
            <p className="text-sm text-muted-foreground">Record monthly close comments and reconciliations.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceModule;