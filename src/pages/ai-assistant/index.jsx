import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const MessageBubble = ({ role, content }) => (
  <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
    <div className={`max-w-xl rounded-lg px-4 py-2 text-sm shadow ${role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
      {content}
    </div>
  </div>
);

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I can help you navigate the dashboards, understand KPIs, and use the Balanced Scorecard. What would you like to do?' }
  ]);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e?.preventDefault();
    setError('');
    const q = question?.trim();
    if (!q) return;
    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setQuestion('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, question: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to get answer');
      }
      setMessages([...newMessages, { role: 'assistant', content: data?.answer || 'No answer returned.' }]);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 px-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="Sparkles" /> AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">Ask questions about KPIs, dashboards, and workflows. I’ll guide you step-by-step.</p>
          <div className="mt-3 p-3 bg-accent/10 border border-border rounded">
            <p className="text-sm text-muted-foreground">
              Tip: If you need help with the Balanced Scorecard, try: <span className="italic">“Show me how to export KPIs to CSV and drill down to the Finance module.”</span>
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="h-[50vh] overflow-y-auto mb-4">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
          </div>
          <form onSubmit={handleAsk} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Ask anything…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={busy} iconName="Send" iconPosition="left">
              {busy ? 'Thinking…' : 'Ask'}
            </Button>
          </form>
          {error && (
            <div className="mt-2 text-sm text-destructive">{error}</div>
          )}
          {!error && (
            <div className="mt-2 text-xs text-muted-foreground">
              If the AI does not respond, ensure <code>OPENAI_API_KEY</code> is set in your deployment.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;