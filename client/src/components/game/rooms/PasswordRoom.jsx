import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import PropTypes from 'prop-types';
import { Key, Lock, ShieldCheck, ShieldAlert, Sparkles, Check, Hash } from 'lucide-react';

const PasswordRoom = ({ challenge, onAnswer, onEvidenceSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const scenario = challenge?.scenario || {};
  const passwordList = scenario.passwordList || [
    "Password123!",
    "admin2024",
    "correct-horse-battery-staple-99",
    "qwertyuiop"
  ];
  const contextText = scenario.context || "Audit the password policy and choose the strongest cryptographic defense.";

  const options = challenge?.options || [
    { text: "Option A", value: "a" },
    { text: "Option B", value: "b" },
    { text: "Option C", value: "c" }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-800">
      {/* Top Header */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 tracking-wider">CYBERLOCK // PASSWORD_VAULT_ANALYZER</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Lock size={12} className="text-emerald-700" /> CRYPTO_ENTROPY_ACTIVE
        </span>
      </div>

      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-3 shadow-sm">
            <Key size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">{challenge?.title || 'Password Vault Challenge'}</h2>
          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed shadow-sm">
            {contextText}
          </p>
        </div>

        {/* Display Password List If Available */}
        {passwordList.length > 0 && (
          <div className="max-w-xl mx-auto space-y-2">
            <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Investigate Passwords / Patterns:</p>
            <div className="grid gap-2">
              {passwordList.map((pw, idx) => (
                <div
                  key={idx}
                  onClick={() => onEvidenceSelect?.('entropy', `Password inspection: ${pw}`)}
                  className="p-3.5 bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 rounded-xl flex items-center justify-between cursor-pointer transition-all group shadow-sm"
                >
                  <span className="font-mono text-sm font-bold text-emerald-800 group-hover:text-emerald-900">{pw}</span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg">
                    Inspect Entropy
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decision Options */}
        <div className="max-w-xl mx-auto pt-2">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Select the Best Answer:</p>
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
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-md ring-1 ring-emerald-500'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedOption === opt.value ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400 bg-white'
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

PasswordRoom.propTypes = {
  challenge: PropTypes.object,
  onAnswer: PropTypes.func.isRequired,
  onEvidenceSelect: PropTypes.func
};

export default PasswordRoom;

