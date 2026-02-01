import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const Diagnostic = () => {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('idle');

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toISOString(), msg, type }]);
  };

  const runDiagnostics = async () => {
    setLogs([]);
    setStatus('running');
    addLog('Starting diagnostics...', 'info');

    // 1. Check Env Vars
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    addLog(`Supabase URL Configured: ${!!url} (${url ? url.substring(0, 15) + '...' : 'Missing'})`);
    addLog(`Supabase Key Configured: ${!!key} (${key ? 'Present' : 'Missing'})`);

    // 2. Check Client
    if (!supabase) {
      addLog('CRITICAL: Supabase client is null!', 'error');
      setStatus('failed');
      return;
    }
    addLog('Supabase client initialized object present.', 'success');

    // 3. Network Check (Fetch)
    try {
      addLog('Attempting network fetch to Supabase URL...', 'info');
      // Supabase health check or just root
      const resp = await fetch(url + '/rest/v1/', { 
        method: 'HEAD',
        headers: { apikey: key }
      });
      addLog(`Network fetch status: ${resp.status} ${resp.statusText}`, resp.ok ? 'success' : 'warning');
    } catch (err) {
      addLog(`Network fetch failed: ${err.message}`, 'error');
      addLog(JSON.stringify(err, Object.getOwnPropertyNames(err)), 'error');
    }

    // 4. DB Query
    try {
      addLog('Attempting DB Query (organizations)...', 'info');
      const { data, error } = await supabase.from('organizations').select('count', { count: 'exact', head: true });
      
      if (error) {
        addLog(`DB Query Error: ${error.message}`, 'error');
        addLog(JSON.stringify(error), 'error');
      } else {
        addLog('DB Query Success!', 'success');
      }
    } catch (err) {
      addLog(`DB Query Exception: ${err.message || 'No message'}`, 'error');
      addLog(JSON.stringify(err, Object.getOwnPropertyNames(err)), 'error');
    }

    setStatus('done');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">System Diagnostics</h1>
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
