import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import VerificationOverview from '../components/VerificationOverview';
import RecentDocuments from '../components/RecentDocuments';

export default function Dashboard({ activeNav, setActiveNav, onUploadClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleUploadBtnClick = () => {
    if (onUploadClick) {
      onUploadClick();
    } else if (setActiveNav) {
      setActiveNav('Upload & Verify');
    }
  };

  const statData = [
    {
      label: 'Total Documents',
      value: '128',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      trend: '+14% this week',
      trendType: 'positive',
      badgeBg: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Verified',
      value: '94',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      trend: '73.4% rate',
      trendType: 'positive',
      badgeBg: 'bg-emerald-50 text-emerald-600'
    },
    {
      label: 'Pending',
      value: '21',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      trend: 'In queue',
      trendType: 'neutral',
      badgeBg: 'bg-amber-50 text-amber-600'
    },
    {
      label: 'Rejected',
      value: '13',
      icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      trend: '-3% vs last week',
      trendType: 'negative',
      badgeBg: 'bg-rose-50 text-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Topbar setMobileOpen={setMobileOpen} />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Welcome Banner */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Good afternoon 👋
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Here's your document verification overview.
              </p>
            </div>
            <button
              onClick={handleUploadBtnClick}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload Document</span>
            </button>
          </section>

          {/* Stat Cards Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" aria-label="Key Statistics">
            {statData.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                trendType={stat.trendType}
                badgeBg={stat.badgeBg}
              />
            ))}
          </section>

          {/* Overview & Detailed Analytics Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <VerificationOverview />
            </div>
            <div className="lg:col-span-2">
              <RecentDocuments />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
