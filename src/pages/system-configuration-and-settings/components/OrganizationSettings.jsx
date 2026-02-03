import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useOrganization } from '../../../contexts/OrganizationContext';
import { supabase } from '../../../utils/supabaseClient';

const OrganizationSettings = () => {
  const { 
    currentOrg, 
    organizations, 
    strategicThemes,
    switchOrganization, 
    createOrganization,
    updateOrganization,
    addStrategicTheme,
    deleteStrategicTheme,
    refreshOrganizations 
  } = useOrganization();

  const [newOrgName, setNewOrgName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'strategy', 'hierarchy'

  // Strategy State
  const [strategyForm, setStrategyForm] = useState({
    vision: '',
    mission: '',
    values: ''
  });
  const [isSavingStrategy, setIsSavingStrategy] = useState(false);
  const [newTheme, setNewTheme] = useState({ title: '', description: '' });

  // Hierarchy State
  const [newSubName, setNewSubName] = useState('');

  useEffect(() => {
    if (currentOrg) {
      setStrategyForm({
        vision: currentOrg.vision || '',
        mission: currentOrg.mission || '',
        values: currentOrg.values || ''
      });
    }
  }, [currentOrg]);

  const handleCreateOrg = async () => {
    if (!newOrgName.trim()) return;
    
    setIsCreating(true);
    const { success, error } = await createOrganization(newOrgName);
    setIsCreating(false);

    if (success) {
      setNewOrgName('');
      alert('Organization created successfully!');
    } else {
      alert('Failed to create organization: ' + error.message);
    }
  };

  const handleTestConnection = async () => {
    setConnectionStatus('checking');
    
    if (!supabase) {
      setConnectionStatus('error');
      alert('System Error: Supabase client is not initialized.');
      return;
    }

    try {
      const { data, error } = await supabase.from('organizations').select('count', { count: 'exact', head: true });
      if (error) throw error;
      setConnectionStatus('success');
    } catch (err) {
      setConnectionStatus('error');
      alert('Connection Failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSaveStrategy = async () => {
    setIsSavingStrategy(true);
    const { success, error } = await updateOrganization(currentOrg.id, strategyForm);
    setIsSavingStrategy(false);
    
    if (success) {
      alert('Strategic direction updated successfully!');
    } else {
      alert('Failed to update strategy: ' + error.message);
    }
  };

  const handleAddTheme = async () => {
    if (!newTheme.title.trim()) return;
    const { success, error } = await addStrategicTheme(newTheme.title, newTheme.description);
    if (success) {
      setNewTheme({ title: '', description: '' });
    } else {
      alert('Failed to add theme: ' + error.message);
    }
  };

  const handleAddSubsidiary = async () => {
    if (!newSubName.trim()) return;
    const { success, error } = await createOrganization(newSubName, currentOrg.id, 'subsidiary');
    if (success) {
      setNewSubName('');
      alert('Subsidiary created successfully!');
    } else {
      alert('Failed to create subsidiary: ' + error.message);
    }
  };

  // Helper to render org tree for Switcher
  const renderOrgTree = (orgs, parentId = null, level = 0) => {
    return orgs
      .filter(org => org.parent_id === parentId)
      .map(org => (
        <React.Fragment key={org.id}>
          <div 
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              currentOrg?.id === org.id 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:bg-muted/50'
            }`}
            style={{ marginLeft: `${level * 20}px` }}
            onClick={() => switchOrganization(org.id)}
          >
            <div className="flex items-center gap-3">
              <Icon name={org.type === 'holding' ? 'Building' : 'GitBranch'} size={18} className={currentOrg?.id === org.id ? 'text-primary' : 'text-muted-foreground'} />
              <div>
                <span className={`text-sm font-medium ${currentOrg?.id === org.id ? 'text-primary' : 'text-foreground'}`}>
                  {org.name}
                </span>
                {org.type !== 'company' && (
                  <span className="ml-2 text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                    {org.type}
                  </span>
                )}
              </div>
            </div>
            {currentOrg?.id === org.id && <Icon name="Check" size={16} className="text-primary" />}
          </div>
          {renderOrgTree(orgs, org.id, level + 1)}
        </React.Fragment>
      ));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile & Connection
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'strategy' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('strategy')}
        >
          Strategic Direction
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'hierarchy' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('hierarchy')}
        >
          Organization Hierarchy
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Database Connection Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Database Connection</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${
                   connectionStatus === 'success' ? 'bg-success' : 
                   connectionStatus === 'error' ? 'bg-error' : 
                   'bg-muted'
                 }`}></div>
                 <div>
                   <p className="text-sm font-medium text-foreground">
                     {connectionStatus === 'success' ? 'Connected' : 
                      connectionStatus === 'error' ? 'Connection Failed' : 
                      'Unknown Status'}
                   </p>
                 </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={connectionStatus === 'checking'}>
                {connectionStatus === 'checking' ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </div>

          {/* Current Organization */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Current Organization</h3>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                  <Icon name="Building" className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{currentOrg?.name || 'Loading...'}</h4>
                  <p className="text-xs text-muted-foreground">ID: {currentOrg?.id}</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">Active</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="space-y-6">
          {/* Vision & Mission */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-foreground">Vision, Mission & Values</h3>
              <Button onClick={handleSaveStrategy} disabled={isSavingStrategy}>
                {isSavingStrategy ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Vision Statement</label>
                <textarea 
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-[80px]"
                  placeholder="e.g. To be the world's leading provider of..."
                  value={strategyForm.vision}
                  onChange={e => setStrategyForm(prev => ({ ...prev, vision: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Mission Statement</label>
                <textarea 
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-[80px]"
                  placeholder="e.g. To innovate and inspire..."
                  value={strategyForm.mission}
                  onChange={e => setStrategyForm(prev => ({ ...prev, mission: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Core Values</label>
                <textarea 
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-[80px]"
                  placeholder="e.g. Integrity, Innovation, Customer Success..."
                  value={strategyForm.values}
                  onChange={e => setStrategyForm(prev => ({ ...prev, values: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Strategic Themes */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Strategic Themes</h3>
            
            <div className="mb-4 space-y-2">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Theme Title" 
                  className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm"
                  value={newTheme.title}
                  onChange={e => setNewTheme(prev => ({ ...prev, title: e.target.value }))}
                />
                <input 
                  type="text" 
                  placeholder="Description (Optional)" 
                  className="flex-[2] bg-background border border-border rounded-md px-3 py-2 text-sm"
                  value={newTheme.description}
                  onChange={e => setNewTheme(prev => ({ ...prev, description: e.target.value }))}
                />
                <Button onClick={handleAddTheme} disabled={!newTheme.title.trim()} iconName="Plus">Add</Button>
              </div>
            </div>

            <div className="space-y-2">
              {strategicThemes?.map(theme => (
                <div key={theme.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
                  <div>
                    <h5 className="font-medium text-sm">{theme.title}</h5>
                    {theme.description && <p className="text-xs text-muted-foreground">{theme.description}</p>}
                  </div>
                  <Button variant="ghost" size="sm" iconName="Trash" onClick={() => deleteStrategicTheme(theme.id)} className="text-destructive hover:bg-destructive/10" />
                </div>
              ))}
              {(!strategicThemes || strategicThemes.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No strategic themes defined yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          {/* Switch Organization */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Organization Structure</h3>
            <p className="text-sm text-muted-foreground mb-4">Select an organization to switch context.</p>
            <div className="grid gap-3">
              {renderOrgTree(organizations)}
            </div>
          </div>

          {/* Create Subsidiary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Add Subsidiary / Business Unit</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new entity under <strong>{currentOrg?.name}</strong>.
            </p>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Enter subsidiary name"
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
              />
              <Button 
                variant="default" 
                onClick={handleAddSubsidiary}
                disabled={!newSubName.trim()}
                iconName="GitBranch"
                iconPosition="left"
              >
                Create Subsidiary
              </Button>
            </div>
          </div>

          {/* Create New Root Organization */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Create New Independent Organization</h3>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Enter organization name"
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
              />
              <Button 
                variant="outline" 
                onClick={handleCreateOrg}
                disabled={isCreating || !newOrgName.trim()}
                iconName="Plus"
                iconPosition="left"
              >
                {isCreating ? 'Creating...' : 'Create New Root'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSettings;