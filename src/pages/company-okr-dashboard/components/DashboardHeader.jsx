import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DashboardHeader = ({ onQuarterChange, onSearchChange, onFilterToggle, onCreateNew }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, error

  const quarterOptions = [
    { value: 'Q1', label: 'Q1 2025' },
    { value: 'Q2', label: 'Q2 2025' },
    { value: 'Q3', label: 'Q3 2025' },
    { value: 'Q4', label: 'Q4 2025' }
  ];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    onSearchChange(searchQuery);
  };

  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
    onQuarterChange(quarter);
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing': return 'RefreshCw';
      case 'error': return 'AlertTriangle';
      default: return 'CheckCircle';
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-success';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing': return 'Syncing...';
      case 'error': return 'Sync Error';
      default: return 'All systems synced';
    }
  };

  return (
    <div className="bg-card border-b border-border p-4 md:p-6">
      {/* Top Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
  <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Strategic oversight and goal alignment across all departments
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          {/* Sync Status */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg">
            <Icon 
              name={getSyncStatusIcon()} 
              size={16} 
              className={`${getSyncStatusColor()} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
            />
            <span className="text-sm text-muted-foreground">{getSyncStatusText()}</span>
          </div>

          {/* Create New Dropdown */}
          <div className="relative">
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onCreateNew('objective')}
            >
              Create New
            </Button>
          </div>
        </div>
      </div>
      {/* Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
          {/* Quarter Selector */}
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={20} className="text-muted-foreground" />
            <Select
              options={quarterOptions}
              value={selectedQuarter}
              onChange={handleQuarterChange}
              className="w-28 sm:w-32"
            />
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Search objectives, KRs, initiatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full sm:w-64 md:w-80 pl-10"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded border">
                ⌘K
              </kbd>
            </div>
          </form>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            iconName="Filter"
            iconPosition="left"
            onClick={onFilterToggle}
          >
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          {/* View Options */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="bg-card shadow-sm"
              iconName="LayoutGrid"
            >
              Board
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="List"
            >
              List
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Calendar"
            >
              Timeline
            </Button>
          </div>

          {/* Bulk Actions */}
          <Button
            variant="outline"
            iconName="MoreHorizontal"
            iconPosition="left"
          >
            Bulk Actions
          </Button>

          {/* Export */}
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            iconName="Settings"
          />
        </div>
      </div>
      {/* Quick Stats */}
      <div className="flex items-center flex-wrap gap-4 mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm text-muted-foreground">On Track: 24</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning rounded-full"></div>
          <span className="text-sm text-muted-foreground">At Risk: 8</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error rounded-full"></div>
          <span className="text-sm text-muted-foreground">Behind: 3</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span className="text-sm text-muted-foreground">Completed: 12</span>
        </div>
        <div className="w-full md:w-auto md:ml-auto text-sm text-muted-foreground">
          Last updated: {new Date()?.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;