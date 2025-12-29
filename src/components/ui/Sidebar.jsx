import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useSidebar } from '../../contexts/SidebarContext';

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobile } = useSidebar();
  const navigate = useNavigate();

  const navigationItems = [
    {
      group: 'Core Operations',
      items: [
        {
          label: 'Dashboard',
          path: '/company-okr-dashboard',
          icon: 'LayoutDashboard',
          description: 'Company-wide OKR overview'
        },
        {
          label: 'Objectives',
          path: '/objective-creation-and-management',
          icon: 'Target',
          description: 'Create and manage objectives'
        },
        {
          label: 'Progress',
          path: '/progress-tracking-and-updates',
          icon: 'TrendingUp',
          description: 'Track progress and updates'
        },
        {
          label: 'Production',
          path: '/production-module',
          icon: 'Cog',
          description: 'Factory production overview'
        }
      ]
    },
    {
      group: 'Collaboration',
      items: [
        {
          label: 'Check-ins',
          path: '/team-check-ins-and-collaboration',
          icon: 'Users',
          description: 'Team collaboration and check-ins'
        },
        {
          label: 'Timeline',
          path: '/timeline-and-milestone-management',
          icon: 'Calendar',
          description: 'Milestone and timeline management'
        }
      ]
    },
    {
      group: 'Intelligence',
      items: [
        {
          label: 'Analytics',
          path: '/analytics-and-reporting-dashboard',
          icon: 'BarChart3',
          description: 'Reports and analytics'
        },
        {
          label: 'Balance Scorecard',
          path: '/balanced-scorecard',
          icon: 'PieChart',
          description: 'Balance Scorecard overview'
        }
      ]
    },
    {
      group: 'Business Modules',
      items: [
        {
          label: 'Executive',
          path: '/executive-dashboard',
          icon: 'LayoutDashboard',
          description: 'Cross-module KPIs for leadership'
        },
        {
          label: 'Project',
          path: '/project-module',
          icon: 'KanbanSquare',
          description: 'Portfolio overview and status'
        },
        {
          label: 'Finance',
          path: '/finance-module',
          icon: 'Banknote',
          description: 'Revenue, expenses, and cash flow'
        },
        {
          label: 'Sales',
          path: '/sales-module',
          icon: 'Handshake',
          description: 'Pipeline and opportunities'
        },
        {
          label: 'Supply Chain',
          path: '/supply-chain-module',
          icon: 'Truck',
          description: 'Inventory, OTIF, and purchase orders'
        }
      ]
    },
    {
      group: 'Utilities',
      items: [
        {
          label: 'All Pages',
          path: '/all-pages',
          icon: 'Grid2x2',
          description: 'Index of all application pages'
        }
      ]
    },
    {
      group: 'Administration',
      items: [
        {
          label: 'Users',
          path: '/user-and-permission-management',
          icon: 'Shield',
          description: 'User and permission management'
        },
        {
          label: 'Settings',
          path: '/system-configuration-and-settings',
          icon: 'Settings',
          description: 'System configuration'
        }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobileOpen) closeMobile();
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } hidden md:flex md:flex-col`}>
        
        {/* Collapse Toggle */}
        <div className="flex items-center justify-end p-4 border-b border-border flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        {/* Scrollable Navigation Container */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-6">
            {navigationItems?.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                {!isCollapsed && (
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                    {group?.group}
                  </h3>
                )}
                <div className="space-y-1">
                  {group?.items?.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => handleNavigation(item?.path)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActiveRoute(item?.path)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-foreground hover:bg-muted hover:text-foreground'
                      }`}
                      title={isCollapsed ? item?.label : item?.description}
                    >
                      <Icon 
                        name={item?.icon} 
                        size={18} 
                        className={`flex-shrink-0 ${
                          isActiveRoute(item?.path) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{item?.label}</span>
                      )}
                    </button>
                  ))}
                </div>
                {!isCollapsed && groupIndex < navigationItems?.length - 1 && (
                  <div className="border-t border-border mt-4"></div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Quick Actions - Fixed Bottom */}
        {!isCollapsed && (
          <div className="flex-shrink-0 p-4 border-t border-border">
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Zap" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Quick Actions</span>
              </div>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start h-8" 
                  iconName="Plus" 
                  iconPosition="left"
                  onClick={() => handleNavigation('/objective-creation-and-management')}
                >
                  New OKR
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start h-8" 
                  iconName="MessageSquare" 
                  iconPosition="left"
                  onClick={() => handleNavigation('/team-check-ins-and-collaboration')}
                >
                  Check-in
                </Button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobile}
          />
          {/* Drawer Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Target" size={18} />
                <span className="text-sm font-medium">Navigation</span>
              </div>
              <Button variant="ghost" size="icon" onClick={closeMobile} className="h-8 w-8">
                <Icon name="X" size={16} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="p-3 space-y-6">
                {navigationItems?.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-2">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                      {group?.group}
                    </h3>
                    <div className="space-y-1">
                      {group?.items?.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          onClick={() => handleNavigation(item?.path)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                            isActiveRoute(item?.path)
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'text-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <Icon 
                            name={item?.icon} 
                            size={18} 
                            className={`flex-shrink-0 ${
                              isActiveRoute(item?.path) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                            }`}
                          />
                          <span className="truncate">{item?.label}</span>
                        </button>
                      ))}
                    </div>
                    {groupIndex < navigationItems?.length - 1 && (
                      <div className="border-t border-border mt-4"></div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Quick Actions Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-50 px-4 md:hidden">
        <div className="bg-card border border-border rounded-lg shadow-lg p-2 flex items-center justify-around">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            iconName="Plus"
            iconPosition="left"
            onClick={() => handleNavigation('/objective-creation-and-management')}
          >
            New OKR
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            iconName="MessageSquare"
            iconPosition="left"
            onClick={() => handleNavigation('/team-check-ins-and-collaboration')}
          >
            Check-in
          </Button>
        </div>
      </div>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
        <nav className="flex items-center justify-around py-2">
          {[
            { label: 'Dashboard', path: '/company-okr-dashboard', icon: 'LayoutDashboard' },
            { label: 'Check-ins', path: '/team-check-ins-and-collaboration', icon: 'Users' },
            { label: 'Timeline', path: '/timeline-and-milestone-management', icon: 'Calendar' },
            { label: 'Analytics', path: '/analytics-and-reporting-dashboard', icon: 'BarChart3' },
            { label: 'More', path: '/more', icon: 'MoreHorizontal' }
          ]?.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item?.path === '/more' ? '/all-pages' : item?.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActiveRoute(item?.path)
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item?.icon} size={20} />
              <span className="text-xs font-medium">{item?.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;