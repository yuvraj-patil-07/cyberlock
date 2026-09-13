import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1e293b] font-pixel text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
             backgroundPosition: '0 0, 20px 20px',
             backgroundSize: '40px 40px'
           }}
      />
      
      <div className="text-[120px] drop-shadow-[4px_4px_0_#000] mb-4 animate-bounce">
        🚧
      </div>
      
      <h1 className="text-6xl text-red-500 mb-6 drop-shadow-[4px_4px_0_#000]">
        404
      </h1>
      
      <div className="pixel-panel-stone p-8 max-w-md shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl text-yellow-400 mb-4 drop-shadow-[2px_2px_0_#000]">DEAD END</h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-8">
          You've wandered off the map! This area of the kingdom does not exist or has been destroyed by malware.
        </p>
        
        <button onClick={() => navigate('/dashboard')} className="pixel-btn pixel-btn-primary w-full py-4">
          RETURN TO VILLAGE
        </button>
      </div>
    </div>
  );
}
