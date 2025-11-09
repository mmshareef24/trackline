import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportExportModal = ({ isOpen, onClose, onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    reportName: `OKR Analytics Report - ${new Date()?.toLocaleDateString()}`,
    includeCharts: true,
    includeRawData: false,
    includeTeamBreakdown: true,
    includeExecutiveSummary: true,
    recipients: '',
    scheduleFrequency: 'none'
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'powerpoint', label: 'PowerPoint Presentation' },
    { value: 'csv', label: 'CSV Data Export' }
  ];

  const frequencyOptions = [
    { value: 'none', label: 'One-time Export' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handleConfigChange = (key, value) => {
    setExportConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    onExport(exportConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Download" size={18} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Export Report</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Input
              label="Report Name"
              type="text"
              value={exportConfig?.reportName}
              onChange={(e) => handleConfigChange('reportName', e?.target?.value)}
              placeholder="Enter report name"
            />
          </div>

          <div>
            <Select
              label="Export Format"
              options={formatOptions}
              value={exportConfig?.format}
              onChange={(value) => handleConfigChange('format', value)}
            />
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-3">Include in Report</h3>
            <div className="space-y-3">
              <Checkbox
                label="Charts and visualizations"
                checked={exportConfig?.includeCharts}
                onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
              />
              <Checkbox
                label="Raw data tables"
                checked={exportConfig?.includeRawData}
                onChange={(e) => handleConfigChange('includeRawData', e?.target?.checked)}
              />
              <Checkbox
                label="Team performance breakdown"
                checked={exportConfig?.includeTeamBreakdown}
                onChange={(e) => handleConfigChange('includeTeamBreakdown', e?.target?.checked)}
              />
              <Checkbox
                label="Executive summary"
                checked={exportConfig?.includeExecutiveSummary}
                onChange={(e) => handleConfigChange('includeExecutiveSummary', e?.target?.checked)}
              />
            </div>
          </div>

          <div>
            <Select
              label="Schedule Frequency"
              description="Set up automated report delivery"
              options={frequencyOptions}
              value={exportConfig?.scheduleFrequency}
              onChange={(value) => handleConfigChange('scheduleFrequency', value)}
            />
          </div>

          {exportConfig?.scheduleFrequency !== 'none' && (
            <div>
              <Input
                label="Email Recipients"
                type="email"
                value={exportConfig?.recipients}
                onChange={(e) => handleConfigChange('recipients', e?.target?.value)}
                placeholder="Enter email addresses separated by commas"
                description="Reports will be automatically sent to these recipients"
              />
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Export Preview</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Format: {formatOptions?.find(f => f?.value === exportConfig?.format)?.label}</p>
              <p>• Includes: {[
                exportConfig?.includeCharts && 'Charts',
                exportConfig?.includeRawData && 'Raw Data',
                exportConfig?.includeTeamBreakdown && 'Team Breakdown',
                exportConfig?.includeExecutiveSummary && 'Executive Summary'
              ]?.filter(Boolean)?.join(', ')}</p>
              {exportConfig?.scheduleFrequency !== 'none' && (
                <p>• Delivery: {frequencyOptions?.find(f => f?.value === exportConfig?.scheduleFrequency)?.label}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Export may take 1-2 minutes</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} iconName="Download" iconPosition="left">
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportExportModal;