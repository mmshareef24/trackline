import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const Login = () => {
  const { isCollapsed } = useSidebar();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState('password'); // 'password' | 'magic'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      if (mode === 'password') {
        await login({ email, password });
        navigate('/company-okr-dashboard');
      } else {
        if (!supabase) throw new Error('Auth not configured');
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/company-okr-dashboard` },
        });
        if (otpError) throw otpError;
        setNotice('Check your email for the magic sign-in link.');
      }
    } catch (err) {
      setError(err?.message || 'Sign in failed. Check credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setNotice('');
    try {
      if (!email) {
        setError('Enter your email to request a password reset.');
        return;
      }
      if (!supabase) throw new Error('Auth not configured');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setNotice('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err?.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className={`pt-20 px-6 transition-all`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <img src="/assets/images/jasco-logo.png" alt="JASCO" className="h-16" />
          </div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
            <p className="text-muted-foreground">Use password or send a magic link.</p>
          </div>

          <div className="flex gap-2 mb-6 max-w-md mx-auto">
            <Button
              type="button"
              variant={mode === 'password' ? 'primary' : 'secondary'}
              onClick={() => setMode('password')}
              icon={<Icon name="KeyRound" />}
            >
              Password
            </Button>
            <Button
              type="button"
              variant={mode === 'magic' ? 'primary' : 'secondary'}
              onClick={() => setMode('magic')}
              icon={<Icon name="Mail" />}
            >
              Magic Link
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
            {mode === 'password' && (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            )}
            {error && (
              <div className="p-3 border border-error/30 bg-error/10 rounded text-sm text-error">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}
            {notice && (
              <div className="p-3 border border-info/30 bg-info/10 rounded text-sm text-info">
                <div className="flex items-center space-x-2">
                  <Icon name="Info" size={16} />
                  <span>{notice}</span>
                </div>
              </div>
            )}
            <Button type="submit" variant="primary" className="w-full" loading={submitting} icon={<Icon name="LogIn" />}>
              {submitting ? (mode === 'password' ? 'Signing in…' : 'Sending link…') : (mode === 'password' ? 'Sign In' : 'Send Magic Link')}
            </Button>
            {mode === 'password' && (
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm text-primary hover:underline mt-2"
              >
                Forgot password?
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;