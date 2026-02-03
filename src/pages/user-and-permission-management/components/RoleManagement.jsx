
import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../../contexts/OrganizationContext';
import { listRoles, createRole, deleteRole } from '../../../services/roleService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PERMISSION_MODULES = [
  {
    key: 'objectives',
    label: 'Objectives & Key Results',
    permissions: [
      { key: 'view_objectives', label: 'View Objectives' },
      { key: 'create_objectives', label: 'Create Objectives' },
      { key: 'edit_objectives', label: 'Edit Objectives' },
      { key: 'delete_objectives', label: 'Delete Objectives' }
    ]
  },
  {
    key: 'kpis',
    label: 'KPIs',
    permissions: [
      { key: 'view_kpis', label: 'View KPIs' },
      { key: 'manage_kpis', label: 'Manage KPIs' },
      { key: 'update_kpi_values', label: 'Update Values' }
    ]
  },
  {
    key: 'initiatives',
    label: 'Initiatives',
    permissions: [
      { key: 'view_initiatives', label: 'View Initiatives' },
      { key: 'manage_initiatives', label: 'Manage Initiatives' }
    ]
  },
  {
    key: 'users',
    label: 'User Management',
    permissions: [
      { key: 'view_users', label: 'View Users' },
      { key: 'manage_users', label: 'Manage Users & Roles' }
    ]
  }
];

const RoleManagement = () => {
  const { currentOrg } = useOrganization();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: {} });

  useEffect(() => {
    if (currentOrg) {
      loadRoles();
    }
  }, [currentOrg]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await listRoles(currentOrg.id);
      setRoles(data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permKey, checked) => {
    setNewRole(prev => {
      const newPermissions = { ...prev.permissions };
      if (checked) {
        newPermissions[permKey] = true;
      } else {
        delete newPermissions[permKey];
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRole.name) return;

    try {
      await createRole({
        organization_id: currentOrg.id,
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions
      });
      setIsCreating(false);
      setNewRole({ name: '', description: '', permissions: {} });
      loadRoles();
    } catch (error) {
      alert('Failed to create role: ' + error.message);
    }
  };

  const handleDelete = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role? Users assigned to this role will lose their permissions.')) return;
    try {
      await deleteRole(roleId);
      loadRoles();
    } catch (error) {
      alert('Failed to delete role: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Role Management</h2>
        <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? 'secondary' : 'primary'}>
          {isCreating ? 'Cancel' : 'Create New Role'}
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role Name</label>
              <Input 
                value={newRole.name} 
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                placeholder="e.g. Department Manager"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <Input 
                value={newRole.description} 
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                placeholder="Optional description" 
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PERMISSION_MODULES.map(module => (
                <div key={module.key} className="bg-white p-3 rounded border">
                  <h4 className="font-medium text-slate-800 mb-2">{module.label}</h4>
                  <div className="space-y-2">
                    {module.permissions.map(perm => (
                      <label key={perm.key} className="flex items-center space-x-2 text-sm text-slate-600">
                        <Checkbox 
                          checked={!!newRole.permissions[perm.key]} 
                          onCheckedChange={(checked) => handlePermissionChange(perm.key, checked)} 
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Role</Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4 text-sm font-medium text-slate-600">Role Name</th>
              <th className="py-3 px-4 text-sm font-medium text-slate-600">Description</th>
              <th className="py-3 px-4 text-sm font-medium text-slate-600">Permissions Count</th>
              <th className="py-3 px-4 text-sm font-medium text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="py-4 text-center text-slate-500">Loading roles...</td></tr>
            ) : roles.length === 0 ? (
              <tr><td colSpan="4" className="py-4 text-center text-slate-500">No custom roles defined.</td></tr>
            ) : (
              roles.map(role => (
                <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">{role.name}</td>
                  <td className="py-3 px-4 text-slate-600">{role.description || '-'}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                      {Object.keys(role.permissions || {}).length} permissions
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => handleDelete(role.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Role"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManagement;
