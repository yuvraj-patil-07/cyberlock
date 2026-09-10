import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROOMS } from '../utils/constants';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../hooks/useAuth';
import { Lock as LockIcon, CheckCircle2, ShieldCheck, Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function RoomSelect() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, loadProgress } = useGame();

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const completedRooms = user?.completedRooms || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 pt-28">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-xs mb-3 font-bold shadow-sm">
            <Sparkles size={14} className="text-cyan-600" /> ADAPTIVE CYBER DEFENSE LABS
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            SELECT SIMULATION ROOM
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto mt-3 text-sm md:text-base font-medium">
            Choose your training environment. Master each room to build your Cyber DNA, unlock advanced AI simulations, and disengage the Final Cyber Lock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ROOMS.map((room, index) => {
            const isCompleted = completedRooms.includes(String(room.id));
            let isUnlocked = true;
            if (room.id === 5) isUnlocked = completedRooms.length >= 2;
            if (room.id === 6) isUnlocked = completedRooms.length >= 3;
            if (room.id === 7) isUnlocked = completedRooms.length >= 4;

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => isUnlocked && navigate(`/play/${room.id}`)}
                className={`relative overflow-hidden rounded-3xl border p-6 flex flex-col items-center text-center transition-all duration-300 ${
                  isUnlocked
                    ? isCompleted
                      ? 'bg-white border-emerald-300 hover:border-emerald-500 shadow-md hover:shadow-lg cursor-pointer group'
                      : 'bg-white border-slate-200 hover:border-cyan-500 hover:shadow-lg shadow-sm cursor-pointer group'
                    : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Status Badges */}
                <div className="absolute top-4 right-4">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                      <CheckCircle2 size={12} /> CLEARED
                    </span>
                  ) : !isUnlocked ? (
                    <div className="text-slate-400">
                      <LockIcon size={18} />
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-full">
                      ROOM {room.id}
                    </span>
                  )}
                </div>

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                    : isUnlocked
                      ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100 group-hover:scale-105'
                      : 'bg-slate-200 text-slate-400'
                }`}>
                  <room.icon size={32} />
                </div>

                <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                  {room.title}
                </h3>
                <p className="text-xs font-mono font-bold text-cyan-700 mb-3">{room.subtitle}</p>

                <p className="text-xs text-slate-600 mb-6 leading-relaxed line-clamp-3">
                  {room.desc}
                </p>

                <div className="mt-auto w-full">
                  {isCompleted ? (
                    <button className="w-full py-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl group-hover:bg-emerald-100 transition-colors text-xs font-bold font-mono">
                      REPLAY ROOM
                    </button>
                  ) : isUnlocked ? (
                    <button className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl shadow-md group-hover:shadow-lg transition-all text-xs font-bold font-mono">
                      START ROOM →
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-slate-200 text-slate-500 rounded-xl text-xs font-mono font-semibold">
                      {room.id === 5 && "Complete 2 Rooms to Unlock"}
                      {room.id === 6 && "Complete 3 Rooms to Unlock"}
                      {room.id === 7 && "Complete 4 Rooms to Unlock"}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost flex items-center gap-2 text-xs">
            <ArrowLeft size={14} /> DASHBOARD
          </button>
          <button onClick={() => navigate('/cyber-dna')} className="btn-primary flex items-center gap-2 text-xs">
            <Trophy size={14} /> VIEW CYBER DNA
          </button>
        </div>
      </div>
    </div>
  );
}

