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

const SupplyChainModule = () => {
  const { isCollapsed } = useSidebar();
  const [warehouse, setWarehouse] = useState('Riyadh DC');
  const [timeframe, setTimeframe] = useState('Last 30d');

  const warehouseOptions = [
    { value: 'Riyadh DC', label: 'Riyadh DC' },
    { value: 'Jeddah DC', label: 'Jeddah DC' },
    { value: 'Dammam DC', label: 'Dammam DC' },
  ];

  const timeframeOptions = [
    { value: 'Last 7d', label: 'Last 7d' },
    { value: 'Last 30d', label: 'Last 30d' },
    { value: 'Quarter', label: 'Quarter' },
  ];

  const defaultKpis = [
    { label: 'Inventory Turnover', value: '4.8x', icon: 'RotateCcw', trend: 2 },
    { label: 'OTIF', value: '93%', icon: 'PackageCheck', trend: 1 },
    { label: 'Backorders', value: '27', icon: 'ClipboardAlert', trend: -2 },
    { label: 'Lead Time', value: '8.2 days', icon: 'Timer', trend: -1 },
  ];
  const kpis = getModuleKpis('supplyChain', defaultKpis);

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

  const purchaseOrders = [
    { id: 'PO-5001', supplier: 'Supplier X', items: 120, status: 'In Transit', eta: '2025-01-12' },
    { id: 'PO-5002', supplier: 'Supplier Y', items: 80, status: 'Received', eta: '2025-01-05' },
    { id: 'PO-5003', supplier: 'Supplier Z', items: 60, status: 'Delayed', eta: '2025-01-16' },
    { id: 'PO-5004', supplier: 'Supplier W', items: 40, status: 'Planned', eta: '2025-01-22' },
  ];

  const statusBadge = (s) => {
    switch (s) {
      case 'Received': return 'border-success text-success bg-success/10';
      case 'In Transit': return 'border-accent text-accent bg-accent/10';
      case 'Planned': return 'border-muted text-muted-foreground bg-muted/10';
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
              <h1 className="text-2xl font-semibold text-foreground">Supply Chain Module</h1>
              <p className="text-muted-foreground">Inventory, OTIF, and purchase orders</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select options={warehouseOptions} value={warehouse} onChange={setWarehouse} placeholder="Warehouse" />
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
          <ModuleObjectives moduleKey="supply_chain" moduleLabel="Supply Chain" />
          {/* Module Objectives List */}
          <ModuleObjectivesList moduleKey="supply_chain" moduleLabel="Supply Chain" />

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Truck" size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground">Purchase Orders</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">New PO</Button>
                <Button variant="ghost" size="sm" iconName="Filter" iconPosition="left">Filter</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="px-4 py-3 text-muted-foreground font-medium">PO ID</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Supplier</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Items</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="border-b border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{po.id}</td>
                      <td className="px-4 py-3 text-foreground">{po.supplier}</td>
                      <td className="px-4 py-3 text-foreground">{po.items}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(po.status)}`}>{po.status}</span></td>
                      <td className="px-4 py-3 text-muted-foreground">{po.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileText" size={18} className="text-muted-foreground" />
              <h2 className="text-lg font-medium text-foreground">Logistics Notes</h2>
            </div>
            <p className="text-sm text-muted-foreground">Document supplier updates and shipment exceptions.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplyChainModule;