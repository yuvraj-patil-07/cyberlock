import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RoomSelect = lazy(() => import('./pages/RoomSelect'));
const GameRoom = lazy(() => import('./pages/GameRoom'));
const CyberDNA = lazy(() => import('./pages/CyberDNA'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const FinalScreen = lazy(() => import('./pages/FinalScreen'));
const DemoMode = lazy(() => import('./pages/DemoMode'));
const NotFound = lazy(() => import('./pages/NotFound'));
const GameEngineLayout = lazy(() => import('./components/layout/GameEngineLayout'));

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center"
         style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>
      {/* Fantasy boot crest */}
      <div className="relative mb-8">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <polygon points="40,5 75,20 75,55 40,75 5,55 5,20" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="4 2"/>
          <polygon points="40,14 66,26 66,52 40,64 14,52 14,26" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.4)" strokeWidth="1"/>
          <path d="M40 22 L40 58 M28 32 L52 32 M30 44 L50 44" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="40" cy="40" r="6" fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="1.5"/>
        </svg>
        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(0,212,255,0.1)' }} />
      </div>
      <p className="font-fantasy text-sm tracking-widest text-cyan-400 animate-pulse uppercase">
        Initializing the Realm...
      </p>
      <div className="mt-4 flex gap-1">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400"
               style={{ animation: `pulse 1s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>
      <Suspense fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center"
             style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>
          <div className="w-16 h-16 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"
               style={{ boxShadow: '0 0 20px rgba(0,212,255,0.4)' }} />
          <p className="font-fantasy text-xs tracking-widest text-cyan-400 uppercase animate-pulse">
            Loading the Realm...
          </p>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo" element={<DemoMode />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><GameEngineLayout><Dashboard /></GameEngineLayout></ProtectedRoute>} />
          <Route path="/rooms"     element={<ProtectedRoute><GameEngineLayout><RoomSelect /></GameEngineLayout></ProtectedRoute>} />
          <Route path="/play/:roomId" element={<ProtectedRoute><GameEngineLayout><GameRoom /></GameEngineLayout></ProtectedRoute>} />
          <Route path="/cyber-dna"   element={<ProtectedRoute><GameEngineLayout><CyberDNA /></GameEngineLayout></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/final"       element={<ProtectedRoute><FinalScreen /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
