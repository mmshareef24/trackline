import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ObjectiveDetails = ({ objective, onEdit, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!objective) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Icon name="Target" size={48} className="text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Objective Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select an objective from the list to view details
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'keyresults', label: 'Key Results', icon: 'Target' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10 border-success/20';
      case 'draft': return 'text-warning bg-warning/10 border-warning/20';
      case 'completed': return 'text-accent bg-accent/10 border-accent/20';
      case 'archived': return 'text-muted-foreground bg-muted border-border';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const mockActivity = [
    {
      id: 1,
      type: 'progress_update',
      user: 'John Doe',
      message: 'Updated progress on "Increase conversion rate" to 65%',
      timestamp: '2 hours ago',
      icon: 'TrendingUp'
    },
    {
      id: 2,
      type: 'comment',
      user: 'Sarah Johnson',
      message: 'Great progress on the revenue KR! We\'re ahead of schedule.',
      timestamp: '1 day ago',
      icon: 'MessageSquare'
    },
    {
      id: 3,
      type: 'kr_added',
      user: 'Mike Chen',
      message: 'Added new key result: "Reduce customer churn to 5%"',
      timestamp: '3 days ago',
      icon: 'Plus'
    },
    {
      id: 4,
      type: 'objective_created',
      user: 'John Doe',
      message: 'Created this objective',
      timestamp: '1 week ago',
      icon: 'Target'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground">{objective?.title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(objective?.status)}`}>
                {objective?.status?.charAt(0)?.toUpperCase() + objective?.status?.slice(1)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(objective?.priority)}`}>
                {objective?.priority?.charAt(0)?.toUpperCase() + objective?.priority?.slice(1)} Priority
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{objective?.description}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm font-medium text-primary">{objective?.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${objective?.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="User" size={14} />
                <span>{objective?.owner}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{objective?.quarter}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>Updated {objective?.updatedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit} iconName="Edit" iconPosition="left">
              Edit
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Target" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Key Results</span>
                </div>
                <div className="text-2xl font-semibold text-foreground">
                  {objective?.keyResults?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  {objective?.keyResults?.filter(kr => kr?.progress >= 100)?.length || 0} completed
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="TrendingUp" size={16} className="text-success" />
                  <span className="text-sm font-medium text-foreground">Progress</span>
                </div>
                <div className="text-2xl font-semibold text-foreground">{objective?.progress}%</div>
                <div className="text-xs text-muted-foreground">
                  +12% this week
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Calendar" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">Time Left</span>
                </div>
                <div className="text-2xl font-semibold text-foreground">45</div>
                <div className="text-xs text-muted-foreground">days remaining</div>
              </div>
            </div>

            {/* Category and Tags */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Category</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {objective?.category}
                </span>
              </div>

              {objective?.tags && objective?.tags?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {objective?.tags?.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Team Information */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Team</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {objective?.owner?.split(' ')?.map(n => n?.[0])?.join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{objective?.owner}</div>
                    <div className="text-xs text-muted-foreground">Owner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Results Tab */}
        {activeTab === 'keyresults' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Key Results</h3>
              <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
                Add Key Result
              </Button>
            </div>

            {objective?.keyResults && objective?.keyResults?.length > 0 ? (
              <div className="space-y-4">
                {objective?.keyResults?.map((kr, index) => (
                  <div key={kr?.id || index} className="p-4 border border-border rounded-lg bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm mb-1">{kr?.title}</h4>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Current: {kr?.currentValue}{kr?.unit}</span>
                          <span>Target: {kr?.targetValue}{kr?.unit}</span>
                          <span className="text-primary font-medium">{kr?.progress}% complete</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Icon name="MoreHorizontal" size={16} />
                      </Button>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${kr?.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Last updated: 2 days ago</span>
                      <Button variant="ghost" size="sm" iconName="Edit" iconPosition="left">
                        Update Progress
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="Target" size={48} className="text-muted-foreground mb-4 mx-auto" />
                <h4 className="text-lg font-medium text-foreground mb-2">No Key Results</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add key results to track progress on this objective.
                </p>
                <Button variant="outline" iconName="Plus" iconPosition="left">
                  Add First Key Result
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
            
            <div className="space-y-4">
              {mockActivity?.map((activity) => (
                <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={activity?.icon} size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{activity?.user}</span>
                      <span className="text-xs text-muted-foreground">{activity?.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity?.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center py-4">
              <Button variant="ghost" size="sm">
                Load More Activity
              </Button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-foreground">Objective Settings</h3>

            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Visibility</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Control who can view and edit this objective.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="visibility" value="public" defaultChecked className="mr-2" />
                    <span className="text-sm text-foreground">Public - Visible to all team members</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="visibility" value="team" className="mr-2" />
                    <span className="text-sm text-foreground">Team - Visible to team members only</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="visibility" value="private" className="mr-2" />
                    <span className="text-sm text-foreground">Private - Visible to owner only</span>
                  </label>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Notifications</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Configure notification preferences for this objective.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-foreground">Progress updates</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-foreground">Comments and mentions</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-foreground">Weekly reminders</span>
                  </label>
                </div>
              </div>

              <div className="p-4 border border-error/20 rounded-lg bg-error/5">
                <h4 className="font-medium text-error mb-2">Danger Zone</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  These actions cannot be undone.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="text-warning border-warning hover:bg-warning/10">
                    Archive Objective
                  </Button>
                  <Button variant="outline" size="sm" className="text-error border-error hover:bg-error/10">
                    Delete Objective
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectiveDetails;