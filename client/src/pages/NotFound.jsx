import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-cyber-950 to-cyber-950 pointer-events-none" />
      
      <AlertTriangle className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
      
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4 tracking-tighter">
        404
      </h1>
      
      <h2 className="text-2xl font-bold text-slate-200 mb-4">ACCESS DENIED</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        The sector you are trying to access does not exist or has been quarantined by security protocols.
      </p>
      
      <button onClick={() => navigate('/dashboard')} className="btn-ghost border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500">
        RETURN TO SECURE SECTOR
      </button>
    </div>
  );
}
