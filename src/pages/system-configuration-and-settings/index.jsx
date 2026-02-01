import React, { useState, useEffect } from 'react';

import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GeneralSettings from './components/GeneralSettings';
import SecuritySettings from './components/SecuritySettings';
import NotificationSettings from './components/NotificationSettings';
import IntegrationSettings from './components/IntegrationSettings';
import DataManagement from './components/DataManagement';
import OrganizationSettings from './components/OrganizationSettings';

const SystemConfigurationAndSettings = () => {
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const tabs = [
  {
    id: 'organization',
    label: 'Organization',
    icon: 'Building',
    description: 'Manage multiple companies and database connection'
  },
  {
    id: 'general',
    label: 'General Settings',
    icon: 'Settings',
    description: 'Company information and system preferences'
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: 'Zap',
    description: 'Third-party service connections and API settings'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'Bell',
    description: 'Email templates and notification rules'
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'Shield',
    description: 'Authentication, permissions, and audit settings'
  },
  {
    id: 'data',
    label: 'Data Management',
    icon: 'Database',
    description: 'Backup, retention, and export policies'
  }];


  const handleTabChange = (tabId) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave this tab?');
      if (!confirmLeave) return;
    }
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
  };

  const handleSaveAll = () => {
    console.log('Saving all configuration changes');
    setHasUnsavedChanges(false);
  };

  const handleResetAll = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.');
    if (confirmReset) {
      console.log('Resetting all settings to defaults');
      setHasUnsavedChanges(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'organization':
        return <OrganizationSettings />;
      case 'general':
        return <GeneralSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'data':
        return <DataManagement />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
      isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'}`
      }>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-bold text-foreground mb-2 text-2xl">System Configuration</h1>
                <p className="text-muted-foreground">
                  Manage system settings, integrations, and administrative configurations
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {hasUnsavedChanges &&
                <div className="flex items-center space-x-2 px-3 py-2 bg-warning/10 text-warning rounded-lg border border-warning/20">
                    <Icon name="AlertTriangle" size={16} />
                    <span className="text-sm font-medium">Unsaved changes</span>
                  </div>
                }
                
                <Button
                  variant="outline"
                  onClick={handleResetAll}
                  iconName="RotateCcw"
                  iconPosition="left">

                  Reset All
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleSaveAll}
                  iconName="Save"
                  iconPosition="left">

                  Save All Changes
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">System Status</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Active Users</span>
                </div>
                <p className="text-lg font-bold text-foreground">247</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Server" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-foreground">Server Load</span>
                </div>
                <p className="text-lg font-bold text-foreground">23%</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-foreground">Uptime</span>
                </div>
                <p className="text-lg font-bold text-foreground">99.9%</p>
              </div>
            </div>
          </div>

          {/* Configuration Tabs */}
          <div className="bg-card border border-border rounded-lg">
            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-0 overflow-x-auto">
                {tabs?.map((tab) =>
                <button
                  key={tab?.id}
                  onClick={() => handleTabChange(tab?.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id ?
                  'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`
                  }>

                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Description */}
            <div className="px-6 py-4 bg-muted/30 border-b border-border">
              <p className="text-sm text-muted-foreground">
                {tabs?.find((tab) => tab?.id === activeTab)?.description}
              </p>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Download" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">System Backup</h3>
                  <p className="text-sm text-muted-foreground">Create a full system backup</p>
                </div>
              </div>
              <Button variant="outline" size="sm" fullWidth iconName="Download" iconPosition="left">
                Create Backup
              </Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">System Logs</h3>
                  <p className="text-sm text-muted-foreground">View system activity logs</p>
                </div>
              </div>
              <Button variant="outline" size="sm" fullWidth iconName="Eye" iconPosition="left">
                View Logs
              </Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Maintenance Mode</h3>
                  <p className="text-sm text-muted-foreground">Enable system maintenance</p>
                </div>
              </div>
              <Button variant="outline" size="sm" fullWidth iconName="Settings" iconPosition="left">
                Enable Mode
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

};

export default SystemConfigurationAndSettings;