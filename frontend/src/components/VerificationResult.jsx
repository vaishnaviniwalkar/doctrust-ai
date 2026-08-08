import React from 'react';

export default function VerificationResult({ result, onVerifyAnother, onViewHistory }) {
  const {
    id,
    fileName,
    status,
    confidence,
    timestamp,
    extractedFields,
    checks,
    engineLabel = 'Prototype Verification Engine (Local Demo)'
  } = result;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
      {/* Prototype Engine Disclaimer Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-bold">{engineLabel}</p>
          <p className="text-amber-700 mt-0.5">
            Results and extracted fields are generated locally in the browser for demonstration purposes.
            No live OCR engine, government database, or external registry was queried in this prototype build.
          </p>
        </div>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Verification Complete</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            File analyzed: <span className="text-slate-700 font-semibold">{fileName}</span>
          </p>
        </div>

        {/* Confidence Score Pill */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right min-w-[140px]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence Score</p>
          <p className="text-2xl font-extrabold text-emerald-600">{confidence}</p>
        </div>
      </div>

      {/* Audit Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div>
          <p className="text-slate-400 font-medium">Document ID</p>
          <p className="font-bold text-slate-800 mt-0.5">{id}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Timestamp</p>
          <p className="font-semibold text-slate-800 mt-0.5">{timestamp}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Verification Status</p>
          <p className="font-semibold text-emerald-700 mt-0.5">{status}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Engine Mode</p>
          <p className="font-semibold text-blue-700 mt-0.5">Local Simulated</p>
        </div>
      </div>

      {/* Grid: Extracted Fields + Verification Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Extracted Fields Table */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Extracted Field Data
          </h4>
          <p className="text-[11px] text-slate-400 mb-4">Structured values formatted for API integration mapping</p>

          <dl className="divide-y divide-slate-200 text-xs">
            {Object.entries(extractedFields).map(([key, val]) => (
              <div key={key} className="py-2.5 flex justify-between gap-4">
                <dt className="text-slate-500 font-medium">{key}</dt>
                <dd className="text-slate-900 font-semibold text-right">{val}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Verification Checks Audit */}
        <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Automated Audit Checks
          </h4>
          <p className="text-[11px] text-slate-400 mb-4">6-point validation suite results</p>

          <div className="space-y-3 text-xs">
            {checks.map((chk) => (
              <div key={chk.name} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{chk.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {chk.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{chk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Result stored in local browser history key: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">doctrust_verification_history</code>
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onViewHistory}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            View Verification History
          </button>
          <button
            onClick={onVerifyAnother}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Verify Another Document
          </button>
        </div>
      </div>
    </div>
  );
}
