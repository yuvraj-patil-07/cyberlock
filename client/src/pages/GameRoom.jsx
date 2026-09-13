import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { gameService } from '../services/gameService';
import { aiService } from '../services/aiService';
import { ROOMS } from '../utils/constants';
import { sounds } from '../utils/soundEffects';

// Room components — unchanged
import PhishingRoom  from '../components/game/rooms/PhishingRoom';
import PasswordRoom  from '../components/game/rooms/PasswordRoom';
import QRRoom        from '../components/game/rooms/QRRoom';
import ScamRoom      from '../components/game/rooms/ScamRoom';
import SocialRoom    from '../components/game/rooms/SocialRoom';
import AIRoom        from '../components/game/rooms/AIRoom';
import FinalRoom     from '../components/game/rooms/FinalRoom';

// Game logic components — unchanged
import EvidenceBoard    from '../components/game/EvidenceBoard';
import ConsequenceEngine from '../components/game/ConsequenceEngine';
import ReasoningPrompt  from '../components/game/ReasoningPrompt';
import HintSystem       from '../components/game/HintSystem';
import ChallengeResult  from '../components/game/ChallengeResult';

import { Volume2, VolumeX, ArrowLeft, Award, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

/* ══════════════════════════════════════════════
   ZONE HEADER ARTWORK
══════════════════════════════════════════════ */
const ZONE_THEMES = {
  1: { name:'Phishing Tower',    emoji:'🎣', color:'#ff4757', bg:'rgba(255,71,87,0.08)',   border:'rgba(255,71,87,0.25)',   icon:'🏰' },
  2: { name:'Password Fortress', emoji:'🔒', color:'#ffd700', bg:'rgba(255,215,0,0.08)',   border:'rgba(255,215,0,0.25)',   icon:'🏯' },
  3: { name:'QR Temple',         emoji:'📱', color:'#9b59b6', bg:'rgba(155,89,182,0.08)', border:'rgba(155,89,182,0.25)', icon:'⛩' },
  4: { name:'Scam Village',      emoji:'💰', color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)', icon:'🏘' },
  5: { name:'Social Nexus',      emoji:'👥', color:'#ff6b9d', bg:'rgba(255,107,157,0.08)','border':'rgba(255,107,157,0.25)', icon:'🌐' },
  6: { name:'AI Threat Lab',     emoji:'🤖', color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.25)',  icon:'⚗' },
  7: { name:'Final Cyber Castle',emoji:'🏰', color:'#00ff88', bg:'rgba(0,255,136,0.08)',  border:'rgba(0,255,136,0.25)',  icon:'⚔' },
};

/* ── Particle burst ── */
const ParticleBurst = ({ trigger, color = '#ffd700' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 12) * 360,
      color: i % 3 === 0 ? color : i % 3 === 1 ? '#ffffff' : '#ffd700',
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 900);
  }, [trigger, color]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div key={p.id} className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
             style={{
               background: p.color,
               boxShadow: `0 0 6px ${p.color}`,
               '--tx': `${Math.cos(p.angle * Math.PI / 180) * 80}px`,
               '--ty': `${Math.sin(p.angle * Math.PI / 180) * 80}px`,
               animation: 'particle-burst 0.8s ease-out forwards',
             }}/>
      ))}
    </div>
  );
};

/* ── Loot Chest ── */
const LootChest = ({ open, xpEarned }) => (
  <div className="relative flex flex-col items-center gap-2">
    <div className="relative">
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none"
           className={open ? 'chest-glow' : ''}>
        {/* Base */}
        <rect x="5" y="35" width="70" height="30" rx="4" fill="#8a5a1e" stroke="#c8922a" strokeWidth="2"/>
        <rect x="10" y="40" width="60" height="20" rx="2" fill="#6b4010"/>
        {/* Hinge straps */}
        <rect x="8" y="35" width="8" height="30" rx="1" fill="#c8922a" opacity="0.7"/>
        <rect x="64" y="35" width="8" height="30" rx="1" fill="#c8922a" opacity="0.7"/>
        <rect x="34" y="35" width="12" height="30" rx="1" fill="#c8922a" opacity="0.7"/>
        {/* Lock */}
        <rect x="34" y="42" width="12" height="10" rx="2" fill={open ? '#00ff88' : '#ffd700'} stroke="#8a5a1e" strokeWidth="1"/>
        <circle cx="40" cy="44" r="3" fill="#8a5a1e"/>
        {/* Lid - animates open */}
        <g style={{ transformOrigin: '40px 35px', transform: open ? 'rotateX(-120deg)' : 'rotateX(0deg)', transition: 'transform 0.5s ease' }}>
          <path d="M5 35 Q5 8 40 5 Q75 8 75 35Z" fill="#a06828" stroke="#c8922a" strokeWidth="2"/>
          <rect x="10" y="15" width="60" height="18" rx="2" fill="#8a5a1e" opacity="0.5"/>
        </g>
        {/* Glow when open */}
        {open && (
          <>
            <ellipse cx="40" cy="35" rx="30" ry="8" fill="rgba(255,215,0,0.3)" style={{ animation: 'torch-flicker 0.3s infinite' }}/>
            <ellipse cx="40" cy="35" rx="15" ry="4" fill="rgba(255,215,0,0.5)"/>
          </>
        )}
      </svg>
      {open && <div className="absolute -top-2 left-0 right-0 flex justify-center pointer-events-none">
        {['💰','⭐','💎'].map((coin, i) => (
          <span key={i} className="text-xl" style={{ animation: `coin-rain 0.8s ease-in ${i * 0.1}s forwards` }}>{coin}</span>
        ))}
      </div>}
    </div>
    {open && xpEarned > 0 && (
      <motion.div initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }}
                  className="rune-badge rune-badge-gold">
        +{xpEarned} XP
      </motion.div>
    )}
  </div>
);

/* ── NPC Wizard Coach ── */
const WizardCoach = ({ message, isThinking }) => (
  <div className="flex items-end gap-3">
    <div className="w-14 h-14 flex-shrink-0 relative" style={{ animation: 'float-slow 4s ease-in-out infinite' }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        {/* Robe */}
        <path d="M14 32 Q12 54 28 54 Q44 54 42 32Z" fill="#4a2080"/>
        {/* Body */}
        <rect x="18" y="28" width="20" height="16" fill="#3d1a6e" rx="2"/>
        {/* Stars on robe */}
        <circle cx="24" cy="38" r="1.5" fill="#ffd700" opacity="0.8"/>
        <circle cx="32" cy="42" r="1.5" fill="#00d4ff" opacity="0.8"/>
        {/* Head */}
        <circle cx="28" cy="24" r="11" fill="#2a3558" stroke="#3d4f7c" strokeWidth="1.5"/>
        {/* Eyes */}
        <circle cx="24" cy="23" r="2.5" fill="white"/>
        <circle cx="32" cy="23" r="2.5" fill="white"/>
        <circle cx="24.5" cy="23.5" r="1.2" fill="#00d4ff"/>
        <circle cx="32.5" cy="23.5" r="1.2" fill="#00d4ff"/>
        {/* Beard */}
        <path d="M22 30 Q28 36 34 30" fill="#8892a4" opacity="0.6"/>
        {/* Wizard hat */}
        <polygon points="28,2 40,18 16,18" fill="#4a2080" stroke="#9b59b6" strokeWidth="1"/>
        <rect x="14" y="16" width="28" height="5" fill="#6b28a8" rx="1"/>
        {/* Hat star */}
        <circle cx="28" cy="10" r="3" fill="#ffd700" style={{ filter: 'drop-shadow(0 0 4px #ffd700)' }}/>
        {/* Wand */}
        <line x1="40" y1="36" x2="52" y2="22" stroke="#8892a4" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="52" cy="21" r="4" fill={isThinking ? '#ffd700' : '#9b59b6'}
                style={{ animation: isThinking ? 'castle-glow 1s infinite' : 'none', filter: `drop-shadow(0 0 6px ${isThinking ? '#ffd700' : '#9b59b6'})` }}/>
      </svg>
    </div>
    <div className="flex-1 speech-bubble">
      <p className="text-xs font-bold mb-0.5" style={{ color: '#c39bd3' }}>
        {isThinking ? '✨ Mentor is thinking...' : '🧙 Mentor Speaks'}
      </p>
      <p className="text-xs leading-relaxed text-white">
        {isThinking ? '...' : (message || 'Click glowing evidence in the scene to investigate. Gather clues before making your verdict.')}
      </p>
    </div>
  </div>
);

export default function GameRoom() {
  const { roomId } = useParams();
  const navigate   = useNavigate();
  const { user, loadUser } = useAuth();
  const { loadProgress }   = useGame();

  const [challenges,        setChallenges]        = useState([]);
  const [currentIndex,      setCurrentIndex]      = useState(0);
  const [loading,           setLoading]           = useState(true);
  const [gameState,         setGameState]         = useState('investigating');
  const [pendingAnswer,     setPendingAnswer]     = useState(null);
  const [selectedReasoning, setSelectedReasoning] = useState([]);
  const [discoveredEvidence,setDiscoveredEvidence]= useState([]);
  const [hintsUsedCount,    setHintsUsedCount]    = useState(0);
  const [hintText,          setHintText]          = useState(null);
  const [hintLevel,         setHintLevel]         = useState(1);
  const [showHintModal,     setShowHintModal]     = useState(false);
  const [submissionResult,  setSubmissionResult]  = useState(null);
  const [startTime,         setStartTime]         = useState(Date.now());
  const [roomScore,         setRoomScore]         = useState(0);
  const [particleTrigger,   setParticleTrigger]   = useState(0);
  const [chestOpen,         setChestOpen]         = useState(false);
  const [isMuted,           setIsMuted]           = useState(sounds.isMuted());

  const roomConfig = ROOMS.find(r => r.id === parseInt(roomId, 10)) || ROOMS[0];
  const zoneTheme  = ZONE_THEMES[parseInt(roomId, 10)] || ZONE_THEMES[1];

  const loadChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const res = await gameService.getChallenges(roomId);
      let loaded = res.data.challenges || [];
      if (loaded.length === 0) {
        loaded = [{
          _id: 'default-challenge',
          room: parseInt(roomId, 10),
          title: `${roomConfig.title} Simulation`,
          category: roomConfig.category,
          difficulty: 'intermediate',
          scenario: { sender: 'Security Test Agent', senderAddress: 'agent@cyberlock.invalid', body: 'Classify the threat pattern present in this mission.', context: 'Investigate the clues and make the correct classification.' },
          options: [
            { text: 'SAFE — Legitimate notification', value: 'safe' },
            { text: 'SUSPICIOUS — Potential deceptive lure', value: 'suspicious' },
            { text: 'THREAT — Confirmed malicious vector', value: 'phishing' }
          ],
          correctAnswer: 'suspicious',
          indicators: [{ type: 'domain', description: 'Deceptive domain suffix (.invalid)', points: 15 }],
          explanation: 'Always verify communication origins out-of-band.',
          hints: ['Inspect the sender domain.', 'Check for urgency.'],
          consequenceChain: ['Unverified click', 'Potential token exposure'],
          recoverySteps: ['Reset credentials', 'Enable 2FA']
        }];
      }
      setChallenges(loaded);
      setCurrentIndex(0); setGameState('investigating');
      setDiscoveredEvidence([]); setHintsUsedCount(0); setHintText(null); setStartTime(Date.now());
    } catch (err) { console.error('Error loading challenges:', err); }
    finally { setLoading(false); }
  }, [roomId, roomConfig]);

  useEffect(() => { loadChallenges(); }, [loadChallenges]);

  const currentChallenge = challenges[currentIndex] || null;

  const handleAnswer = answerValue => { setPendingAnswer(answerValue); setGameState('reasoning'); };

  const handleEvidenceSelect = (type, label) => {
    if (!discoveredEvidence.some(e => e.id === type || e.label === label)) {
      sounds.playEvidenceFound();
      setDiscoveredEvidence(prev => [...prev, { id: type, type: 'danger', label: label || `Indicator: ${type}`, analysis: `Evidence logged.`, points: 10, found: true }]);
    }
  };

  const handleRequestHint = async () => {
    if (!currentChallenge) return;
    try {
      const res = await aiService.getHint(currentChallenge._id, hintLevel, discoveredEvidence);
      setHintText(res.data.hint);
    } catch { setHintText('Look closely at the sender domain and whether any artificial urgency is being created.'); }
    setHintsUsedCount(prev => prev + 1);
    setHintLevel(prev => Math.min(3, prev + 1));
    setShowHintModal(true);
  };

  const handleConfirmReasoning = async reasons => {
    setSelectedReasoning(reasons);
    const responseTimeSec = Math.round((Date.now() - startTime) / 1000);
    try {
      setLoading(true);
      const res = await gameService.submitAttempt(currentChallenge._id, {
        answer: pendingAnswer, reasoning: reasons, evidenceFound: discoveredEvidence,
        hintsUsed: hintsUsedCount, responseTime: responseTimeSec
      });
      setSubmissionResult(res.data);
      const xpEarned = res.data.scoring?.xpEarned || 0;
      setRoomScore(prev => prev + xpEarned);
      await loadUser();
      if (res.data.isCorrect) {
        sounds.playCorrect();
        setParticleTrigger(t => t + 1);
        setTimeout(() => setChestOpen(true), 400);
      } else { sounds.playIncorrect(); }
      setGameState((!res.data.isCorrect && res.data.consequenceChain?.length > 0) ? 'consequence' : 'result');
    } catch (err) {
      const isCorrect = pendingAnswer === currentChallenge.correctAnswer;
      if (isCorrect) { sounds.playCorrect(); setParticleTrigger(t => t + 1); setTimeout(() => setChestOpen(true), 400); }
      else sounds.playIncorrect();
      setSubmissionResult({
        isCorrect, explanation: currentChallenge.explanation,
        scoring: { xpEarned: isCorrect ? 60 : 10, trustChange: isCorrect ? 15 : -20 },
        consequenceChain: currentChallenge.consequenceChain || [],
        recoverySteps: currentChallenge.recoverySteps || [],
        coachExplanation: { analysis: currentChallenge.explanation, strength: isCorrect ? 'Solid identification.' : 'Good attempt.', vulnerability: isCorrect ? 'None' : 'Watch for subtle tricks.', actionableTip: 'Always verify out-of-band.' }
      });
      setGameState(!isCorrect ? 'consequence' : 'result');
    } finally { setLoading(false); }
  };

  const handleNextChallenge = async () => {
    setChestOpen(false);
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(prev => prev + 1); setGameState('investigating'); setPendingAnswer(null);
      setSelectedReasoning([]); setDiscoveredEvidence([]); setHintsUsedCount(0);
      setHintText(null); setHintLevel(1); setShowHintModal(false); setStartTime(Date.now());
    } else {
      sounds.playRoomUnlock();
      try { await gameService.completeRoom(roomId); await loadProgress(); } catch {}
      setGameState('room_complete');
    }
  };

  const renderRoomContent = () => {
    if (!currentChallenge) return null;
    const props = { challenge: currentChallenge, onAnswer: handleAnswer, onEvidenceSelect: handleEvidenceSelect, selectedEvidence: discoveredEvidence };
    switch (parseInt(roomId, 10)) {
      case 1: return <PhishingRoom {...props} />;
      case 2: return <PasswordRoom {...props} />;
      case 3: return <QRRoom {...props} />;
      case 4: return <ScamRoom {...props} />;
      case 5: return <SocialRoom {...props} />;
      case 6: return <AIRoom {...props} />;
      case 7: return <FinalRoom {...props} />;
      default: return <PhishingRoom {...props} />;
    }
  };

  if (loading && challenges.length === 0) return (
    <div className="h-screen w-full flex flex-col items-center justify-center"
         style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>
      <div className="text-6xl mb-4 animate-float">{zoneTheme.emoji}</div>
      <div className="w-16 h-16 border-2 border-t-transparent rounded-full animate-spin mb-4"
           style={{ borderColor: zoneTheme.color, borderTopColor: 'transparent', boxShadow: `0 0 20px ${zoneTheme.color}40` }}/>
      <p className="font-fantasy text-sm tracking-widest uppercase" style={{ color: zoneTheme.color }}>
        Entering {zoneTheme.name}...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>

      {/* ════ GAME HUD BAR ════ */}
      <div className="hud-panel sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

        {/* Left: Back + Zone name */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate('/rooms')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wider transition-all hover:scale-105"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#8892a4', background: 'rgba(255,255,255,0.04)' }}>
            <ArrowLeft size={12} /> MAP
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg flex-shrink-0">{zoneTheme.emoji}</span>
            <span className="font-fantasy text-sm font-bold text-white truncate">{zoneTheme.name}</span>
          </div>
        </div>

        {/* Center: Challenge progress */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-xs font-bold tracking-wider" style={{ color: '#8892a4' }}>
            MISSION {currentIndex + 1}/{challenges.length || 1}
          </div>
          <div className="w-24 xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${((currentIndex + 1) / Math.max(challenges.length, 1)) * 100}%` }}/>
          </div>
        </div>

        {/* Right: HUD metrics */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Lives */}
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(Math.max(0, user?.lives ?? 5))].map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#ff4757" style={{ filter: 'drop-shadow(0 0 4px #ff4757)' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            ))}
          </div>

          {/* Trust score */}
          <div className="rune-badge text-[10px]">
            <span>🛡</span>
            <span>{user?.trustScore ?? 100}%</span>
          </div>

          {/* XP earned */}
          <div className="rune-badge rune-badge-gold text-[10px]">
            <span>⚡</span>
            <span>+{roomScore}</span>
          </div>

          {/* Hint button */}
          <button onClick={handleRequestHint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all hover:scale-105"
            style={{ background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', color: '#c39bd3' }}>
            🔮 <span className="hidden md:inline">HINT</span>
          </button>

          {/* Mute */}
          <button onClick={() => { const m = sounds.toggleMute(); setIsMuted(m); }}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all">
            {isMuted ? <VolumeX size={12}/> : <Volume2 size={12}/>}
          </button>
        </div>
      </div>

      {/* ════ MAIN GAME AREA ════ */}
      <div className="flex-1 p-4 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto w-full">

        {/* ── MAIN CONTENT ── */}
        <div className="lg:col-span-8 flex flex-col gap-4">

          {/* Zone Scene Header */}
          <div className="fantasy-panel rounded-xl px-5 py-3 flex items-center gap-3"
               style={{ borderColor: zoneTheme.border, background: zoneTheme.bg }}>
            <span className="text-2xl">{zoneTheme.emoji}</span>
            <div>
              <h2 className="font-fantasy text-sm font-bold" style={{ color: zoneTheme.color }}>{zoneTheme.name}</h2>
              <p className="text-xs" style={{ color: '#8892a4' }}>
                {currentChallenge?.title || 'Investigate the scene — click glowing evidence to collect clues'}
              </p>
            </div>
            <div className="ml-auto rune-badge text-[10px]" style={{ borderColor: zoneTheme.border, color: zoneTheme.color }}>
              {discoveredEvidence.length} clues found
            </div>
          </div>

          {/* Game content area */}
          <div className="fantasy-panel rounded-xl overflow-hidden flex-1 min-h-96 relative">
            <ParticleBurst trigger={particleTrigger} color={zoneTheme.color}/>

            {/* Investigating: Room content */}
            {gameState === 'investigating' && (
              <div className="p-4 h-full">
                {renderRoomContent()}
              </div>
            )}

            {/* Consequence */}
            {gameState === 'consequence' && submissionResult && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4 p-3 rounded-xl"
                     style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)' }}>
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#ff4757' }}>⚠ BREACH CONSEQUENCE ACTIVATED</p>
                    <p className="text-[11px]" style={{ color: '#8892a4' }}>Your decision triggered a chain reaction...</p>
                  </div>
                </div>
                <ConsequenceEngine
                  consequenceChain={submissionResult.consequenceChain || ['You fell for the trap', 'Trust score reduced']}
                  trustChange={submissionResult.scoring?.trustChange || -20}
                  onRecoveryStart={() => setGameState('result')}
                />
              </div>
            )}

            {/* Result */}
            {gameState === 'result' && submissionResult && (
              <div className="p-4">
                <ChallengeResult
                  isCorrect={submissionResult.isCorrect}
                  explanation={submissionResult.explanation}
                  scoring={submissionResult.scoring}
                  coachExplanation={submissionResult.coachExplanation}
                  onNext={handleNextChallenge}
                />
              </div>
            )}

            {/* Room Complete! */}
            {gameState === 'room_complete' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center p-8 text-center h-full gap-6">
                <ParticleBurst trigger={1} color="#ffd700"/>

                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}>
                  <LootChest open={true} xpEarned={roomScore}/>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }} className="space-y-2">
                  <div className="rune-badge rune-badge-gold mx-auto">🏆 ZONE CONQUERED</div>
                  <h1 className="font-fantasy text-3xl font-bold text-white">
                    {zoneTheme.name} Cleared!
                  </h1>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: '#8892a4' }}>
                    You successfully investigated all threats and boosted your Cyber DNA!
                  </p>
                </motion.div>

                {/* Stats */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                            className="grid grid-cols-3 gap-4 w-full max-w-xs">
                  {[['⚡', `+${roomScore}`, 'XP Earned'], ['🔍', discoveredEvidence.length, 'Clues Found'], ['🎯', challenges.length, 'Missions']].map(([icon, val, label]) => (
                    <div key={label} className="fantasy-panel rounded-xl p-3 text-center">
                      <div className="text-xl mb-1">{icon}</div>
                      <div className="font-fantasy text-lg font-bold" style={{ color: '#ffd700' }}>{val}</div>
                      <div className="text-[10px]" style={{ color: '#8892a4' }}>{label}</div>
                    </div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                            className="flex flex-wrap gap-3 justify-center">
                  <button onClick={() => navigate('/rooms')} className="world-btn world-btn-gold px-6 py-2.5">
                    🗺 Next Zone
                  </button>
                  <button onClick={() => navigate('/cyber-dna')} className="world-btn world-btn-ghost px-5 py-2.5">
                    🧬 Cyber DNA
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* NPC Wizard Coach */}
          <div className="fantasy-panel rounded-xl p-4"
               style={{ borderColor: 'rgba(155,89,182,0.25)', background: 'rgba(155,89,182,0.05)' }}>
            <WizardCoach message={currentChallenge?.learningObjective} isThinking={loading}/>
            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-[11px]" style={{ color: '#8892a4' }}>Hints: {hintsUsedCount}</span>
              <span className="rune-badge rune-badge-purple text-[10px]">Coach: Watching</span>
            </div>
          </div>

          {/* Evidence Board */}
          <div className="fantasy-panel rounded-xl p-4 flex-1"
               style={{ borderColor: `${zoneTheme.border}`, background: `${zoneTheme.bg}` }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🔍</span>
              <h3 className="font-fantasy text-xs font-bold text-white">EVIDENCE CLUES</h3>
              <span className="ml-auto rune-badge text-[10px]"
                    style={{ borderColor: zoneTheme.border, color: zoneTheme.color }}>
                {discoveredEvidence.length} found
              </span>
            </div>
            {discoveredEvidence.length === 0 ? (
              <div className="text-center py-6">
                <span className="text-3xl opacity-30">🔍</span>
                <p className="text-xs mt-2" style={{ color: '#8892a4' }}>Click glowing elements in the scene to collect evidence</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {discoveredEvidence.map((ev, i) => (
                  <motion.div key={ev.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-2 p-2 rounded-lg"
                              style={{ background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)' }}>
                    <span className="text-sm">⚠</span>
                    <p className="text-xs text-white flex-1">{ev.label}</p>
                    <span className="text-[10px] font-bold" style={{ color: '#ff4757' }}>+{ev.points}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════ REASONING MODAL ════ */}
      <AnimatePresence>
        {gameState === 'reasoning' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
               style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }} className="max-w-md w-full">
              <div className="mb-3 text-center">
                <span className="rune-badge mx-auto">⚔ MAKE YOUR VERDICT</span>
              </div>
              <ReasoningPrompt category={roomConfig.category} onConfirmReasoning={handleConfirmReasoning}/>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════ HINT MODAL ════ */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
               style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="max-w-md w-full fantasy-panel rounded-2xl p-6"
                        style={{ borderColor: 'rgba(155,89,182,0.4)' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl animate-float">🔮</span>
                <div>
                  <h3 className="font-fantasy text-sm font-bold text-white">Mentor's Crystal Vision</h3>
                  <span className="text-[10px]" style={{ color: '#8892a4' }}>Hint Level {hintLevel - 1 || 1}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl mb-4"
                   style={{ background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.25)' }}>
                <p className="text-sm text-white leading-relaxed">"{hintText}"</p>
              </div>
              <button onClick={() => setShowHintModal(false)} className="world-btn world-btn-primary w-full py-2.5 text-xs">
                ✓ Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
