import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ObjectivesList = ({ 
  objectives, 
  selectedObjective, 
  onObjectiveSelect, 
  onBulkUpdate,
  filters,
  onFiltersChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState([]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'on-track', label: 'On Track' },
    { value: 'at-risk', label: 'At Risk' },
    { value: 'behind', label: 'Behind' },
    { value: 'completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'text-success bg-success/10';
      case 'at-risk': return 'text-warning bg-warning/10';
      case 'behind': return 'text-error bg-error/10';
      case 'completed': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const filteredObjectives = objectives?.filter(obj => {
    const matchesSearch = obj?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         obj?.owner?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = filters?.status === 'all' || obj?.status === filters?.status;
    const matchesPriority = filters?.priority === 'all' || obj?.priority === filters?.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleBulkSelect = (objectiveId) => {
    setSelectedObjectives(prev => 
      prev?.includes(objectiveId) 
        ? prev?.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  const handleBulkUpdate = () => {
    if (selectedObjectives?.length > 0) {
      onBulkUpdate(selectedObjectives);
      setSelectedObjectives([]);
      setBulkMode(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Objectives</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={bulkMode ? "default" : "outline"}
              size="sm"
              onClick={() => setBulkMode(!bulkMode)}
              iconName="CheckSquare"
              iconPosition="left"
            >
              Bulk
            </Button>
            {bulkMode && selectedObjectives?.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={handleBulkUpdate}
                iconName="Upload"
                iconPosition="left"
              >
                Update ({selectedObjectives?.length})
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3">
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFiltersChange({ ...filters, status: value })}
            placeholder="Filter by status"
          />
          <Select
            options={priorityOptions}
            value={filters?.priority}
            onChange={(value) => onFiltersChange({ ...filters, priority: value })}
            placeholder="Filter by priority"
          />
        </div>
      </div>
      {/* Objectives List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {filteredObjectives?.map((objective) => (
            <div
              key={objective?.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                selectedObjective?.id === objective?.id
                  ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
              }`}
              onClick={() => !bulkMode && onObjectiveSelect(objective)}
            >
              <div className="flex items-start space-x-3">
                {bulkMode && (
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      checked={selectedObjectives?.includes(objective?.id)}
                      onChange={() => handleBulkSelect(objective?.id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {objective?.title}
                    </h3>
                    <Icon 
                      name={getPriorityColor(objective?.priority) === 'text-error' ? 'AlertTriangle' : 'Circle'} 
                      size={12} 
                      className={getPriorityColor(objective?.priority)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{objective?.owner}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(objective?.status)}`}>
                      {objective?.status?.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium text-foreground">{objective?.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          objective?.progress >= 75 ? 'bg-success' :
                          objective?.progress >= 50 ? 'bg-warning' :
                          objective?.progress >= 25 ? 'bg-primary' : 'bg-error'
                        }`}
                        style={{ width: `${objective?.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{objective?.keyResults} KRs</span>
                    <span>Updated {objective?.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">{filteredObjectives?.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {filteredObjectives?.filter(obj => obj?.status === 'on-track')?.length}
            </div>
            <div className="text-xs text-muted-foreground">On Track</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectivesList;