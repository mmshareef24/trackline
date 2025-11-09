import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserFilters = ({ 
  searchQuery, 
  onSearchChange, 
  selectedDepartment, 
  onDepartmentChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  totalUsers,
  filteredUsers
}) => {
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const hasActiveFilters = searchQuery || selectedDepartment || selectedRole || selectedStatus;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Search and Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search users by name, email, or department..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers} of {totalUsers} users
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          placeholder="Filter by department"
          options={departmentOptions}
          value={selectedDepartment}
          onChange={onDepartmentChange}
        />
        
        <Select
          placeholder="Filter by role"
          options={roleOptions}
          value={selectedRole}
          onChange={onRoleChange}
        />
        
        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={selectedStatus}
          onChange={onStatusChange}
        />

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Clear Filters
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            title="Refresh users"
            onClick={() => window.location?.reload()}
          >
            <Icon name="RefreshCw" size={18} />
          </Button>
        </div>
      </div>
      {/* Quick Filter Tags */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Search: "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {selectedDepartment && (
              <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                Dept: {departmentOptions?.find(d => d?.value === selectedDepartment)?.label}
                <button
                  onClick={() => onDepartmentChange('')}
                  className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {selectedRole && (
              <span className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                Role: {roleOptions?.find(r => r?.value === selectedRole)?.label}
                <button
                  onClick={() => onRoleChange('')}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                Status: {statusOptions?.find(s => s?.value === selectedStatus)?.label}
                <button
                  onClick={() => onStatusChange('')}
                  className="ml-1 hover:bg-warning/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;