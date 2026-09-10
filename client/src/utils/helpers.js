export const formatXP = (xp) => {
  return new Intl.NumberFormat('en-US').format(xp || 0) + ' XP';
};

export const formatTime = (seconds) => {
  if (!seconds) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const getRiskColor = (level) => {
  if (level < 30) return 'text-green-500';
  if (level < 70) return 'text-yellow-500';
  return 'text-red-500';
};

export const formatPercentage = (value) => {
  return `${Math.round(value || 0)}%`;
};

export const calculateProgress = (completed, total) => {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
};

export const truncateText = (text, maxLen) => {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
};
