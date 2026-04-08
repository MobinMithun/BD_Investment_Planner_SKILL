import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

export default function AIAdvisor() {
  const [query, setQuery] = useState('');
  
  const suggestions = [
    "Is my allocation right for my age?",
    "How can I maximize my tax rebate?",
    "Should I move more into Sanchaypatra?",
  ];

  return (
    <div className="glass card" role="region" aria-label="AI Portfolio Advisor">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="text-emerald-400" size={20} aria-hidden="true" />
          AI Advisor (Claude Powered)
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>
          Get personalized insights on your Bangladesh investment portfolio
        </p>
      </div>

      <div 
        className="empty-state"
        style={{
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          border: '1px solid var(--glass-border)',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
        aria-live="polite"
      >
        <MessageSquare style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }} size={42} aria-hidden="true" />
        <p style={{ color: 'var(--text-secondary)', maxWidth: 300, fontSize: 'var(--text-sm)' }}>
          Ask me anything about your current portfolio or NBR tax laws.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Suggested questions">
        {suggestions.map((s, idx) => (
          <button 
            key={idx} 
            onClick={() => setQuery(s)}
            className="btn"
            style={{
              padding: '0.375rem 0.875rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <form 
        onSubmit={(e) => { e.preventDefault(); /* Mock submit */ setQuery(''); }}
        className="relative"
      >
        <label htmlFor="ai-query" className="sr-only">Ask the AI advisor</label>
        <input
          id="ai-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question..."
          className="form-input"
          style={{
            paddingRight: '3.5rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        />
        <button 
          type="submit"
          className="btn btn-primary"
          style={{
            position: 'absolute',
            right: 6,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            padding: 0,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Send question"
          disabled={!query.trim()}
        >
          <Send size={16} />
        </button>
      </form>
      
      <p style={{ marginTop: 'var(--space-4)', fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
        Powered by Claude 3.5 Sonnet
      </p>
    </div>
  );
}
