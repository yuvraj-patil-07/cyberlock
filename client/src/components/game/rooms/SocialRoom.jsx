import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import PropTypes from 'prop-types';
import { Users, UserX, AlertTriangle, ShieldCheck, Check, Radio, HardDrive } from 'lucide-react';

const SocialRoom = ({ challenge, onAnswer, onEvidenceSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const scenario = challenge?.scenario || {};
  const sender = scenario.sender || 'Unknown Personnel';
  const body = scenario.body || 'A person asks you to hold open the high-security server room door.';
  const contextText = scenario.context || 'Analyze the social pressure or pretext being used to circumvent established security policy.';

  const options = challenge?.options || [
    { text: "COMPLY — Avoid confrontation", value: "comply" },
    { text: "REFUSE & VERIFY — Enforce security policy out-of-band", value: "refuse" },
    { text: "SHARE CREDENTIALS — Assist with the request", value: "share" }
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
          <span className="text-xs font-mono font-bold text-rose-800 tracking-wider">CYBERLOCK // SOCIAL_PRETEXT_INVESTIGATOR</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <Users size={12} className="text-rose-700" /> HUMAN_FACTOR_ANALYSIS
        </span>
      </div>

      <div className="flex-grow p-3 overflow-y-auto custom-scrollbar space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-1">{challenge?.title || 'Social Engineering Challenge'}</h2>
          <p className="text-xs font-mono font-semibold text-slate-500">{contextText}</p>
        </div>

        {/* Threat Situation Card */}
        <div className="max-w-xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 font-bold">
              <UserX size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{sender}</p>
              <p className="text-xs font-mono font-semibold text-rose-700">Social Vector Encounter</p>
            </div>
          </div>

          <div
            onClick={() => onEvidenceSelect?.('authority_pressure', 'Pretext & Coercion Indicators')}
            className="p-4 bg-white border border-slate-200 hover:border-rose-400 rounded-xl text-slate-800 text-sm leading-relaxed cursor-pointer transition-all shadow-sm"
          >
            {body}
          </div>
        </div>

        {/* Decision Options */}
        <div className="max-w-xl mx-auto pt-2">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Your Tactical Response:</p>
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
                    ? 'bg-rose-50 border-rose-500 text-rose-950 font-semibold shadow-md ring-1 ring-rose-500'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedOption === opt.value ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-400 bg-white'
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

SocialRoom.propTypes = {
  challenge: PropTypes.object,
  onAnswer: PropTypes.func.isRequired,
  onEvidenceSelect: PropTypes.func
};

export default SocialRoom;

