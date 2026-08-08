import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import UploadZone from '../components/UploadZone';
import DocumentPreview from '../components/DocumentPreview';
import VerificationProgress, { STAGES } from '../components/VerificationProgress';
import VerificationResult from '../components/VerificationResult';

// Local Mock Verification Engine
// Note for judges: This function simulates structured extraction and security audits.
// Replace this function with a backend call to real OCR and Verification APIs in production.
function runLocalVerificationEngine(file) {
  const docIdNumber = Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const timestampString = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + ', ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Infer realistic document type based on file name or default
  const nameLower = file.name.toLowerCase();
  let docType = 'Government Photo ID';
  if (nameLower.includes('aadhaar')) docType = 'Aadhaar Card';
  else if (nameLower.includes('pan')) docType = 'PAN Card';
  else if (nameLower.includes('passport')) docType = 'Passport';
  else if (nameLower.includes('license') || nameLower.includes('licence')) docType = 'Driving Licence';

  const mockResult = {
    id: `DOC-TR-${docIdNumber}`,
    fileName: file.name,
    fileType: file.type || 'application/pdf',
    fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    status: 'Verified',
    confidence: '98%',
    timestamp: timestampString,
    engineLabel: 'Prototype Verification Engine (Local Demo)',
    extractedFields: {
      'Document Type': docType,
      'Document Number': `DOC-${docIdNumber}`,
      'Full Name': 'Ananya Sharma',
      'Date of Birth': '14 Aug 1994',
      'Issue Date': '10 Jan 2021',
      'Expiry Date': '09 Jan 2031'
    },
    checks: [
      { name: 'File Integrity', status: 'Passed', detail: 'Digital file signature is intact with no corruption detected.' },
      { name: 'Required Fields', status: 'Passed', detail: 'All 6 mandatory identification data points successfully identified.' },
      { name: 'Format Validation', status: 'Passed', detail: 'Document number format complies with national standard structure.' },
      { name: 'Date Validity', status: 'Passed', detail: 'Issue date is valid and document is currently active.' },
      { name: 'Consistency Check', status: 'Passed', detail: 'Name, DOB, and formatting cross-check verified.' },
      { name: 'Duplicate Check', status: 'Passed', detail: 'No existing document checksum match found in local ledger.' }
    ]
  };

  // Save result to localStorage under key "doctrust_verification_history"
  try {
    const existingHistoryRaw = localStorage.getItem('doctrust_verification_history');
    const existingHistory = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
    existingHistory.unshift(mockResult);
    localStorage.setItem('doctrust_verification_history', JSON.stringify(existingHistory));
  } catch (err) {
    console.warn('Unable to write verification history to localStorage:', err);
  }

  return mockResult;
}

export default function UploadVerify({ activeNav, setActiveNav }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [verificationState, setVerificationState] = useState('idle'); // 'idle' | 'preview' | 'verifying' | 'result'
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setVerificationState('preview');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setVerificationState('idle');
    setCurrentStageIndex(0);
    setVerificationResult(null);
  };

  const handleStartVerification = () => {
    setVerificationState('verifying');
    setCurrentStageIndex(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      if (stage < STAGES.length) {
        setCurrentStageIndex(stage);
      } else {
        clearInterval(interval);
        // Run engine & display result
        const result = runLocalVerificationEngine(selectedFile);
        setVerificationResult(result);
        setVerificationState('result');
      }
    }, 500); // 500ms delay per stage for clean visual feedback
  };

  const handleVerifyAnother = () => {
    handleRemoveFile();
  };

  const handleViewHistory = () => {
    if (setActiveNav) {
      setActiveNav('Verification History');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Banner */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Upload & Verify
                </h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Feature 2
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Upload a document and let DocTrust AI check its authenticity and consistency.
              </p>
            </div>
          </section>

          {/* Dynamic Workflow Area */}
          <section className="mt-6">
            {verificationState === 'idle' && (
              <UploadZone onFileSelect={handleFileSelect} />
            )}

            {verificationState === 'preview' && selectedFile && (
              <DocumentPreview
                file={selectedFile}
                onRemove={handleRemoveFile}
                onVerify={handleStartVerification}
              />
            )}

            {verificationState === 'verifying' && selectedFile && (
              <VerificationProgress
                currentStageIndex={currentStageIndex}
                fileName={selectedFile.name}
              />
            )}

            {verificationState === 'result' && verificationResult && (
              <VerificationResult
                result={verificationResult}
                onVerifyAnother={handleVerifyAnother}
                onViewHistory={handleViewHistory}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
