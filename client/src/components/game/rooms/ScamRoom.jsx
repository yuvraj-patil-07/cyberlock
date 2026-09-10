import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import PropTypes from 'prop-types';
import { MessageSquare, Phone, User, Check, AlertCircle, ShieldAlert, Clock } from 'lucide-react';

const ScamRoom = ({ challenge, onAnswer, onEvidenceSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const scenario = challenge?.scenario || {};
  const sender = scenario.sender || 'Fraud Alert';
  const senderAddress = scenario.senderAddress || '+1 (844) 555-0182';
  const timestamp = scenario.timestamp || 'Today at 02:41 PM';
  const body = scenario.body || 'Did you authorize a $948.50 charge? Call our hotline immediately.';
  const urgencyLevel = scenario.urgencyLevel || 'high';

  const options = challenge?.options || [
    { text: "SAFE — Respond or call to resolve", value: "safe" },
    { text: "SUSPICIOUS — Verify independently via official numbers", value: "suspicious" },
    { text: "SCAM — Smishing / social engineering lure", value: "scam" }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-800">
      {/* Top Phone Status Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-amber-800 tracking-wider">CYBERLOCK // SMS_MESSAGING_SIMULATOR</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <Phone size={12} className="text-amber-700" /> SECURE_CHAT_FEED
        </span>
      </div>

      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-1">{challenge?.title || 'Scam Inbox Challenge'}</h2>
          <p className="text-xs font-mono font-semibold text-slate-500">Investigate the conversation and determine whether to engage or report.</p>
        </div>

        {/* Simulated Phone Screen */}
        <div className="max-w-md mx-auto bg-slate-100 rounded-3xl border border-slate-300 p-4 shadow-md">
          {/* Phone Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 bg-white p-3 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold">
              <User size={20} />
            </div>
            <div 
              className="flex-grow cursor-pointer group"
              onClick={() => onEvidenceSelect?.('smishing_number', `Sender verification: ${senderAddress}`)}
              title="Click to inspect phone number"
            >
              <p className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">{sender}</p>
              <p className="text-xs font-mono font-semibold text-amber-700">{senderAddress}</p>
            </div>
          </div>

          {/* Chat Bubble */}
          <div className="py-6 space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                {timestamp}
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onEvidenceSelect?.('panic_prompt', 'Message Text Urgency Lure')}
              className="bg-white border border-slate-200 hover:border-amber-400 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-800 leading-relaxed cursor-pointer transition-all shadow-sm"
            >
              <p className="whitespace-pre-line">{body}</p>
              <div className="mt-2 text-right">
                <span className="text-[10px] font-mono font-semibold text-slate-400">Delivered</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decision Options */}
        <div className="max-w-xl mx-auto pt-2">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Classify this Message:</p>
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
                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-semibold shadow-md ring-1 ring-amber-500'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedOption === opt.value ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-400 bg-white'
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

ScamRoom.propTypes = {
  challenge: PropTypes.object,
  onAnswer: PropTypes.func.isRequired,
  onEvidenceSelect: PropTypes.func
};

export default ScamRoom;

