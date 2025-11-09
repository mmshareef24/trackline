import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InitiativeCard = ({ initiative, onEdit, onDelete, onDragStart, onDragEnd, isDragging }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-primary bg-primary/10 border-primary/20';
      case 'Completed': return 'text-success bg-success/10 border-success/20';
      case 'Blocked': return 'text-error bg-error/10 border-error/20';
      case 'Planning': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Project': return 'Folder';
      case 'Task': return 'CheckSquare';
      case 'Campaign': return 'Megaphone';
      case 'Research': return 'Search';
      default: return 'Circle';
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
          <Icon name={getTypeIcon(initiative?.type)} size={14} className="text-accent" />
          <span className="text-xs font-medium text-muted-foreground">
            {initiative?.id}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onEdit(initiative)}
          >
            <Icon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-error hover:text-error"
            onClick={() => onDelete(initiative?.id)}
          >
            <Icon name="Trash2" size={12} />
          </Button>
        </div>
      </div>
      {/* Title */}
      <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
        {initiative?.title}
      </h3>
      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {initiative?.description}
      </p>
      {/* Status and Type */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(initiative?.status)}`}>
          {initiative?.status}
        </span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {initiative?.type}
        </span>
      </div>
      {/* Team Members */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-1">
          <Icon name="Users" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Team</span>
        </div>
        <div className="flex items-center space-x-1">
          {initiative?.team?.slice(0, 3)?.map((member, index) => (
            <div key={index} className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">
                {member?.split(' ')?.map(n => n?.[0])?.join('')}
              </span>
            </div>
          ))}
          {initiative?.team?.length > 3 && (
            <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{initiative?.team?.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Linked Objectives */}
      <div className="mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">
            Supports {initiative?.linkedObjectives} objective(s)
          </span>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Calendar" size={12} />
          <span>Due {initiative?.dueDate}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={12} />
          <span>{initiative?.timeRemaining}</span>
        </div>
      </div>
    </div>
  );
};

export default InitiativeCard;