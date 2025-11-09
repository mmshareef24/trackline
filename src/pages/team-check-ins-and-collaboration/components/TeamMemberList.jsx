import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TeamMemberList = ({ teamMembers, selectedMember, onMemberSelect, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMembers = teamMembers?.filter(member => {
    const matchesSearch = member?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         member?.role?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
          <span className="text-sm text-muted-foreground">{filteredMembers?.length} members</span>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex space-x-1">
          {['all', 'active', 'away', 'busy']?.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status === 'all' ? 'All' : getStatusText(status)}
            </button>
          ))}
        </div>
      </div>
      {/* Member List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMembers?.map((member) => (
          <div
            key={member?.id}
            onClick={() => onMemberSelect(member)}
            className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedMember?.id === member?.id ? 'bg-accent/10 border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={member?.avatar}
                  alt={member?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(member?.status)}`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground truncate">{member?.name}</h3>
                  {member?.hasUnreadCheckins && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{member?.role}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">{getStatusText(member?.status)}</span>
                  {member?.lastCheckin && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        Last check-in: {member?.lastCheckin}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-xs font-medium text-foreground">{member?.weeklyCheckins}</div>
                  <div className="text-xs text-muted-foreground">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-foreground">{member?.blockers}</div>
                  <div className="text-xs text-muted-foreground">Blockers</div>
                </div>
              </div>
              
              {member?.needsAttention && (
                <div className="flex items-center space-x-1 text-warning">
                  <Icon name="AlertTriangle" size={12} />
                  <span className="text-xs font-medium">Needs Attention</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full" iconName="MessageSquare" iconPosition="left">
          Broadcast Message
        </Button>
      </div>
    </div>
  );
};

export default TeamMemberList;