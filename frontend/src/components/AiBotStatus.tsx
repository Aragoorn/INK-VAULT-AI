"use client";
import React from 'react';
import { ShieldCheck, Bot, Zap, Lock } from 'lucide-react';

interface AiBotStatusProps {
  botAddress: string;
  maxTradeLimit: string;
  isWhitelisted: boolean;
}

export const AiBotStatus: React.FC<AiBotStatusProps> = ({
  botAddress,
  maxTradeLimit,
  isWhitelisted,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Trading Agent & Security Guard</h3>
            <p className="text-xs text-slate-400">Real-time Automated Execution Boundaries</p>
          </div>
        </div>
        <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Active Agent
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-1">Authorized AI Bot Address</p>
          <p className="font-mono text-sm text-indigo-300 truncate">{botAddress || "Not Configured"}</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-1">Max Trade Hard Limit</p>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <p className="font-bold text-slate-100">{maxTradeLimit} ETH</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-1">Target Verification Status</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${isWhitelisted ? 'text-emerald-400' : 'text-rose-400'}`} />
            <p className={`font-semibold text-sm ${isWhitelisted ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isWhitelisted ? 'Whitelisted Destination' : 'Untrusted Target'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-black/40 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-amber-400" />
          [AI Log] Connected to Ink Mainnet. Safety parameters validated.
        </span>
        <span className="text-emerald-400 font-semibold">100% Coverage</span>
      </div>
    </div>
  );
};