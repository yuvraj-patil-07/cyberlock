import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import PropTypes from 'prop-types';
import { Mail, Paperclip, AlertTriangle, ShieldCheck, User, ExternalLink, HelpCircle, Flame, Clock } from 'lucide-react';

const PhishingRoom = ({ challenge, onAnswer, onEvidenceSelect, selectedEvidence = [] }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const scenario = challenge?.scenario || {};
  const sender = scenario.sender || 'IT Support Desk';
  const senderAddress = scenario.senderAddress || 'security@paypa1-support-verify.com';
  const subject = scenario.subject || challenge?.title || 'Account Verification Notice';
  const timestamp = scenario.timestamp || 'Today at 10:45 AM';
  const body = scenario.body || 'Please verify your credentials immediately to avoid suspension.';
  const links = scenario.links || ['https://login.paypa1-account-restore.com/auth/verify'];
  const attachments = scenario.attachments || [];
  const urgencyLevel = scenario.urgencyLevel || 'high';

  const options = challenge?.options || [
    { text: 'SAFE — Legitimate notification', value: 'safe' },
    { text: 'SUSPICIOUS — Check official website directly', value: 'suspicious' },
    { text: 'PHISHING — Malicious domain and credential harvesting', value: 'phishing' }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-800">
      {/* Email Client Top Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-cyan-800 tracking-wider">CYBERLOCK // SECURE_INBOX_SIMULATOR</span>
        </div>
        {urgencyLevel === 'critical' || urgencyLevel === 'high' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-700 border border-rose-200">
            <Flame size={13} className="text-rose-600" /> {urgencyLevel.toUpperCase()} URGENCY
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
            <Clock size={13} className="text-cyan-700" /> STANDARD NOTICE
          </span>
        )}
      </div>

      {/* Email Header Info */}
      <div className="bg-slate-50/80 border-b border-slate-200 p-5">
        <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2.5">
          <Mail className="h-5 w-5 text-cyan-600 shrink-0" />
          <span>{subject}</span>
        </h2>
        
        <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="h-10 w-10 bg-cyan-50 border border-cyan-200 rounded-full flex items-center justify-center text-cyan-700 shrink-0 font-bold">
            <User size={20} />
          </div>
          <div className="flex-grow min-w-0">
            <div 
              className="group cursor-pointer hover:bg-cyan-50 p-1 rounded-lg transition-colors inline-block max-w-full"
              onClick={() => onEvidenceSelect?.('domain', 'Sender Domain Inspection')}
              title="Click to investigate sender address"
            >
              <p className="text-sm font-bold text-slate-800 truncate">
                {sender} <span className="text-cyan-700 font-mono font-semibold group-hover:underline">&lt;{senderAddress}&gt;</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">To: security-trainee@company.invalid • {timestamp}</p>
          </div>
        </div>
      </div>

      {/* Email Body Content */}
      <div className="flex-grow p-6 text-slate-700 overflow-y-auto custom-scrollbar space-y-4">
        <div 
          className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-cyan-400 transition-all cursor-pointer leading-relaxed text-sm whitespace-pre-line shadow-sm"
          onClick={() => onEvidenceSelect?.('urgency', 'Email Body Urgency Lure')}
          title="Click to analyze message text"
        >
          {body}
        </div>

        {/* Links Preview */}
        {links.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Embedded Links (Hover / Inspect):</p>
            {links.map((link, idx) => (
              <div 
                key={idx}
                onClick={() => onEvidenceSelect?.('link_mismatch', `URL Inspection: ${link}`)}
                className="group p-3.5 bg-slate-50 hover:bg-cyan-50/80 border border-slate-200 hover:border-cyan-300 rounded-xl cursor-pointer transition-all flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <ExternalLink size={16} className="text-cyan-600 shrink-0" />
                  <span className="font-mono text-xs text-cyan-800 font-semibold group-hover:text-cyan-900 truncate">{link}</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-lg shrink-0">
                  Inspect URL
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Attached Files:</p>
            <div className="flex flex-wrap gap-2">
              {attachments.map((att, idx) => (
                <div 
                  key={idx}
                  onClick={() => onEvidenceSelect?.('attachment', `Suspicious Attachment: ${att}`)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 hover:border-rose-400 hover:bg-rose-50 rounded-xl cursor-pointer transition-all text-xs font-mono font-semibold text-slate-800"
                >
                  <Paperclip size={14} className="text-rose-600" />
                  <span>{att}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Decision Action Options */}
      <div className="bg-slate-50 border-t border-slate-200 p-5">
        <p className="text-center text-xs text-slate-500 mb-3 font-mono font-bold uppercase tracking-widest">
          Make Your Security Classification
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedOption(opt.value);
                onAnswer(opt.value);
              }}
              className={`p-3.5 rounded-xl border text-left font-semibold text-xs md:text-sm transition-all flex items-center justify-between ${
                selectedOption === opt.value
                  ? 'bg-cyan-100/90 border-cyan-500 text-cyan-900 shadow-md ring-1 ring-cyan-500'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

PhishingRoom.propTypes = {
  challenge: PropTypes.object,
  onAnswer: PropTypes.func.isRequired,
  onEvidenceSelect: PropTypes.func,
  selectedEvidence: PropTypes.array
};

export default PhishingRoom;

