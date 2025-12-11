import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

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

  const data = {
    financial: [
      { label: 'Revenue Growth', value: '12%', trend: 2 },
      { label: 'Gross Margin', value: '48%', trend: 1 },
      { label: 'Operating Income', value: 'SAR 2.4M', trend: -3 },
    ],
    customer: [
      { label: 'NPS', value: '62', trend: 4 },
      { label: 'Customer Retention', value: '88%', trend: 1 },
      { label: 'New Logos', value: '34', trend: 10 },
    ],
    internal: [
      { label: 'Cycle Time', value: '7.2d', trend: -8 },
      { label: 'Defect Rate', value: '0.9%', trend: -2 },
      { label: 'Deploy Frequency', value: '24/wk', trend: 6 },
    ],
    learning: [
      { label: 'Training Hours', value: '480h', trend: 12 },
      { label: 'Skill Certifications', value: '26', trend: 8 },
      { label: 'Engagement Score', value: '78', trend: 3 },
    ],
  };

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