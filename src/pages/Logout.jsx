import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';

const Logout = () => {
  const { isCollapsed } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => navigate('/login'), 1200);
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`pt-20 px-6 ${isCollapsed ? 'ml-16' : 'ml-60'} transition-all`}>
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Icon name="LogOut" size={22} />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Signed out</h1>
          <p className="text-muted-foreground mb-6">You have been logged out. Redirecting to login…</p>
          <Button variant="outline" onClick={() => navigate('/login')} icon={<Icon name="LogIn" />}>
            Go to Login
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Logout;