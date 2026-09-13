import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: '#f5e6c8' }}>
      <div className="text-center">
        <div className="text-8xl mb-4 cq-bounce">🐕</div>
        <h1 className="font-pixel text-4xl mb-2" style={{ color: '#2a1a0a' }}>404</h1>
        <p className="text-xl mb-6" style={{ fontFamily: "'VT323', monospace", color: '#6a5a4a' }}>
          Looks like you took a wrong turn.
        </p>
        <button onClick={() => navigate('/dashboard')}
                className="cq-btn cq-btn-danger">
          🏠 Go Home
        </button>
      </div>
    </div>
  );
}
