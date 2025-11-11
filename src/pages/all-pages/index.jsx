import React from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const AllPages = () => {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  const pages = [
    { label: 'Analytics & Reporting', path: '/analytics-and-reporting-dashboard', icon: 'BarChart3', description: 'Comprehensive insights and performance analytics' },
  { label: 'Dashboard', path: '/company-okr-dashboard', icon: 'LayoutDashboard', description: 'Company-wide OKR overview' },
    { label: 'Objective Management', path: '/objective-creation-and-management', icon: 'Target', description: 'Create and manage objectives' },
    { label: 'Progress Tracking', path: '/progress-tracking-and-updates', icon: 'TrendingUp', description: 'Track progress and updates' },
    { label: 'Team Check-ins', path: '/team-check-ins-and-collaboration', icon: 'Users', description: 'Team collaboration and check-ins' },
    { label: 'Timeline & Milestones', path: '/timeline-and-milestone-management', icon: 'Calendar', description: 'Milestone and timeline management' },
    { label: 'User & Permissions', path: '/user-and-permission-management', icon: 'Shield', description: 'User and permission management' },
    { label: 'System Settings', path: '/system-configuration-and-settings', icon: 'Settings', description: 'System configuration and integrations' },
    { label: 'Balanced Scorecard', path: '/balanced-scorecard', icon: 'PieChart', description: 'Four perspectives with KPIs' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-60'} p-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">All Pages</h1>
              <p className="text-muted-foreground">Quick access to every section in the app</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages?.map((page) => (
              <div key={page.path} className="bg-card border border-border rounded-lg shadow-sm p-4 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name={page.icon} size={20} className="text-primary" />
                  <h3 className="text-lg font-medium text-foreground">{page.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{page.description}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="primary" onClick={() => navigate(page.path)}>
                    Open
                  </Button>
                  <Button variant="outline" onClick={() => navigate(page.path)} iconPosition="left" icon={<Icon name="ArrowRight" />}>Go</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllPages;