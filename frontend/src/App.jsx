import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import UploadVerify from './pages/UploadVerify';

function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');

  if (activeNav === 'Upload & Verify') {
    return <UploadVerify activeNav={activeNav} setActiveNav={setActiveNav} />;
  }

  return (
    <Dashboard
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      onUploadClick={() => setActiveNav('Upload & Verify')}
    />
  );
}

export default App;