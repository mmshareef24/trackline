import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStats = ({ users, departments = [] }) => {
  const stats = {
    total: users?.length,
    active: users?.filter(u => u?.status === 'active')?.length,
    inactive: users?.filter(u => u?.status === 'inactive')?.length,
    pending: users?.filter(u => u?.status === 'pending')?.length,
    suspended: users?.filter(u => u?.status === 'suspended')?.length,
    admins: users?.filter(u => u?.role === 'admin')?.length,
    managers: users?.filter(u => u?.role === 'manager')?.length,
    editors: users?.filter(u => u?.role === 'editor')?.length,
    viewers: users?.filter(u => u?.role === 'viewer')?.length
  };

  const statusCards = [
    {
      title: 'Total Users',
      value: stats?.total,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'Active Users',
      value: stats?.active,
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Pending Users',
      value: stats?.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'Suspended',
      value: stats?.suspended,
      icon: 'UserX',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20'
    }
  ];

  const roleCards = [
    {
      title: 'Administrators',
      value: stats?.admins,
      icon: 'Shield',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20'
    },
    {
      title: 'Managers',
      value: stats?.managers,
      icon: 'Crown',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'Editors',
      value: stats?.editors,
      icon: 'Edit',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    },
    {
      title: 'Viewers',
      value: stats?.viewers,
      icon: 'Eye',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  ];

  const StatCard = ({ title, value, icon, color, bgColor, borderColor }) => (
    <div className={`p-4 bg-card border ${borderColor} rounded-lg hover:shadow-sm transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
        </div>
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <Icon name={icon} size={24} className={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* User Status Overview */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">User Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards?.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </div>
      {/* Role Distribution */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Role Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roleCards?.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </div>
      {/* Department Breakdown */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Department Breakdown</h3>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.length > 0 ? (
              departments.map((dept, index) => {
                // Match user department name with department name (case insensitive)
                const deptUsers = users?.filter(u => u?.department?.toLowerCase() === dept?.name?.toLowerCase());
                return (
                  <div key={dept.id || index} className="text-center">
                    <p className="text-sm text-muted-foreground truncate px-1" title={dept.name}>{dept.name}</p>
                    <p className="text-xl font-semibold text-foreground">{deptUsers?.length || 0}</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground text-sm py-2">
                No departments found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;