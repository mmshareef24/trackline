import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useOrganization } from '../../../contexts/OrganizationContext';

const GeneralSettings = () => {
  const { currentOrg, updateOrganization, isLoading: isOrgLoading } = useOrganization();
  const [settings, setSettings] = useState({
    companyName: "TechCorp Solutions",
    companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "SAR",
    fiscalYearStart: "January",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    enableWeekends: false,
    defaultQuarterLength: 90,
    autoArchiveCompleted: true,
    enableNotifications: true,
    maintenanceMode: false
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentOrg) {
      // Merge saved settings with defaults
      setSettings(prev => ({
        ...prev,
        companyName: currentOrg.name || prev.companyName,
        // If settings column exists and has data, use it, otherwise use defaults
        ...(currentOrg.settings || {})
      }));
    }
  }, [currentOrg]);

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" }
  ];

  const currencies = [
    { value: "SAR", label: "Saudi Riyal (SAR)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (C$)" }
  ];

  const fiscalMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!currentOrg) {
      alert('Error: No organization selected or loaded. Please check your connection or select an organization.');
      return;
    }
    
    setIsSaving(true);
    
    // Separate name from other settings
    const { companyName, ...otherSettings } = settings;
    
    const updates = {
      name: companyName,
      settings: otherSettings
    };

    let { success, error } = await updateOrganization(currentOrg.id, updates);
    
    // Fallback: If failed due to missing settings column, try saving just the name
    if (!success && error.message && error.message.includes('settings')) {
       console.warn('Settings column missing, attempting to save name only.');
       const nameUpdate = { name: companyName };
       const retryResult = await updateOrganization(currentOrg.id, nameUpdate);
       
       if (retryResult.success) {
         setIsSaving(false);
         alert('Company name saved successfully! However, system preferences could not be saved because the database schema is outdated (missing settings column). Please contact IT to run the migration.');
         return;
       }
    }
    
    setIsSaving(false);
    
    if (success) {
      alert('General settings saved successfully!');
    } else {
      alert('Failed to save settings: ' + error.message);
    }
  };

  const handleReset = () => {
    setSettings({
      companyName: "TechCorp Solutions",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      currency: "SAR",
      fiscalYearStart: "January",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      enableWeekends: false,
      defaultQuarterLength: 90,
      autoArchiveCompleted: true,
      enableNotifications: true,
      maintenanceMode: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Building2" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Company Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Company Name"
              type="text"
              value={settings?.companyName}
              onChange={(e) => handleInputChange('companyName', e?.target?.value)}
              placeholder="Enter company name"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <Input
              label="Company Logo URL"
              type="url"
              value={settings?.companyLogo}
              onChange={(e) => handleInputChange('companyLogo', e?.target?.value)}
              placeholder="https://example.com/logo.png"
              description="Recommended size: 200x200px, PNG or JPG format"
            />
          </div>
        </div>
      </div>
      {/* Regional Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Regional Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select 
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              value={settings?.timezone}
              onChange={(e) => handleInputChange('timezone', e?.target?.value)}
            >
              {timezones?.map(tz => (
                <option key={tz?.value} value={tz?.value}>{tz?.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
            <select 
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              value={settings?.dateFormat}
              onChange={(e) => handleInputChange('dateFormat', e?.target?.value)}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
            <select 
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              value={settings?.currency}
              onChange={(e) => handleInputChange('currency', e?.target?.value)}
            >
              {currencies?.map(curr => (
                <option key={curr?.value} value={curr?.value}>{curr?.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fiscal Year Start</label>
            <select 
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              value={settings?.fiscalYearStart}
              onChange={(e) => handleInputChange('fiscalYearStart', e?.target?.value)}
            >
              {fiscalMonths?.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* System Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">System Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Input
              label="Default Quarter Length (Days)"
              type="number"
              value={settings?.defaultQuarterLength}
              onChange={(e) => handleInputChange('defaultQuarterLength', parseInt(e?.target?.value))}
              min="30"
              max="120"
              description="Standard quarter length for OKR cycles"
            />
          </div>
          
          <div className="space-y-3">
            <Checkbox
              label="Auto-archive completed objectives"
              description="Automatically move completed objectives to archive after 30 days"
              checked={settings?.autoArchiveCompleted}
              onChange={(e) => handleInputChange('autoArchiveCompleted', e?.target?.checked)}
            />
            
            <Checkbox
              label="Enable system notifications"
              description="Allow the system to send email and in-app notifications"
              checked={settings?.enableNotifications}
              onChange={(e) => handleInputChange('enableNotifications', e?.target?.checked)}
            />
            
            <Checkbox
              label="Enable weekend tracking"
              description="Allow progress updates and check-ins on weekends"
              checked={settings?.enableWeekends}
              onChange={(e) => handleInputChange('enableWeekends', e?.target?.checked)}
            />
            
            <Checkbox
              label="Maintenance Mode"
              description="Restrict system access to administrators only"
              checked={settings?.maintenanceMode}
              onChange={(e) => handleInputChange('maintenanceMode', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset to Defaults
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => console.log('Test configuration')}
            iconName="TestTube"
            iconPosition="left"
          >
            Test Configuration
          </Button>
          
          <Button
            variant="default"
            onClick={handleSave}
            loading={isSaving || isOrgLoading}
            disabled={isSaving || isOrgLoading}
            iconName="Save"
            iconPosition="left"
          >
            {isOrgLoading ? 'Loading...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;