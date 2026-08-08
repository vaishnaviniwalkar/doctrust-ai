import React from 'react';

const sampleDocuments = [
  {
    id: 1,
    name: 'Aarav Sharma',
    type: 'Aadhaar Card',
    submitted: 'Today, 10:32 AM',
    status: 'Verified',
    confidence: '98%'
  },
  {
    id: 2,
    name: 'Meera Joshi',
    type: 'PAN Card',
    submitted: 'Today, 09:15 AM',
    status: 'Pending',
    confidence: '--'
  },
  {
    id: 3,
    name: 'Rohan Patil',
    type: 'Driving Licence',
    submitted: 'Yesterday',
    status: 'Verified',
    confidence: '96%'
  },
  {
    id: 4,
    name: 'Priya Deshmukh',
    type: 'Passport',
    submitted: 'Yesterday',
    status: 'Rejected',
    confidence: '61%'
  }
];

export default function RecentDocuments() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Verified
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Documents</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Latest document verification requests</p>
        </div>
        <button className="self-start sm:self-auto text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
          View All Documents →
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3.5 px-5 sm:px-6">Document</th>
              <th scope="col" className="py-3.5 px-4">Type</th>
              <th scope="col" className="py-3.5 px-4">Submitted</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-5 sm:px-6 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sampleDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors duration-100">
                {/* Document Name / Holder */}
                <td className="py-4 px-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-100">
                      {doc.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-snug">{doc.name}</p>
                      <p className="text-xs text-slate-400">ID: DOC-2026-{doc.id}049</p>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="py-4 px-4 text-slate-700 font-medium">
                  {doc.type}
                </td>

                {/* Submitted */}
                <td className="py-4 px-4 text-slate-500 text-xs">
                  {doc.submitted}
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  {getStatusBadge(doc.status)}
                </td>

                {/* Confidence */}
                <td className="py-4 px-5 sm:px-6 text-right font-semibold text-slate-900">
                  {doc.confidence !== '--' ? (
                    <span className="text-emerald-700 font-bold">{doc.confidence}</span>
                  ) : (
                    <span className="text-slate-400 font-normal">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
