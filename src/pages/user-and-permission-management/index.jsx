import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserCard from './components/UserCard';
import PermissionPanel from './components/PermissionPanel';
import UserFilters from './components/UserFilters';
import BulkActions from './components/BulkActions';
import UserStats from './components/UserStats';
import AddUserModal from './components/AddUserModal';
import { createUser, listUsers, updateUserRole, updateUserStatus } from '../../services/userService';

const UserAndPermissionManagement = () => {
  const { isCollapsed } = useSidebar();
  const { user, session } = useAuth();
  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const demoCleanupEnabled = import.meta.env.VITE_ENABLE_DEMO_CLEANUP === 'true';

  // Load users from Supabase
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const rows = await listUsers();
        if (isMounted) setUsers(rows);
      } catch (e) {
        console.error('Failed to load users:', e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const refreshUsers = async () => {
    try {
      const rows = await listUsers();
      setUsers(rows);
    } catch (e) {
      console.error('Failed to refresh users:', e);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const matchesSearch = !searchQuery ||
      user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.department?.toLowerCase()?.includes(searchQuery?.toLowerCase());

      const matchesDepartment = !selectedDepartment || user?.department === selectedDepartment;
      const matchesRole = !selectedRole || user?.role === selectedRole;
      const matchesStatus = !selectedStatus || user?.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedDepartment, selectedRole, selectedStatus]);

  // Handle user selection
  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) => {
      if (prev?.includes(userId)) {
        return prev?.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle select all users
  const handleSelectAll = () => {
    if (selectedUsers?.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map((user) => user?.id));
    }
  };

  // Handle user detail view
  const handleUserDetail = (userId) => {
    const user = users?.find((u) => u?.id === userId);
    setSelectedUser(user);
  };

  // Handle user update
  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) => prev?.map((user) =>
    user?.id === updatedUser?.id ? updatedUser : user
    ));
    setSelectedUser(updatedUser);
  };

  // Handle user status toggle
  const handleToggleUserStatus = async (user) => {
    const newStatus = user?.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUserStatus(user?.id, newStatus);
      const updatedUser = {
        ...user,
        status: newStatus,
        activityLog: [
          {
            action: `Account ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
            timestamp: new Date()?.toLocaleString(),
            icon: newStatus === 'active' ? 'UserCheck' : 'UserX'
          },
          ...user?.activityLog
        ]
      };
      handleUpdateUser(updatedUser);
    } catch (e) {
      console.error('Failed to update user status:', e);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (actionType, userIds) => {
    const [action, value] = actionType?.split(':');

    try {
      if (action === 'activate' || action === 'deactivate' || action === 'suspend') {
        const targetStatus = action === 'activate' ? 'active' : 'inactive';
        await Promise.all(userIds.map((id) => updateUserStatus(id, targetStatus)));
      }
      if (action === 'change_role') {
        await Promise.all(userIds.map((id) => updateUserRole(id, value)));
      }
    } catch (e) {
      console.error('Bulk action persistence failed:', e);
    }

    setUsers((prev) => prev?.map((user) => {
      if (!userIds?.includes(user?.id)) return user;

      let updatedUser = { ...user };

      switch (action) {
        case 'activate':
          updatedUser.status = 'active';
          break;
        case 'deactivate':
          updatedUser.status = 'inactive';
          break;
        case 'suspend':
          updatedUser.status = 'suspended';
          break;
        case 'change_role':
          updatedUser.role = value;
          break;
        case 'change_department':
          updatedUser.department = value;
          break;
        case 'delete':
          return null; // Will be filtered out
        default:
          break;
      }

      // Add activity log entry
      updatedUser.activityLog = [
        {
          action: `Bulk action: ${actionType}`,
          timestamp: new Date()?.toLocaleString(),
          icon: 'Settings'
        },
        ...updatedUser?.activityLog
      ];

      return updatedUser;
    })?.filter(Boolean)); // Remove null entries (deleted users)
  };

  // Handle add new user
  const handleAddUser = async (newUser) => {
    try {
      const created = await createUser({
        name: newUser?.name,
        email: newUser?.email,
        role: newUser?.role,
        status: newUser?.status,
      });

      const uiUser = {
        id: created?.id,
        name: created?.name,
        email: created?.email,
        department: newUser?.department || '',
        role: newUser?.role || 'viewer',
        status: newUser?.status || 'pending',
        avatar: null,
        lastLogin: 'Never',
        permissions: newUser?.permissions || {},
        activityLog: [
          {
            action: 'User account created',
            timestamp: new Date()?.toLocaleString(),
            icon: 'UserPlus',
          },
        ],
      };
      setUsers((prev) => [...prev, uiUser]);
    } catch (e) {
      console.error('Failed to add user to database:', e);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    setSelectedRole('');
    setSelectedStatus('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
      isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'}`
      }>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-foreground text-2xl">User & Permission Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage user accounts, roles, and permissions across your organization
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {demoCleanupEnabled && isAdmin && (
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (!window.confirm('This will delete demo data for the default org. Continue?')) return;
                    if (!session?.access_token) {
                      alert('You must be logged in to perform cleanup.');
                      return;
                    }
                    try {
                      const resp = await fetch('/api/cleanupDemo', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${session?.access_token || ''}`,
                        },
                        body: JSON.stringify({ orgName: import.meta.env.VITE_DEFAULT_ORG_NAME || 'Default Org' }),
                      });
                      const json = await resp.json();
                      if (!resp.ok) throw new Error(json?.error || 'Cleanup failed');
                      await refreshUsers();
                      alert('Demo data cleared successfully');
                    } catch (e) {
                      console.error('Cleanup error:', e);
                      alert(`Cleanup failed: ${e?.message || e}`);
                    }
                  }}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Clear Demo Data
                </Button>
              )}
              <Button
                variant="outline"
                onClick={refreshUsers}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowStats(!showStats)}
                iconName={showStats ? "EyeOff" : "Eye"}
                iconPosition="left">

                {showStats ? 'Hide Stats' : 'Show Stats'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                iconName={viewMode === 'grid' ? "List" : "Grid3X3"}
                iconPosition="left">

                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              <Button
                onClick={() => setIsAddUserModalOpen(true)}
                iconName="UserPlus"
                iconPosition="left">

                Add User
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          {showStats &&
          <div className="mb-6">
              <UserStats users={users} />
            </div>
          }

          {/* Filters */}
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onClearFilters={handleClearFilters}
            totalUsers={users?.length}
            filteredUsers={filteredUsers?.length} />


          {/* Bulk Actions */}
          <BulkActions
            selectedUsers={selectedUsers}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedUsers([])} />


          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* User List */}
            <div className="lg:col-span-2 space-y-4">
              {/* List Header */}
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2" />

                  <span className="text-sm font-medium text-foreground">
                    {selectedUsers?.length > 0 ?
                    `${selectedUsers?.length} selected` :
                    `${filteredUsers?.length} users`
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" title="Refresh">
                    <Icon name="RefreshCw" size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" title="Export">
                    <Icon name="Download" size={16} />
                  </Button>
                </div>
              </div>

              {/* User Cards */}
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredUsers?.length > 0 ?
                filteredUsers?.map((user) =>
                <UserCard
                  key={user?.id}
                  user={user}
                  isSelected={selectedUsers?.includes(user?.id)}
                  onSelect={handleUserSelect}
                  onEdit={() => handleUserDetail(user?.id)}
                  onToggleStatus={() => handleToggleUserStatus(user)} />

                ) :

                <div className="text-center py-12">
                    <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Users Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedDepartment || selectedRole || selectedStatus ?
                    'Try adjusting your filters to see more users' : 'Get started by adding your first user'
                    }
                    </p>
                    {!searchQuery && !selectedDepartment && !selectedRole && !selectedStatus &&
                  <Button
                    onClick={() => setIsAddUserModalOpen(true)}
                    iconName="UserPlus"
                    iconPosition="left">

                        Add First User
                      </Button>
                  }
                  </div>
                }
              </div>
            </div>

            {/* Permission Panel */}
            <div className="lg:col-span-3">
              <PermissionPanel
                selectedUser={selectedUser}
                onUpdateUser={handleUpdateUser}
                onClose={() => setSelectedUser(null)} />

            </div>
          </div>
        </div>
      </main>
      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser} />
    </div>
  );

};

export default UserAndPermissionManagement;