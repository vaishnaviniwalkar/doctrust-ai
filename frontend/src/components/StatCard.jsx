import React from 'react';

export default function StatCard({ label, value, icon, trend, trendType = 'positive', badgeBg = 'bg-blue-50 text-blue-600' }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-150">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <div className={`p-2.5 rounded-lg ${badgeBg}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              trendType === 'positive'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : trendType === 'negative'
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {trendType === 'positive' && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            )}
            {trendType === 'negative' && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
