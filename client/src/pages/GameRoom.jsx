import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { gameService } from '../services/gameService';
import { aiService } from '../services/aiService';
import { ROOMS } from '../utils/constants';
import { sounds } from '../utils/soundEffects';

// Room components
import PhishingRoom from '../components/game/rooms/PhishingRoom';
import PasswordRoom from '../components/game/rooms/PasswordRoom';
import QRRoom from '../components/game/rooms/QRRoom';
import ScamRoom from '../components/game/rooms/ScamRoom';
import SocialRoom from '../components/game/rooms/SocialRoom';
import AIRoom from '../components/game/rooms/AIRoom';
import FinalRoom from '../components/game/rooms/FinalRoom';

// Game UI components
import EvidenceBoard from '../components/game/EvidenceBoard';
import ConsequenceEngine from '../components/game/ConsequenceEngine';
import ReasoningPrompt from '../components/game/ReasoningPrompt';
import HintSystem from '../components/game/HintSystem';
import ChallengeResult from '../components/game/ChallengeResult';

import { 
  Heart, Shield, Zap, HelpCircle, ArrowLeft, Award, RefreshCw, 
  CheckCircle, AlertTriangle, Sparkles, MessageSquare, Flame, Volume2, VolumeX 
} from 'lucide-react';
import Button from '../components/common/Button';

