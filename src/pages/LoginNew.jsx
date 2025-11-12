import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth, demoUsers } from '../contexts/AuthContext';

const LoginNew = () => {
  const { isCollapsed } = useSidebar();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const roles = useMemo(() => Array.from(new Set(demoUsers.map(u => u.role))), []);

  const tryResolveUser = () => {
    const byEmail = demoUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (byEmail) return byEmail;
    if (role) {
      const byRole = demoUsers.find(u => u.role === role);
      if (byRole) return byRole;
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const resolved = tryResolveUser();
    if (!resolved) {
      setError('No matching demo user. Try selecting a role or use a known demo email.');
      return;
    }
    login(resolved);
    navigate('/company-okr-dashboard');
  };

  const fillDemo = (u) => {
    setEmail(u.email);
    setRole(u.role);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className={`pt-20 px-6 transition-all`}>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <img src="/assets/images/jasco-logo.png" alt="JASCO" className="h-16" />
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
            <p className="text-muted-foreground">Use email or select a role to sign in to the demo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 border border-border rounded-lg p-4 bg-card">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah.johnson@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Role</label>
              <div className="relative">
                <select
                  className="w-full border border-border rounded-md bg-background px-3 py-2 text-foreground"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select role (optional)</option>
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-error">
                <Icon name="AlertCircle" size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" icon={<Icon name="LogIn" />}>
              Continue
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-3">Quick fill from demo users</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoUsers.map((u) => (
                <button
                  key={u.id}
                  className="text-left p-3 rounded-md border border-border bg-muted hover:bg-muted/70 transition-colors"
                  onClick={() => fillDemo(u)}
                >
                  <div className="flex items-center space-x-3">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground">
                          {u.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.role} • {u.department}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span className="text-sm text-muted-foreground">Demo-only login. Passwords aren’t required; we match by email or role.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginNew;