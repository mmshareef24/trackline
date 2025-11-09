import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedObjectives, onBulkAction, onClearSelection }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const bulkActions = [
    {
      id: 'update_status',
      label: 'Update Status',
      icon: 'RefreshCw',
      description: 'Change status for selected objectives',
      submenu: [
        { id: 'status_active', label: 'Mark as Active', icon: 'Play' },
        { id: 'status_draft', label: 'Mark as Draft', icon: 'Edit' },
        { id: 'status_completed', label: 'Mark as Completed', icon: 'CheckCircle' },
        { id: 'status_archived', label: 'Archive', icon: 'Archive' }
      ]
    },
    {
      id: 'update_priority',
      label: 'Update Priority',
      icon: 'Flag',
      description: 'Change priority for selected objectives',
      submenu: [
        { id: 'priority_high', label: 'High Priority', icon: 'AlertTriangle', color: 'text-error' },
        { id: 'priority_medium', label: 'Medium Priority', icon: 'Minus', color: 'text-warning' },
        { id: 'priority_low', label: 'Low Priority', icon: 'ArrowDown', color: 'text-accent' }
      ]
    },
    {
      id: 'assign_owner',
      label: 'Assign Owner',
      icon: 'User',
      description: 'Assign or reassign owner for selected objectives'
    },
    {
      id: 'update_quarter',
      label: 'Update Quarter',
      icon: 'Calendar',
      description: 'Move objectives to different quarter'
    },
    {
      id: 'export',
      label: 'Export',
      icon: 'Download',
      description: 'Export selected objectives'
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'Copy',
      description: 'Create copies of selected objectives'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'Trash2',
      description: 'Permanently delete selected objectives',
      variant: 'destructive'
    }
  ];

  const handleActionClick = (action) => {
    if (action?.submenu) {
      return; // Handle submenu separately
    }

    if (action?.id === 'delete') {
      setPendingAction(action);
      setIsConfirmModalOpen(true);
    } else {
      onBulkAction(action?.id, selectedObjectives);
    }
    setIsDropdownOpen(false);
  };

  const handleSubmenuClick = (parentAction, subAction) => {
    onBulkAction(subAction?.id, selectedObjectives);
    setIsDropdownOpen(false);
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      onBulkAction(pendingAction?.id, selectedObjectives);
      setPendingAction(null);
      setIsConfirmModalOpen(false);
    }
  };

  if (selectedObjectives?.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {selectedObjectives?.length}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedObjectives?.length} objective{selectedObjectives?.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="h-4 w-px bg-border"></div>

          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleActionClick({ id: 'export' })}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleActionClick({ id: 'duplicate' })}
              iconName="Copy"
              iconPosition="left"
            >
              Duplicate
            </Button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                iconName="MoreHorizontal"
                iconPosition="left"
              >
                More Actions
              </Button>

              {isDropdownOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {bulkActions?.map((action) => (
                      <div key={action?.id}>
                        {action?.submenu ? (
                          <div className="group relative">
                            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                              <div className="flex items-center space-x-2">
                                <Icon name={action?.icon} size={16} />
                                <span>{action?.label}</span>
                              </div>
                              <Icon name="ChevronRight" size={14} />
                            </button>
                            
                            {/* Submenu */}
                            <div className="absolute left-full top-0 ml-1 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                              <div className="p-2">
                                {action?.submenu?.map((subAction) => (
                                  <button
                                    key={subAction?.id}
                                    onClick={() => handleSubmenuClick(action, subAction)}
                                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors ${
                                      subAction?.color || 'text-foreground'
                                    }`}
                                  >
                                    <Icon name={subAction?.icon} size={16} />
                                    <span>{subAction?.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleActionClick(action)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors ${
                              action?.variant === 'destructive' ? 'text-error hover:bg-error/10' : 'text-foreground'
                            }`}
                          >
                            <Icon name={action?.icon} size={16} />
                            <span>{action?.label}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-border"></div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsConfirmModalOpen(false)}></div>
          <div className="relative bg-card border border-border rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Action</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-foreground">
                Are you sure you want to delete {selectedObjectives?.length} objective{selectedObjectives?.length !== 1 ? 's' : ''}?
              </p>
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  This will permanently delete the selected objectives and all associated key results, comments, and activity history.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmAction}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete {selectedObjectives?.length} Objective{selectedObjectives?.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Backdrop for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </>
  );
};

export default BulkActions;