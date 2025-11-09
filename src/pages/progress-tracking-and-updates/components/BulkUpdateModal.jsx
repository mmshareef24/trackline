import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BulkUpdateModal = ({ isOpen, onClose, selectedObjectives, objectives, onBulkUpdate }) => {
  const [updateType, setUpdateType] = useState('progress');
  const [progressValue, setProgressValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const updateTypeOptions = [
    { value: 'progress', label: 'Update Progress' },
    { value: 'status', label: 'Change Status' },
    { value: 'comment', label: 'Add Comment' }
  ];

  const statusOptions = [
    { value: 'on-track', label: 'On Track' },
    { value: 'at-risk', label: 'At Risk' },
    { value: 'behind', label: 'Behind' },
    { value: 'completed', label: 'Completed' }
  ];

  const selectedObjectivesList = objectives?.filter(obj => 
    selectedObjectives?.includes(obj?.id)
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const updateData = {
      type: updateType,
      value: updateType === 'progress' ? parseInt(progressValue) : 
             updateType === 'status' ? statusValue : comment,
      objectiveIds: selectedObjectives,
      timestamp: new Date()?.toISOString()
    };

    onBulkUpdate(updateData);
    onClose();
    
    // Reset form
    setUpdateType('progress');
    setProgressValue('');
    setStatusValue('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Bulk Update Objectives</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selected Objectives */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Selected Objectives ({selectedObjectives?.length})
            </h3>
            <div className="max-h-32 overflow-y-auto bg-muted/30 rounded-lg p-3">
              {selectedObjectivesList?.map((obj) => (
                <div key={obj?.id} className="flex items-center justify-between py-1">
                  <span className="text-sm text-foreground truncate">{obj?.title}</span>
                  <span className="text-xs text-muted-foreground">{obj?.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Update Type */}
          <div>
            <Select
              label="Update Type"
              options={updateTypeOptions}
              value={updateType}
              onChange={setUpdateType}
              required
            />
          </div>

          {/* Update Value */}
          {updateType === 'progress' && (
            <div>
              <Input
                type="number"
                label="Progress Percentage"
                placeholder="Enter progress (0-100)"
                value={progressValue}
                onChange={(e) => setProgressValue(e?.target?.value)}
                min="0"
                max="100"
                required
              />
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressValue || 0}
                  onChange={(e) => setProgressValue(e?.target?.value)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          )}

          {updateType === 'status' && (
            <div>
              <Select
                label="New Status"
                options={statusOptions}
                value={statusValue}
                onChange={setStatusValue}
                required
              />
            </div>
          )}

          {updateType === 'comment' && (
            <div>
              <Input
                type="text"
                label="Comment"
                placeholder="Enter comment for all selected objectives"
                value={comment}
                onChange={(e) => setComment(e?.target?.value)}
                required
              />
            </div>
          )}

          {/* Preview */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Preview Changes</h4>
            <div className="text-sm text-muted-foreground">
              {updateType === 'progress' && progressValue && (
                <span>Set progress to {progressValue}% for {selectedObjectives?.length} objectives</span>
              )}
              {updateType === 'status' && statusValue && (
                <span>Change status to "{statusValue?.replace('-', ' ')}" for {selectedObjectives?.length} objectives</span>
              )}
              {updateType === 'comment' && comment && (
                <span>Add comment "{comment}" to {selectedObjectives?.length} objectives</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Save"
              iconPosition="left"
              disabled={
                (updateType === 'progress' && !progressValue) ||
                (updateType === 'status' && !statusValue) ||
                (updateType === 'comment' && !comment)
              }
            >
              Update {selectedObjectives?.length} Objectives
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkUpdateModal;