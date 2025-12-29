import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const statusOptions = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function ModuleObjectives({ moduleKey, moduleLabel }) {
  const { session, user } = useAuth();
  const token = session?.access_token || '';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('not_started');
  const [priority, setPriority] = useState('medium');
  const [quarter, setQuarter] = useState('');
  const [year, setYear] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => title.trim().length > 2 && !!moduleKey && !!token, [title, moduleKey, token]);

  const createObjective = async (e) => {
    e?.preventDefault?.();
    setMessage('');
    if (!canSubmit) return;
    setBusy(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        moduleKey,
      };
      if (year && quarter) {
        payload.year = Number(year);
        payload.quarter = Number(quarter);
      }
      const resp = await fetch('/api/objectivesCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to create objective');
      setMessage('Objective created successfully');
      setTitle('');
      setDescription('');
      setStatus('not_started');
      setPriority('medium');
      setQuarter('');
      setYear('');
    } catch (err) {
      setMessage(err.message || 'Error creating objective');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 border rounded-lg p-4 bg-white/60 dark:bg-slate-800/60">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{moduleLabel} Objectives</h3>
        {user?.name && <span className="text-sm text-slate-500">Signed in as {user.name}</span>}
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4" onSubmit={createObjective}>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-900"
            placeholder={`e.g., Improve ${moduleLabel} throughput`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-900"
            rows={3}
            placeholder="Optional details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-900" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-900" value={priority} onChange={(e) => setPriority(e.target.value)}>
            {priorityOptions.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-900" type="number" placeholder="e.g., 2025" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quarter</label>
          <select className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-900" value={quarter} onChange={(e) => setQuarter(e.target.value)}>
            <option value="">Select</option>
            <option value="1">Q1</option>
            <option value="2">Q2</option>
            <option value="3">Q3</option>
            <option value="4">Q4</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-2">
          <button
            type="submit"
            className={`px-4 py-2 rounded ${canSubmit ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-300 text-slate-600 cursor-not-allowed'}`}
            disabled={!canSubmit || busy}
          >
            {busy ? 'Creating...' : 'Create Objective'}
          </button>
          {message && <span className="text-sm text-slate-600 dark:text-slate-300">{message}</span>}
        </div>
      </form>
      <p className="text-xs text-slate-500 mt-2">Objectives are stored under the {moduleLabel} department.</p>
    </div>
  );
}