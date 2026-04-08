import React from 'react';
import { BookOpen, HelpCircle, Lightbulb } from 'lucide-react';

export default function GuidelineDetail() {
  const guidelines = [
    {
      title: "How to Start?",
      content: "Begin by building an Emergency Fund in liquid cash (T-Bills or Savings) for 6 months of expenses before moving to long-term investments like Sanchaypatra.",
      icon: <Lightbulb className="text-amber-400" />
    },
    {
      title: "Priority Level",
      content: "For most Bangladeshis, Sanchaypatra offers the best risk-adjusted return (~11%). It should be the backbone of your low-risk bucket.",
      icon: <BookOpen className="text-emerald-400" />
    },
    {
      title: "Understanding Risk",
      content: "Market investments (DSE Stocks) can be volatile but are essential for beating inflation over 10+ years. Balance them with government-backed bonds.",
      icon: <HelpCircle className="text-indigo-400" />
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        Investment Guidelines
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guidelines.map((g, idx) => (
          <div key={idx} className="glass card flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              {g.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-200 mb-2">{g.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{g.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
