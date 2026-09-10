import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';

const AdminCharts = ({ chartData }) => {
  // Mock Data
  const performanceData = [
    { name: 'Phishing', score: 75 },
    { name: 'Passwords', score: 62 },
    { name: 'QR Safety', score: 45 },
    { name: 'Social Eng', score: 82 },
    { name: 'Browsing', score: 68 },
  ];

  const mistakesData = [
    { name: 'Clicked Link', value: 400 },
    { name: 'Scanned QR', value: 300 },
    { name: 'Weak Password', value: 300 },
    { name: 'Shared Data', value: 200 },
  ];

  const improvementData = [
    { week: 'W1', score: 45 },
    { week: 'W2', score: 52 },
    { week: 'W3', score: 61 },
    { week: 'W4', score: 68 },
    { week: 'W5', score: 75 },
  ];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#a855f7'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 mb-1">{label || payload[0].name}</p>
          <p className="font-bold text-cyan-400 font-mono">
            Value: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard>
        <h3 className="text-lg font-bold text-slate-100 mb-6">Category Performance Avg</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
              <Bar dataKey="score" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-bold text-slate-100 mb-6">Score Improvement Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={improvementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="week" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="lg:col-span-2">
        <h3 className="text-lg font-bold text-slate-100 mb-6">Mistake Breakdown</h3>
        <div className="h-[300px] w-full flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mistakesData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {mistakesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

AdminCharts.propTypes = {
  chartData: PropTypes.object,
};

export default AdminCharts;
