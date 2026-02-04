import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, onApplyFilters, currentFilters, departments = [] }) => {
  const [filters, setFilters] = useState(currentFilters);

  const quarterOptions = [
    { value: 'Q4-2024', label: 'Q4 2024' },
    { value: 'Q3-2024', label: 'Q3 2024' },
    { value: 'Q2-2024', label: 'Q2 2024' },
    { value: 'Q1-2024', label: 'Q1 2024' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments.map(dept => ({
      value: dept.id, // Use ID as value for better matching
      label: dept.name
    }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'on-track', label: 'On Track' },
    { value: 'at-risk', label: 'At Risk' },
    { value: 'behind', label: 'Behind' },
    { value: 'completed', label: 'Completed' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      quarter: 'Q4-2024',
      department: 'all',
      status: 'all',
      includeArchived: false,
      showOnlyMyTeam: false
    };
    setFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Filter Reports</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Select
              label="Quarter"
              options={quarterOptions}
              value={filters?.quarter}
              onChange={(value) => handleFilterChange('quarter', value)}
            />
          </div>

          <div>
            <Select
              label="Department"
              options={departmentOptions}
              value={filters?.department}
              onChange={(value) => handleFilterChange('department', value)}
            />
          </div>

          <div>
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          <div className="space-y-3">
            <Checkbox
              label="Include archived objectives"
              checked={filters?.includeArchived}
              onChange={(e) => handleFilterChange('includeArchived', e?.target?.checked)}
            />
            <Checkbox
              label="Show only my team's data"
              checked={filters?.showOnlyMyTeam}
              onChange={(e) => handleFilterChange('showOnlyMyTeam', e?.target?.checked)}
            />
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="font-medium text-foreground mb-3">Quick Filters</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleFilterChange('status', 'at-risk')}
              >
                At Risk Only
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleFilterChange('status', 'completed')}
              >
                Completed Only
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  handleFilterChange('quarter', 'Q4-2024');
                  handleFilterChange('showOnlyMyTeam', true);
                }}
              >
                My Team Q4
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;