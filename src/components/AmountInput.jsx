import React, { useState } from 'react';
import { profiles } from '../data/profiles';

const PRESETS = [
  { value: 100000, label: '1L' },
  { value: 500000, label: '5L' },
  { value: 1000000, label: '10L' },
  { value: 2500000, label: '25L' },
  { value: 5000000, label: '50L' },
];

function formatDisplay(amount) {
  if (amount <= 0) return '৳0';
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)} Lakh`;
  return `৳${amount.toLocaleString('en-BD')}`;
}

export default function AmountInput({ totalAmount, setTotalAmount, profileId, setProfileId }) {
  const activeProfile = profiles.find(p => p.id === profileId);
  const [draft, setDraft] = useState(String(totalAmount));

  // Keep draft in sync when totalAmount changes from outside (e.g. presets)
  React.useEffect(() => {
    setDraft(String(totalAmount));
  }, [totalAmount]);

  const handleBlur = () => {
    let val = parseInt(draft.replace(/\D/g, ''), 10);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 100000000) val = 100000000;
    setDraft(String(val));
    setTotalAmount(val);
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    // Allow digits only (plus empty string for backspacing)
    const cleaned = raw.replace(/[^\d]/g, '');
    setDraft(cleaned);
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 0) {
      setTotalAmount(num);
    }
  };

  const handleKeyDown = (e) => {
    // Allow: Backspace, Delete, Tab, Escape, Enter, Arrow keys, Home, End
    const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'];
    if (allowed.includes(e.key) || (e.key === 'a' && e.ctrlKey)) return;
    // Allow digits only
    if (e.key < '0' || e.key > '9') e.preventDefault();
  };

  return (
    <div className="glass card mb-6" role="region" aria-label="Investment configuration">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        {/* ── Amount Input ── */}
        <div className="flex-1">
          <label
            htmlFor="investment-amount"
            className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider"
          >
            Total Investment (BDT)
          </label>
          <div className="relative">
            <span
              className="absolute font-bold text-slate-400"
              style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem', pointerEvents: 'none' }}
              aria-hidden="true"
            >
              ৳
            </span>
            <input
              id="investment-amount"
              type="text"
              inputMode="numeric"
              value={draft}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              aria-label="Total investment amount in Bangladeshi Taka"
              aria-describedby="amount-hint"
              className="form-input form-input-number"
            />
          </div>

          {/* Live formatted display */}
          <p id="amount-hint" className="mt-2 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            {formatDisplay(totalAmount)}
          </p>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Quick amount presets">
            {PRESETS.map(preset => (
              <button
                key={preset.value}
                onClick={() => setTotalAmount(preset.value)}
                aria-pressed={totalAmount === preset.value}
                className="btn"
                style={{
                  padding: '0.375rem 0.875rem',
                  minHeight: '36px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  background: totalAmount === preset.value
                    ? 'var(--primary)'
                    : 'rgba(255,255,255,0.06)',
                  color: totalAmount === preset.value ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${totalAmount === preset.value ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="hidden md:block"
          style={{ width: '1px', height: '80px', background: 'var(--glass-border)', margin: '0 2rem' }}
          aria-hidden="true"
        />

        {/* ── Risk Profile ── */}
        <div className="flex-1">
          <label
            htmlFor="risk-profile"
            className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider"
          >
            Risk Profile
          </label>
          <div className="relative">
            <select
              id="risk-profile"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              aria-label="Investment risk profile"
              className="form-input"
              style={{ fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer', appearance: 'none', paddingRight: '2.5rem' }}
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.namebn ? ` (${p.namebn})` : ''}
                </option>
              ))}
            </select>
            {/* Custom caret */}
            <svg
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {activeProfile && (
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {activeProfile.description}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
