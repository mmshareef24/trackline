import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserCard from './components/UserCard';
import PermissionPanel from './components/PermissionPanel';
import UserFilters from './components/UserFilters';
import BulkActions from './components/BulkActions';
import UserStats from './components/UserStats';
import AddUserModal from './components/AddUserModal';

const UserAndPermissionManagement = () => {
  const { isCollapsed } = useSidebar();
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

  // Mock user data
  useEffect(() => {
    const mockUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      department: "engineering",
      role: "admin",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      lastLogin: "2 hours ago",
      permissions: {
        create_objectives: true,
        edit_objectives: true,
        delete_objectives: true,
        assign_objectives: true,
        view_progress: true,
        update_progress: true,
        view_analytics: true,
        export_reports: true,
        manage_team: true,
        view_team_progress: true,
        conduct_checkins: true,
        approve_objectives: true,
        manage_users: true,
        system_settings: true,
        audit_logs: true,
        backup_restore: true
      },
      activityLog: [
      { action: "Updated system settings", timestamp: "2 hours ago", icon: "Settings" },
      { action: "Created new user account", timestamp: "1 day ago", icon: "UserPlus" },
      { action: "Approved team objectives", timestamp: "2 days ago", icon: "CheckCircle" }]

    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      department: "marketing",
      role: "manager",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      lastLogin: "1 day ago",
      permissions: {
        create_objectives: true,
        edit_objectives: true,
        assign_objectives: true,
        view_progress: true,
        update_progress: true,
        view_analytics: true,
        manage_team: true,
        view_team_progress: true,
        conduct_checkins: true,
        approve_objectives: true
      },
      activityLog: [
      { action: "Conducted team check-in", timestamp: "1 day ago", icon: "Users" },
      { action: "Updated marketing objectives", timestamp: "3 days ago", icon: "Target" }]

    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      department: "sales",
      role: "editor",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      lastLogin: "3 hours ago",
      permissions: {
        create_objectives: true,
        edit_objectives: true,
        view_progress: true,
        update_progress: true,
        view_team_progress: true
      },
      activityLog: [
      { action: "Updated Q4 sales objectives", timestamp: "3 hours ago", icon: "TrendingUp" },
      { action: "Submitted progress report", timestamp: "1 day ago", icon: "FileText" }]

    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      department: "hr",
      role: "viewer",
      status: "pending",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      lastLogin: "Never",
      permissions: {
        view_progress: true,
        view_analytics: true,
        view_team_progress: true
      },
      activityLog: []
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.thompson@company.com",
      department: "finance",
      role: "manager",
      status: "suspended",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      lastLogin: "1 week ago",
      permissions: {
        create_objectives: true,
        edit_objectives: true,
        assign_objectives: true,
        view_progress: true,
        update_progress: true,
        view_analytics: true,
        manage_team: true,
        view_team_progress: true,
        conduct_checkins: true,
        approve_objectives: true
      },
      activityLog: [
      { action: "Account suspended", timestamp: "1 week ago", icon: "AlertTriangle" }]

    },
    {
      id: 6,
      name: "James Wilson",
      email: "james.wilson@company.com",
      department: "operations",
      role: "editor",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      lastLogin: "5 hours ago",
      permissions: {
        create_objectives: true,
        edit_objectives: true,
        view_progress: true,
        update_progress: true,
        view_team_progress: true
      },
      activityLog: [
      { action: "Updated operations workflow", timestamp: "5 hours ago", icon: "Workflow" },
      { action: "Created quarterly objectives", timestamp: "2 days ago", icon: "Target" }]

    },
    {
      id: 7,
      name: "Anna Martinez",
      email: "anna.martinez@company.com",
      department: "engineering",
      role: "viewer",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      lastLogin: "30 minutes ago",
      permissions: {
        view_progress: true,
        view_analytics: true,
        view_team_progress: true
      },
      activityLog: [
      { action: "Viewed team progress", timestamp: "30 minutes ago", icon: "Eye" },
      { action: "Accessed analytics dashboard", timestamp: "2 hours ago", icon: "BarChart3" }]

    },
    {
      id: 8,
      name: "Robert Brown",
      email: "robert.brown@company.com",
      department: "marketing",
      role: "editor",
      status: "inactive",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      lastLogin: "2 weeks ago",
      permissions: {
        create_objectives: true,
        edit_objectives: true,
        view_progress: true,
        update_progress: true,
        view_team_progress: true
      },
      activityLog: [
      { action: "Account deactivated", timestamp: "2 weeks ago", icon: "UserX" }]

    }];

    setUsers(mockUsers);
  }, []);

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
  const handleToggleUserStatus = (user) => {
    const newStatus = user?.status === 'active' ? 'inactive' : 'active';
    const updatedUser = {
      ...user,
      status: newStatus,
      activityLog: [
      {
        action: `Account ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
        timestamp: new Date()?.toLocaleString(),
        icon: newStatus === 'active' ? 'UserCheck' : 'UserX'
      },
      ...user?.activityLog]

    };
    handleUpdateUser(updatedUser);
  };

  // Handle bulk actions
  const handleBulkAction = (actionType, userIds) => {
    const [action, value] = actionType?.split(':');

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
      ...updatedUser?.activityLog];


      return updatedUser;
    })?.filter(Boolean)); // Remove null entries (deleted users)
  };

  // Handle add new user
  const handleAddUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
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