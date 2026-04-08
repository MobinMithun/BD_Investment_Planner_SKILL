import React, { useState } from 'react';
import AmountInput from './components/AmountInput';
import AllocationSliders from './components/AllocationSliders';
import MetricSummary from './components/MetricSummary';
import ROIChart from './components/ROIChart';
import InstrumentTable from './components/InstrumentTable';
import TaxRebateTable from './components/TaxRebateTable';
import GuidelineDetail from './components/GuidelineDetail';
import AIAdvisor from './components/AIAdvisor';
import MoneyBackground from './components/MoneyBackground';
import MusicPlayer from './components/MusicPlayer';
import { usePortfolio } from './hooks/usePortfolio';
import { useTaxCalc } from './hooks/useTaxCalc';
import { Download, PieChart, Info, Landmark, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [isExporting, setIsExporting] = useState(false);

  const handleExportToPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('main-content');
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#070d1a',
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('BD_Investment_Plan.pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 'var(--space-20)', position: 'relative' }}>
      {/* ── Money flying background ── */}
      <MoneyBackground />

      {/* ── Sticky Header ── */}
      <header className="site-header" role="banner" style={{ position: 'relative', zIndex: 10 }}>
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

          {/* Controls Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MusicPlayer />
            {/* Export button */}
            <button
              className="btn btn-primary"
              aria-label="Export your investment plan as PDF"
              style={{ gap: '0.5rem', opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'wait' : 'pointer' }}
              onClick={handleExportToPDF}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 size={15} className="spin" aria-hidden="true" /> : <Download size={15} aria-hidden="true" />}
              {isExporting ? 'Exporting...' : 'Export Plan'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main id="main-content" role="main" style={{ position: 'relative', zIndex: 1 }}>
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

          {/* GitHub */}
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href="https://github.com/mobinmithun"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              aria-label="Visit mobinmithun on GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              mobinmithun
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
