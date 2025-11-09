import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ObjectivesList = ({ objectives, onSelectObjective, selectedObjectiveId, onCreateNew }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredObjectives = objectives?.filter(objective => {
    const matchesSearch = objective?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         objective?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || objective?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedObjectives = [...filteredObjectives]?.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'progress':
        return b?.progress - a?.progress;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'draft': return 'text-warning bg-warning/10';
      case 'completed': return 'text-accent bg-accent/10';
      case 'archived': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Objectives</h2>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateNew}
          >
            New Objective
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="px-3 py-1.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-1.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="recent">Recently Updated</option>
            <option value="progress">Progress</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
      {/* Objectives List */}
      <div className="flex-1 overflow-y-auto">
        {sortedObjectives?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Icon name="Target" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No objectives found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || filterStatus !== 'all' ?'Try adjusting your search or filters' :'Create your first objective to get started'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button variant="outline" onClick={onCreateNew} iconName="Plus" iconPosition="left">
                Create Objective
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {sortedObjectives?.map((objective) => (
              <div
                key={objective?.id}
                onClick={() => onSelectObjective(objective)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  selectedObjectiveId === objective?.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground text-sm line-clamp-2 flex-1 mr-2">
                    {objective?.title}
                  </h3>
                  <Icon 
                    name="Flag" 
                    size={14} 
                    className={`flex-shrink-0 ${getPriorityColor(objective?.priority)}`} 
                  />
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {objective?.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(objective?.status)}`}>
                    {objective?.status?.charAt(0)?.toUpperCase() + objective?.status?.slice(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {objective?.progress}% complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${objective?.progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={12} />
                    <span>{objective?.owner}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{objective?.quarter}</span>
                  </div>
                </div>

                {objective?.keyResults && objective?.keyResults?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Icon name="Target" size={12} />
                      <span>{objective?.keyResults?.length} Key Results</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Stats Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {objectives?.filter(o => o?.status === 'active')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {objectives?.filter(o => o?.status === 'completed')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {Math.round(objectives?.reduce((acc, obj) => acc + obj?.progress, 0) / objectives?.length) || 0}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectivesList;