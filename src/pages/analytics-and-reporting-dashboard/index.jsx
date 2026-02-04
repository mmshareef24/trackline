import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import PerformanceChart from './components/PerformanceChart';
import TeamPerformanceGrid from './components/TeamPerformanceGrid';
import ObjectiveBreakdown from './components/ObjectiveBreakdown';
import FilterPanel from './components/FilterPanel';
import ReportExportModal from './components/ReportExportModal';
import TrendAnalysis from './components/TrendAnalysis';

const AnalyticsAndReportingDashboard = () => {
  const { isCollapsed } = useSidebar();
  const { currentOrg } = useAuth();
  const [teams, setTeams] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [filters, setFilters] = useState({
    quarter: 'Q4-2024',
    department: 'all',
    status: 'all',
    includeArchived: false,
    showOnlyMyTeam: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (!currentOrg?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch departments
        const { data: depts } = await supabase
          .from('departments')
          .select('*')
          .eq('organization_id', currentOrg.id);
        
        if (depts) {
          setDepartments(depts);

          // Fetch objectives for calculations
          const { data: objectives } = await supabase
            .from('objectives')
            .select('*, key_results(*)')
            .eq('organization_id', currentOrg.id);

          // Calculate team performance
          const teamStats = depts.map(dept => {
            const deptObjs = objectives?.filter(o => o.department_id === dept.id) || [];
            const totalObjs = deptObjs.length;
            const completedObjs = deptObjs.filter(o => o.status === 'completed' || o.progress === 100).length;
            
            // Calculate average progress
            const avgProgress = totalObjs > 0 
              ? Math.round(deptObjs.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalObjs)
              : 0;

            // Calculate KR stats
            let totalKRs = 0;
            let completedKRs = 0;
            deptObjs.forEach(obj => {
              if (obj.key_results) {
                totalKRs += obj.key_results.length;
                completedKRs += obj.key_results.filter(kr => kr.progress === 100).length;
              }
            });

            return {
              id: dept.id,
              name: dept.name,
              members: 0, // Placeholder as we don't have member count in dept yet
              performance: avgProgress,
              completedObjectives: completedObjs,
              totalObjectives: totalObjs,
              completedKRs: completedKRs,
              totalKRs: totalKRs,
              checkInRate: 0 // Placeholder
            };
          });
          setTeams(teamStats);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentOrg]);

  // Mock data for metrics cards
  const metricsData = [
  {
    title: "Overall Progress",
    value: "78%",
    change: "+12%",
    changeType: "positive",
    icon: "Target",
    description: "Company-wide OKR completion"
  },
  {
    title: "Active Objectives",
    value: "142",
    change: "+8",
    changeType: "positive",
    icon: "Flag",
    description: "Currently tracked objectives"
  },
  {
    title: "Team Engagement",
    value: "89%",
    change: "+5%",
    changeType: "positive",
    icon: "Users",
    description: "Weekly check-in participation"
  },
  {
    title: "At Risk OKRs",
    value: "23",
    change: "-4",
    changeType: "positive",
    icon: "AlertTriangle",
    description: "Objectives requiring attention"
  }];


  // Mock data for performance chart
  const performanceData = [
  { period: 'Week 1', completion: 45, target: 50 },
  { period: 'Week 2', completion: 52, target: 55 },
  { period: 'Week 3', completion: 61, target: 60 },
  { period: 'Week 4', completion: 68, target: 65 },
  { period: 'Week 5', completion: 72, target: 70 },
  { period: 'Week 6', completion: 78, target: 75 },
  { period: 'Week 7', completion: 81, target: 80 },
  { period: 'Week 8', completion: 85, target: 85 }];


  // Mock data for team performance
  const teamsData = [
  {
    id: 1,
    name: "Engineering",
    members: 24,
    performance: 85,
    completedObjectives: 12,
    totalObjectives: 15,
    completedKRs: 34,
    totalKRs: 42,
    checkInRate: 92
  },
  {
    id: 2,
    name: "Marketing",
    members: 18,
    performance: 78,
    completedObjectives: 8,
    totalObjectives: 12,
    completedKRs: 22,
    totalKRs: 30,
    checkInRate: 88
  },
  {
    id: 3,
    name: "Sales",
    members: 32,
    performance: 91,
    completedObjectives: 15,
    totalObjectives: 16,
    completedKRs: 41,
    totalKRs: 45,
    checkInRate: 95
  },
  {
    id: 4,
    name: "Product",
    members: 14,
    performance: 72,
    completedObjectives: 6,
    totalObjectives: 10,
    completedKRs: 18,
    totalKRs: 28,
    checkInRate: 85
  },
  {
    id: 5,
    name: "Human Resources",
    members: 8,
    performance: 88,
    completedObjectives: 7,
    totalObjectives: 8,
    completedKRs: 19,
    totalKRs: 22,
    checkInRate: 100
  },
  {
    id: 6,
    name: "Operations",
    members: 12,
    performance: 76,
    completedObjectives: 9,
    totalObjectives: 13,
    completedKRs: 25,
    totalKRs: 35,
    checkInRate: 83
  }];


  // Mock data for objective breakdown
  const objectiveBreakdownData = [
  { name: 'Completed', value: 89, total: 142 },
  { name: 'On Track', value: 32, total: 142 },
  { name: 'At Risk', value: 15, total: 142 },
  { name: 'Behind', value: 6, total: 142 }];


  // Mock data for trend analysis
  const trendData = [
  { period: 'Jan', overall: 45, onTrack: 65, atRisk: 25 },
  { period: 'Feb', overall: 52, onTrack: 68, atRisk: 22 },
  { period: 'Mar', overall: 58, onTrack: 72, atRisk: 20 },
  { period: 'Apr', overall: 64, onTrack: 75, atRisk: 18 },
  { period: 'May', overall: 69, onTrack: 78, atRisk: 16 },
  { period: 'Jun', overall: 73, onTrack: 80, atRisk: 15 },
  { period: 'Jul', overall: 78, onTrack: 82, atRisk: 14 },
  { period: 'Aug', overall: 81, onTrack: 85, atRisk: 12 }];


  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    console.log('Applied filters:', newFilters);
  };

  const handleExportReport = (exportConfig) => {
    console.log('Exporting report with config:', exportConfig);
    // Simulate export process
    setTimeout(() => {
      alert(`Report "${exportConfig?.reportName}" exported successfully as ${exportConfig?.format?.toUpperCase()}!`);
    }, 1000);
  };

  const handleKeyboardShortcuts = (e) => {
    if (e?.ctrlKey || e?.metaKey) {
      switch (e?.key) {
        case 'e':
          e?.preventDefault();
          setIsExportOpen(true);
          break;
        case 'f':
          e?.preventDefault();
          setIsFilterOpen(true);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, []);

  const filteredTeams = (teams || []).filter(team => {
    if (!team) return false;
    // Safety check for filters
    if (!filters || !filters.department || filters.department === 'all') return true;
    // Check both ID and Name to support legacy and new filters
    return team.id === filters.department || team.name === filters.department;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-8 ${
      isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'}`
      }>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="font-bold text-foreground mb-2 text-2xl">Analytics & Reporting</h1>
              <p className="text-muted-foreground">
                Comprehensive insights and performance analytics for your OKR program
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                iconName="Filter"
                iconPosition="left">

                Filter
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsExportOpen(true)}
                iconName="Download"
                iconPosition="left">

                Export
              </Button>
              <Button iconName="RefreshCw" iconPosition="left">
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Current Filters Display */}
          {(filters?.department !== 'all' || filters?.status !== 'all' || filters?.showOnlyMyTeam) &&
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Filter" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Active Filters:</span>
                  <div className="flex items-center space-x-2">
                    {filters?.department !== 'all' &&
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {filters?.department}
                      </span>
                  }
                    {filters?.status !== 'all' &&
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {filters?.status}
                      </span>
                  }
                    {filters?.showOnlyMyTeam &&
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        My Team Only
                      </span>
                  }
                  </div>
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({
                  quarter: 'Q4-2024',
                  department: 'all',
                  status: 'all',
                  includeArchived: false,
                  showOnlyMyTeam: false
                })}>

                  Clear All
                </Button>
              </div>
            </div>
          }

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) =>
            <MetricsCard key={index} {...metric} />
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PerformanceChart
              title="Progress Trend Analysis"
              data={performanceData}
              height={350} />

            <ObjectiveBreakdown
              title="Objective Status Distribution"
              data={objectiveBreakdownData} />

          </div>

          {/* Trend Analysis */}
          <div className="mb-8">
            <TrendAnalysis
              title="Quarterly Performance Trends"
              data={trendData}
              height={400} />

          </div>

          {/* Team Performance Grid */}
          <div className="mb-8">
            <TeamPerformanceGrid teams={filteredTeams} />
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                iconName="FileText"
                iconPosition="left">

                <div className="text-left">
                  <div className="font-medium">Executive Summary</div>
                  <div className="text-sm text-muted-foreground">Generate leadership report</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                iconName="TrendingUp"
                iconPosition="left">

                <div className="text-left">
                  <div className="font-medium">Performance Deep Dive</div>
                  <div className="text-sm text-muted-foreground">Detailed team analysis</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                iconName="Calendar"
                iconPosition="left">

                <div className="text-left">
                  <div className="font-medium">Schedule Reports</div>
                  <div className="text-sm text-muted-foreground">Automate delivery</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                iconName="Settings"
                iconPosition="left">

                <div className="text-left">
                  <div className="font-medium">Configure Dashboards</div>
                  <div className="text-sm text-muted-foreground">Customize views</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Keyboard" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+E</kbd> Export Report
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+F</kbd> Open Filters
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> Navigate Widgets
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
        departments={departments} />
      <ReportExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExportReport} />
    </div>
  );

};

export default AnalyticsAndReportingDashboard;