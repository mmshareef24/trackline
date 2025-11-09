import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BoardColumn = ({ 
  title, 
  items, 
  icon, 
  color, 
  onDrop, 
  onCardEdit, 
  onCardDelete, 
  children,
  onAddNew 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const draggedData = JSON.parse(e?.dataTransfer?.getData('text/plain'));
    onDrop(draggedData, title?.toLowerCase());
  };

  const getColumnStats = () => {
    if (!items || items?.length === 0) return null;
    
    const total = items?.length;
    let completed = 0;
    let atRisk = 0;
    
    items?.forEach(item => {
      if (item?.status === 'Completed') completed++;
      if (item?.status === 'At Risk' || item?.status === 'Behind') atRisk++;
    });

    return { total, completed, atRisk };
  };

  const stats = getColumnStats();

  return (
    <div className="flex flex-col h-full">
      {/* Column Header - Fixed height for consistent alignment */}
      <div className="flex items-start justify-between p-4 border-b border-border bg-muted/30 min-h-[80px]">
        <div className="flex items-start space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} flex-shrink-0 mt-1`}>
            <Icon name={icon} size={18} color="white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground leading-6 mb-1">{title}</h2>
            {/* Fixed height stats container to ensure consistent alignment */}
            <div className="min-h-[32px] flex flex-col justify-start">
              {stats && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{stats?.total} total</span>
                  {stats?.completed > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-success">{stats?.completed} completed</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0 mt-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onAddNew(title?.toLowerCase())}
          >
            <Icon name="Plus" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Icon name="MoreVertical" size={16} />
          </Button>
        </div>
      </div>
      {/* Column Content */}
      <div
        className={`flex-1 p-4 space-y-3 overflow-y-auto transition-colors ${
          isDragOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children}
        
        {/* Empty State */}
        {(!items || items?.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Icon name={icon} size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              No {title?.toLowerCase()} yet
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onAddNew(title?.toLowerCase())}
            >
              Add {title?.slice(0, -1)}
            </Button>
          </div>
        )}

        {/* Drop Zone Indicator */}
        {isDragOver && (
          <div className="flex items-center justify-center py-8 border-2 border-dashed border-primary rounded-lg bg-primary/5">
            <div className="text-center">
              <Icon name="Download" size={24} className="text-primary mb-2" />
              <p className="text-sm font-medium text-primary">Drop here to move</p>
            </div>
          </div>
        )}
      </div>
      {/* Column Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {items ? items?.length : 0} item{items && items?.length !== 1 ? 's' : ''}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            iconName="ArrowUp"
            iconPosition="left"
          >
            Scroll to top
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoardColumn;