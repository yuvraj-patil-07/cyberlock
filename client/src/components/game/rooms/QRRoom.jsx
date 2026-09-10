import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import PropTypes from 'prop-types';
import { QrCode, Scan, Smartphone, ExternalLink, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

const QRRoom = ({ challenge, onAnswer, onEvidenceSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const scenario = challenge?.scenario || {};
  const qrDestination = scenario.qrDestination || "https://city-parking-meter-quickpay.online/pay?meterId=4920";
  const contextText = scenario.context || "Inspect the physical QR code and evaluate its destination before proceeding.";

  const options = challenge?.options || [
    { text: "SAFE — Standard QR code", value: "safe" },
    { text: "SUSPICIOUS — Verify destination domain", value: "suspicious" },
    { text: "MALICIOUS — Dangerous redirect / APK dropper", value: "malicious" }
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
          <span className="text-xs font-mono font-bold text-indigo-800 tracking-wider">CYBERLOCK // OPTICAL_QR_SCANNER</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          <Scan size={12} className="text-indigo-700" /> CAMERA_FEED_ACTIVE
        </span>
      </div>

      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-2">{challenge?.title || 'QR Trap Challenge'}</h2>
          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed shadow-sm">
            {contextText}
          </p>
        </div>

        {/* Simulated Camera Viewfinder with QR Target */}
        <div className="max-w-md mx-auto relative p-6 bg-slate-50 rounded-2xl border border-indigo-200 shadow-inner flex flex-col items-center">
          {/* Viewfinder Corners */}
          <div className="w-48 h-48 relative border-2 border-indigo-300 rounded-2xl flex items-center justify-center p-4 bg-white overflow-hidden shadow-sm">
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            />
            <QrCode size={120} className="text-indigo-600 opacity-90" />
          </div>

          {/* Destination URL Display Box */}
          <div 
            onClick={() => onEvidenceSelect?.('domain', `QR Destination Decoded: ${qrDestination}`)}
            className="w-full mt-4 p-3.5 bg-white border border-indigo-200 hover:border-indigo-400 rounded-xl cursor-pointer transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
              <span className="font-bold">DECODED DESTINATION:</span>
              <span className="text-indigo-600 font-semibold group-hover:underline">Click to Inspect</span>
            </div>
            <div className="flex items-center gap-2 overflow-hidden">
              <ExternalLink size={14} className="text-indigo-600 shrink-0" />
              <span className="font-mono text-xs text-indigo-900 font-bold truncate">{qrDestination}</span>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="max-w-xl mx-auto pt-2">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Classify this QR Code:</p>
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

QRRoom.propTypes = {
  challenge: PropTypes.object,
  onAnswer: PropTypes.func.isRequired,
  onEvidenceSelect: PropTypes.func
};

export default QRRoom;

