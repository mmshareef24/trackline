import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = () => {
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5,
    expirationDays: 90,
    lockoutAttempts: 5,
    lockoutDuration: 30
  });

  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: 480, // 8 hours in minutes
    idleTimeout: 60, // 1 hour in minutes
    maxConcurrentSessions: 3,
    requireReauth: true,
    rememberMe: false,
    secureOnly: true
  });

  const [auditSettings, setAuditSettings] = useState({
    enableAuditLog: true,
    logLoginAttempts: true,
    logDataChanges: true,
    logSystemAccess: true,
    retentionDays: 365,
    exportEnabled: true,
    realTimeAlerts: true
  });

  const [apiSettings, setApiSettings] = useState({
    enableApiAccess: true,
    requireApiKey: true,
    rateLimitEnabled: true,
    requestsPerMinute: 100,
    enableCors: true,
    allowedOrigins: 'https://company.com, https://app.company.com',
    tokenExpiration: 24 // hours
  });

  const [activeTokens] = useState([
    {
      id: 'token-1',
      name: 'Mobile App Integration',
      created: '2025-07-15T10:30:00Z',
      lastUsed: '2025-07-31T04:15:00Z',
      permissions: ['read:objectives', 'write:progress'],
      status: 'active'
    },
    {
      id: 'token-2',
      name: 'Analytics Dashboard',
      created: '2025-07-20T14:20:00Z',
      lastUsed: '2025-07-30T22:45:00Z',
      permissions: ['read:analytics', 'read:reports'],
      status: 'active'
    },
    {
      id: 'token-3',
      name: 'Slack Integration',
      created: '2025-07-10T09:15:00Z',
      lastUsed: '2025-07-25T16:30:00Z',
      permissions: ['read:notifications', 'write:notifications'],
      status: 'expired'
    }
  ]);

  const [securityEvents] = useState([
    {
      id: 'event-1',
      type: 'login_failure',
      user: 'john.doe@company.com',
      timestamp: '2025-07-31T04:20:00Z',
      details: 'Multiple failed login attempts',
      severity: 'high',
      resolved: false
    },
    {
      id: 'event-2',
      type: 'api_rate_limit',
      user: 'api-client-mobile',
      timestamp: '2025-07-31T03:45:00Z',
      details: 'Rate limit exceeded (150 requests/minute)',
      severity: 'medium',
      resolved: true
    },
    {
      id: 'event-3',
      type: 'permission_change',
      user: 'admin@company.com',
      timestamp: '2025-07-31T02:30:00Z',
      details: 'User permissions modified for jane.smith@company.com',
      severity: 'low',
      resolved: true
    }
  ]);

  const handlePasswordPolicyChange = (field, value) => {
    setPasswordPolicy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSessionSettingChange = (field, value) => {
    setSessionSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRevokeToken = (tokenId) => {
    console.log('Revoking token:', tokenId);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Security Score</p>
              <p className="text-2xl font-bold text-foreground">92%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="text-2xl font-bold text-foreground">47</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Key" size={20} className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">API Tokens</p>
              <p className="text-2xl font-bold text-foreground">
                {activeTokens?.filter(t => t?.status === 'active')?.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Security Events</p>
              <p className="text-2xl font-bold text-foreground">
                {securityEvents?.filter(e => !e?.resolved)?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Password Policy */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Lock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Password Policy</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Minimum Length"
            type="number"
            value={passwordPolicy?.minLength}
            onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e?.target?.value))}
            min="6"
            max="32"
          />
          
          <Input
            label="Password Expiration (Days)"
            type="number"
            value={passwordPolicy?.expirationDays}
            onChange={(e) => handlePasswordPolicyChange('expirationDays', parseInt(e?.target?.value))}
            min="30"
            max="365"
          />
          
          <Input
            label="Prevent Reuse (Last N passwords)"
            type="number"
            value={passwordPolicy?.preventReuse}
            onChange={(e) => handlePasswordPolicyChange('preventReuse', parseInt(e?.target?.value))}
            min="0"
            max="10"
          />
          
          <Input
            label="Lockout After (Failed attempts)"
            type="number"
            value={passwordPolicy?.lockoutAttempts}
            onChange={(e) => handlePasswordPolicyChange('lockoutAttempts', parseInt(e?.target?.value))}
            min="3"
            max="10"
          />
        </div>
        
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-foreground">Password Requirements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Checkbox
              label="Require uppercase letters"
              checked={passwordPolicy?.requireUppercase}
              onChange={(e) => handlePasswordPolicyChange('requireUppercase', e?.target?.checked)}
            />
            <Checkbox
              label="Require lowercase letters"
              checked={passwordPolicy?.requireLowercase}
              onChange={(e) => handlePasswordPolicyChange('requireLowercase', e?.target?.checked)}
            />
            <Checkbox
              label="Require numbers"
              checked={passwordPolicy?.requireNumbers}
              onChange={(e) => handlePasswordPolicyChange('requireNumbers', e?.target?.checked)}
            />
            <Checkbox
              label="Require special characters"
              checked={passwordPolicy?.requireSpecialChars}
              onChange={(e) => handlePasswordPolicyChange('requireSpecialChars', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Session Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Clock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Session Management</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Session Timeout (Minutes)"
            type="number"
            value={sessionSettings?.sessionTimeout}
            onChange={(e) => handleSessionSettingChange('sessionTimeout', parseInt(e?.target?.value))}
            min="30"
            max="1440"
            description="Maximum session duration"
          />
          
          <Input
            label="Idle Timeout (Minutes)"
            type="number"
            value={sessionSettings?.idleTimeout}
            onChange={(e) => handleSessionSettingChange('idleTimeout', parseInt(e?.target?.value))}
            min="15"
            max="240"
            description="Timeout after inactivity"
          />
          
          <Input
            label="Max Concurrent Sessions"
            type="number"
            value={sessionSettings?.maxConcurrentSessions}
            onChange={(e) => handleSessionSettingChange('maxConcurrentSessions', parseInt(e?.target?.value))}
            min="1"
            max="10"
          />
        </div>
        
        <div className="mt-6 space-y-3">
          <Checkbox
            label="Require re-authentication for sensitive actions"
            checked={sessionSettings?.requireReauth}
            onChange={(e) => handleSessionSettingChange('requireReauth', e?.target?.checked)}
          />
          <Checkbox
            label="Enable 'Remember Me' option"
            checked={sessionSettings?.rememberMe}
            onChange={(e) => handleSessionSettingChange('rememberMe', e?.target?.checked)}
          />
          <Checkbox
            label="Secure cookies only (HTTPS)"
            checked={sessionSettings?.secureOnly}
            onChange={(e) => handleSessionSettingChange('secureOnly', e?.target?.checked)}
          />
        </div>
      </div>
      {/* API Security */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Key" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">API Security</h3>
          </div>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Generate Token
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Rate Limit (Requests per minute)"
            type="number"
            value={apiSettings?.requestsPerMinute}
            onChange={(e) => setApiSettings(prev => ({ ...prev, requestsPerMinute: parseInt(e?.target?.value) }))}
            min="10"
            max="1000"
          />
          
          <Input
            label="Token Expiration (Hours)"
            type="number"
            value={apiSettings?.tokenExpiration}
            onChange={(e) => setApiSettings(prev => ({ ...prev, tokenExpiration: parseInt(e?.target?.value) }))}
            min="1"
            max="8760"
          />
        </div>
        
        <div className="space-y-3 mb-6">
          <Checkbox
            label="Enable API access"
            checked={apiSettings?.enableApiAccess}
            onChange={(e) => setApiSettings(prev => ({ ...prev, enableApiAccess: e?.target?.checked }))}
          />
          <Checkbox
            label="Require API key authentication"
            checked={apiSettings?.requireApiKey}
            onChange={(e) => setApiSettings(prev => ({ ...prev, requireApiKey: e?.target?.checked }))}
          />
          <Checkbox
            label="Enable rate limiting"
            checked={apiSettings?.rateLimitEnabled}
            onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimitEnabled: e?.target?.checked }))}
          />
        </div>

        {/* Active API Tokens */}
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-4">Active API Tokens</h4>
          <div className="space-y-3">
            {activeTokens?.map((token) => (
              <div key={token?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-medium text-foreground">{token?.name}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      token?.status === 'active' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                    }`}>
                      {token?.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Created: {new Date(token.created)?.toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Last used: {new Date(token.lastUsed)?.toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Permissions: {token?.permissions?.join(', ')}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeToken(token?.id)}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Security Events */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recent Security Events</h3>
          </div>
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export Log
          </Button>
        </div>
        
        <div className="space-y-3">
          {securityEvents?.map((event) => (
            <div key={event?.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
              <Icon 
                name={getSeverityIcon(event?.severity)} 
                size={20} 
                className={getSeverityColor(event?.severity)} 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-foreground capitalize">
                    {event?.type?.replace('_', ' ')}
                  </h5>
                  <span className="text-sm text-muted-foreground">
                    {new Date(event.timestamp)?.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{event?.details}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>User: {event?.user}</span>
                  {event?.resolved && (
                    <span className="px-2 py-1 bg-success/10 text-success rounded-full">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Audit Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Audit & Compliance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Log Retention (Days)"
            type="number"
            value={auditSettings?.retentionDays}
            onChange={(e) => setAuditSettings(prev => ({ ...prev, retentionDays: parseInt(e?.target?.value) }))}
            min="30"
            max="2555"
            description="How long to keep audit logs"
          />
        </div>
        
        <div className="mt-6 space-y-3">
          <Checkbox
            label="Enable audit logging"
            description="Log all system activities and changes"
            checked={auditSettings?.enableAuditLog}
            onChange={(e) => setAuditSettings(prev => ({ ...prev, enableAuditLog: e?.target?.checked }))}
          />
          <Checkbox
            label="Log login attempts"
            description="Track successful and failed login attempts"
            checked={auditSettings?.logLoginAttempts}
            onChange={(e) => setAuditSettings(prev => ({ ...prev, logLoginAttempts: e?.target?.checked }))}
          />
          <Checkbox
            label="Log data changes"
            description="Track all data modifications and deletions"
            checked={auditSettings?.logDataChanges}
            onChange={(e) => setAuditSettings(prev => ({ ...prev, logDataChanges: e?.target?.checked }))}
          />
          <Checkbox
            label="Real-time security alerts"
            description="Send immediate notifications for security events"
            checked={auditSettings?.realTimeAlerts}
            onChange={(e) => setAuditSettings(prev => ({ ...prev, realTimeAlerts: e?.target?.checked }))}
          />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;