export default function GameRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, loadUser } = useAuth();
  const { loadProgress } = useGame();

  const [challenges, setChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState('investigating'); // investigating | reasoning | consequence | result | room_complete
  const [pendingAnswer, setPendingAnswer] = useState(null);
  const [selectedReasoning, setSelectedReasoning] = useState([]);
  const [discoveredEvidence, setDiscoveredEvidence] = useState([]);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [hintText, setHintText] = useState(null);
  const [hintLevel, setHintLevel] = useState(1);
  const [showHintModal, setShowHintModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [roomScore, setRoomScore] = useState(0);

  const roomConfig = ROOMS.find(r => r.id === parseInt(roomId, 10)) || ROOMS[0];

  // Fetch challenges for this room
  const loadChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const res = await gameService.getChallenges(roomId);
      let loaded = res.data.challenges || [];
      if (loaded.length === 0) {
        loaded = [
          {
            _id: 'default-challenge',
            room: parseInt(roomId, 10),
            title: `${roomConfig.title} Simulation`,
            category: roomConfig.category,
            difficulty: 'intermediate',
            scenario: {
              sender: 'Security Test Agent',
              senderAddress: 'agent@cyberlock.invalid',
              body: 'Classify the threat pattern present in this mission.',
              context: 'Investigate the clues and make the correct classification.'
            },
            options: [
              { text: 'SAFE — Legitimate notification', value: 'safe' },
              { text: 'SUSPICIOUS — Potential deceptive lure', value: 'suspicious' },
              { text: 'THREAT — Confirmed malicious vector', value: 'phishing' }
            ],
            correctAnswer: 'suspicious',
            indicators: [
              { type: 'domain', description: 'Deceptive domain suffix (.invalid)', points: 15 }
            ],
            explanation: 'Always verify communication origins out-of-band.',
            hints: ['Inspect the sender domain.', 'Check for urgency.'],
            consequenceChain: ['Unverified click', 'Potential token exposure'],
            recoverySteps: ['Reset credentials', 'Enable 2FA']
          }
        ];
      }
      setChallenges(loaded);
      setCurrentIndex(0);
      setGameState('investigating');
      setDiscoveredEvidence([]);
      setHintsUsedCount(0);
      setHintText(null);
      setStartTime(Date.now());
    } catch (err) {
      console.error('Error loading challenges:', err);
    } finally {
      setLoading(false);
    }
  }, [roomId, roomConfig]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const currentChallenge = challenges[currentIndex] || null;

  // Handle user classification answer
  const handleAnswer = (answerValue) => {
    setPendingAnswer(answerValue);
    setGameState('reasoning');
  };

  // Handle evidence discovery clicks from room
  const handleEvidenceSelect = (type, label) => {
    if (!discoveredEvidence.some(e => e.id === type || e.label === label)) {
      sounds.playEvidenceFound();
      const newEv = {
        id: type,
        type: 'danger',
        label: label || `Discovered Indicator: ${type}`,
        analysis: `Evidence logged. Increases threat confidence score.`,
        points: 10,
        found: true
      };
      setDiscoveredEvidence(prev => [...prev, newEv]);
    }
  };

  // Request Hint from AI Coach
  const handleRequestHint = async () => {
    if (!currentChallenge) return;
    try {
      const res = await aiService.getHint(currentChallenge._id, hintLevel, discoveredEvidence);
      setHintText(res.data.hint);
      setHintsUsedCount(prev => prev + 1);
      setHintLevel(prev => Math.min(3, prev + 1));
      setShowHintModal(true);
      sounds.playEvidenceFound();
    } catch (err) {
      setHintText('Look closely at the sender domain and whether any artificial urgency is being created.');
      setShowHintModal(true);
    }
  };

  // Submit final decision with reasoning
  const handleConfirmReasoning = async (reasons) => {
    setSelectedReasoning(reasons);
    const responseTimeSec = Math.round((Date.now() - startTime) / 1000);

    try {
      setLoading(true);
      const res = await gameService.submitAttempt(currentChallenge._id, {
        answer: pendingAnswer,
        reasoning: reasons,
        evidenceFound: discoveredEvidence,
        hintsUsed: hintsUsedCount,
        responseTime: responseTimeSec
      });

      setSubmissionResult(res.data);
      setRoomScore(prev => prev + (res.data.scoring?.xpEarned || 0));
      await loadUser();

      if (res.data.isCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playIncorrect();
      }

      if (!res.data.isCorrect && res.data.consequenceChain && res.data.consequenceChain.length > 0) {
        setGameState('consequence');
      } else {
        setGameState('result');
      }
    } catch (err) {
      console.error('Failed to submit attempt:', err);
      const isCorrect = pendingAnswer === currentChallenge.correctAnswer;
      if (isCorrect) sounds.playCorrect();
      else sounds.playIncorrect();

      setSubmissionResult({
        isCorrect,
        explanation: currentChallenge.explanation,
        scoring: { xpEarned: isCorrect ? 60 : 10, trustChange: isCorrect ? 15 : -20 },
        consequenceChain: currentChallenge.consequenceChain || [],
        recoverySteps: currentChallenge.recoverySteps || [],
        coachExplanation: {
          analysis: currentChallenge.explanation,
          strength: isCorrect ? 'Solid threat identification.' : 'Good attempt.',
          vulnerability: isCorrect ? 'None' : 'Watch for subtle domain tricks.',
          actionableTip: 'Always verify out-of-band.'
        }
      });
      setGameState(!isCorrect ? 'consequence' : 'result');
    } finally {
      setLoading(false);
    }
  };

  // Advance to next challenge or complete room
  const handleNextChallenge = async () => {
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(prev => prev + 1);
      setGameState('investigating');
      setPendingAnswer(null);
      setSelectedReasoning([]);
      setDiscoveredEvidence([]);
      setHintsUsedCount(0);
      setHintText(null);
      setHintLevel(1);
      setShowHintModal(false);
      setStartTime(Date.now());
    } else {
      sounds.playRoomUnlock();
      try {
        await gameService.completeRoom(roomId);
        await loadProgress();
      } catch (err) {
        console.error('Failed to record room completion:', err);
      }
      setGameState('room_complete');
    }
  };

  // Render appropriate interactive room component
  const renderRoomContent = () => {
    if (!currentChallenge) return null;

    const props = {
      challenge: currentChallenge,
      onAnswer: handleAnswer,
      onEvidenceSelect: handleEvidenceSelect,
      selectedEvidence: discoveredEvidence
    };

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

  if (loading && challenges.length === 0) {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center text-cyan-700">
        <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest uppercase font-bold text-slate-700">INITIALIZING ESCAPE ROOM ENVIRONMENT...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top HUD Bar */}
      <div className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/rooms')}
            className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-cyan-700 transition-colors px-3 py-1.5 rounded-xl border border-slate-300 hover:border-cyan-400 bg-white shadow-sm"
          >
            <ArrowLeft size={14} /> ESCAPE ROOMS
          </button>
          <div className="h-5 w-px bg-slate-300" />
          <div className="flex items-center gap-2 font-bold text-sm tracking-wider text-slate-900">
            <roomConfig.icon size={18} className="text-cyan-600" />
            <span>{roomConfig.title}</span>
          </div>
        </div>

        {/* Live Metrics HUD */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-slate-500 font-bold">CHALLENGE:</span>
            <span className="text-cyan-800 font-bold bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-200">
              {currentIndex + 1} / {challenges.length || 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Heart size={16} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-rose-600 font-bold">{user?.lives ?? 5}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield size={16} className="text-cyan-600" />
            <span className="text-cyan-800 font-bold">{user?.trustScore ?? 100}% TRUST</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap size={16} className="text-amber-500 fill-amber-500" />
            <span className="text-amber-700 font-bold">+{roomScore} XP</span>
          </div>

          <button
            onClick={handleRequestHint}
            className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 hover:border-purple-300 rounded-xl transition-all font-semibold shadow-sm"
          >
            <Sparkles size={14} className="text-purple-600" />
            <span className="hidden md:inline">AI HINT</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left / Center: Interactive Room Simulator */}
        <div className="lg:col-span-8 flex flex-col min-h-[550px]">
          {gameState === 'investigating' && renderRoomContent()}

          {gameState === 'consequence' && submissionResult && (
            <ConsequenceEngine
              consequenceChain={submissionResult.consequenceChain || [
                "You fell for the deceptive indicator",
                "Fictional credentials entered",
                "Trust score reduced"
              ]}
              trustChange={submissionResult.scoring?.trustChange || -20}
              onRecoveryStart={() => setGameState('result')}
            />
          )}

          {gameState === 'result' && submissionResult && (
            <ChallengeResult
              isCorrect={submissionResult.isCorrect}
              explanation={submissionResult.explanation}
              scoring={submissionResult.scoring}
              coachExplanation={submissionResult.coachExplanation}
              onNext={handleNextChallenge}
            />
          )}

          {gameState === 'room_complete' && (
            <div className="bg-white border-2 border-emerald-300 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center justify-center flex-1 space-y-6 text-slate-800">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-lg animate-bounce">
                <Award size={40} />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  MISSION ACCOMPLISHED
                </span>
                <h1 className="text-3xl font-black text-slate-900 mt-3">ROOM {roomId} COMPLETED!</h1>
                <p className="text-sm text-slate-600 max-w-md mt-2 leading-relaxed">
                  You successfully investigated all threats in {roomConfig.title} and boosted your Cyber DNA!
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="primary" onClick={() => navigate('/rooms')}>
                  NEXT ESCAPE ROOM
                </Button>
                <Button variant="ghost" onClick={() => navigate('/cyber-dna')}>
                  VIEW CYBER DNA
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Evidence Board & Coach Live Feed */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="h-80">
            <EvidenceBoard
              indicators={discoveredEvidence}
              onEvidenceCollected={(id) => {}}
              maxScore={50}
            />
          </div>

          {/* AI Coach Live Feed Card */}
          <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
              <Sparkles size={16} className="text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Coach Briefing</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentChallenge?.learningObjective || "Click hotspots in the scenario to gather digital evidence before selecting your classification."}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Hints Used: {hintsUsedCount}</span>
              <span className="text-purple-700 font-semibold">Coach: Observing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning Modal */}
      <AnimatePresence>
        {gameState === 'reasoning' && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full"
            >
              <ReasoningPrompt
                category={roomConfig.category}
                onConfirmReasoning={handleConfirmReasoning}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-white border border-purple-200 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-800"
            >
              <div className="flex items-center gap-2 text-purple-700 font-bold">
                <Sparkles size={20} />
                <span>AI Security Coach Hint (Level {hintLevel - 1 || 1})</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-purple-50/60 p-4 rounded-2xl border border-purple-100 font-medium">
                "{hintText}"
              </p>
              <div className="flex justify-end">
                <Button variant="primary" onClick={() => setShowHintModal(false)}>
                  Understood
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
