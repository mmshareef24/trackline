import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TimelineHeader = ({ 
  currentView, 
  onViewChange, 
  searchQuery, 
  onSearchChange, 
  selectedQuarter, 
  onQuarterChange,
  selectedOwner,
  onOwnerChange,
  onExport,
  onBulkOperations 
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const viewOptions = [
    { value: 'quarterly', label: 'Quarterly View' },
    { value: 'monthly', label: 'Monthly View' },
    { value: 'yearly', label: 'Yearly View' }
  ];

  const quarterOptions = [
    { value: 'all', label: 'All Quarters' },
    { value: 'q1-2025', label: 'Q1 2025' },
    { value: 'q2-2025', label: 'Q2 2025' },
    { value: 'q3-2025', label: 'Q3 2025' },
    { value: 'q4-2025', label: 'Q4 2025' }
  ];

  const ownerOptions = [
    { value: 'all', label: 'All Owners' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-chen', label: 'Mike Chen' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'alex-johnson', label: 'Alex Johnson' }
  ];

  return (
    <div className="bg-card border-b border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and Description */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Timeline & Milestone Management</h1>
          <p className="text-muted-foreground">
            Track quarterly milestones, manage dependencies, and visualize strategic timelines across all objectives
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconPosition="left"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            Filters
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            onClick={onBulkOperations}
          >
            Bulk Actions
          </Button>

          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
          >
            Add Milestone
          </Button>
        </div>
      </div>
      {/* Filters Row */}
      <div className={`mt-6 transition-all duration-300 ${isFiltersOpen ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Input
              type="search"
              placeholder="Search objectives and milestones..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full"
            />
          </div>

          <Select
            placeholder="Select view"
            options={viewOptions}
            value={currentView}
            onChange={onViewChange}
          />

          <Select
            placeholder="Filter by quarter"
            options={quarterOptions}
            value={selectedQuarter}
            onChange={onQuarterChange}
          />

          <Select
            placeholder="Filter by owner"
            options={ownerOptions}
            value={selectedOwner}
            onChange={onOwnerChange}
          />
        </div>
      </div>
      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Total Objectives</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">24</p>
          <p className="text-xs text-muted-foreground">Across all quarters</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Calendar" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Active Milestones</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">18</p>
          <p className="text-xs text-muted-foreground">Due this quarter</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-foreground">At Risk</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">3</p>
          <p className="text-xs text-muted-foreground">Behind schedule</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Completed</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">12</p>
          <p className="text-xs text-muted-foreground">This quarter</p>
        </div>
      </div>
    </div>
  );
};

export default TimelineHeader;