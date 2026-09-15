import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { gameService } from '../services/gameService';
import { aiService } from '../services/aiService';
import { ROOMS } from '../utils/constants';
import { sounds } from '../utils/soundEffects';
import useGameStore from '../store/gameStore';

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
  1: { name:'Phishing Tower',     emoji:'🎣', color:'#ff4757', bg:'rgba(255,71,87,0.08)',   border:'rgba(255,71,87,0.25)',   icon:'🏰' },
  2: { name:'Password Fortress',  emoji:'🔒', color:'#ffd700', bg:'rgba(255,215,0,0.08)',   border:'rgba(255,215,0,0.25)',   icon:'🏯' },
  3: { name:'QR Temple',          emoji:'📱', color:'#9b59b6', bg:'rgba(155,89,182,0.08)', border:'rgba(155,89,182,0.25)', icon:'⛩' },
  4: { name:'Scam Village',       emoji:'💰', color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)', icon:'🏘' },
  5: { name:'Firewall Defense',   emoji:'🛡️', color:'#ff6b9d', bg:'rgba(255,107,157,0.08)', border:'rgba(255,107,157,0.25)', icon:'🌐' },
  6: { name:'Deepfake Detective', emoji:'🧠', color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.25)',  icon:'⚗' },
  7: { name:'Final Cyber Castle', emoji:'🏰', color:'#00ff88', bg:'rgba(0,255,136,0.08)',  border:'rgba(0,255,136,0.25)',  icon:'⚔' },
};

/* Self-contained rooms manage their own game loop internally */
const SELF_CONTAINED_ROOMS = [5, 6];

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
  const [localLives,        setLocalLives]        = useState(3);
  const [roomFeedback,      setRoomFeedback]      = useState(null);
  const [roomCorrect,       setRoomCorrect]       = useState(0); // for star calc
  const [roomTotal,         setRoomTotal]         = useState(0); // for star calc
  const { loseHeart }       = useGameStore();

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
      setLocalLives(3); setRoomFeedback(null); setRoomCorrect(0); setRoomTotal(0);
    } catch (err) { console.error('Error loading challenges:', err); }
    finally { setLoading(false); }
  }, [roomId, roomConfig]);

  useEffect(() => { loadChallenges(); }, [loadChallenges]);

  const currentChallenge = challenges[currentIndex] || null;

  const handleAnswer = answerValue => { setPendingAnswer(answerValue); setGameState('reasoning'); };

  const handleRoomFeedback = (feedback) => {
    setRoomFeedback(feedback);
  };

  const handleWrongAnswer = async () => {
    if (localLives <= 1) {
      setLocalLives(0);
      loseHeart(); // local UI sync
      try {
        await gameService.submitCustomScore({ heartsLost: 1 });
        await loadUser(2, true); // refresh dashboard
      } catch (err) {
        console.error('Failed to deduct heart on backend', err);
      }
      setTimeout(() => navigate('/map'), 5000);
    } else {
      setLocalLives(prev => prev - 1);
      setTimeout(() => handleNextChallenge({ xp: 0, coins: 0 }), 5000);
    }
  };

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
      setRoomTotal(prev => prev + 1);
      if (res.data.isCorrect) setRoomCorrect(prev => prev + 1);
      await loadUser(2, true);
        if (res.data.isCorrect) {
          sounds.playCorrect();
          setParticleTrigger(t => t + 1);
          setTimeout(() => setChestOpen(true), 400);
        } else {
          sounds.playIncorrect();
          setLocalLives(prev => Math.max(0, prev - 1));
        }
      setGameState((!res.data.isCorrect && res.data.consequenceChain?.length > 0) ? 'consequence' : 'result');
    } catch (err) {
      const isCorrect = pendingAnswer === currentChallenge.correctAnswer;
        if (isCorrect) { sounds.playCorrect(); setParticleTrigger(t => t + 1); setTimeout(() => setChestOpen(true), 400); }
        else {
          sounds.playIncorrect();
          setLocalLives(prev => Math.max(0, prev - 1));
        }
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

    const handleNextChallenge = async (customScore) => {
      setChestOpen(false);

      if ((customScore && customScore.failed) || localLives <= 0) {
        loseHeart();
        try {
          await gameService.submitCustomScore({ heartsLost: 1 });
          await loadUser(2, true);
        } catch (err) {
          console.error('Failed to deduct heart on backend', err);
        }
        setGameState('game_over'); // ← proper in-page screen, not navigate('/map')
        return;
      }

      /* ── Self-contained rooms (Firewall Defense, Deepfake Detective) ── */
      const roomNum = parseInt(roomId, 10);
      if (SELF_CONTAINED_ROOMS.includes(roomNum) && customScore && !customScore.failed) {
        try {
          const xp    = customScore.xp    || 0;
          const coins = customScore.coins || 0;
          // Stars based on XP earned: 3=150+, 2=90+, 1=any pass
          const stars = xp >= 150 ? 3 : xp >= 90 ? 2 : 1;
          await gameService.submitCustomScore({ xpEarned: xp, coinsEarned: coins });
          await gameService.completeRoom(roomId, stars);
          await loadProgress();
          await loadUser(2, true);
        } catch (err) { console.error('Self-contained room finish error', err); }
        sounds.playRoomUnlock();
        setRoomScore(customScore.xp || 0);
        setGameState('room_complete');
        return;
      }
      
      // Save custom mini-game scores to backend
      if (customScore && !customScore.failed) {
      try {
        const xp = typeof customScore === 'number' ? customScore : (customScore.xp || 0);
        const coins = typeof customScore === 'object' ? (customScore.coins || 0) : Math.floor(xp / 5);
        await gameService.submitCustomScore({ xpEarned: xp, coinsEarned: coins });
        await loadUser(2, true); // Refresh HUD
      } catch (err) {
        console.error('Failed to save custom score', err);
      }
    }

    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(prev => prev + 1); setGameState('investigating'); setPendingAnswer(null);
      setSelectedReasoning([]); setDiscoveredEvidence([]); setHintsUsedCount(0);
      setHintText(null); setHintLevel(1); setShowHintModal(false); setStartTime(Date.now());
      setRoomFeedback(null);
    } else {
      sounds.playRoomUnlock();
      // Calculate stars: 3 = 90%+, 2 = 60%+, 1 = any completion
      const pct = roomTotal > 0 ? (roomCorrect / roomTotal) * 100 : 50;
      const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
      try { await gameService.completeRoom(roomId, stars); await loadProgress(); await loadUser(2, true); } catch {}
      setGameState('room_complete');
    }
  };

  const renderRoomContent = () => {
    const roomNum = parseInt(roomId, 10);
    const props = { 
      challenge: currentChallenge, 
      onAnswer: handleAnswer, 
      onComplete: handleNextChallenge, 
      onEvidenceSelect: handleEvidenceSelect, 
      selectedEvidence: discoveredEvidence,
      onFeedback: handleRoomFeedback, 
      onWrongAnswer: handleWrongAnswer 
    };
    switch (roomNum) {
      case 1: return currentChallenge ? <PhishingRoom {...props} /> : null;
      case 2: return currentChallenge ? <PasswordRoom {...props} /> : null;
      case 3: return currentChallenge ? <QRRoom {...props} /> : null;
      case 4: return currentChallenge ? <ScamRoom {...props} /> : null;
      case 5: return <SocialRoom {...props} />;  // self-contained, no challenge needed
      case 6: return <AIRoom {...props} />;       // self-contained, no challenge needed
      case 7: return currentChallenge ? <FinalRoom {...props} /> : null;
      default: return currentChallenge ? <PhishingRoom {...props} /> : null;
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
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>

      {/* ════ MAIN GAME AREA ════ */}
      <div className="flex-1 p-2 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 max-w-7xl mx-auto w-full min-h-0">

        {/* ── MAIN CONTENT ── */}
        <div className="lg:col-span-8 flex flex-col gap-4">

          {/* Zone Scene Header */}
          <div className="pixel-panel-stone px-5 py-3 flex items-center gap-3"
               style={{ borderColor: zoneTheme.border, background: zoneTheme.bg }}>
            <span className="text-2xl">{zoneTheme.emoji}</span>
            <div>
              <h2 className="font-fantasy text-sm font-bold" style={{ color: zoneTheme.color }}>{zoneTheme.name}</h2>
              <p className="text-xs" style={{ color: '#8892a4' }}>
                {currentChallenge?.title || 'Investigate the scene — click glowing evidence to collect clues'}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="rune-badge text-[10px]" style={{ borderColor: 'red', color: 'red' }}>
                {localLives} ♥ LIVES
              </span>
              <span className="rune-badge text-[10px]" style={{ borderColor: zoneTheme.border, color: zoneTheme.color }}>
                {discoveredEvidence.length} clues found
              </span>
            </div>
          </div>

          {/* Game content area */}
          <div className="pixel-panel-wood flex-1 relative p-0 overflow-hidden flex flex-col min-h-0">
            <ParticleBurst trigger={particleTrigger} color={zoneTheme.color}/>

            {/* Investigating: Room content */}
            {gameState === 'investigating' && (
              <div className="p-2 h-full flex flex-col overflow-hidden">
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

            {/* Game Over */}
            {gameState === 'game_over' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center p-4 text-center h-full gap-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}>
                  <span className="text-7xl">💀</span>
                </motion.div>
                <div className="space-y-2">
                  <div className="rune-badge" style={{ borderColor: '#ff4757', color: '#ff4757' }}>❌ MISSION FAILED</div>
                  <h1 className="font-fantasy text-2xl font-bold text-white">{zoneTheme.name}</h1>
                  <p className="text-sm max-w-xs mx-auto" style={{ color: '#8892a4' }}>
                    You ran out of lives. Don't give up — try again to earn your stars!
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="fantasy-panel rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">⚡</div>
                    <div className="font-fantasy text-lg font-bold" style={{ color: '#ffd700' }}>+{roomScore}</div>
                    <div className="text-[10px]" style={{ color: '#8892a4' }}>XP Earned</div>
                  </div>
                  <div className="fantasy-panel rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">❤️</div>
                    <div className="font-fantasy text-lg font-bold" style={{ color: '#ff4757' }}>0</div>
                    <div className="text-[10px]" style={{ color: '#8892a4' }}>Lives Left</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={() => { loadChallenges(); }} className="pixel-btn pixel-btn-primary px-6">
                    🔄 TRY AGAIN
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="pixel-btn pixel-btn-secondary px-6">
                    🏠 DASHBOARD
                  </button>
                </div>
              </motion.div>
            )}

            {/* Room Complete! */}
            {gameState === 'room_complete' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center p-4 text-center h-full gap-3">
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
                            className="flex flex-wrap gap-4 justify-center">
                  <button onClick={() => navigate('/rooms')} className="pixel-btn pixel-btn-primary px-8">
                    🗺 NEXT ZONE
                  </button>
                  <button onClick={() => navigate('/cyber-dna')} className="pixel-btn pixel-btn-secondary px-8">
                    🧬 CYBER DNA
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* NPC Wizard Coach */}
          <div className="pixel-panel-stone p-4"
               style={{ borderColor: 'rgba(155,89,182,0.25)', background: 'rgba(155,89,182,0.05)' }}>
            <WizardCoach message={currentChallenge?.learningObjective} isThinking={loading}/>
            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
              <button onClick={handleRequestHint} className="pixel-btn text-[10px] px-2 py-1 text-purple-300" style={{ background: 'rgba(155,89,182,0.2)' }}>
                🔮 REQUEST HINT
              </button>
              <span className="text-[11px]" style={{ color: '#8892a4' }}>Hints: {hintsUsedCount}</span>
              <span className="rune-badge rune-badge-purple text-[10px]">Coach: Watching</span>
            </div>
          </div>

          {/* Reasoning Box / Evidence Board */}
          {roomFeedback ? (
            <div className="pixel-panel-parchment p-4 flex-1"
                 style={{ borderColor: `${zoneTheme.border}`, background: `${zoneTheme.bg}` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{roomFeedback.isCorrect ? '✅' : '❌'}</span>
                <h3 className="font-fantasy text-xs font-bold text-white">REASONING</h3>
              </div>
              <div className="text-xs leading-relaxed text-white whitespace-pre-wrap">
                {roomFeedback.text}
              </div>
            </div>
          ) : (
            <div className="pixel-panel-parchment p-4 flex-1"
                 style={{ borderColor: `${zoneTheme.border}`, background: `${zoneTheme.bg}` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🕵️‍♂️</span>
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
                      <span className="text-sm">🎯</span>
                      <p className="text-xs text-white flex-1">{ev.label}</p>
                      <span className="text-[10px] font-bold" style={{ color: '#ff4757' }}>+{ev.points}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ════ REASONING MODAL ════ */}
      <AnimatePresence>
        {gameState === 'reasoning' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
               style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }} className="max-w-md w-full">
              <div className="mb-4 text-center">
                <span className="pixel-tag bg-blue-600 text-white shadow-[4px_4px_0_rgba(0,0,0,0.5)]">⚔ MAKE YOUR VERDICT</span>
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
                        className="max-w-md w-full pixel-panel-stone p-3"
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
              <button onClick={() => setShowHintModal(false)} className="pixel-btn pixel-btn-primary w-full py-4 text-xs mt-4">
                ✓ UNDERSTOOD
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
