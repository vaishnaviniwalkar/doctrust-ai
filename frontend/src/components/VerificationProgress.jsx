import React from 'react';

export const STAGES = [
  'Reading document',
  'Extracting information',
  'Validating fields',
  'Checking consistency',
  'Checking duplicates',
  'Generating verification result'
];

export default function VerificationProgress({ currentStageIndex, fileName }) {
  const progressPercent = Math.min(100, Math.round(((currentStageIndex + 1) / STAGES.length) * 100));

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Verifying Document</h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Analyzing <span className="font-semibold text-slate-700">{fileName}</span> via local engine
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-blue-600">{STAGES[currentStageIndex] || 'Processing...'}</span>
          <span className="text-slate-700">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Verification Stages Checklist */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div key={stage} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">
                    ✓
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center flex-shrink-0 text-[10px]">
                    {idx + 1}
                  </div>
                )}
                <span
                  className={`font-medium ${
                    isDone
                      ? 'text-slate-700'
                      : isCurrent
                      ? 'text-blue-700 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {stage}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {isDone ? 'Completed' : isCurrent ? 'In progress...' : 'Queued'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
