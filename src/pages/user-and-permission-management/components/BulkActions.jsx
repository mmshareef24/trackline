import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedUsers, onBulkAction, onClearSelection }) => {
  const [bulkActionType, setBulkActionType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'activate', label: 'Activate Users' },
    { value: 'deactivate', label: 'Deactivate Users' },
    { value: 'suspend', label: 'Suspend Users' },
    { value: 'change_role', label: 'Change Role' },
    { value: 'change_department', label: 'Change Department' },
    { value: 'reset_password', label: 'Reset Passwords' },
    { value: 'send_invitation', label: 'Send Invitations' },
    { value: 'export', label: 'Export Selected' },
    { value: 'delete', label: 'Delete Users' }
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const handleBulkAction = async () => {
    if (!bulkActionType || selectedUsers?.length === 0) return;

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onBulkAction(bulkActionType, selectedUsers);
      setBulkActionType('');
      onClearSelection();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'activate':
        return 'UserCheck';
      case 'deactivate': case'suspend':
        return 'UserX';
      case 'change_role':
        return 'Shield';
      case 'change_department':
        return 'Building';
      case 'reset_password':
        return 'Key';
      case 'send_invitation':
        return 'Mail';
      case 'export':
        return 'Download';
      case 'delete':
        return 'Trash2';
      default:
        return 'Settings';
    }
  };

  const getActionVariant = (action) => {
    switch (action) {
      case 'delete':
      case 'suspend':
        return 'destructive';
      case 'activate':
        return 'success';
      case 'export':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (selectedUsers?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedUsers?.length} user{selectedUsers?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              placeholder="Choose action..."
              options={bulkActionOptions}
              value={bulkActionType}
              onChange={setBulkActionType}
              className="min-w-48"
            />
            
            {/* Additional options for specific actions */}
            {bulkActionType === 'change_role' && (
              <Select
                placeholder="Select new role"
                options={roleOptions}
                onChange={(role) => setBulkActionType(`change_role:${role}`)}
                className="min-w-40"
              />
            )}
            
            {bulkActionType === 'change_department' && (
              <Select
                placeholder="Select department"
                options={departmentOptions}
                onChange={(dept) => setBulkActionType(`change_department:${dept}`)}
                className="min-w-40"
              />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={getActionVariant(bulkActionType?.split(':')?.[0])}
            onClick={handleBulkAction}
            disabled={!bulkActionType || isProcessing}
            loading={isProcessing}
            iconName={getActionIcon(bulkActionType?.split(':')?.[0])}
            iconPosition="left"
          >
            {isProcessing ? 'Processing...' : 'Apply Action'}
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>
      </div>
      {/* Action Preview */}
      {bulkActionType && (
        <div className="mt-3 p-3 bg-muted/20 rounded-lg border-l-4 border-primary">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Action Preview: {bulkActionOptions?.find(opt => opt?.value === bulkActionType?.split(':')?.[0])?.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This action will be applied to {selectedUsers?.length} selected user{selectedUsers?.length !== 1 ? 's' : ''}. 
                {bulkActionType === 'delete' && ' This action cannot be undone.'}
                {bulkActionType === 'reset_password' && ' Users will receive password reset emails.'}
                {bulkActionType?.startsWith('change_role') && ` All selected users will be assigned the ${bulkActionType?.split(':')?.[1]} role.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;