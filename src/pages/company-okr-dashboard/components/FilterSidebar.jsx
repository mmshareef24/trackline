import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const quarterOptions = [
    { value: 'all', label: 'All Quarters' },
    { value: 'Q1', label: 'Q1 2025' },
    { value: 'Q2', label: 'Q2 2025' },
    { value: 'Q3', label: 'Q3 2025' },
    { value: 'Q4', label: 'Q4 2025' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'On Track', label: 'On Track' },
    { value: 'At Risk', label: 'At Risk' },
    { value: 'Behind', label: 'Behind' },
    { value: 'Completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' }
  ];

  const ownerOptions = [
    { value: 'all', label: 'All Owners' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Michael Chen', label: 'Michael Chen' },
    { value: 'Emily Rodriguez', label: 'Emily Rodriguez' },
    { value: 'David Kim', label: 'David Kim' },
    { value: 'Lisa Thompson', label: 'Lisa Thompson' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Product', label: 'Product' },
    { value: 'HR', label: 'Human Resources' }
  ];

  const savedFilters = [
    { id: 1, name: 'My Objectives', description: 'Objectives assigned to me' },
    { id: 2, name: 'At Risk Items', description: 'Items that need attention' },
    { id: 3, name: 'Q4 Goals', description: 'Current quarter objectives' },
    { id: 4, name: 'High Priority', description: 'High priority items only' },
    { id: 5, name: 'Engineering Team', description: 'Engineering department goals' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      quarter: 'all',
      status: 'all',
      priority: 'all',
      owner: 'all',
      department: 'all',
      progressMin: 0,
      progressMax: 100,
      search: '',
      showCompleted: true,
      showArchived: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleSavedFilterClick = (filterId) => {
    // Mock implementation - in real app, this would load saved filter settings
    console.log('Loading saved filter:', filterId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />
      {/* Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 w-80 bg-card border-r border-border z-50 overflow-y-auto lg:relative lg:top-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Saved Filters */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Saved Filters</h3>
            <div className="space-y-2">
              {savedFilters?.map((filter) => (
                <button
                  key={filter?.id}
                  onClick={() => handleSavedFilterClick(filter?.id)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="font-medium text-sm text-foreground">{filter?.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{filter?.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <Input
              label="Search"
              type="search"
              placeholder="Search objectives, KRs..."
              value={localFilters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
            />
          </div>

          {/* Quarter */}
          <div>
            <Select
              label="Quarter"
              options={quarterOptions}
              value={localFilters?.quarter}
              onChange={(value) => handleFilterChange('quarter', value)}
            />
          </div>

          {/* Status */}
          <div>
            <Select
              label="Status"
              options={statusOptions}
              value={localFilters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          {/* Priority */}
          <div>
            <Select
              label="Priority"
              options={priorityOptions}
              value={localFilters?.priority}
              onChange={(value) => handleFilterChange('priority', value)}
            />
          </div>

          {/* Owner */}
          <div>
            <Select
              label="Owner"
              options={ownerOptions}
              value={localFilters?.owner}
              onChange={(value) => handleFilterChange('owner', value)}
              searchable
            />
          </div>

          {/* Department */}
          <div>
            <Select
              label="Department"
              options={departmentOptions}
              value={localFilters?.department}
              onChange={(value) => handleFilterChange('department', value)}
            />
          </div>

          {/* Progress Range */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Progress Range
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min %"
                  value={localFilters?.progressMin}
                  onChange={(e) => handleFilterChange('progressMin', parseInt(e?.target?.value) || 0)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max %"
                  value={localFilters?.progressMax}
                  onChange={(e) => handleFilterChange('progressMax', parseInt(e?.target?.value) || 100)}
                  className="flex-1"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Current range: {localFilters?.progressMin}% - {localFilters?.progressMax}%
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Display Options
            </label>
            <div className="space-y-3">
              <Checkbox
                label="Show completed items"
                checked={localFilters?.showCompleted}
                onChange={(e) => handleFilterChange('showCompleted', e?.target?.checked)}
              />
              <Checkbox
                label="Show archived items"
                checked={localFilters?.showArchived}
                onChange={(e) => handleFilterChange('showArchived', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1"
              iconName="Filter"
              iconPosition="left"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;