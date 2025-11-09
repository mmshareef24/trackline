import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserCard = ({ user, isSelected, onSelect, onEdit, onToggleStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'suspended':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-error/10 text-error border-error/20';
      case 'manager':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'editor':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'viewer':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className={`p-4 border border-border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer ${
      isSelected ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'
    }`} onClick={() => onSelect(user?.id)}>
      <div className="flex items-start space-x-3">
        {/* Selection Checkbox */}
        <div className="flex items-center pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e?.stopPropagation();
              onSelect(user?.id);
            }}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />
        </div>

        {/* User Avatar */}
        <div className="flex-shrink-0">
          {user?.avatar ? (
            <Image
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-foreground truncate">{user?.name}</h3>
            <div className="flex items-center space-x-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user?.status)}`}>
                {user?.status}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground truncate mb-2">{user?.email}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-muted-foreground">{user?.department}</span>
              <span className={`text-xs px-2 py-1 rounded border ${getRoleColor(user?.role)}`}>
                {user?.role}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e?.stopPropagation();
                  onEdit(user);
                }}
                className="h-8 w-8"
              >
                <Icon name="Edit" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e?.stopPropagation();
                  onToggleStatus(user);
                }}
                className="h-8 w-8"
              >
                <Icon name={user?.status === 'active' ? 'UserX' : 'UserCheck'} size={14} />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Last login: {user?.lastLogin}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;