import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth, demoUsers } from '../contexts/AuthContext';

const Login = () => {
  const { isCollapsed } = useSidebar();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (user) => {
    login(user);
    navigate('/company-okr-dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className={`pt-20 px-6 transition-all`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <img src="/assets/images/jasco-logo.png" alt="JASCO" className="h-16" />
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
            <p className="text-muted-foreground">Choose a demo user to continue.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {demoUsers.map((user) => (
              <div key={user.id} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center space-x-3 mb-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.role} • {user.department}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Button variant="primary" className="w-full" icon={<Icon name="LogIn" />} onClick={() => handleLogin(user)}>
                  Sign in as {user.name.split(' ')[0]}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span className="text-sm text-muted-foreground">This is a demo login. No passwords required.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;