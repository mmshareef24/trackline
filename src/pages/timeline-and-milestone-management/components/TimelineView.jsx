import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimelineView = ({ objectives, currentView, onMilestoneUpdate, onDependencyChange }) => {
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [draggedMilestone, setDraggedMilestone] = useState(null);
  const timelineRef = useRef(null);
  const [timelineWidth, setTimelineWidth] = useState(0);

  useEffect(() => {
    if (timelineRef?.current) {
      setTimelineWidth(timelineRef?.current?.scrollWidth);
    }
  }, [currentView]);

  const getTimelineColumns = () => {
    if (currentView === 'quarterly') {
      return ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];
    } else if (currentView === 'monthly') {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    return ['2024', '2025', '2026', '2027'];
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-primary';
    if (progress >= 40) return 'bg-warning';
    return 'bg-error';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
      default: return 'border-l-muted';
    }
  };

  const handleMilestoneDragStart = (e, milestone, objectiveId) => {
    setDraggedMilestone({ ...milestone, objectiveId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleMilestoneDrop = (e, newQuarter) => {
    e?.preventDefault();
    if (draggedMilestone) {
      onMilestoneUpdate(draggedMilestone?.objectiveId, draggedMilestone?.id, { quarter: newQuarter });
      setDraggedMilestone(null);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const columns = getTimelineColumns();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Timeline Header */}
      <div className="bg-muted/30 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-foreground">Strategic Timeline</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Info" size={14} />
              <span>Drag milestones to adjust timelines</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" iconName="ZoomIn">
              Zoom In
            </Button>
            <Button variant="ghost" size="sm" iconName="ZoomOut">
              Zoom Out
            </Button>
            <Button variant="ghost" size="sm" iconName="Maximize2">
              Full Screen
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="overflow-x-auto" ref={timelineRef}>
        <div className="min-w-[1800px]">
          {/* Column Headers - Fixed proportional layout */}
          <div className="grid border-b border-border bg-muted/20" style={{ gridTemplateColumns: '400px repeat(6, 1fr)' }}>
            <div className="p-6 border-r border-border bg-muted/10">
              <span className="font-semibold text-foreground text-base">Objectives</span>
            </div>
            {columns?.map((column, index) => (
              <div key={index} className="p-4 border-r border-border last:border-r-0 bg-background/50">
                <div className="text-center">
                  <div className="font-semibold text-foreground text-sm mb-1">{column}</div>
                  <div className="text-xs text-muted-foreground px-2 py-1 bg-muted/40 rounded-full inline-block">
                    {currentView === 'quarterly' ? '3 months' : currentView === 'monthly' ? '30 days' : '12 months'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Rows - Fixed proportional layout */}
          <div className="divide-y divide-border">
            {objectives?.map((objective) => (
              <div key={objective?.id} className="grid hover:bg-muted/10 transition-colors" style={{ gridTemplateColumns: '400px repeat(6, 1fr)' }}>
                {/* Objective Info - Fixed width with proper padding */}
                <div className="p-6 border-r border-border bg-card">
                  <div className={`border-l-4 ${getPriorityColor(objective?.priority)} pl-4 pr-2`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm mb-2 leading-tight">
                          {objective?.title}
                        </h4>
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="flex -space-x-1">
                            {objective?.owners?.slice(0, 3)?.map((owner, index) => (
                              <div
                                key={index}
                                className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center border-2 border-card shadow-sm"
                                title={owner?.name}
                              >
                                {owner?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                              </div>
                            ))}
                            {objective?.owners?.length > 3 && (
                              <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center border-2 border-card shadow-sm">
                                +{objective?.owners?.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                            {objective?.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-muted/60 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${getProgressColor(objective?.progress)}`}
                              style={{ width: `${objective?.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-foreground min-w-[35px] text-right">
                            {objective?.progress}%
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => setSelectedObjective(selectedObjective === objective?.id ? null : objective?.id)}
                      >
                        <Icon name={selectedObjective === objective?.id ? "ChevronUp" : "ChevronDown"} size={14} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Timeline Columns - Fixed proportional spacing */}
                {columns?.map((column, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="p-3 border-r border-border last:border-r-0 min-h-[120px] bg-background/30 relative"
                    onDrop={(e) => handleMilestoneDrop(e, column)}
                    onDragOver={handleDragOver}
                  >
                    <div className="space-y-2 h-full">
                      {/* Milestones for this column */}
                      {objective?.milestones?.filter(milestone => milestone?.quarter === column)?.map((milestone, milestoneIndex) => (
                        <div
                          key={milestone?.id}
                          draggable
                          onDragStart={(e) => handleMilestoneDragStart(e, milestone, objective?.id)}
                          className="bg-card border border-border rounded-lg p-3 cursor-move hover:shadow-md hover:border-primary/40 transition-all group relative"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="mt-0.5 shrink-0">
                              <Icon 
                                name="Calendar" 
                                size={12} 
                                className={
                                  milestone?.status === 'completed' ? 'text-success' : 
                                  milestone?.status === 'at-risk' ? 'text-error' : 
                                  milestone?.status === 'in-progress'? 'text-primary' : 'text-muted-foreground'
                                } 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground text-xs leading-tight mb-1">
                                {milestone?.title}
                              </div>
                              <div className="text-xs text-muted-foreground mb-1">
                                {milestone?.dueDate}
                              </div>
                              {milestone?.dependencies && milestone?.dependencies?.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Icon name="Link" size={10} className="text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {milestone?.dependencies?.length} deps
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Status indicator */}
                          <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                            milestone?.status === 'completed' ? 'bg-success' : 
                            milestone?.status === 'at-risk' ? 'bg-error' : 
                            milestone?.status === 'in-progress'? 'bg-primary' : 'bg-muted-foreground'
                          }`} />
                        </div>
                      ))}
                    </div>

                    {/* Drop Zone Indicator */}
                    {draggedMilestone && (
                      <div className="absolute inset-2 border-2 border-dashed border-primary/50 rounded-lg bg-primary/5 flex items-center justify-center z-10">
                        <span className="text-xs text-primary font-medium">Drop here</span>
                      </div>
                    )}

                    {/* Empty state for columns without milestones */}
                    {objective?.milestones?.filter(milestone => milestone?.quarter === column)?.length === 0 && (
                      <div className="absolute inset-3 flex items-center justify-center">
                        <div className="text-xs text-muted-foreground/60 text-center">
                          <Icon name="Plus" size={16} className="mx-auto mb-1 opacity-40" />
                          <div>Drop milestone here</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-muted/20 border-t border-border p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Status:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full shadow-sm"></div>
                  <span className="text-xs text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full shadow-sm"></div>
                  <span className="text-xs text-muted-foreground">On Track</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning rounded-full shadow-sm"></div>
                  <span className="text-xs text-muted-foreground">At Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-error rounded-full shadow-sm"></div>
                  <span className="text-xs text-muted-foreground">Overdue</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Priority:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1.5 bg-error rounded-full shadow-sm"></div>
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1.5 bg-warning rounded-full shadow-sm"></div>
                  <span className="text-xs text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1.5 bg-success rounded-full shadow-sm"></div>
                  <span className="text-xs text-muted-foreground">Low</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
            Last updated: August 7, 2025 at 6:43 AM
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;