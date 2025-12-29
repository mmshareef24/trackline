import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const ProductionModule = () => {
  const { isCollapsed } = useSidebar();
  const [factory, setFactory] = useState('Plant A');
  const [line, setLine] = useState('Line 1');
  const [timeframe, setTimeframe] = useState('Last 24h');

  const factoryOptions = [
    { value: 'Plant A', label: 'Plant A' },
    { value: 'Plant B', label: 'Plant B' },
    { value: 'Plant C', label: 'Plant C' }
  ];

  const lineOptions = [
    { value: 'Line 1', label: 'Line 1' },
    { value: 'Line 2', label: 'Line 2' },
    { value: 'Line 3', label: 'Line 3' }
  ];

  const timeframeOptions = [
    { value: 'Last 24h', label: 'Last 24h' },
    { value: 'Last 7d', label: 'Last 7d' },
    { value: 'Last 30d', label: 'Last 30d' }
  ];

  const kpis = [
    { label: 'OEE', value: '84%', icon: 'Gauge', trend: 2 },
    { label: 'Throughput', value: '1,240 units', icon: 'Activity', trend: 5 },
    { label: 'Downtime', value: '1.8h', icon: 'Timer', trend: -1 },
    { label: 'Defect Rate', value: '0.7%', icon: 'AlertTriangle', trend: -2 }
  ];

  const lines = [
    { name: 'Line 1', status: 'running', utilization: 89, orders: 12 },
    { name: 'Line 2', status: 'maintenance', utilization: 0, orders: 0 },
    { name: 'Line 3', status: 'idle', utilization: 35, orders: 3 }
  ];

  const workOrders = [
    { id: 'WO-1042', product: 'Rebar 12mm', qty: 520, status: 'in-progress', due: '2025-01-04' },
    { id: 'WO-1043', product: 'Sheet Steel 2mm', qty: 300, status: 'queued', due: '2025-01-05' },
    { id: 'WO-1044', product: 'Galvanized Pipe 1"', qty: 850, status: 'in-progress', due: '2025-01-06' },
    { id: 'WO-1045', product: 'Angle Bar 50x50', qty: 220, status: 'completed', due: '2024-12-29' }
  ];

  const statusBadge = (status) => {
    switch (status) {
      case 'running': return 'border-success text-success bg-success/10';
      case 'maintenance': return 'border-warning text-warning bg-warning/10';
      case 'idle': return 'border-muted text-muted-foreground bg-muted/10';
      case 'in-progress': return 'border-primary text-primary bg-primary/10';
      case 'queued': return 'border-accent text-accent bg-accent/10';
      case 'completed': return 'border-foreground text-foreground bg-muted/10';
      default: return 'border-border text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4`}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Production Module</h1>
              <p className="text-muted-foreground">Real-time production status, OEE, and work orders</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select options={factoryOptions} value={factory} onChange={setFactory} placeholder="Select factory" />
              <Select options={lineOptions} value={line} onChange={setLine} placeholder="Select line" />
              <Select options={timeframeOptions} value={timeframe} onChange={setTimeframe} placeholder="Timeframe" />
              <Button variant="outline" icon={<Icon name="Download" />} iconPosition="left">Export</Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis?.map((kpi, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name={kpi?.icon} size={18} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{kpi?.label}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${kpi?.trend >= 0 ? 'border-success text-success' : 'border-error text-error'}`}>
                    {kpi?.trend >= 0 ? `+${kpi?.trend}%` : `${kpi?.trend}%`}
                  </span>
                </div>
                <div className="text-xl font-semibold text-foreground">{kpi?.value}</div>
              </div>
            ))}
          </div>

          {/* Lines status */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Cog" size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground">Production Lines</h2>
              </div>
              <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">Refresh</Button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {lines?.map((l) => (
                <div key={l?.name} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{l?.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(l?.status)}`}>{l?.status?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="text-foreground font-medium">{l?.utilization}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Orders</span>
                    <span className="text-foreground font-medium">{l?.orders}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Orders */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="ClipboardList" size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-medium text-foreground">Work Orders</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">New Order</Button>
                <Button variant="ghost" size="sm" iconName="Filter" iconPosition="left">Filter</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="px-4 py-3 text-muted-foreground font-medium">Order ID</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Product</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Quantity</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders?.map((wo) => (
                    <tr key={wo?.id} className="border-b border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{wo?.id}</td>
                      <td className="px-4 py-3 text-foreground">{wo?.product}</td>
                      <td className="px-4 py-3 text-foreground">{wo?.qty}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(wo?.status)}`}>{wo?.status?.replace('-', ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{wo?.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileText" size={18} className="text-muted-foreground" />
              <h2 className="text-lg font-medium text-foreground">Shift Notes</h2>
            </div>
            <p className="text-sm text-muted-foreground">Add shift highlights, incidents, and maintenance notes here.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductionModule;