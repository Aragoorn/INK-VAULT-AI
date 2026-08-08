"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Coins, ArrowUpRight } from 'lucide-react';

interface VestingProps {
  totalVested: string;
  claimedAmount: string;
  claimableAmount: string;
  onClaim: () => void;
  isLoading: boolean;
}

export const VestingCard: React.FC<VestingProps> = ({
  totalVested,
  claimedAmount,
  claimableAmount,
  onClaim,
  isLoading,
}) => {
  const chartData = [
    { time: 'Start', vested: 0 },
    { time: '25%', vested: parseFloat(totalVested || "0") * 0.25 },
    { time: '50%', vested: parseFloat(totalVested || "0") * 0.5 },
    { time: '75%', vested: parseFloat(totalVested || "0") * 0.75 },
    { time: '100%', vested: parseFloat(totalVested || "0") },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Linear Vesting Schedule</h3>
            <p className="text-xs text-slate-400">Timestamp-verified Release Engine</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/40 p-4 rounded-lg">
          <p className="text-xs text-slate-400">Total Allocation</p>
          <p className="text-xl font-bold text-slate-100">{totalVested} ETH</p>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-lg">
          <p className="text-xs text-slate-400">Claimed Amount</p>
          <p className="text-xl font-bold text-slate-400">{claimedAmount} ETH</p>
        </div>
        <div className="bg-blue-950/30 border border-blue-800/50 p-4 rounded-lg">
          <p className="text-xs text-blue-300">Ready to Claim</p>
          <p className="text-xl font-bold text-blue-400">{claimableAmount} ETH</p>
        </div>
      </div>

      <div className="h-40 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            <Area type="monotone" dataKey="vested" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVested)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={onClaim}
        disabled={isLoading || parseFloat(claimableAmount || "0") <= 0}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
      >
        <Coins className="w-5 h-5" />
        {isLoading ? 'Processing Claim...' : 'Claim Vested Tokens'}
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
};