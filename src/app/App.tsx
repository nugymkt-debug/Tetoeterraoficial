import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainSite } from './MainSite';
import { AdminPanel } from './components/AdminPanel';
import { AdminSetup } from './components/AdminSetup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/setup" element={<SetupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function AdminPage() {
  return (
    <AdminPanel onClose={() => window.location.href = '/'} />
  );
}

function SetupPage() {
  return (
    <div className="min-h-screen bg-[#dde2df] flex items-center justify-center">
      <AdminSetup
        onClose={() => window.location.href = '/'}
        onSuccess={() => {
          setTimeout(() => {
            window.location.href = '/admin';
          }, 2000);
        }}
      />
    </div>
  );
}

export default App;
