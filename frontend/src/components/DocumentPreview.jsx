import React, { useEffect, useState } from 'react';

export default function DocumentPreview({ file, onRemove, onVerify }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const isImage = file && file.type.startsWith('image/');
  const isPdf = file && file.type === 'application/pdf';

  useEffect(() => {
    if (isImage) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file, isImage]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Document Ready for Verification</h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Review file details before initiating the analysis workflow.
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove File
        </button>
      </div>

      {/* File Info Header */}
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
          {isPdf ? 'PDF' : 'IMG'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
            <span>{isPdf ? 'PDF Document' : file.type.toUpperCase().replace('IMAGE/', '')}</span>
            <span>•</span>
            <span>{formatFileSize(file.size)}</span>
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Validated
        </span>
      </div>

      {/* Visual Preview Container */}
      <div className="bg-slate-900/5 rounded-xl p-4 flex items-center justify-center border border-slate-200 min-h-[220px]">
        {isImage && imagePreviewUrl ? (
          <div className="text-center">
            <img
              src={imagePreviewUrl}
              alt="Document Preview"
              className="max-h-72 w-auto object-contain rounded-lg border border-slate-200 shadow-sm mx-auto"
            />
            <p className="text-xs text-slate-400 mt-2">Image Preview</p>
          </div>
        ) : isPdf ? (
          <div className="text-center py-6">
            <div className="w-16 h-20 mx-auto bg-white rounded-lg border border-slate-300 shadow-sm flex flex-col justify-between p-3 relative overflow-hidden">
              <div className="w-full h-2 bg-rose-500 rounded-full" />
              <div className="space-y-1 my-2">
                <div className="w-full h-1 bg-slate-200 rounded" />
                <div className="w-4/5 h-1 bg-slate-200 rounded" />
                <div className="w-3/5 h-1 bg-slate-200 rounded" />
              </div>
              <span className="text-[9px] font-extrabold text-slate-500 tracking-wider">PDF</span>
            </div>
            <p className="text-sm font-semibold text-slate-700 mt-3">{file.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">Portable Document Format • Ready for analysis</p>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-6">
            <p className="text-sm font-semibold">Document loaded</p>
            <p className="text-xs mt-1">Ready for verification engine</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          onClick={onRemove}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onVerify}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Verify Document
        </button>
      </div>
    </div>
  );
}
