import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KeyResultCard = ({ keyResult, onEdit, onDelete, onDragStart, onDragEnd, isDragging }) => {
  const getMetricIcon = (type) => {
    switch (type) {
      case 'percentage': return 'Percent';
      case 'revenue': return 'DollarSign';
      case 'tickets': return 'Ticket';
      case 'custom': return 'Hash';
      default: return 'Hash';
    }
  };

  const formatValue = (value, type) => {
    switch (type) {
      case 'percentage': return `${value}%`;
      case 'revenue': return `$${value?.toLocaleString()}`;
      case 'tickets': return `${value} tickets`;
      default: return value?.toString();
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-primary';
    if (progress >= 40) return 'bg-warning';
    return 'bg-error';
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
          <Icon name={getMetricIcon(keyResult?.type)} size={14} className="text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            {keyResult?.id}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onEdit(keyResult)}
          >
            <Icon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-error hover:text-error"
            onClick={() => onDelete(keyResult?.id)}
          >
            <Icon name="Trash2" size={12} />
          </Button>
        </div>
      </div>
      {/* Title */}
      <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
        {keyResult?.title}
      </h3>
      {/* Current vs Target */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Current</span>
          <span className="text-xs text-muted-foreground">Target</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {formatValue(keyResult?.current, keyResult?.type)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {formatValue(keyResult?.target, keyResult?.type)}
          </span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium text-foreground">{keyResult?.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`rounded-full h-2 transition-all duration-300 ${getProgressColor(keyResult?.progress)}`}
            style={{ width: `${keyResult?.progress}%` }}
          />
        </div>
      </div>
      {/* Objective Link */}
      <div className="mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Link" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">
            {keyResult?.objectiveTitle}
          </span>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="User" size={12} />
          <span>{keyResult?.owner}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={12} />
          <span>Updated {keyResult?.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default KeyResultCard;