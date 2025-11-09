import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ObjectiveCard = ({ objective, onEdit, onDelete, onDragStart, onDragEnd, isDragging }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track': return 'text-success bg-success/10 border-success/20';
      case 'At Risk': return 'text-warning bg-warning/10 border-warning/20';
      case 'Behind': return 'text-error bg-error/10 border-error/20';
      case 'Completed': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return 'AlertTriangle';
      case 'Medium': return 'Circle';
      case 'Low': return 'Minus';
      default: return 'Circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-error';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 cursor-move transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getPriorityIcon(objective?.priority)} 
            size={14} 
            className={getPriorityColor(objective?.priority)} 
          />
          <span className="text-xs font-medium text-muted-foreground">
            {objective?.id}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onEdit(objective)}
          >
            <Icon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-error hover:text-error"
            onClick={() => onDelete(objective?.id)}
          >
            <Icon name="Trash2" size={12} />
          </Button>
        </div>
      </div>
      {/* Title */}
      <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
        {objective?.title}
      </h3>
      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {objective?.description}
      </p>
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium text-foreground">{objective?.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${objective?.progress}%` }}
          />
        </div>
      </div>
      {/* Status and Owner */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(objective?.status)}`}>
          {objective?.status}
        </span>
        <div className="flex items-center space-x-1">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {objective?.owner?.split(' ')?.map(n => n?.[0])?.join('')}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{objective?.owner}</span>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Calendar" size={12} />
          <span>Q{objective?.quarter} {new Date()?.getFullYear()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Target" size={12} />
          <span>{objective?.keyResults} KRs</span>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveCard;