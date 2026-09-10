import { Shield, Lock, QrCode, MessageSquare, Users, Bot, KeyRound, Sparkles, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export const ROOMS = [
  {
    id: 1,
    title: 'PHISHING ROOM',
    subtitle: 'Email Infiltration & Deceptive Domains',
    icon: Shield,
    desc: 'Investigate spoofed headers, typo-squatting, and deceptive attachments in an interactive inbox simulator.',
    category: 'phishing',
    difficulty: 'Novice to Advanced',
    active: true,
    path: 'phishing',
    color: '#06b6d4',
    bgGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]'
  },
  {
    id: 2,
    title: 'PASSWORD VAULT',
    subtitle: 'Entropy, Passkeys & MFA Defenses',
    icon: Lock,
    desc: 'Audit credential hygiene, defeat brute-force dictionary attacks, and configure phishing-resistant Passkeys.',
    category: 'password',
    difficulty: 'Novice to Expert',
    active: true,
    path: 'password',
    color: '#10b981',
    bgGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]'
  },
  {
    id: 3,
    title: 'QR TRAP',
    subtitle: 'Physical Overlays & Quishing Exploits',
    icon: QrCode,
    desc: 'Decode dangerous QR codes, detect physical sticker overlays, and avoid malicious APK trojan downloads.',
    category: 'qr',
    difficulty: 'Intermediate to Expert',
    active: true,
    path: 'qr',
    color: '#8b5cf6',
    bgGlow: 'shadow-[0_0_30px_rgba(139,92,246,0.2)]'
  },
  {
    id: 4,
    title: 'SCAM INBOX',
    subtitle: 'SMS Smishing & Task Fraud',
    icon: MessageSquare,
    desc: 'Navigate high-pressure SMS alerts, remote task scams, romance crypto traps, and urgent utility shutoffs.',
    category: 'scam',
    difficulty: 'Novice to Advanced',
    active: true,
    path: 'scam',
    color: '#f59e0b',
    bgGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]'
  },
  {
    id: 5,
    title: 'SOCIAL ENGINEERING',
    subtitle: 'Pretexting, Vishing & USB Baiting',
    icon: Users,
    desc: 'Resist tailgating traps, executive rush orders, caller ID spoofing, and rogue hardware implants.',
    category: 'social-engineering',
    difficulty: 'Advanced',
    active: true,
    path: 'social',
    color: '#ec4899',
    bgGlow: 'shadow-[0_0_30px_rgba(236,72,153,0.2)]'
  },
  {
    id: 6,
    title: 'AI THREAT LAB',
    subtitle: 'Voice Cloning, Prompt Injections & Deepfakes',
    icon: Bot,
    desc: 'Outsmart generative AI attacks: synthesized executive voice calls, document prompt injections, and AI slopsquatting.',
    category: 'ai-threat',
    difficulty: 'Advanced to Expert',
    active: true,
    path: 'ai',
    color: '#6366f1',
    bgGlow: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]'
  },
  {
    id: 7,
    title: 'FINAL CYBER LOCK',
    subtitle: 'The Multi-Vector Master Escape',
    icon: KeyRound,
    desc: 'The ultimate boss challenge: investigate a coordinated multi-stage cyber assault across all 5 threat vectors.',
    category: 'final',
    difficulty: 'Master Sentinel',
    active: true,
    path: 'final',
    color: '#ef4444',
    bgGlow: 'shadow-[0_0_40px_rgba(239,68,68,0.3)]'
  }
];

export const BADGE_DEFINITIONS = [
  { slug: 'phish-hunter', name: 'Phish Hunter', icon: 'ShieldAlert', rarity: 'common', color: 'text-cyan-400' },
  { slug: 'vault-keeper', name: 'Vault Keeper', icon: 'Lock', rarity: 'common', color: 'text-emerald-400' },
  { slug: 'qr-guardian', name: 'QR Guardian', icon: 'QrCode', rarity: 'common', color: 'text-purple-400' },
  { slug: 'scam-breaker', name: 'Scam Breaker', icon: 'MessageSquare', rarity: 'rare', color: 'text-amber-400' },
  { slug: 'social-engineering-detective', name: 'Social Engineering Detective', icon: 'Users', rarity: 'rare', color: 'text-pink-400' },
  { slug: 'ai-skeptic', name: 'AI Skeptic', icon: 'Bot', rarity: 'epic', color: 'text-indigo-400' },
  { slug: 'cyber-sentinel', name: 'Cyber Sentinel', icon: 'Sparkles', rarity: 'legendary', color: 'text-yellow-400' },
  { slug: 'perfect-escape', name: 'Perfect Escape', icon: 'Flame', rarity: 'legendary', color: 'text-red-400' },
  { slug: 'most-improved', name: 'Most Improved', icon: 'CheckCircle', rarity: 'epic', color: 'text-green-400' }
];

export const DIFFICULTY_LEVELS = {
  beginner: { label: 'Novice', color: 'text-green-400', badgeBg: 'bg-green-500/10 border-green-500/30' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-400', badgeBg: 'bg-yellow-500/10 border-yellow-500/30' },
  advanced: { label: 'Advanced', color: 'text-orange-400', badgeBg: 'bg-orange-500/10 border-orange-500/30' },
  expert: { label: 'Expert', color: 'text-red-400', badgeBg: 'bg-red-500/10 border-red-500/30' }
};
