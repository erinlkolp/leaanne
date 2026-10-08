'use client';

import React, { useEffect, useState } from 'react';
import { getNextWeeklyReset, calculateTimeRemaining, TimeRemaining } from '../lib/resetTimer';
import { Clock, RefreshCw, Key, Shield, Sparkles, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'weekly' | 'mounts' | 'roster' | 'settings';
  setActiveTab: (tab: 'weekly' | 'mounts' | 'roster' | 'settings') => void;
  region: 'us' | 'eu';
  setRegion: (region: 'us' | 'eu') => void;
  onResetWeek: () => void;
  openSettings: () => void;
  totalAlts: number;
  totalMountsOwned: number;
  totalMountsCount: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  region,
  setRegion,
  onResetWeek,
  openSettings,
  totalAlts,
  totalMountsOwned,
  totalMountsCount,
}: HeaderProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: 'Calculating...',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const nextReset = getNextWeeklyReset(region);
      setTimeLeft(calculateTimeRemaining(nextReset));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [region]);

  return (
    <header className="border-b border-amber-900/30 bg-[#0d1322]/90 backdrop-blur-md sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Title, Reset Clock & Quick Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-950 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
              <Shield className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                  Leaanne&apos;s WoW Companion
                </h1>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  The War Within
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Weekly Lockout Matrix &bull; Vault Progress &bull; Mount &amp; Pet Collector
              </p>
            </div>
          </div>

          {/* Right Stats & Reset Timer */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Reset Countdown Card */}
            <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-1.5 shadow-inner">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <span>RESET IN ({region.toUpperCase()})</span>
                  <button
                    onClick={() => setRegion(region === 'us' ? 'eu' : 'us')}
                    className="text-[9px] hover:text-amber-300 transition-colors underline flex items-center gap-0.5"
                    title="Click to switch between US (Tuesdays) and EU (Wednesdays)"
                  >
                    <Globe className="w-2.5 h-2.5" />
                    {region === 'us' ? 'Switch to EU' : 'Switch to US'}
                  </button>
                </div>
                <div className="text-xs font-mono font-bold text-amber-300">
                  {timeLeft.formatted}
                </div>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="hidden lg:flex items-center gap-3 text-xs bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] block">ALTS</span>
                <span className="font-bold text-sky-400">{totalAlts} Active</span>
              </div>
              <div className="h-6 w-px bg-slate-700/60" />
              <div>
                <span className="text-slate-500 text-[10px] block">MOUNTS</span>
                <span className="font-bold text-amber-400">
                  {totalMountsOwned}/{totalMountsCount}
                </span>
              </div>
            </div>

            {/* New Week Reset Button */}
            <button
              onClick={onResetWeek}
              className="text-xs flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition shadow-sm"
              title="Clear weekly checkboxes for a fresh reset"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Week</span>
            </button>

            {/* Battle.net Settings Button */}
            <button
              onClick={openSettings}
              className="text-xs flex items-center gap-1.5 bg-gradient-to-r from-blue-700/80 to-indigo-800/80 hover:from-blue-600 hover:to-indigo-700 text-sky-100 px-3 py-1.5 rounded-lg border border-sky-400/30 transition shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-sky-300" />
              <span>Battle.net API</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 pt-1 pb-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'weekly'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            Weekly &amp; Lockouts
          </button>

          <button
            onClick={() => setActiveTab('mounts')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'mounts'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            Mount &amp; Pet Collector
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'roster'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span className="text-base leading-none">👥</span>
            Alt Roster Matrix
          </button>
        </div>
      </div>
    </header>
  );
}
