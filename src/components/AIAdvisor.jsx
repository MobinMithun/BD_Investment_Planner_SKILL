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
    <div className="glass card">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Sparkles className="text-emerald-400" size={20} />
        AI Advisor (Claude Powered)
      </h3>

      <div className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-700/30 min-h-[200px] flex flex-col justify-center items-center text-center">
        <MessageSquare className="text-slate-600 mb-4" size={48} />
        <p className="text-slate-400 max-w-sm">
          Ask me anything about your current portfolio or Bangladesh investment laws.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {suggestions.map(s => (
          <button 
            key={s} 
            onClick={() => setQuery(s)}
            className="px-3 py-1.5 rounded-full bg-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-700 transition-all border border-slate-700/50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question..."
          className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-4 pl-4 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 rounded-md flex items-center justify-center hover:bg-emerald-600 transition-all">
          <Send size={18} className="text-white" />
        </button>
      </div>
      
      <p className="mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">
        Powered by Claude-3.5-Sonnet
      </p>
    </div>
  );
}
