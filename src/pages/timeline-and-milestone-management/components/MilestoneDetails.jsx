import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MilestoneDetails = ({ milestone, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: milestone?.title || '',
    description: milestone?.description || '',
    dueDate: milestone?.dueDate || '',
    status: milestone?.status || 'pending',
    priority: milestone?.priority || 'medium',
    assignee: milestone?.assignee || '',
    completionCriteria: milestone?.completionCriteria || ''
  });

  const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'overdue', label: 'Overdue' }];


  const priorityOptions = [
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' }];


  const assigneeOptions = [
  { value: 'john-doe', label: 'John Doe' },
  { value: 'sarah-wilson', label: 'Sarah Wilson' },
  { value: 'mike-chen', label: 'Mike Chen' },
  { value: 'emily-davis', label: 'Emily Davis' }];


  const handleSave = () => {
    onUpdate(milestone?.id, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      title: milestone?.title || '',
      description: milestone?.description || '',
      dueDate: milestone?.dueDate || '',
      status: milestone?.status || 'pending',
      priority: milestone?.priority || 'medium',
      assignee: milestone?.assignee || '',
      completionCriteria: milestone?.completionCriteria || ''
    });
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':return 'text-success bg-success/10';
      case 'in-progress':return 'text-primary bg-primary/10';
      case 'at-risk':return 'text-warning bg-warning/10';
      case 'overdue':return 'text-error bg-error/10';
      default:return 'text-muted-foreground bg-muted/10';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':return 'text-error bg-error/10';
      case 'medium':return 'text-warning bg-warning/10';
      case 'low':return 'text-success bg-success/10';
      default:return 'text-muted-foreground bg-muted/10';
    }
  };

  if (!milestone) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 hidden">
        <div className="text-center text-muted-foreground">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a milestone to view details</p>
        </div>
      </div>);

  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Calendar" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Milestone Details</h3>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ?
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              onClick={() => setIsEditing(true)}>

                Edit
              </Button> :

            <>
                <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}>

                  Cancel
                </Button>
                <Button
                variant="default"
                size="sm"
                iconName="Save"
                iconPosition="left"
                onClick={handleSave}>

                  Save
                </Button>
              </>
            }
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}>

              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
            {isEditing ?
            <Input
              value={formData?.title}
              onChange={(e) => setFormData({ ...formData, title: e?.target?.value })}
              placeholder="Enter milestone title" /> :


            <p className="text-foreground font-medium">{milestone?.title}</p>
            }
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
            {isEditing ?
            <textarea
              value={formData?.description}
              onChange={(e) => setFormData({ ...formData, description: e?.target?.value })}
              placeholder="Enter milestone description"
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3} /> :


            <p className="text-muted-foreground">{milestone?.description}</p>
            }
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Due Date</label>
              {isEditing ?
              <Input
                type="date"
                value={formData?.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e?.target?.value })} /> :


              <p className="text-foreground">{milestone?.dueDate}</p>
              }
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Assignee</label>
              {isEditing ?
              <Select
                options={assigneeOptions}
                value={formData?.assignee}
                onChange={(value) => setFormData({ ...formData, assignee: value })}
                placeholder="Select assignee" /> :


              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {milestone?.assigneeName?.split(' ')?.map((n) => n?.[0])?.join('') || 'UN'}
                  </div>
                  <span className="text-foreground">{milestone?.assigneeName || 'Unassigned'}</span>
                </div>
              }
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              {isEditing ?
              <Select
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => setFormData({ ...formData, status: value })} /> :


              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone?.status)}`}>
                  {statusOptions?.find((opt) => opt?.value === milestone?.status)?.label || milestone?.status}
                </span>
              }
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
              {isEditing ?
              <Select
                options={priorityOptions}
                value={formData?.priority}
                onChange={(value) => setFormData({ ...formData, priority: value })} /> :


              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(milestone?.priority)}`}>
                  {priorityOptions?.find((opt) => opt?.value === milestone?.priority)?.label || milestone?.priority}
                </span>
              }
            </div>
          </div>
        </div>

        {/* Completion Criteria */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Completion Criteria</label>
          {isEditing ?
          <textarea
            value={formData?.completionCriteria}
            onChange={(e) => setFormData({ ...formData, completionCriteria: e?.target?.value })}
            placeholder="Define what constitutes completion of this milestone"
            className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={3} /> :


          <p className="text-muted-foreground">{milestone?.completionCriteria || 'No completion criteria defined'}</p>
          }
        </div>

        {/* Dependencies */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Dependencies</label>
          <div className="space-y-2">
            {milestone?.dependencies && milestone?.dependencies?.length > 0 ?
            milestone?.dependencies?.map((dep, index) =>
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Icon name="Link" size={16} className="text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{dep?.title}</p>
                    <p className="text-xs text-muted-foreground">{dep?.objective}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dep?.status)}`}>
                    {dep?.status}
                  </span>
                </div>
            ) :

            <p className="text-muted-foreground text-sm">No dependencies</p>
            }
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Recent Comments</label>
          <div className="space-y-3">
            {milestone?.comments && milestone?.comments?.length > 0 ?
            milestone?.comments?.slice(0, 3)?.map((comment, index) =>
            <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
                    {comment?.author?.split(' ')?.map((n) => n?.[0])?.join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{comment?.author}</span>
                      <span className="text-xs text-muted-foreground">{comment?.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment?.content}</p>
                  </div>
                </div>
            ) :

            <p className="text-muted-foreground text-sm">No comments yet</p>
            }
            
            <Button variant="outline" size="sm" iconName="MessageSquare" iconPosition="left">
              Add Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default MilestoneDetails;