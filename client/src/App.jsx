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

// Layouts and components mapping (simulated via ProtectedRoute here)
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-full flex items-center justify-center text-cyan-400">Initializing Secure Connection...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-cyan-600 font-mono animate-pulse font-bold">Loading Core Systems...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo" element={<DemoMode />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/rooms" element={
            <ProtectedRoute>
              <RoomSelect />
            </ProtectedRoute>
          } />
          
          <Route path="/play/:roomId" element={
            <ProtectedRoute>
              <GameRoom />
            </ProtectedRoute>
          } />
          
          <Route path="/cyber-dna" element={
            <ProtectedRoute>
              <CyberDNA />
            </ProtectedRoute>
          } />
          
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/final" element={
            <ProtectedRoute>
              <FinalScreen />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
