import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressCard = ({ progress, onEdit, onDelete, onDragStart, onDragEnd, isDragging }) => {
  const getUpdateTypeIcon = (type) => {
    switch (type) {
      case 'milestone': return 'Flag';
      case 'blocker': return 'AlertTriangle';
      case 'achievement': return 'Trophy';
      case 'update': return 'MessageSquare';
      default: return 'Circle';
    }
  };

  const getUpdateTypeColor = (type) => {
    switch (type) {
      case 'milestone': return 'text-primary bg-primary/10 border-primary/20';
      case 'blocker': return 'text-error bg-error/10 border-error/20';
      case 'achievement': return 'text-success bg-success/10 border-success/20';
      case 'update': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-error';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
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
          <span className={`text-xs px-2 py-1 rounded-full border ${getUpdateTypeColor(progress?.type)}`}>
            <Icon name={getUpdateTypeIcon(progress?.type)} size={12} className="inline mr-1" />
            {progress?.type}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onEdit(progress)}
          >
            <Icon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-error hover:text-error"
            onClick={() => onDelete(progress?.id)}
          >
            <Icon name="Trash2" size={12} />
          </Button>
        </div>
      </div>
      {/* Title */}
      <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
        {progress?.title}
      </h3>
      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
        {progress?.description}
      </p>
      {/* Impact and Confidence */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <Icon name="TrendingUp" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Impact:</span>
          <span className={`text-xs font-medium ${getImpactColor(progress?.impact)}`}>
            {progress?.impact}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{progress?.confidence}%</span>
        </div>
      </div>
      {/* Metrics */}
      {progress?.metrics && (
        <div className="mb-3 p-2 bg-muted/50 rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Progress Change</span>
            <span className={`text-xs font-medium ${
              progress?.metrics?.change >= 0 ? 'text-success' : 'text-error'
            }`}>
              {progress?.metrics?.change >= 0 ? '+' : ''}{progress?.metrics?.change}%
            </span>
          </div>
          {progress?.metrics?.value && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">Current Value</span>
              <span className="text-xs font-medium text-foreground">
                {progress?.metrics?.value}
              </span>
            </div>
          )}
        </div>
      )}
      {/* Linked Item */}
      <div className="mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Link" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">
            {progress?.linkedItem}
          </span>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {progress?.author?.split(' ')?.map(n => n?.[0])?.join('')}
            </span>
          </div>
          <span>{progress?.author}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={12} />
          <span>{progress?.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;