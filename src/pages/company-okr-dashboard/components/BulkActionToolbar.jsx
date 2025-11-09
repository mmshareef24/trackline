import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionToolbar = ({ selectedItems, onBulkAction, onClearSelection }) => {
  const [bulkAction, setBulkAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'update-status', label: 'Update Status' },
    { value: 'change-owner', label: 'Change Owner' },
    { value: 'move-quarter', label: 'Move to Quarter' },
    { value: 'archive', label: 'Archive Items' },
    { value: 'delete', label: 'Delete Items' },
    { value: 'export', label: 'Export Selected' }
  ];

  const statusOptions = [
    { value: 'On Track', label: 'On Track' },
    { value: 'At Risk', label: 'At Risk' },
    { value: 'Behind', label: 'Behind' },
    { value: 'Completed', label: 'Completed' }
  ];

  const ownerOptions = [
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Michael Chen', label: 'Michael Chen' },
    { value: 'Emily Rodriguez', label: 'Emily Rodriguez' },
    { value: 'David Kim', label: 'David Kim' },
    { value: 'Lisa Thompson', label: 'Lisa Thompson' }
  ];

  const quarterOptions = [
    { value: 'Q1', label: 'Q1 2025' },
    { value: 'Q2', label: 'Q2 2025' },
    { value: 'Q3', label: 'Q3 2025' },
    { value: 'Q4', label: 'Q4 2025' }
  ];

  const handleBulkActionExecute = async (actionValue) => {
    setIsProcessing(true);
    
    try {
      await onBulkAction(bulkAction, actionValue, selectedItems);
      setBulkAction('');
      onClearSelection();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderActionOptions = () => {
    switch (bulkAction) {
      case 'update-status':
        return (
          <div className="flex items-center space-x-2">
            <Select
              options={statusOptions}
              placeholder="Select status..."
              onChange={(value) => handleBulkActionExecute(value)}
              className="w-40"
            />
          </div>
        );
      
      case 'change-owner':
        return (
          <div className="flex items-center space-x-2">
            <Select
              options={ownerOptions}
              placeholder="Select owner..."
              onChange={(value) => handleBulkActionExecute(value)}
              searchable
              className="w-48"
            />
          </div>
        );
      
      case 'move-quarter':
        return (
          <div className="flex items-center space-x-2">
            <Select
              options={quarterOptions}
              placeholder="Select quarter..."
              onChange={(value) => handleBulkActionExecute(value)}
              className="w-40"
            />
          </div>
        );
      
      case 'archive': case'delete':
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkActionExecute(null)}
              loading={isProcessing}
            >
              Confirm {bulkAction === 'archive' ? 'Archive' : 'Delete'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkAction('')}
            >
              Cancel
            </Button>
          </div>
        );
      
      case 'export':
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkActionExecute('csv')}
              iconName="FileText"
              iconPosition="left"
            >
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkActionExecute('excel')}
              iconName="FileSpreadsheet"
              iconPosition="left"
            >
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkActionExecute('pdf')}
              iconName="FileDown"
              iconPosition="left"
            >
              PDF
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (selectedItems?.length === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedItems?.length} item{selectedItems?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              options={bulkActionOptions}
              value={bulkAction}
              onChange={setBulkAction}
              placeholder="Select action..."
              className="w-48"
            />
            
            {renderActionOptions()}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-primary/10">
        <span className="text-sm text-muted-foreground">Quick actions:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBulkAction('update-status')}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Update Status
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBulkAction('change-owner')}
          iconName="User"
          iconPosition="left"
        >
          Reassign
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBulkAction('export')}
          iconName="Download"
          iconPosition="left"
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default BulkActionToolbar;