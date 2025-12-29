import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const Login = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const supabaseUrlEnv = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseProjectRef = (() => {
    try {
      const m = supabaseUrlEnv.match(/https?:\/\/([^.]+)\.supabase\.co/i);
      return m ? m[1] : '';
    } catch {
      return '';
    }
  })();
  const { isCollapsed } = useSidebar();
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState('password'); // 'password' | 'magic' | 'signup'
  const [oauthLoading, setOauthLoading] = useState(''); // '', 'google', 'github'
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      if (mode === 'password') {
        await login({ email, password });
        navigate('/company-okr-dashboard');
      } else if (mode === 'magic') {
        if (!supabase) throw new Error('Auth not configured');
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${siteUrl}/company-okr-dashboard` },
        });
        if (otpError) throw otpError;
        setNotice('Check your email for the magic sign-in link.');
      } else if (mode === 'signup') {
        if (!supabase) throw new Error('Auth not configured');
        if (!email || !password) throw new Error('Enter email and password to sign up.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${siteUrl}/company-okr-dashboard` },
        });
        if (signUpError) throw signUpError;
        if (data?.session) {
          // Immediate login when confirmation is disabled
          navigate('/company-okr-dashboard');
        } else {
          setNotice(
            'Account created. If email confirmation is enabled, check your inbox for the confirmation link.'
          );
          setMode('password');
        }
      }
    } catch (err) {
      setError(err?.message || 'Sign in failed. Check credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError('');
    setNotice('');
    setOauthLoading(provider);
    try {
      if (!supabase) throw new Error('Auth not configured');
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${siteUrl}/company-okr-dashboard`,
        },
      });
      if (error) throw error;
      // Browser will redirect to provider; when it returns, AuthContext will detect session
    } catch (err) {
      setError(err?.message || `Failed to start ${provider} sign in.`);
    } finally {
      setOauthLoading('');
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
        redirectTo: `${siteUrl}/reset-password`,
      });
      if (resetError) throw resetError;
      setNotice('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err?.message || 'Failed to send password reset email.');
    }
  };

  const handleCheckSupabase = async () => {
    setCheckResult('');
    setCheckLoading(true);
    try {
      if (!supabase) {
        setCheckResult('Supabase not configured (missing env vars).');
        return;
      }
      // Lightweight connectivity check; RLS may block anonymous reads which is fine
      const { error } = await supabase
        .from('organizations')
        .select('id', { head: true })
        .limit(1);
      if (error) {
        const msg = error.message || String(error);
        if (/permission|JWT|auth|not authorized/i.test(msg)) {
          setCheckResult('Connected: yes (RLS blocks anonymous reads, expected before login).');
        } else {
          setCheckResult(`Connected: no (${msg})`);
        }
      } else {
        setCheckResult('Connected: yes');
      }
    } catch (err) {
      setCheckResult(`Connected: no (${err?.message || 'unknown error'})`);
    } finally {
      setCheckLoading(false);
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
            <Button
              type="button"
              variant={mode === 'signup' ? 'primary' : 'secondary'}
              onClick={() => setMode('signup')}
              icon={<Icon name="UserPlus" />}
            >
              Sign Up
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
            {(mode === 'password' || mode === 'signup') && (
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
            {error && String(error).toLowerCase().includes('failed to fetch') && (
              <div className="p-3 border border-warning/30 bg-warning/10 rounded text-xs text-warning">
                <div className="flex items-center space-x-2">
                  <Icon name="Info" size={14} />
                  <span>
                    Troubleshooting: This usually indicates a network/CORS issue. Try incognito, disable extensions/ad blockers, and ensure Supabase Auth has these allowed redirects: {`${siteUrl}/reset-password`} and {`${siteUrl}/company-okr-dashboard`}.
                  </span>
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
              {submitting
                ? (mode === 'password'
                    ? 'Signing in…'
                    : mode === 'magic'
                      ? 'Sending link…'
                      : 'Creating account…')
                : (mode === 'password'
                    ? 'Sign In'
                    : mode === 'magic'
                      ? 'Send Magic Link'
                      : 'Create Account')}
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

          {/* Social sign-in */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <span className="flex-1 h-px bg-muted" />
              <span>Or continue with</span>
              <span className="flex-1 h-px bg-muted" />
            </div>
            {/* Auth configuration hint for troubleshooting */}
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Auth ref: {supabaseProjectRef || 'not configured'} • Redirect origin: {siteUrl}</span>
            </div>
            {/* Lightweight connectivity check */}
            <div className="mt-2 text-xs">
              <Button
                type="button"
                variant="secondary"
                loading={checkLoading}
                onClick={handleCheckSupabase}
                icon={<Icon name="Link" />}
              >
                Check connectivity
              </Button>
              {checkResult && (
                <div className="mt-2 text-muted-foreground">{checkResult}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                icon={<Icon name="Chrome" />}
                loading={oauthLoading === 'google'}
                onClick={() => handleOAuth('google')}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="secondary"
                icon={<Icon name="Github" />}
                loading={oauthLoading === 'github'}
                onClick={() => handleOAuth('github')}
              >
                GitHub
              </Button>
            </div>
            {/* Production: removed debug and connectivity checks */}
          </div>
        </div>
      </main>
    </div>
  );
};

// Auto-redirect when auth state changes (e.g., after magic link or confirmation)
const LoginWithRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      navigate('/company-okr-dashboard');
    }
  }, [user, loading, navigate]);
  return <Login />;
};

export default LoginWithRedirect;