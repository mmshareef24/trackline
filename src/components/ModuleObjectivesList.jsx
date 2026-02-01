import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { useOrganization } from '../contexts/OrganizationContext';
import Icon from './AppIcon';

export default function ModuleObjectivesList({ moduleKey, moduleLabel }) {
  const { session } = useAuth();
  const { currentOrg } = useOrganization();
  const token = session?.access_token || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canLoad = useMemo(() => !!moduleKey && !!token, [moduleKey, token]);

  const load = async () => {
    if (!currentOrg?.id) return; // Wait for org to load
    
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('objectives')
        .select('*')
        .eq('organization_id', currentOrg.id)
        .eq('category', moduleKey)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Error loading objectives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey, currentOrg?.id]);

  return (
    <div className="mt-3 border rounded-lg p-4 bg-white/60 dark:bg-slate-800/60">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon name="ListOrdered" size={18} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold">{moduleLabel} Objectives List</h3>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={!canLoad || loading}
          className={`text-sm px-3 py-1 rounded border ${loading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'border-primary text-primary bg-primary/10 hover:bg-primary/20'}`}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      {!token && (
        <p className="text-sm text-warning">Please sign in to view objectives.</p>
      )}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border">
              <th className="px-4 py-2 text-muted-foreground font-medium">Title</th>
              <th className="px-4 py-2 text-muted-foreground font-medium">Status</th>
              <th className="px-4 py-2 text-muted-foreground font-medium">Priority</th>
              <th className="px-4 py-2 text-muted-foreground font-medium">Progress</th>
              <th className="px-4 py-2 text-muted-foreground font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-muted-foreground">No objectives yet.</td>
              </tr>
            ) : (
              items.map((o) => (
                <tr key={o.id} className="border-b border-border">
                  <td className="px-4 py-3 text-foreground">{o.title}</td>
                  <td className="px-4 py-3 text-foreground">{o.status}</td>
                  <td className="px-4 py-3 text-foreground">{o.priority}</td>
                  <td className="px-4 py-3 text-foreground">{o.progress}%</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.updated_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}