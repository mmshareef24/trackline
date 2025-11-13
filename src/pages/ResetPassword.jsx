import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import { supabase } from '../utils/supabaseClient';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasSession, setHasSession] = useState(null); // null = unknown, boolean once checked

  // Detect recovery/auth session to guide the user
  useEffect(() => {
    let unsub = null;
    (async () => {
      try {
        if (!supabase) return;
        const { data } = await supabase.auth.getSession();
        setHasSession(Boolean(data?.session));
      } catch {
        setHasSession(false);
      }
    })();
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setHasSession(true);
        }
      });
      unsub = data?.subscription;
    }
    return () => {
      try { unsub?.unsubscribe?.(); } catch {}
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!supabase) {
      setError('Authentication not configured. Please contact support.');
      return;
    }
    if (hasSession === false) {
      setError('No recovery session detected. Please open this page from the password reset email link.');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setNotice('Password updated successfully. Redirecting to sign in…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const msg = err?.message || 'Failed to update password.';
      // Common case: user opened this page without the recovery session
      if (msg.toLowerCase().includes('session')) {
        setError('Password reset session not found. Please use the link sent to your email to open this page.');
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <img src="/assets/images/jasco-logo.png" alt="JASCO" className="h-16" />
          </div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground">Enter and confirm your new password.</p>
          </div>

          {hasSession === false && (
            <div className="p-3 border border-info/30 bg-info/10 rounded text-sm text-info mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={16} />
                <span>
                  No recovery session found. To reset your password, open the link from the password reset email. You can request a new email from the Sign In page.
                </span>
              </div>
              <button type="button" onClick={() => navigate('/login')} className="text-primary hover:underline mt-2">
                Back to Sign In
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
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
            <Button type="submit" variant="primary" className="w-full" loading={submitting} disabled={hasSession === false} icon={<Icon name="KeyRound" />}>
              {submitting ? 'Updating…' : 'Update Password'}
            </Button>
            <button type="button" onClick={() => navigate('/login')} className="text-sm text-primary hover:underline mt-2">
              Back to Sign In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;