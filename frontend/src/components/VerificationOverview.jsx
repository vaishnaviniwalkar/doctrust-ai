import React from 'react';

export default function VerificationOverview() {
  const verifiedCount = 94;
  const pendingCount = 21;
  const rejectedCount = 13;
  const totalCount = verifiedCount + pendingCount + rejectedCount; // 128

  const verifiedPercent = Math.round((verifiedCount / totalCount) * 100);
  const pendingPercent = Math.round((pendingCount / totalCount) * 100);
  const rejectedPercent = Math.round((rejectedCount / totalCount) * 100);

  const stats = [
    {
      label: 'Verified',
      count: verifiedCount,
      percentage: verifiedPercent,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      lightBg: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      dotColor: 'bg-emerald-500'
    },
    {
      label: 'Pending',
      count: pendingCount,
      percentage: pendingPercent,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      lightBg: 'bg-amber-50',
      borderColor: 'border-amber-200',
      dotColor: 'bg-amber-500'
    },
    {
      label: 'Rejected',
      count: rejectedCount,
      percentage: rejectedPercent,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      lightBg: 'bg-rose-50',
      borderColor: 'border-rose-200',
      dotColor: 'bg-rose-500'
    }
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verification Overview</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Distribution across status categories</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
            {totalCount} Total
          </span>
        </div>

        {/* Visual Progress Bar (CSS Segmented Bar) */}
        <div className="mt-4">
          <div className="h-3.5 w-full bg-slate-100 rounded-full flex overflow-hidden p-0.5 gap-0.5">
            <div
              style={{ width: `${verifiedPercent}%` }}
              className="bg-emerald-500 h-full rounded-l-full transition-all duration-300"
              title={`Verified: ${verifiedCount} (${verifiedPercent}%)`}
            />
            <div
              style={{ width: `${pendingPercent}%` }}
              className="bg-amber-500 h-full transition-all duration-300"
              title={`Pending: ${pendingCount} (${pendingPercent}%)`}
            />
            <div
              style={{ width: `${rejectedPercent}%` }}
              className="bg-rose-500 h-full rounded-r-full transition-all duration-300"
              title={`Rejected: ${rejectedCount} (${rejectedPercent}%)`}
            />
          </div>
        </div>

        {/* Detailed Breakdown Legend Cards */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className={`p-3 rounded-lg border ${item.lightBg} ${item.borderColor} flex flex-col justify-between`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{item.count}</p>
                <p className={`text-xs font-medium ${item.textColor}`}>{item.percentage}% of total</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Verification Rate</span>
        <span className="font-bold text-slate-900">{verifiedPercent}% Success Rate</span>
      </div>
    </div>
  );
}
