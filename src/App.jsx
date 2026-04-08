import React, { useState } from 'react';
import AmountInput from './components/AmountInput';
import AllocationSliders from './components/AllocationSliders';
import MetricSummary from './components/MetricSummary';
import ROIChart from './components/ROIChart';
import InstrumentTable from './components/InstrumentTable';
import TaxRebateTable from './components/TaxRebateTable';
import GuidelineDetail from './components/GuidelineDetail';
import AIAdvisor from './components/AIAdvisor';
import { usePortfolio } from './hooks/usePortfolio';
import { useTaxCalc } from './hooks/useTaxCalc';
import { Download, PieChart, Info, Landmark } from 'lucide-react';

const TABS = [
  { id: 'simulator',   label: 'Simulator',   icon: <PieChart size={16} aria-hidden="true" /> },
  { id: 'instruments', label: 'Instruments', icon: <Landmark size={16} aria-hidden="true" /> },
  { id: 'guidelines',  label: 'Guidelines',  icon: <Info size={16} aria-hidden="true" /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('simulator');

  const {
    totalAmount, setTotalAmount,
    profileId, setProfileId,
    allocations, updateAllocation,
    computed,
  } = usePortfolio();

  const { estimatedRebate } = useTaxCalc(totalAmount, allocations);

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 'var(--space-20)' }}>

      {/* ── Sticky Header ── */}
      <header className="site-header" role="banner">
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40, height: 40,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(16,185,129,0.3)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <Landmark size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
                InvestBD
              </h1>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                Simulation & Guidelines
              </p>
            </div>
          </div>

          {/* Export button */}
          <button
            className="btn btn-primary"
            aria-label="Export your investment plan as PDF"
            style={{ gap: '0.5rem' }}
          >
            <Download size={15} aria-hidden="true" />
            Export Plan
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main id="main-content" role="main">
        <div className="dashboard-grid">

          {/* Input & Metrics */}
          <div className="col-span-12">
            <AmountInput
              totalAmount={totalAmount}
              setTotalAmount={setTotalAmount}
              profileId={profileId}
              setProfileId={setProfileId}
            />
            <MetricSummary computed={computed} />
          </div>

          {/* Tab Navigation */}
          <div className="col-span-12">
            <nav aria-label="Dashboard sections" role="tablist">
              <div className="tabs-nav">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Tab Panels */}
          {activeTab === 'simulator' && (
            <>
              <div
                id="panel-simulator"
                role="tabpanel"
                aria-labelledby="tab-simulator"
                className="col-span-4"
                style={{ height: '100%' }}
              >
                <AllocationSliders
                  allocations={allocations}
                  updateAllocation={updateAllocation}
                  bucketAmounts={computed.bucketAmounts}
                />
              </div>
              <div
                id="panel-simulator-chart"
                role="tabpanel"
                aria-labelledby="tab-simulator"
                className="col-span-8"
                style={{ height: '100%' }}
              >
                <ROIChart projections={computed.projections} />
              </div>
              <div className="col-span-12">
                <TaxRebateTable estimatedRebate={estimatedRebate} />
              </div>
              <div className="col-span-12">
                <AIAdvisor />
              </div>
            </>
          )}

          {activeTab === 'instruments' && (
            <div
              id="panel-instruments"
              role="tabpanel"
              aria-labelledby="tab-instruments"
              className="col-span-12"
            >
              <InstrumentTable />
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div
              id="panel-guidelines"
              role="tabpanel"
              aria-labelledby="tab-guidelines"
              className="col-span-12"
            >
              <GuidelineDetail />
            </div>
          )}

        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        role="contentinfo"
        style={{
          marginTop: 'var(--space-16)',
          padding: 'var(--space-8) var(--space-6)',
          borderTop: '1px solid var(--glass-border)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', lineHeight: 1.8 }}>
            ⚠️ <strong>Disclaimer:</strong> This simulation is for educational purposes only. ROI rates are based
            on FY 2024-25 data and market historicals. Consult a certified financial advisor before investing.
          </p>
          <div
            style={{
              marginTop: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-6)',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Bangladesh Bank', href: 'https://bb.org.bd' },
              { label: 'NBR Bangladesh', href: 'https://nbr.gov.bd' },
              { label: 'Dhaka Stock Exchange', href: 'https://dsebd.org' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
