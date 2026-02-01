import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const Diagnostic = () => {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('idle');
  const [manualUrl, setManualUrl] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [useManual, setUseManual] = useState(false);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toISOString(), msg, type }]);
  };

  const runDiagnostics = async () => {
    setLogs([]);
    setStatus('running');
    addLog('Starting diagnostics...', 'info');

    // 1. Check Env Vars
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Determine which credentials to use
    let targetUrl = useManual ? manualUrl : (envUrl || 'https://ygzgenatdfmnmhidqcos.supabase.co');
    let targetKey = useManual ? manualKey : (envKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnemdlbmF0ZGZtbm1oaWRxY29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjExMjAsImV4cCI6MjA4NTE5NzEyMH0.GenViHd0Jmc1StwShR7cNqNW5Sw4CJb6K4nbHJ0YVXU');

    addLog(`Using ${useManual ? 'MANUAL' : 'DEFAULT'} Configuration`, 'info');
    addLog(`Target URL: ${targetUrl ? targetUrl.substring(0, 20) + '...' : 'Missing'}`);
    
    // Create temporary client for testing if manual
    let testClient = supabase;
    if (useManual) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        testClient = createClient(targetUrl, targetKey);
        addLog('Created temporary Supabase client with manual keys.', 'success');
      } catch (e) {
        addLog(`Failed to create manual client: ${e.message}`, 'error');
        setStatus('failed');
        return;
      }
    }

    // 3. Network Check (Fetch)
    try {
      addLog(`Attempting network fetch to ${targetUrl}...`, 'info');
      const resp = await fetch(targetUrl + '/rest/v1/', { 
        method: 'HEAD',
        headers: { apikey: targetKey }
      });
      addLog(`Network fetch status: ${resp.status} ${resp.statusText}`, resp.ok || resp.status === 404 ? 'success' : 'warning');
    } catch (err) {
      addLog(`Network fetch failed: ${err.message}`, 'error');
      addLog('POSSIBLE CAUSE: Firewall/CORS blocking Supabase domain.', 'warning');
    }

    // 4. DB Query
    try {
      addLog('Attempting DB Query (organizations)...', 'info');
      const { data, error } = await testClient.from('organizations').select('count', { count: 'exact', head: true });
      
      if (error) {
        addLog(`DB Query Error: ${error.message}`, 'error');
        addLog(JSON.stringify(error), 'error');
      } else {
        addLog('DB Query Success! Connection is working.', 'success');
      }
    } catch (err) {
      addLog(`DB Query Exception: ${err.message}`, 'error');
    }

    setStatus('done');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">System Diagnostics</h1>
      
      <div className="mb-6 p-4 border rounded bg-white dark:bg-slate-800">
        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" checked={useManual} onChange={e => setUseManual(e.target.checked)} />
          <span className="font-bold">Test Custom Credentials</span>
        </label>
        
        {useManual && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs mb-1">Supabase URL</label>
              <input 
                className="w-full border p-2 rounded" 
                value={manualUrl} 
                onChange={e => setManualUrl(e.target.value)} 
                placeholder="https://xyz.supabase.co"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Supabase Anon Key</label>
              <input 
                className="w-full border p-2 rounded" 
                value={manualKey} 
                onChange={e => setManualKey(e.target.value)} 
                placeholder="eyJ..."
              />
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={runDiagnostics}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
      >
        Run Diagnostics
      </button>

      <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded border overflow-auto h-96 whitespace-pre-wrap">
        {logs.length === 0 ? 'Click Run to start...' : logs.map((l, i) => (
          <div key={i} className={`mb-1 ${
            l.type === 'error' ? 'text-red-600 font-bold' : 
            l.type === 'success' ? 'text-green-600' : 
            l.type === 'warning' ? 'text-orange-600' : 'text-slate-700 dark:text-slate-300'
          }`}>
            [{l.time.split('T')[1].split('.')[0]}] {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diagnostic;
