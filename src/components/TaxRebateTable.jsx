import React from 'react';
import { taxRules } from '../data/tax-rules';
import { formatBDT } from '../utils/format';
import { ShieldAlert } from 'lucide-react';

export default function TaxRebateTable({ estimatedRebate }) {
  return (
    <div className="glass card">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold">Tax Rebate Guide (FY {taxRules.fiscalYear})</h3>
          <p className="text-sm text-slate-500 mt-1">Estimations based on NBR regulations</p>
        </div>
        <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-right">
          <span className="block text-xs font-bold text-emerald-400 uppercase tracking-tighter">ESTIMATED REBATE</span>
          <span className="text-2xl font-bold text-emerald-400">{formatBDT(estimatedRebate)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-700/30">
          <div className="flex gap-3">
            <ShieldAlert className="text-amber-500 shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-slate-300">Important NBR Rule</p>
              <p className="text-xs text-slate-500 mt-1">
                Total rebate cannot exceed 20% of your total taxable income or ৳1 Crore invested (whichever is lower).
              </p>
            </div>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Investment Type</th>
              <th>Rebate Rate</th>
              <th>Limit / Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="font-semibold">Sanchaypatra</span>
              </td>
              <td className="text-emerald-400">15%</td>
              <td className="text-xs text-slate-500">Max rebate ৳2,25,000</td>
            </tr>
            <tr>
              <td>
                <span className="font-semibold">DPS (Bank/FI)</span>
              </td>
              <td className="text-emerald-400">15%</td>
              <td className="text-xs text-slate-500">Max investment ৳1,20,000/yr</td>
            </tr>
            <tr>
              <td>
                <span className="font-semibold">Listed Mutual Funds</span>
              </td>
              <td className="text-emerald-400">10%</td>
              <td className="text-xs text-slate-500">10% of investment</td>
            </tr>
            <tr>
              <td>
                <span className="font-semibold">DSE Stock Market</span>
              </td>
              <td className="text-indigo-400">Tax Exempt</td>
              <td className="text-xs text-slate-500">First ৳50L capital gains exempt</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
