import React, { useMemo, useState } from 'react';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { kbArticles } from '../../config/kb';

const KBCard = ({ article, expanded, onToggle }) => (
  <div className="border border-border rounded-lg p-4 mb-3 bg-card">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-medium text-foreground">{article.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{article.summary}</p>
        <div className="mt-2 flex gap-2 flex-wrap">
          {article.tags?.map((t) => (
            <span key={t} className="text-xs px-2 py-1 bg-accent/10 text-muted-foreground rounded border border-border">#{t}</span>
          ))}
        </div>
      </div>
      <Button variant="ghost" size="sm" iconName={expanded ? 'ChevronUp' : 'ChevronDown'} onClick={onToggle}>
        {expanded ? 'Hide' : 'Read'}
      </Button>
    </div>
    {expanded && (
      <div className="mt-3 whitespace-pre-wrap text-sm text-foreground">{article.content}</div>
    )}
  </div>
);

const KnowledgeBase = () => {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return kbArticles;
    return kbArticles.filter(a => (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q))
    ));
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 px-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="BookOpen" /> Knowledge Base
          </h1>
          <p className="text-muted-foreground mt-1">Search guides and articles about dashboards, modules, and workflows.</p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Input
            type="search"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" iconName="X" onClick={() => setQuery('')}>Clear</Button>
        </div>

        <div className="grid grid-cols-1">
          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No articles matched your search.</div>
          ) : (
            filtered.map((a) => (
              <KBCard
                key={a.id}
                article={a}
                expanded={openId === a.id}
                onToggle={() => setOpenId(openId === a.id ? null : a.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBase;