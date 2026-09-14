import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckSquare, Square, Brain, HelpCircle, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const CATEGORY_REASONS = {
  phishing: [
    { id: 'domain_mismatch', text: 'Suspicious or typo-squatted sender domain' },
    { id: 'urgency_pressure', text: 'Artificial urgency or deadline coercion' },
    { id: 'credential_harvesting', text: 'Unverified credential/login or payment request' },
    { id: 'dangerous_attachment', text: 'Suspicious attachment or double file extension' },
    { id: 'verified_official', text: 'Legitimate sender domain matching official organization' }
  ],
  password: [
    { id: 'entropy_length', text: 'High cryptographic entropy from 4+ random words / length' },
    { id: 'predictable_pattern', text: 'Predictable seasonal or dictionary substitution pattern' },
    { id: 'reuse_blast_radius', text: 'Password reuse across multiple services creates single point of failure' },
    { id: 'passkey_asymmetric', text: 'Passkeys use public-key cryptography immune to server database breaches' },
    { id: 'mfa_resistance', text: 'FIDO2 / WebAuthn provides origin-bound phishing resistance' }
  ],
  qr: [
    { id: 'physical_overlay', text: 'Physical sticker pasted over official machine or poster' },
    { id: 'unverified_destination', text: 'Decoded QR destination points to untrusted third-party domain' },
    { id: 'apk_trojan_prompt', text: 'Prompts to download executable APK file or mobile config profile' },
    { id: 'qrljacking_pairing', text: 'Attempts to hijack active messaging app session via in-app pairing' }
  ],
  scam: [
    { id: 'unsolicited_high_pay', text: 'Unrealistic compensation for trivial tasks (Task Scam)' },
    { id: 'toll_free_boiler_room', text: 'Directs victim to call fraudulent boiler room call center' },
    { id: 'secrecy_isolation', text: 'Demands secrecy or prevents contacting family/authorities' },
    { id: 'untraceable_payment', text: 'Demands payment via gift cards, wire transfer, or cryptocurrency' }
  ],
  'social-engineering': [
    { id: 'tailgating_pretext', text: 'Exploiting social politeness to bypass physical access controls' },
    { id: 'executive_pressure', text: 'Executive authority coercion bypassing security governance' },
    { id: 'vishing_caller_spoof', text: 'Caller ID forgery during incoming phone call' },
    { id: 'usb_baiting_curiosity', text: 'Physical USB drop baiting human curiosity' }
  ],
  'ai-threat': [
    { id: 'deepfake_synthesis', text: 'AI synthetic voice cloning bypassing verbal verification' },
    { id: 'prompt_injection_payload', text: 'Adversarial instructions embedded in untrusted document text' },
    { id: 'ai_slopsquatting', text: 'Hallucinated package name registered with malicious code' }
  ],
  final: [
    { id: 'multi_vector_chain', text: 'Coordinated multi-stage voice deepfake, quishing, and AitM proxy attack' },
    { id: 'token_theft', text: 'Immediate risk of enterprise SSO and cloud session hijacking' }
  ]
};

const ReasoningPrompt = ({ 
  category = 'phishing', 
  onConfirmReasoning, 
  onSubmitReasoning, 
  availableReasons 
}) => {
  const [selected, setSelected] = useState([]);

  // Use provided reasons or default to category-specific reasons
  const reasons = availableReasons && availableReasons.length > 0
    ? availableReasons
    : CATEGORY_REASONS[category] || CATEGORY_REASONS.phishing;

  const toggleReason = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const callback = onConfirmReasoning || onSubmitReasoning;
    if (callback) {
      callback(selected.length > 0 ? selected : ['general_investigation']);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-indigo-200 rounded-3xl p-3 md:p-4 shadow-2xl space-y-6 text-slate-800">
      <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
          <Brain size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Why did you make this decision?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Select the digital indicators or threat vectors that guided your classification.
          </p>
        </div>
      </div>

      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {reasons.map((reason) => {
          const reasonId = reason.id || reason.text;
          const isSelected = selected.includes(reasonId);
          return (
            <button
              key={reasonId}
              type="button"
              onClick={() => toggleReason(reasonId)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                isSelected 
                  ? 'bg-indigo-50/90 border-indigo-500 text-indigo-950 font-medium shadow-sm ring-1 ring-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {isSelected ? (
                <CheckSquare className="h-5 w-5 text-indigo-600 shrink-0" />
              ) : (
                <Square className="h-5 w-5 text-slate-400 shrink-0" />
              )}
              <span className="text-xs md:text-sm leading-snug">{reason.text}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 flex gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={selected.length === 0}
          onClick={handleSubmit}
          className="py-3.5 text-sm font-bold shadow-md"
        >
          CONFIRM DECISION REASONING <ArrowRight size={16} className="inline ml-1" />
        </Button>
      </div>
    </div>
  );
};

ReasoningPrompt.propTypes = {
  category: PropTypes.string,
  onConfirmReasoning: PropTypes.func,
  onSubmitReasoning: PropTypes.func,
  availableReasons: PropTypes.array,
};

export default ReasoningPrompt;
