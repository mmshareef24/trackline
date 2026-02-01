import React, { useMemo, useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useOrganization } from '../../contexts/OrganizationContext';
import { supabase } from '../../utils/supabaseClient';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { getModuleKpis } from '../../utils/kpiConfig';
import { formatValue, formatTrend, trendClass, formatDelta, deltaClass } from '../../utils/kpiFormat';
import ModuleObjectives from '../../components/ModuleObjectives';
import ModuleObjectivesList from '../../components/ModuleObjectivesList';

const ProjectModule = () => {
  const { isCollapsed } = useSidebar();
  const { currentOrg } = useOrganization();
  const [projectsList, setProjectsList] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

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

  useEffect(() => {
    if (currentOrg?.id) {
      fetchProjects();
    } else {
      setProjectsList([]);
    }
  }, [currentOrg?.id]);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', currentOrg.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjectsList(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateProject = async () => {
    if (!currentOrg?.id) return alert('Please select an organization first.');
    
    const name = prompt('Enter Project Name:');
    if (!name) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          organization_id: currentOrg.id,
          status: 'Not Started',
          budget: 0,
          spent: 0,
          progress: 0,
          manager_name: 'Unassigned'
        })
        .select()
        .single();

      if (error) throw error;
      
      setProjectsList(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project: ' + error.message);
    }
  };

  const statusBadge = (s) => {
    const statusLower = s?.toLowerCase() || '';
    if (statusLower.includes('on track') || statusLower === 'in progress') return 'border-success text-success bg-success/10';
    if (statusLower.includes('risk')) return 'border-warning text-warning bg-warning/10';
    if (statusLower.includes('delayed')) return 'border-error text-error bg-error/10';
    return 'border-border text-muted-foreground';
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
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left" onClick={handleCreateProject}>New Project</Button>
                <Button variant="ghost" size="sm" iconName="Filter" iconPosition="left">Filter</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="px-4 py-3 text-muted-foreground font-medium">Name</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Owner</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Due Date</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Budget Used</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingProjects ? (
                    <tr><td colSpan="5" className="px-4 py-4 text-center text-muted-foreground">Loading projects...</td></tr>
                  ) : projectsList.length === 0 ? (
                     <tr><td colSpan="5" className="px-4 py-4 text-center text-muted-foreground">No projects found. Create one to get started.</td></tr>
                  ) : (
                    projectsList.map((p) => {
                      const budgetUsed = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
                      return (
                        <tr key={p.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 text-foreground font-medium">{p.name}</td>
                          <td className="px-4 py-3 text-foreground">{p.manager_name || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(p.status)}`}>{p.status}</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{p.end_date || '-'}</td>
                          <td className="px-4 py-3 text-foreground">
                             <div className="flex items-center gap-2">
                               <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                 <div className="h-full bg-primary" style={{ width: `${Math.min(budgetUsed, 100)}%` }}></div>
                               </div>
                               <span>{budgetUsed}%</span>
                             </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
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