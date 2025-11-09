import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Weekly check-in reminder', message: 'Q4 objectives review due today', time: '2 hours ago', unread: true },
    { id: 2, title: 'Progress update', message: 'Marketing team completed KR milestone', time: '4 hours ago', unread: true },
    { id: 3, title: 'Deadline alert', message: 'Product launch objective due in 3 days', time: '1 day ago', unread: false },
  ]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    console.log('Search query:', searchQuery);
  };

  const handleNotificationClick = (notificationId) => {
    console.log('Notification clicked:', notificationId);
    setIsNotificationOpen(false);
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    setIsProfileOpen(false);
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">OKR Platform</span>
              <span className="text-xs text-muted-foreground">Strategic Excellence</span>
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="search"
              placeholder="Search objectives, KRs, team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-10 pr-4"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded border">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Icon name="Search" size={20} />
          </Button>

          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
              New Objective
            </Button>
            <Button variant="ghost" size="sm" iconName="Calendar">
              Check-in
            </Button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-foreground">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-muted transition-colors ${
                        notification?.unread ? 'bg-accent/5' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification?.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{notification?.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{notification?.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification?.time}</p>
                        </div>
                        {notification?.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">JD</span>
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">John Doe</span>
                <span className="text-xs text-muted-foreground">Product Manager</span>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">john.doe@company.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Product Manager</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => handleProfileAction('profile')}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="User" size={16} />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => handleProfileAction('objectives')}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="Target" size={16} />
                    <span>My Objectives</span>
                  </button>
                  <button
                    onClick={() => handleProfileAction('settings')}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="py-2 border-t border-border">
                  <button
                    onClick={() => handleProfileAction('logout')}
                    className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-border bg-card p-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search objectives, KRs, team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-10"
              autoFocus
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;