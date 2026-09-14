import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import PropTypes from 'prop-types';
import { Bot, Cpu, Sparkles, Terminal, AlertTriangle, ShieldCheck, Check, Volume2 } from 'lucide-react';

const AIRoom = ({ challenge, onAnswer, onEvidenceSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const scenario = challenge?.scenario || {};
  const sender = scenario.sender || 'AI Voice Clone Call';
  const body = scenario.body || 'A generative AI assistant prompt injection payload was detected.';
  const contextText = scenario.context || 'Analyze how generative AI, voice cloning, or prompt injection is weaponized in this scenario.';

  const options = challenge?.options || [
    { text: "SAFE — Standard AI generated communication", value: "safe" },
    { text: "SUSPICIOUS — Potential AI manipulation / prompt injection payload", value: "suspicious" },
    { text: "CRITICAL RISK — Automated AI offensive agent", value: "critical_risk" }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-800">
      {/* Top Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-indigo-800 tracking-wider">CYBERLOCK // NEURAL_THREAT_LAB</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          <Cpu size={12} className="text-indigo-700" /> GENERATIVE_AI_ACTIVE
        </span>
      </div>

      <div className="flex-grow p-3 overflow-y-auto custom-scrollbar space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-1">{challenge?.title || 'AI Threat Lab'}</h2>
          <p className="text-xs font-mono font-semibold text-slate-500">{contextText}</p>
        </div>

        {/* AI Threat Visualizer */}
        <div className="max-w-xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-700 font-bold">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{sender}</p>
                <p className="text-xs font-mono font-semibold text-indigo-700">Neural Vector</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg">
              LLM / Audio Model
            </span>
          </div>

          <div
            onClick={() => onEvidenceSelect?.('ai_voice_clone', 'Neural Synthesis & Injection Anomaly')}
            className="p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-slate-800 text-sm font-mono leading-relaxed cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2 text-indigo-700 text-xs font-bold">
              <Terminal size={14} />
              <span>PAYLOAD INGESTION:</span>
            </div>
            <p className="whitespace-pre-line text-slate-800">{body}</p>
          </div>
        </div>

        {/* Decision Options */}
        <div className="max-w-xl mx-auto pt-2">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Classify Threat Vector:</p>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedOption(opt.value);
                  onAnswer(opt.value);
                }}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3.5 ${
                  selectedOption === opt.value
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold shadow-md ring-1 ring-indigo-500'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedOption === opt.value ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-400 bg-white'
                }`}>
                  {selectedOption === opt.value && <Check size={12} strokeWidth={3} />}
                </div>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

AIRoom.propTypes = {
  challenge: PropTypes.object,
  onAnswer: PropTypes.func.isRequired,
  onEvidenceSelect: PropTypes.func
};

export default AIRoom;

