import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: 'MessageSquare',
      status: 'connected',
      lastSync: '2025-07-31T04:30:00Z',
      config: {
        webhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        channel: '#okr-updates',
        enableNotifications: true,
        syncFrequency: 'realtime'
      }
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Project management and issue tracking',
      icon: 'Bug',
      status: 'connected',
      lastSync: '2025-07-31T04:25:00Z',
      config: {
        serverUrl: 'https://company.atlassian.net',
        username: 'okr-integration@company.com',
        apiToken: '••••••••••••••••',
        projectKeys: 'PROJ,DEV,QA',
        syncFrequency: 'hourly'
      }
    },
    {
      id: 'gsuite',
      name: 'Google Workspace',
      description: 'Calendar integration and document sharing',
      icon: 'Calendar',
      status: 'error',
      lastSync: '2025-07-30T18:45:00Z',
      error: 'Authentication token expired',
      config: {
        clientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
        calendarId: 'company.com_okr@group.calendar.google.com',
        enableCalendarSync: true,
        syncFrequency: 'daily'
      }
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM data and revenue tracking',
      icon: 'DollarSign',
      status: 'disconnected',
      lastSync: null,
      config: {
        instanceUrl: '',
        username: '',
        securityToken: '',
        enableRevenueSync: false,
        syncFrequency: 'daily'
      }
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'error': return 'text-error';
      case 'disconnected': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      case 'disconnected': return 'Circle';
      default: return 'Circle';
    }
  };

  const handleTestConnection = async (integrationId) => {
    setIsTestingConnection(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => prev?.map(integration => 
      integration?.id === integrationId 
        ? { ...integration, status: 'connected', lastSync: new Date()?.toISOString(), error: null }
        : integration
    ));
    
    setIsTestingConnection(false);
  };

  const handleConfigUpdate = (integrationId, field, value) => {
    setIntegrations(prev => prev?.map(integration => 
      integration?.id === integrationId 
        ? { 
            ...integration, 
            config: { ...integration?.config, [field]: value }
          }
        : integration
    ));
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date?.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Plug" size={20} className="text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Connected</p>
              <p className="text-2xl font-bold text-foreground">
                {integrations?.filter(i => i?.status === 'connected')?.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-foreground">
                {integrations?.filter(i => i?.status === 'error')?.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Last Sync</p>
              <p className="text-sm font-medium text-foreground">2 min ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground">
                {integrations?.filter(i => i?.status === 'connected')?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Integration List */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Available Integrations</h3>
            </div>
            <Button variant="outline" iconName="Plus" iconPosition="left">
              Add Integration
            </Button>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {integrations?.map((integration) => (
            <div key={integration?.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Icon name={integration?.icon} size={24} className="text-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-lg font-medium text-foreground">{integration?.name}</h4>
                      <Icon 
                        name={getStatusIcon(integration?.status)} 
                        size={16} 
                        className={getStatusColor(integration?.status)} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{integration?.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Last sync: {formatLastSync(integration?.lastSync)}</span>
                      {integration?.error && (
                        <span className="text-error">Error: {integration?.error}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection(integration?.id)}
                    loading={isTestingConnection}
                    iconName="TestTube"
                    iconPosition="left"
                  >
                    Test
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIntegration(
                      selectedIntegration?.id === integration?.id ? null : integration
                    )}
                    iconName={selectedIntegration?.id === integration?.id ? "ChevronUp" : "ChevronDown"}
                    iconPosition="right"
                  >
                    Configure
                  </Button>
                </div>
              </div>
              
              {/* Configuration Panel */}
              {selectedIntegration?.id === integration?.id && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <h5 className="font-medium text-foreground mb-4">Configuration Settings</h5>
                  
                  {integration?.id === 'slack' && (
                    <div className="space-y-4">
                      <Input
                        label="Webhook URL"
                        type="url"
                        value={integration?.config?.webhookUrl}
                        onChange={(e) => handleConfigUpdate(integration?.id, 'webhookUrl', e?.target?.value)}
                        placeholder="https://hooks.slack.com/services/..."
                      />
                      <Input
                        label="Default Channel"
                        type="text"
                        value={integration?.config?.channel}
                        onChange={(e) => handleConfigUpdate(integration?.id, 'channel', e?.target?.value)}
                        placeholder="#okr-updates"
                      />
                      <Checkbox
                        label="Enable notifications"
                        checked={integration?.config?.enableNotifications}
                        onChange={(e) => handleConfigUpdate(integration?.id, 'enableNotifications', e?.target?.checked)}
                      />
                    </div>
                  )}
                  
                  {integration?.id === 'jira' && (
                    <div className="space-y-4">
                      <Input
                        label="Server URL"
                        type="url"
                        value={integration?.config?.serverUrl}
                        onChange={(e) => handleConfigUpdate(integration?.id, 'serverUrl', e?.target?.value)}
                        placeholder="https://company.atlassian.net"
                      />
                      <Input
                        label="Username"
                        type="email"
                        value={integration?.config?.username}
                        onChange={(e) => handleConfigUpdate(integration?.id, 'username', e?.target?.value)}
                        placeholder="user@company.com"
                      />
                      <Input
                        label="Project Keys"
                        type="text"
                        value={integration?.config?.projectKeys}
                        onChange={(e) => handleConfigUpdate(integration?.id, 'projectKeys', e?.target?.value)}
                        placeholder="PROJ,DEV,QA"
                        description="Comma-separated list of project keys"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-6 pt-4 border-t border-border">
                    <Button variant="default" iconName="Save" iconPosition="left">
                      Save Configuration
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Sync Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="RefreshCw" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Sync Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Global Sync Frequency</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
              <option value="realtime">Real-time</option>
              <option value="5min">Every 5 minutes</option>
              <option value="15min">Every 15 minutes</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Retry Attempts</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
              <option value="3">3 attempts</option>
              <option value="5">5 attempts</option>
              <option value="10">10 attempts</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <Checkbox
            label="Enable automatic retry on failure"
            description="Automatically retry failed sync operations"
            checked
            onChange={() => {}}
          />
          
          <Checkbox
            label="Send sync failure notifications"
            description="Notify administrators when sync operations fail"
            checked
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;