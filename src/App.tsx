import React, { useState, useEffect } from 'react';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { authService } from './services/authService';
import { AuthResponse } from './types';

function App() {
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const savedSession = authService.getSession();
    if (savedSession) {
      setSession(savedSession);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return <AuthView onSuccess={(s) => setSession(s)} />;
  }

  return (
    <DashboardView 
      session={session} 
      onLogout={() => setSession(null)} 
    />
  );
}

export default App;