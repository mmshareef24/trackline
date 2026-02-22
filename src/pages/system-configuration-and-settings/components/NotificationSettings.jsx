import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSettings = () => {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.company.com',
    smtpPort: 587,
    smtpUsername: 'okr-notifications@company.com',
    smtpPassword: '••••••••••••',
    enableTLS: true,
    fromName: 'JASCO Insight',
    fromEmail: 'okr-notifications@company.com',
    replyToEmail: 'support@company.com'
  });

  const [notificationRules, setNotificationRules] = useState([
    {
      id: 'objective-created',
      name: 'Objective Created',
      description: 'When a new objective is created',
      enabled: true,
      channels: ['email', 'inapp'],
      recipients: ['owner', 'manager', 'team'],
      timing: 'immediate',
      template: 'objective-created-template'
    },
    {
      id: 'kr-updated',
      name: 'Key Result Updated',
      description: 'When progress is updated on a key result',
      enabled: true,
      channels: ['inapp'],
      recipients: ['owner', 'manager'],
      timing: 'immediate',
      template: 'kr-updated-template'
    },
    {
      id: 'checkin-reminder',
      name: 'Check-in Reminder',
      description: 'Weekly reminder for team check-ins',
      enabled: true,
      channels: ['email', 'inapp', 'slack'],
      recipients: ['team'],
      timing: 'weekly-friday',
      template: 'checkin-reminder-template'
    },
    {
      id: 'deadline-approaching',
      name: 'Deadline Approaching',
      description: 'When objective deadline is within 7 days',
      enabled: true,
      channels: ['email', 'inapp'],
      recipients: ['owner', 'manager'],
      timing: '7-days-before',
      template: 'deadline-warning-template'
    },
    {
      id: 'objective-completed',
      name: 'Objective Completed',
      description: 'When an objective is marked as completed',
      enabled: true,
      channels: ['email', 'inapp', 'slack'],
      recipients: ['owner', 'manager', 'team'],
      timing: 'immediate',
      template: 'objective-completed-template'
    }
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 'objective-created-template',
      name: 'Objective Created',
      subject: 'New Objective: {{objective.title}}',
      content: `A new objective has been created:\n\n**{{objective.title}}**\n\nOwner: {{objective.owner}}\nDue Date: {{objective.dueDate}}\n\nView objective: {{objective.url}}`
    },
    {
      id: 'kr-updated-template',
      name: 'Key Result Updated',
      subject: 'Progress Update: {{kr.title}}',
      content: `Progress has been updated on key result:\n\n**{{kr.title}}**\n\nNew Progress: {{kr.progress}}%\nObjective: {{objective.title}}\n\nView details: {{kr.url}}`
    },
    {
      id: 'checkin-reminder-template',
      name: 'Check-in Reminder',
      subject: 'Weekly Check-in Reminder',
      content: `Hi {{user.name}},\n\nIt's time for your weekly OKR check-in. Please update your progress and share any blockers or achievements.\n\nSubmit check-in: {{checkin.url}}`
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleEmailSettingChange = (field, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRuleToggle = (ruleId) => {
    setNotificationRules(prev => prev?.map(rule => 
      rule?.id === ruleId ? { ...rule, enabled: !rule?.enabled } : rule
    ));
  };

  const handleChannelToggle = (ruleId, channel) => {
    setNotificationRules(prev => prev?.map(rule => {
      if (rule?.id === ruleId) {
        const channels = rule?.channels?.includes(channel)
          ? rule?.channels?.filter(c => c !== channel)
          : [...rule?.channels, channel];
        return { ...rule, channels };
      }
      return rule;
    }));
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTestingEmail(false);
    console.log('Test email sent');
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return 'Mail';
      case 'inapp': return 'Bell';
      case 'slack': return 'MessageSquare';
      case 'sms': return 'Smartphone';
      case 'whatsapp': return 'Phone';
      default: return 'Bell';
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Mail" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Email Configuration</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestEmail}
            loading={isTestingEmail}
            iconName="Send"
            iconPosition="left"
          >
            Test Email
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="SMTP Server"
            type="text"
            value={emailSettings?.smtpServer}
            onChange={(e) => handleEmailSettingChange('smtpServer', e?.target?.value)}
            placeholder="smtp.company.com"
          />
          
          <Input
            label="SMTP Port"
            type="number"
            value={emailSettings?.smtpPort}
            onChange={(e) => handleEmailSettingChange('smtpPort', parseInt(e?.target?.value))}
            placeholder="587"
          />
          
          <Input
            label="Username"
            type="email"
            value={emailSettings?.smtpUsername}
            onChange={(e) => handleEmailSettingChange('smtpUsername', e?.target?.value)}
            placeholder="notifications@company.com"
          />
          
          <Input
            label="Password"
            type="password"
            value={emailSettings?.smtpPassword}
            onChange={(e) => handleEmailSettingChange('smtpPassword', e?.target?.value)}
            placeholder="••••••••••••"
          />
          
          <Input
            label="From Name"
            type="text"
            value={emailSettings?.fromName}
            onChange={(e) => handleEmailSettingChange('fromName', e?.target?.value)}
            placeholder="JASCO Insight"
          />
          
          <Input
            label="From Email"
            type="email"
            value={emailSettings?.fromEmail}
            onChange={(e) => handleEmailSettingChange('fromEmail', e?.target?.value)}
            placeholder="notifications@company.com"
          />
        </div>
        
        <div className="mt-4">
          <Checkbox
            label="Enable TLS/SSL"
            description="Use secure connection for email delivery"
            checked={emailSettings?.enableTLS}
            onChange={(e) => handleEmailSettingChange('enableTLS', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Notification Rules */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notification Rules</h3>
        </div>
        
        <div className="space-y-4">
          {notificationRules?.map((rule) => (
            <div key={rule?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Checkbox
                      checked={rule?.enabled}
                      onChange={() => handleRuleToggle(rule?.id)}
                    />
                    <h4 className="font-medium text-foreground">{rule?.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">{rule?.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {rule?.timing === 'immediate' ? 'Immediate' : 
                     rule?.timing === 'weekly-friday' ? 'Weekly (Friday)' :
                     rule?.timing === '7-days-before' ? '7 days before' : rule?.timing}
                  </span>
                </div>
              </div>
              
              {rule?.enabled && (
                <div className="ml-7 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Channels</label>
                    <div className="flex items-center space-x-4">
                      {['email', 'inapp', 'slack', 'sms', 'whatsapp']?.map((channel) => (
                        <label key={channel} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule?.channels?.includes(channel)}
                            onChange={() => handleChannelToggle(rule?.id, channel)}
                            className="rounded border-border text-primary focus:ring-ring"
                          />
                          <Icon name={getChannelIcon(channel)} size={16} className="text-muted-foreground" />
                          <span className="text-sm text-foreground capitalize">{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Recipients</label>
                    <div className="flex items-center space-x-4">
                      {['owner', 'manager', 'team', 'admin']?.map((recipient) => (
                        <label key={recipient} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule?.recipients?.includes(recipient)}
                            onChange={() => {}}
                            className="rounded border-border text-primary focus:ring-ring"
                          />
                          <span className="text-sm text-foreground capitalize">{recipient}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Email Templates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Email Templates</h3>
          </div>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            New Template
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground mb-3">Available Templates</h4>
            {templates?.map((template) => (
              <div
                key={template?.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <h5 className="font-medium text-foreground">{template?.name}</h5>
                <p className="text-sm text-muted-foreground truncate">{template?.subject}</p>
              </div>
            ))}
          </div>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Edit Template</h4>
              
              <Input
                label="Template Name"
                type="text"
                value={selectedTemplate?.name}
                onChange={() => {}}
                placeholder="Template name"
              />
              
              <Input
                label="Subject Line"
                type="text"
                value={selectedTemplate?.subject}
                onChange={() => {}}
                placeholder="Email subject"
                description="Use {{variable}} for dynamic content"
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Content</label>
                <textarea
                  className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  value={selectedTemplate?.content}
                  onChange={() => {}}
                  placeholder="Email content..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available variables: {`{{user.name}}, {{objective.title}}, {{kr.progress}}`}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button variant="default" size="sm">
                  Save Template
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;