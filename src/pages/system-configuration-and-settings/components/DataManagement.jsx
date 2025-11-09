import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataManagement = () => {
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    includeAttachments: true,
    encryptBackups: true,
    cloudStorage: true,
    localStorage: false
  });

  const [exportSettings, setExportSettings] = useState({
    allowUserExport: true,
    allowAdminExport: true,
    maxRecords: 10000,
    includePersonalData: false,
    requireApproval: true,
    exportFormats: ['csv', 'xlsx', 'json']
  });

  const [dataRetention, setDataRetention] = useState({
    objectiveRetention: 2555, // 7 years
    userDataRetention: 2555,
    auditLogRetention: 365,
    attachmentRetention: 1095, // 3 years
    autoArchive: true,
    archiveAfterDays: 365,
    deleteAfterDays: 2555
  });

  const [recentBackups] = useState([
    {
      id: 'backup-1',
      timestamp: '2025-07-31T02:00:00Z',
      type: 'automatic',
      size: '2.4 GB',
      status: 'completed',
      duration: '12 minutes',
      records: 45678
    },
    {
      id: 'backup-2',
      timestamp: '2025-07-30T02:00:00Z',
      type: 'automatic',
      size: '2.3 GB',
      status: 'completed',
      duration: '11 minutes',
      records: 45234
    },
    {
      id: 'backup-3',
      timestamp: '2025-07-29T14:30:00Z',
      type: 'manual',
      size: '2.3 GB',
      status: 'completed',
      duration: '10 minutes',
      records: 45123
    },
    {
      id: 'backup-4',
      timestamp: '2025-07-29T02:00:00Z',
      type: 'automatic',
      size: '2.2 GB',
      status: 'failed',
      duration: '5 minutes',
      error: 'Storage quota exceeded'
    }
  ]);

  const [exportRequests] = useState([
    {
      id: 'export-1',
      requestedBy: 'john.doe@company.com',
      requestDate: '2025-07-31T03:15:00Z',
      dataType: 'User Objectives',
      format: 'xlsx',
      status: 'pending',
      approver: 'admin@company.com'
    },
    {
      id: 'export-2',
      requestedBy: 'jane.smith@company.com',
      requestDate: '2025-07-30T16:45:00Z',
      dataType: 'Team Analytics',
      format: 'csv',
      status: 'approved',
      approver: 'admin@company.com',
      downloadUrl: '/exports/team-analytics-20250730.csv'
    },
    {
      id: 'export-3',
      requestedBy: 'mike.wilson@company.com',
      requestDate: '2025-07-30T10:20:00Z',
      dataType: 'Progress Reports',
      format: 'json',
      status: 'rejected',
      approver: 'admin@company.com',
      reason: 'Insufficient permissions'
    }
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);

  const handleBackupSettingChange = (field, value) => {
    setBackupSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsCreatingBackup(false);
    console.log('Manual backup created');
  };

  const handleRestoreBackup = async (backupId) => {
    setIsRestoringBackup(true);
    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsRestoringBackup(false);
    console.log('Backup restored:', backupId);
  };

  const handleApproveExport = (exportId) => {
    console.log('Export approved:', exportId);
  };

  const handleRejectExport = (exportId) => {
    console.log('Export rejected:', exportId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'failed': return 'text-error';
      case 'pending': return 'text-warning';
      case 'approved': return 'text-success';
      case 'rejected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'pending': return 'Clock';
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={20} className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold text-foreground">45,678</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="HardDrive" size={20} className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <p className="text-2xl font-bold text-foreground">2.4 GB</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Archive" size={20} className="text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Archived</p>
              <p className="text-2xl font-bold text-foreground">12,345</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Last Backup</p>
              <p className="text-sm font-medium text-foreground">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
      {/* Backup Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Archive" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Backup Configuration</h3>
          </div>
          <Button
            variant="default"
            onClick={handleCreateBackup}
            loading={isCreatingBackup}
            iconName="Download"
            iconPosition="left"
          >
            Create Backup Now
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Backup Frequency</label>
            <select 
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              value={backupSettings?.backupFrequency}
              onChange={(e) => handleBackupSettingChange('backupFrequency', e?.target?.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <Input
            label="Backup Time"
            type="time"
            value={backupSettings?.backupTime}
            onChange={(e) => handleBackupSettingChange('backupTime', e?.target?.value)}
            description="Time for automatic backups (24-hour format)"
          />
          
          <Input
            label="Retention Period (Days)"
            type="number"
            value={backupSettings?.retentionDays}
            onChange={(e) => handleBackupSettingChange('retentionDays', parseInt(e?.target?.value))}
            min="7"
            max="365"
            description="How long to keep backup files"
          />
        </div>
        
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-foreground">Backup Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Checkbox
              label="Enable automatic backups"
              checked={backupSettings?.autoBackup}
              onChange={(e) => handleBackupSettingChange('autoBackup', e?.target?.checked)}
            />
            <Checkbox
              label="Include file attachments"
              checked={backupSettings?.includeAttachments}
              onChange={(e) => handleBackupSettingChange('includeAttachments', e?.target?.checked)}
            />
            <Checkbox
              label="Encrypt backup files"
              checked={backupSettings?.encryptBackups}
              onChange={(e) => handleBackupSettingChange('encryptBackups', e?.target?.checked)}
            />
            <Checkbox
              label="Store in cloud storage"
              checked={backupSettings?.cloudStorage}
              onChange={(e) => handleBackupSettingChange('cloudStorage', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Recent Backups */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="History" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Backups</h3>
        </div>
        
        <div className="space-y-3">
          {recentBackups?.map((backup) => (
            <div key={backup?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <Icon 
                  name={getStatusIcon(backup?.status)} 
                  size={20} 
                  className={getStatusColor(backup?.status)} 
                />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-medium text-foreground">
                      {new Date(backup.timestamp)?.toLocaleString()}
                    </h5>
                    <span className="text-sm text-muted-foreground">
                      ({backup?.type})
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Size: {backup?.size}</span>
                    <span className="mx-2">•</span>
                    <span>Duration: {backup?.duration}</span>
                    <span className="mx-2">•</span>
                    <span>Records: {backup?.records?.toLocaleString()}</span>
                  </div>
                  {backup?.error && (
                    <p className="text-sm text-error mt-1">Error: {backup?.error}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {backup?.status === 'completed' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreBackup(backup?.id)}
                      loading={isRestoringBackup}
                      iconName="RotateCcw"
                      iconPosition="left"
                    >
                      Restore
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Data Retention */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Data Retention Policies</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Objective Data (Days)"
            type="number"
            value={dataRetention?.objectiveRetention}
            onChange={(e) => setDataRetention(prev => ({ ...prev, objectiveRetention: parseInt(e?.target?.value) }))}
            min="365"
            max="3650"
            description="How long to keep objective data"
          />
          
          <Input
            label="User Data (Days)"
            type="number"
            value={dataRetention?.userDataRetention}
            onChange={(e) => setDataRetention(prev => ({ ...prev, userDataRetention: parseInt(e?.target?.value) }))}
            min="365"
            max="3650"
            description="How long to keep user profile data"
          />
          
          <Input
            label="Audit Logs (Days)"
            type="number"
            value={dataRetention?.auditLogRetention}
            onChange={(e) => setDataRetention(prev => ({ ...prev, auditLogRetention: parseInt(e?.target?.value) }))}
            min="90"
            max="2555"
            description="How long to keep audit logs"
          />
          
          <Input
            label="File Attachments (Days)"
            type="number"
            value={dataRetention?.attachmentRetention}
            onChange={(e) => setDataRetention(prev => ({ ...prev, attachmentRetention: parseInt(e?.target?.value) }))}
            min="365"
            max="2555"
            description="How long to keep file attachments"
          />
        </div>
        
        <div className="mt-6 space-y-3">
          <Checkbox
            label="Enable automatic archiving"
            description="Automatically archive old records based on retention policies"
            checked={dataRetention?.autoArchive}
            onChange={(e) => setDataRetention(prev => ({ ...prev, autoArchive: e?.target?.checked }))}
          />
        </div>
      </div>
      {/* Export Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Download" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Data Export Management</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Maximum Records per Export"
            type="number"
            value={exportSettings?.maxRecords}
            onChange={(e) => setExportSettings(prev => ({ ...prev, maxRecords: parseInt(e?.target?.value) }))}
            min="1000"
            max="100000"
          />
        </div>
        
        <div className="space-y-3 mb-6">
          <Checkbox
            label="Allow user data exports"
            description="Users can export their own data"
            checked={exportSettings?.allowUserExport}
            onChange={(e) => setExportSettings(prev => ({ ...prev, allowUserExport: e?.target?.checked }))}
          />
          <Checkbox
            label="Require admin approval"
            description="All export requests need admin approval"
            checked={exportSettings?.requireApproval}
            onChange={(e) => setExportSettings(prev => ({ ...prev, requireApproval: e?.target?.checked }))}
          />
          <Checkbox
            label="Include personal data"
            description="Allow export of personally identifiable information"
            checked={exportSettings?.includePersonalData}
            onChange={(e) => setExportSettings(prev => ({ ...prev, includePersonalData: e?.target?.checked }))}
          />
        </div>

        {/* Export Requests */}
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-4">Recent Export Requests</h4>
          <div className="space-y-3">
            {exportRequests?.map((request) => (
              <div key={request?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Icon 
                    name={getStatusIcon(request?.status)} 
                    size={20} 
                    className={getStatusColor(request?.status)} 
                  />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-medium text-foreground">{request?.dataType}</h5>
                      <span className="text-sm text-muted-foreground">
                        ({request?.format?.toUpperCase()})
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Requested by: {request?.requestedBy}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(request.requestDate)?.toLocaleDateString()}</span>
                    </div>
                    {request?.reason && (
                      <p className="text-sm text-error mt-1">Reason: {request?.reason}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {request?.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveExport(request?.id)}
                        iconName="Check"
                        iconPosition="left"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectExport(request?.id)}
                        iconName="X"
                        iconPosition="left"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {request?.status === 'approved' && request?.downloadUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;