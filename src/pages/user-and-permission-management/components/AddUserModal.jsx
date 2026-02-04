import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddUserModal = ({ isOpen, onClose, onAddUser, availableDepartments = [], availableRoles = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    role_id: '', // Store the custom role ID
    status: 'pending',
    sendInvitation: true,
    permissions: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const departmentOptions = availableDepartments.map(d => ({
    value: d.name,
    label: d.name
  }));

  // Merge standard roles with dynamic roles
  const standardRoles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const roleOptions = [
    ...standardRoles,
    ...(availableRoles || []).map(r => ({ value: `custom:${r.id}`, label: r.name, isCustom: true }))
  ];

  const handleRoleChange = (e) => {
    const value = e.target.value;
    if (value.startsWith('custom:')) {
      const roleId = value.split(':')[1];
      setFormData(prev => ({ ...prev, role: 'contributor', role_id: roleId }));
    } else {
      setFormData(prev => ({ ...prev, role: value, role_id: null }));
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData?.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData?.role && !formData?.role_id) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // API call is handled by parent
      
      const newUser = {
        ...formData,
        avatar: null,
        lastLogin: 'Never',
        createdAt: new Date()?.toISOString(),
        activityLog: [
          {
            action: 'User account created',
            timestamp: new Date()?.toLocaleString(),
            icon: 'UserPlus'
          }
        ]
      };
      
      await onAddUser(newUser);
      // Don't close here, parent does it or we do it if success
    } catch (error) {
      console.error('Failed to add user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      role: '',
      status: 'pending',
      sendInvitation: true,
      permissions: {}
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="UserPlus" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Add New User</h2>
              <p className="text-sm text-muted-foreground">Create a new user account and assign permissions</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter full name"
                value={formData?.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                error={errors?.name}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={formData?.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e?.target?.value }))}
                error={errors?.email}
                required
              />
            </div>
          </div>

          {/* Role and Department */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Role Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Department"
                placeholder="Select department"
                options={departmentOptions}
                value={formData?.department}
                onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                error={errors?.department}
                required
              />
              <Select
                label="Role"
                placeholder="Select role"
                options={roleOptions}
                value={formData?.role_id ? `custom:${formData.role_id}` : formData?.role}
                onChange={(value) => {
                  if (value.startsWith('custom:')) {
                    const roleId = value.split(':')[1];
                    setFormData(prev => ({ ...prev, role: 'contributor', role_id: roleId }));
                  } else {
                    setFormData(prev => ({ ...prev, role: value, role_id: null }));
                  }
                }}
                error={errors?.role}
                required
              />
              <Select
                label="Initial Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Account Options</h3>
            <div className="space-y-3">
              <Checkbox
                label="Send invitation email"
                description="User will receive an email with login instructions"
                checked={formData?.sendInvitation}
                onChange={(e) => setFormData(prev => ({ ...prev, sendInvitation: e?.target?.checked }))}
              />
            </div>
          </div>

          {/* Role Description */}
          {(formData?.role || formData?.role_id) && (
            <div className="p-4 bg-muted/20 rounded-lg border-l-4 border-primary">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formData.role_id 
                      ? availableRoles.find(r => r.id === formData.role_id)?.name 
                      : roleOptions?.find(r => r?.value === formData?.role)?.label} Role
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.role_id && (
                      <span className="block mb-2">
                        {availableRoles.find(r => r.id === formData.role_id)?.description}
                      </span>
                    )}
                    {formData.role_id && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <strong className="block text-xs font-semibold mb-1.5">Active Permissions:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(availableRoles.find(r => r.id === formData.role_id)?.permissions || {})
                            .filter(([_, enabled]) => enabled)
                            .map(([key, _]) => (
                              <span key={key} className="px-2 py-0.5 bg-background border border-border rounded text-[10px] font-medium text-foreground/80">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                    {!formData.role_id && (
                      <>
                        {formData?.role === 'admin' && 'Full system access with user management capabilities'}
                        {formData?.role === 'manager' && 'Team management with objective creation and approval rights'}
                        {formData?.role === 'editor' && 'Can create and edit objectives with progress tracking'}
                        {formData?.role === 'viewer' && 'Read-only access to objectives and progress reports'}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/20">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            loading={isSubmitting}
            iconName="UserPlus"
            iconPosition="left"
          >
            {isSubmitting ? 'Creating User...' : 'Create User'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;