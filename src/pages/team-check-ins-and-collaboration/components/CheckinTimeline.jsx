import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CheckinTimeline = ({ checkins, selectedCheckin, onCheckinSelect, onApproveCheckin, onCommentCheckin }) => {
  const [expandedCheckins, setExpandedCheckins] = useState(new Set());
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const toggleExpanded = (checkinId) => {
    const newExpanded = new Set(expandedCheckins);
    if (newExpanded?.has(checkinId)) {
      newExpanded?.delete(checkinId);
    } else {
      newExpanded?.add(checkinId);
    }
    setExpandedCheckins(newExpanded);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Circle';
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-success/10 text-success border-success/20',
      needs_review: 'bg-error/10 text-error border-error/20',
      draft: 'bg-muted/10 text-muted-foreground border-muted/20'
    };
    
    return styles?.[status] || styles?.draft;
  };

  const filteredCheckins = checkins?.filter(checkin => {
    if (filterPriority === 'all') return true;
    return checkin?.priority === filterPriority;
  });

  const sortedCheckins = [...filteredCheckins]?.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
    }
    return 0;
  });

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Check-in Timeline</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="ghost" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e?.target?.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>
          
          <span className="text-sm text-muted-foreground">{sortedCheckins?.length} check-ins</span>
        </div>
      </div>
      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {sortedCheckins?.map((checkin, index) => (
            <div
              key={checkin?.id}
              className={`relative border border-border rounded-lg transition-all duration-200 hover:shadow-sm ${
                selectedCheckin?.id === checkin?.id ? 'ring-2 ring-primary border-primary' : ''
              }`}
            >
              {/* Timeline Line */}
              {index < sortedCheckins?.length - 1 && (
                <div className="absolute left-6 top-16 w-px h-8 bg-border"></div>
              )}

              {/* Check-in Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => onCheckinSelect(checkin)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Image
                      src={checkin?.author?.avatar}
                      alt={checkin?.author?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${getPriorityColor(checkin?.priority)}`}>
                      <Icon name={getPriorityIcon(checkin?.priority)} size={10} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-foreground">{checkin?.author?.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(checkin?.status)}`}>
                          {checkin?.status?.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{checkin?.submittedAt}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e?.stopPropagation();
                            toggleExpanded(checkin?.id);
                          }}
                        >
                          <Icon 
                            name={expandedCheckins?.has(checkin?.id) ? "ChevronUp" : "ChevronDown"} 
                            size={14} 
                          />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">{checkin?.weekOf}</p>
                    
                    {/* Quick Preview */}
                    <div className="mt-2">
                      <p className="text-sm text-foreground line-clamp-2">{checkin?.summary}</p>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1 text-success">
                        <Icon name="CheckCircle" size={12} />
                        <span className="text-xs">{checkin?.completedTasks} completed</span>
                      </div>
                      {checkin?.blockers > 0 && (
                        <div className="flex items-center space-x-1 text-error">
                          <Icon name="AlertTriangle" size={12} />
                          <span className="text-xs">{checkin?.blockers} blockers</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Icon name="MessageSquare" size={12} />
                        <span className="text-xs">{checkin?.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedCheckins?.has(checkin?.id) && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="mt-4 space-y-4">
                    {/* Progress Updates */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Progress Updates</h4>
                      <p className="text-sm text-muted-foreground">{checkin?.progressUpdate}</p>
                    </div>

                    {/* Blockers */}
                    {checkin?.blockersList && checkin?.blockersList?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Blockers</h4>
                        <ul className="space-y-1">
                          {checkin?.blockersList?.map((blocker, idx) => (
                            <li key={idx} className="text-sm text-error flex items-start space-x-2">
                              <Icon name="AlertTriangle" size={12} className="mt-0.5 flex-shrink-0" />
                              <span>{blocker}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Week Priorities */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Next Week Priorities</h4>
                      <p className="text-sm text-muted-foreground">{checkin?.nextWeekPriorities}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex space-x-2">
                        {checkin?.status === 'pending' && (
                          <Button
                            variant="success"
                            size="sm"
                            iconName="Check"
                            iconPosition="left"
                            onClick={() => onApproveCheckin(checkin?.id)}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="MessageSquare"
                          iconPosition="left"
                          onClick={() => onCommentCheckin(checkin?.id)}
                        >
                          Comment
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" iconName="Share">
                          Share
                        </Button>
                        <Button variant="ghost" size="sm" iconName="MoreHorizontal">
                          More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckinTimeline;