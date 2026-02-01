import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useOrganization } from '../../../contexts/OrganizationContext';
import { supabase } from '../../../utils/supabaseClient';

const OrganizationSettings = () => {
  const { 
    currentOrg, 
    organizations, 
    switchOrganization, 
    createOrganization,
    refreshOrganizations 
  } = useOrganization();

  const [newOrgName, setNewOrgName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

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
    console.log('Test Connection clicked');
    setConnectionStatus('checking');
    
    if (!supabase) {
      console.error('Supabase client is not initialized');
      setConnectionStatus('error');
      alert('System Error: Supabase client is not initialized.');
      return;
    }

    try {
      console.log('Pinging Supabase...');
      const { data, error } = await supabase.from('organizations').select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Supabase Ping Error:', error);
        throw error;
      }
      
      console.log('Supabase Ping Success:', data);
      setConnectionStatus('success');
      // alert('Connection Successful!'); // Optional feedback
    } catch (err) {
      console.error('Connection Test Exception:', err);
      setConnectionStatus('error');
      alert('Connection Failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
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
               <p className="text-xs text-muted-foreground">
                 {connectionStatus === 'success' ? 'Supabase is reachable and responding.' : 
                  connectionStatus === 'error' ? 'Cannot reach Supabase. Check network/config.' : 
                  'Click test to verify connection.'}
               </p>
             </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleTestConnection}
            disabled={connectionStatus === 'checking'}
          >
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
          <div className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
            Active
          </div>
        </div>
      </div>

      {/* Switch Organization */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Switch Organization</h3>
        <div className="grid gap-3">
          {organizations.map(org => (
            <div 
              key={org.id} 
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                currentOrg?.id === org.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => switchOrganization(org.id)}
            >
              <div className="flex items-center gap-3">
                <Icon name="Building" size={18} className={currentOrg?.id === org.id ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`text-sm font-medium ${currentOrg?.id === org.id ? 'text-primary' : 'text-foreground'}`}>
                  {org.name}
                </span>
              </div>
              {currentOrg?.id === org.id && <Icon name="Check" size={16} className="text-primary" />}
            </div>
          ))}
        </div>
      </div>

      {/* Create New Organization */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Create New Organization</h3>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Enter organization name"
            className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
          />
          <Button 
            variant="default" 
            onClick={handleCreateOrg}
            disabled={isCreating || !newOrgName.trim()}
            iconName="Plus"
            iconPosition="left"
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;
