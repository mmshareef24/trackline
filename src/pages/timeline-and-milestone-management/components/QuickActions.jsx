import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickActions = ({ onBulkUpdate, onExport, onTemplateApply }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [bulkUpdateData, setBulkUpdateData] = useState({
    action: '',
    targets: [],
    newDate: '',
    newStatus: '',
    newAssignee: ''
  });

  const bulkActionOptions = [
    { value: 'update-dates', label: 'Update Due Dates' },
    { value: 'change-status', label: 'Change Status' },
    { value: 'reassign', label: 'Reassign Milestones' },
    { value: 'archive', label: 'Archive Completed' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'at-risk', label: 'At Risk' }
  ];

  const assigneeOptions = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-chen', label: 'Mike Chen' },
    { value: 'emily-davis', label: 'Emily Davis' }
  ];

  const exportOptions = [
    { value: 'gantt-pdf', label: 'Gantt Chart (PDF)' },
    { value: 'timeline-excel', label: 'Timeline Report (Excel)' },
    { value: 'milestones-csv', label: 'Milestones List (CSV)' },
    { value: 'dependencies-json', label: 'Dependencies Map (JSON)' }
  ];

  const templateOptions = [
    { value: 'quarterly-review', label: 'Quarterly Review Template' },
    { value: 'product-launch', label: 'Product Launch Template' },
    { value: 'marketing-campaign', label: 'Marketing Campaign Template' },
    { value: 'compliance-audit', label: 'Compliance Audit Template' }
  ];

  const handleBulkUpdate = () => {
    onBulkUpdate(bulkUpdateData);
    setActiveAction(null);
    setBulkUpdateData({
      action: '',
      targets: [],
      newDate: '',
      newStatus: '',
      newAssignee: ''
    });
  };

  const handleExport = (format) => {
    onExport(format);
  };

  const handleTemplateApply = (template) => {
    onTemplateApply(template);
  };

  const quickActions = [
    {
      id: 'bulk-operations',
      title: 'Bulk Operations',
      description: 'Update multiple milestones at once',
      icon: 'Settings',
      color: 'text-primary bg-primary/10'
    },
    {
      id: 'export-data',
      title: 'Export & Reports',
      description: 'Generate timeline reports and charts',
      icon: 'Download',
      color: 'text-success bg-success/10'
    },
    {
      id: 'templates',
      title: 'Apply Templates',
      description: 'Use predefined milestone templates',
      icon: 'Copy',
      color: 'text-warning bg-warning/10'
    },
    {
      id: 'calendar-sync',
      title: 'Calendar Sync',
      description: 'Sync milestones with calendar',
      icon: 'Calendar',
      color: 'text-accent bg-accent/10'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
        </div>
      </div>
      {/* Quick Action Cards */}
      <div className="p-4 space-y-3">
        {quickActions?.map((action) => (
          <div key={action?.id}>
            <button
              onClick={() => setActiveAction(activeAction === action?.id ? null : action?.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action?.color}`}>
                <Icon name={action?.icon} size={18} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-foreground text-sm">{action?.title}</h4>
                <p className="text-xs text-muted-foreground">{action?.description}</p>
              </div>
              <Icon 
                name={activeAction === action?.id ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </button>

            {/* Action Content */}
            {activeAction === action?.id && (
              <div className="mt-3 p-4 bg-muted/20 rounded-lg border border-border">
                {action?.id === 'bulk-operations' && (
                  <div className="space-y-4">
                    <Select
                      label="Select Action"
                      options={bulkActionOptions}
                      value={bulkUpdateData?.action}
                      onChange={(value) => setBulkUpdateData({ ...bulkUpdateData, action: value })}
                      placeholder="Choose bulk action"
                    />

                    {bulkUpdateData?.action === 'update-dates' && (
                      <Input
                        label="New Due Date"
                        type="date"
                        value={bulkUpdateData?.newDate}
                        onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, newDate: e?.target?.value })}
                      />
                    )}

                    {bulkUpdateData?.action === 'change-status' && (
                      <Select
                        label="New Status"
                        options={statusOptions}
                        value={bulkUpdateData?.newStatus}
                        onChange={(value) => setBulkUpdateData({ ...bulkUpdateData, newStatus: value })}
                        placeholder="Select new status"
                      />
                    )}

                    {bulkUpdateData?.action === 'reassign' && (
                      <Select
                        label="New Assignee"
                        options={assigneeOptions}
                        value={bulkUpdateData?.newAssignee}
                        onChange={(value) => setBulkUpdateData({ ...bulkUpdateData, newAssignee: value })}
                        placeholder="Select new assignee"
                      />
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleBulkUpdate}
                        disabled={!bulkUpdateData?.action}
                      >
                        Apply Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveAction(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {action?.id === 'export-data' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose export format for timeline data
                    </p>
                    {exportOptions?.map((option) => (
                      <Button
                        key={option?.value}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        iconName="Download"
                        iconPosition="left"
                        onClick={() => handleExport(option?.value)}
                      >
                        {option?.label}
                      </Button>
                    ))}
                  </div>
                )}

                {action?.id === 'templates' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      Apply predefined milestone templates
                    </p>
                    {templateOptions?.map((template) => (
                      <Button
                        key={template?.value}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        iconName="Copy"
                        iconPosition="left"
                        onClick={() => handleTemplateApply(template?.value)}
                      >
                        {template?.label}
                      </Button>
                    ))}
                  </div>
                )}

                {action?.id === 'calendar-sync' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      Sync milestones with external calendars
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        iconName="Calendar"
                        iconPosition="left"
                      >
                        Sync with Google Calendar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        iconName="Calendar"
                        iconPosition="left"
                      >
                        Sync with Outlook Calendar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        iconName="Settings"
                        iconPosition="left"
                      >
                        Calendar Settings
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Recent Actions */}
      <div className="border-t border-border p-4">
        <h4 className="font-medium text-foreground mb-3 text-sm">Recent Actions</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Exported Gantt chart</span>
            <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Updated 5 milestone dates</span>
            <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Applied product launch template</span>
            <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;