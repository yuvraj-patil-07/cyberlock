import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import PropTypes from 'prop-types';
import { KeyRound, ShieldAlert, Sparkles, Check, Flame, Award, AlertCircle, FileText } from 'lucide-react';

const FinalRoom = ({ challenge, onAnswer, onEvidenceSelect }) => {
  const [answers, setAnswers] = useState({
    attackType: '',
    objective: '',
    entryPoint: '',
    dataAtRisk: '',
    correctResponse: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const scenario = challenge?.scenario || {
    sender: "Apex Corporate Payroll Audit",
    senderAddress: "audit-desk@apex-holdings-portal-auth.net",
    subject: "INCIDENT CASE FILE #9912: Multi-Vector Breach Investigation",
    body: "Victim Employee received a voice call mimicking their CFO, followed by an email containing a QR code for 'Emergency 2FA binding' on domain 'apex-holdings-portal-auth.net'. Scanning the QR prompted for corporate SSO credentials and 2FA tokens.",
    qrDestination: "https://auth-relay.apex-holdings-portal-auth.net/mfa/bind",
    context: "A coordinated multi-stage social engineering, deepfake, quishing, and credential theft operation."
  };

  const questions = [
    {
      id: 'attackType',
      label: '1. Primary Attack Vector Combo',
      options: [
        { text: 'Standard Spam Email', value: 'spam' },
        { text: 'Multi-Vector: AI Voice Clone + Quishing + Adversary-in-the-Middle (AitM) Proxy', value: 'multi_vector' },
        { text: 'DDoS Network Flood', value: 'ddos' }
      ]
    },
    {
      id: 'objective',
      label: '2. Attacker Objective',
      options: [
        { text: 'Enterprise SSO & Session Token Hijacking for Cloud Infrastructure Takeover', value: 'sso_takeover' },
        { text: 'Defacing public company homepage', value: 'defacement' },
        { text: 'Mining Bitcoin on workstation CPU', value: 'mining' }
      ]
    },
    {
      id: 'entryPoint',
      label: '3. Technical Entry Point',
      options: [
        { text: 'Unpatched USB Keyboard Driver', value: 'usb' },
        { text: 'Phishing QR code bypassing email gateway URL inspection', value: 'qr_gateway' },
        { text: 'Cracked WPA2 Wi-Fi Password', value: 'wifi' }
      ]
    },
    {
      id: 'dataAtRisk',
      label: '4. Information Immediately At Risk',
      options: [
        { text: 'Corporate Active Directory SSO credentials & live Azure session tokens', value: 'ad_tokens' },
        { text: 'Computer wallpaper images', value: 'wallpaper' },
        { text: 'Printer ink levels', value: 'printer' }
      ]
    },
    {
      id: 'correctResponse',
      label: '5. Decisive Incident Response',
      options: [
        { text: 'Ignore and restart the computer tomorrow morning', value: 'ignore' },
        { text: 'Revoke all global session tokens immediately, report to SOC, and enforce FIDO2 WebAuthn keys', value: 'revoke_fido2' },
        { text: 'Email the attacker asking them to delete the stolen credentials', value: 'email_attacker' }
      ]
    }
  ];

  const handleSelect = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const isAllAnswered = Object.values(answers).every(Boolean);

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = (
      answers.attackType === 'multi_vector' &&
      answers.objective === 'sso_takeover' &&
      answers.entryPoint === 'qr_gateway' &&
      answers.dataAtRisk === 'ad_tokens' &&
      answers.correctResponse === 'revoke_fido2'
    );
    onAnswer(isCorrect ? 'phishing' : 'safe');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-rose-200 shadow-xl overflow-hidden text-slate-800">
      {/* Top Header */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-rose-800 tracking-widest">
            CYBERLOCK // MASTER_CASE_FILE_FINAL_LOCK
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-rose-100 text-rose-800 border border-rose-200 font-bold">
          <Flame size={14} className="text-rose-600" /> BOSS_ESCAPE_CHALLENGE
        </span>
      </div>

      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mx-auto mb-3 shadow-sm">
            <KeyRound size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-wide mb-2">FINAL CYBER LOCK ESCAPE</h2>
          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm leading-relaxed">
            Analyze the complete multi-stage attack case file. Correctly solve all 5 incident vectors to disengage the master security lock and escape CYBERLOCK!
          </p>
        </div>

        {/* Incident Dossier */}
        <div className="max-w-2xl mx-auto bg-slate-50 rounded-2xl border border-rose-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-rose-700 font-mono text-xs font-bold">
              <FileText size={16} />
              <span>CLASSIFIED EVIDENCE DOSSIER</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-200 rounded-lg">
              5 THREAT VECTORS
            </span>
          </div>

          <div
            onClick={() => onEvidenceSelect?.('master_dossier', 'Full multi-stage attack dossier analysis')}
            className="p-4 bg-white border border-slate-200 hover:border-rose-400 rounded-xl text-slate-800 text-xs font-mono leading-relaxed cursor-pointer transition-all space-y-2 shadow-sm"
          >
            <p><strong className="text-slate-500">SENDER:</strong> {scenario.sender} &lt;{scenario.senderAddress}&gt;</p>
            <p><strong className="text-slate-500">INCIDENT CONTEXT:</strong> {scenario.body}</p>
            <p><strong className="text-slate-500">DESTINATION DOMAIN:</strong> {scenario.qrDestination}</p>
          </div>
        </div>

        {/* 5 Incident Questions */}
        <div className="max-w-2xl mx-auto space-y-5">
          {questions.map((q) => (
            <div key={q.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
              <p className="text-xs font-bold font-mono text-slate-800">{q.label}</p>
              <div className="grid gap-2">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(q.id, opt.value)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                      answers[q.id] === opt.value
                        ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-sm ring-1 ring-rose-500'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      answers[q.id] === opt.value ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-400 bg-white'
                    }`}>
                      {answers[q.id] === opt.value && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-4 pb-8">
            <Button
              variant="danger"
              size="lg"
              disabled={!isAllAnswered}
              onClick={handleSubmit}
            >
              DISENGAGE MASTER CYBER LOCK & ESCAPE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

FinalRoom.propTypes = {
  challenge: PropTypes.object,
  onAnswer: PropTypes.func.isRequired,
  onEvidenceSelect: PropTypes.func
};

export default FinalRoom;

