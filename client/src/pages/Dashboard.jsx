import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { useAuth } from '../hooks/useAuth';

/*
  Dashboard — Uses the exact provided world map image as the full background.
  Clickable hotspot zones are positioned at the exact locations
  matching the zone labels in the image.
*/

/* Zone definitions with exact % positions matching the image */
const ZONES = [
  { id: 'phishing',    name: 'PHISHING PORT',   x: 30,  y: 27,  route: '/play/phishing' },
  { id: 'passwords',   name: 'PASSWORD VAULT',  x: 24,  y: 53,  route: '/play/passwords' },
  { id: 'firewall',    name: 'FIREWALL CITY',   x: 50,  y: 43,  route: '/play/firewall' },
  { id: 'qr-codes',    name: 'QR TEMPLE',       x: 32,  y: 77,  route: '/play/qr-codes' },
  { id: 'ai-threats',  name: 'AI LAB',          x: 73,  y: 24,  route: '/play/ai-threats' },
  { id: 'scams',       name: 'SCAM MARKET',     x: 76,  y: 54,  route: '/play/scams' },
  { id: 'dark-web',    name: 'DARK WEB DEPTHS', x: 72,  y: 76,  route: '/play/dark-web' },
  { id: 'final',       name: 'CYBER CORE',      x: 50,  y: 17,  route: '/play/final' },
];

/* Sidebar nav items with exact positions matching the image */
const SIDEBAR_ITEMS = [
  { label: 'WORLD',       route: '/dashboard',   y: 27 },
  { label: 'QUESTS',      route: '/rooms',        y: 34 },
  { label: 'INVENTORY',   route: null,            y: 41 },
  { label: 'BADGES',      route: null,            y: 48 },
  { label: 'LEADERBOARD', route: '/leaderboard',  y: 55 },
  { label: 'PROFILE',     route: '/cyber-dna',    y: 62 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    gameService.getProgress()
      .then(res => setProgress(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#1a1a2e' }}>
      {/* ═══ THE EXACT IMAGE AS FULL BACKGROUND ═══ */}
      <img
        src="/assets/world-map-bg.png"
        alt="Cyber Quest World Map"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          imageRendering: 'auto',
        }}
        draggable={false}
      />

      {/* ═══ CLICKABLE ZONE HOTSPOTS ═══
          These are invisible buttons positioned exactly over each zone label in the image.
          When clicked, they navigate to the corresponding game room. */}
      {ZONES.map((zone) => (
        <button
          key={zone.id}
          onClick={() => navigate(zone.route)}
          className="absolute group"
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '140px',
            height: '50px',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            zIndex: 10,
          }}
          title={zone.name}
        >
          {/* Invisible hover highlight */}
          <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
               style={{
                 background: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                 border: '2px solid rgba(255, 215, 0, 0.4)',
               }}
          />
        </button>
      ))}

      {/* ═══ SIDEBAR NAVIGATION HOTSPOTS ═══ */}
      {SIDEBAR_ITEMS.map((item) => (
        <button
          key={item.label}
          onClick={() => item.route && navigate(item.route)}
          className="absolute group"
          style={{
            left: '6.5%',
            top: `${item.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '34px',
            cursor: item.route ? 'pointer' : 'not-allowed',
            background: 'transparent',
            border: 'none',
            zIndex: 20,
            opacity: item.route ? 1 : 0.5,
          }}
          title={item.label}
        >
          <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
               style={{
                 background: 'rgba(255, 255, 255, 0.06)',
               }}
          />
        </button>
      ))}

      {/* ═══ SETTINGS GEAR HOTSPOT (top-right) ═══ */}
      <button
        onClick={() => {/* settings modal placeholder */}}
        className="absolute"
        style={{
          right: '1.5%',
          top: '3.5%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          zIndex: 20,
        }}
        title="Settings"
      />

      {/* ═══ CURRENT QUEST ARROW HOTSPOT (right sidebar) ═══ */}
      <button
        onClick={() => navigate('/play/phishing')}
        className="absolute group"
        style={{
          right: '2%',
          top: '26%',
          width: '200px',
          height: '90px',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          zIndex: 20,
        }}
        title="Go to Current Quest"
      >
        <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
             style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        />
      </button>

      {/* ═══ CONTINUE BUTTON HOTSPOT (bottom-right) ═══ */}
      <button
        onClick={() => navigate('/rooms')}
        className="absolute group"
        style={{
          right: '2%',
          bottom: '3%',
          width: '180px',
          height: '50px',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          zIndex: 20,
        }}
        title="Continue"
      >
        <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
             style={{
               background: 'rgba(255, 255, 255, 0.1)',
               boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
             }}
        />
      </button>

      {/* ═══ COMPASS HOTSPOT (bottom-left) ═══ */}
      <div className="absolute"
           style={{
             left: '3%',
             bottom: '3%',
             width: '60px',
             height: '70px',
             zIndex: 20,
           }}
      />
    </div>
  );
}
