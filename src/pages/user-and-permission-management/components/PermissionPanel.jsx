import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PermissionPanel = ({ selectedUser, onUpdateUser, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: selectedUser?.name || '',
    email: selectedUser?.email || '',
    department: selectedUser?.department || '',
    role: selectedUser?.role || '',
    status: selectedUser?.status || '',
    permissions: selectedUser?.permissions || {}
  });

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const permissionCategories = [
    {
      category: 'Objectives Management',
      permissions: [
        { key: 'create_objectives', label: 'Create Objectives', description: 'Allow user to create new objectives' },
        { key: 'edit_objectives', label: 'Edit Objectives', description: 'Allow user to modify existing objectives' },
        { key: 'delete_objectives', label: 'Delete Objectives', description: 'Allow user to delete objectives' },
        { key: 'assign_objectives', label: 'Assign Objectives', description: 'Allow user to assign objectives to team members' }
      ]
    },
    {
      category: 'Progress Tracking',
      permissions: [
        { key: 'view_progress', label: 'View Progress', description: 'Allow user to view progress reports' },
        { key: 'update_progress', label: 'Update Progress', description: 'Allow user to update progress on objectives' },
        { key: 'view_analytics', label: 'View Analytics', description: 'Allow user to access analytics dashboard' },
        { key: 'export_reports', label: 'Export Reports', description: 'Allow user to export progress reports' }
      ]
    },
    {
      category: 'Team Management',
      permissions: [
        { key: 'manage_team', label: 'Manage Team', description: 'Allow user to manage team members' },
        { key: 'view_team_progress', label: 'View Team Progress', description: 'Allow user to view team progress' },
        { key: 'conduct_checkins', label: 'Conduct Check-ins', description: 'Allow user to conduct team check-ins' },
        { key: 'approve_objectives', label: 'Approve Objectives', description: 'Allow user to approve team objectives' }
      ]
    },
    {
      category: 'System Administration',
      permissions: [
        { key: 'manage_users', label: 'Manage Users', description: 'Allow user to manage other users' },
        { key: 'system_settings', label: 'System Settings', description: 'Allow user to modify system settings' },
        { key: 'audit_logs', label: 'Audit Logs', description: 'Allow user to view audit logs' },
        { key: 'backup_restore', label: 'Backup & Restore', description: 'Allow user to perform backup and restore operations' }
      ]
    }
  ];

  const handleSave = () => {
    onUpdateUser({ ...selectedUser, ...formData });
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: selectedUser?.name || '',
      email: selectedUser?.email || '',
      department: selectedUser?.department || '',
      role: selectedUser?.role || '',
      status: selectedUser?.status || '',
      permissions: selectedUser?.permissions || {}
    });
    setEditMode(false);
  };

  const handlePermissionChange = (permissionKey, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev?.permissions,
        [permissionKey]: checked
      }
    }));
  };

  const getRolePermissions = (role) => {
    const rolePermissionMap = {
      admin: permissionCategories?.flatMap(cat => cat?.permissions?.map(p => p?.key)),
      manager: ['create_objectives', 'edit_objectives', 'assign_objectives', 'view_progress', 'update_progress', 'view_analytics', 'manage_team', 'view_team_progress', 'conduct_checkins', 'approve_objectives'],
      editor: ['create_objectives', 'edit_objectives', 'view_progress', 'update_progress', 'view_team_progress'],
      viewer: ['view_progress', 'view_analytics', 'view_team_progress']
    };
    return rolePermissionMap?.[role] || [];
  };

  const applyRolePermissions = () => {
    const rolePermissions = getRolePermissions(formData?.role);
    const newPermissions = {};
    rolePermissions?.forEach(key => {
      newPermissions[key] = true;
    });
    setFormData(prev => ({
      ...prev,
      permissions: newPermissions
    }));
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No User Selected</h3>
          <p className="text-muted-foreground">Select a user from the list to view and manage their permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-primary-foreground">
                {selectedUser?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{selectedUser?.name}</h2>
              <p className="text-muted-foreground">{selectedUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditMode(true)} iconName="Edit" iconPosition="left">
                Edit User
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData?.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
              disabled={!editMode}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData?.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e?.target?.value }))}
              disabled={!editMode}
            />
            <Select
              label="Department"
              options={departmentOptions}
              value={formData?.department}
              onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
              disabled={!editMode}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* Role Assignment */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Role Assignment</h3>
            {editMode && (
              <Button variant="outline" size="sm" onClick={applyRolePermissions}>
                Apply Role Permissions
              </Button>
            )}
          </div>
          <Select
            label="User Role"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            disabled={!editMode}
            description="Role determines the default set of permissions for this user"
          />
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Permissions</h3>
          <div className="space-y-6">
            {permissionCategories?.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
                  {category?.category}
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {category?.permissions?.map((permission, permissionIndex) => (
                    <div key={permissionIndex} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
                      <Checkbox
                        checked={formData?.permissions?.[permission?.key] || false}
                        onChange={(e) => handlePermissionChange(permission?.key, e?.target?.checked)}
                        disabled={!editMode}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-foreground cursor-pointer">
                          {permission?.label}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {permission?.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
          <div className="space-y-3">
            {selectedUser?.activityLog?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/10 rounded-lg">
                <Icon name={activity?.icon} size={16} className="text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity?.action}</p>
                  <p className="text-xs text-muted-foreground">{activity?.timestamp}</p>
                </div>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionPanel;