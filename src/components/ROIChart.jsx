import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatBDT } from '../utils/format';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function ROIChart({ projections }) {
  if (!projections || projections.length === 0) return null;

  const finalValue = projections[projections.length - 1]?.value ?? 0;
  const initialValue = projections[0]?.value ?? 0;
  const growthPct = initialValue > 0
    ? (((finalValue - initialValue) / initialValue) * 100).toFixed(1)
    : 0;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        // Glassmorphic tooltip
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        titleColor: '#94a3b8',
        bodyColor: '#f1f5f9',
        bodyFont: { family: 'IBM Plex Sans', size: 14, weight: 'bold' },
        titleFont: { family: 'IBM Plex Sans', size: 11, weight: '600' },
        padding: { x: 16, y: 12 },
        borderColor: 'rgba(16, 185, 129, 0.25)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label ?? '',
          label: (context) => ` Portfolio: ${formatBDT(context.parsed.y)}`,
          afterLabel: (context) => {
            const gain = context.parsed.y - initialValue;
            return gain >= 0 ? ` Gain: +${formatBDT(gain)}` : ` Loss: ${formatBDT(gain)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#64748b',
          font: { family: 'IBM Plex Sans', size: 11, weight: '600' },
          padding: 8,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          drawBorder: false,
        },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: '#64748b',
          font: { family: 'IBM Plex Sans', size: 11 },
          padding: 12,
          maxTicksLimit: 5,
          callback: (value) => {
            if (value >= 10000000) return `৳${(value / 10000000).toFixed(1)}Cr`;
            if (value >= 100000) return `৳${(value / 100000).toFixed(1)}L`;
            return `৳${value}`;
          },
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 7,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff',
      },
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart',
    },
  };

  const data = {
    labels: projections.map(p => `Year ${p.year}`),
    datasets: [
      {
        fill: true,
        label: 'Portfolio Value',
        data: projections.map(p => p.value),
        borderColor: '#10b981',
        borderWidth: 2.5,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
          return gradient;
        },
        tension: 0.45,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#1e293b',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div className="glass card h-full flex flex-col" role="region" aria-label="5-year portfolio growth projection chart">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div style={{ width: 4, height: 24, background: '#6366f1', borderRadius: 999 }} aria-hidden="true" />
          5-Year Growth Projection
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.875rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
          }}
          aria-label={`${growthPct}% total growth over 5 years`}
        >
          <TrendingUp size={12} aria-hidden="true" />
          +{growthPct}%
        </div>
      </div>

      {/* Chart canvas */}
      <div style={{ height: '280px', position: 'relative' }}>
        <Line options={options} data={data} aria-label={`Line chart showing portfolio growth from ${formatBDT(initialValue)} to ${formatBDT(finalValue)} over 5 years`} />
      </div>

      {/* Summary strip */}
      <div
        style={{
          marginTop: '1.25rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
        }}
      >
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
            Today
          </p>
          <p className="tnum" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {formatBDT(initialValue)}
          </p>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.07)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
            After 5 Years
          </p>
          <p className="tnum" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#10b981' }}>
            {formatBDT(finalValue)}
          </p>
        </div>
      </div>
    </div>
  );
}
