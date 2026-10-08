'use client';

import React, { useState } from 'react';
import { Character, WeeklyActivity, RaidLockout, CharacterProgress } from '../types/wow';
import { CLASS_COLORS, MOCK_WEEKLY_ACTIVITIES, MOCK_RAIDS } from '../data/mockData';
import { CheckCircle2, Circle, Trophy, Swords, Sparkles, MapPin, Gift, Plus, Minus, FileText } from 'lucide-react';

interface WeeklyLockoutsViewProps {
  character: Character;
  progress: CharacterProgress;
  onUpdateActivity: (activityId: string, completed: boolean) => void;
  onUpdateVault: (type: 'raidBosses' | 'dungeons' | 'delves', value: number) => void;
  onUpdateRaidLockout: (raidId: string, difficulty: string, bosses: number) => void;
  onUpdateNotes: (notes: string) => void;
}

export default function WeeklyLockoutsView({
  character,
  progress,
  onUpdateActivity,
  onUpdateVault,
  onUpdateRaidLockout,
  onUpdateNotes,
}: WeeklyLockoutsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const classColor = CLASS_COLORS[character.class] || '#fbbf24';

  const activities = MOCK_WEEKLY_ACTIVITIES;
  const filteredActivities =
    selectedCategory === 'All'
      ? activities
      : activities.filter((act) => act.category === selectedCategory);

  const completedCount = activities.filter(
    (act) => progress.activitiesCompleted[act.id]
  ).length;
  const progressPct = Math.round((completedCount / activities.length) * 100);

  // Vault helpers
  const vault = progress.greatVault || { raidBosses: 0, dungeons: 0, delves: 0 };

  const getVaultSlots = (current: number, thresholds: number[]) => {
    return thresholds.map((threshold, idx) => ({
      tier: idx + 1,
      threshold,
      unlocked: current >= threshold,
    }));
  };

  const raidSlots = getVaultSlots(vault.raidBosses, [2, 4, 6]);
  const dungeonSlots = getVaultSlots(vault.dungeons, [1, 4, 8]);
  const delveSlots = getVaultSlots(vault.delves, [2, 4, 8]);

  const totalVaultUnlocked =
    raidSlots.filter((s) => s.unlocked).length +
    dungeonSlots.filter((s) => s.unlocked).length +
    delveSlots.filter((s) => s.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Character Header & Overall Weekly Completion Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
                style={{ backgroundColor: classColor }}
              />
              <h2 className="text-xl font-bold text-white">
                {character.name}
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold border"
                style={{
                  color: classColor,
                  borderColor: `${classColor}40`,
                  backgroundColor: `${classColor}15`,
                }}
              >
                {character.spec} {character.class}
              </span>
              <span className="text-xs text-slate-400">
                {character.realm} &bull; {character.itemLevel} iLvl
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Weekly progress reset status for this character. Check off completed items as you play.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Weekly Quests</span>
              <span className="text-sm font-bold text-amber-300">
                {completedCount} / {activities.length} ({progressPct}%)
              </span>
            </div>
            <div className="h-7 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Vault Slots</span>
              <span className="text-sm font-bold text-sky-400">
                {totalVaultUnlocked} / 9 Unlocked
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 mt-4 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Grid: Great Vault (Left) & Weekly Checklist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Great Vault & Lockouts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Great Vault Section */}
          <div className="bg-[#121829] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-slate-100 text-sm">The Great Vault</h3>
              </div>
              <span className="text-xs text-amber-400/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {totalVaultUnlocked}/9 Slots
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {/* Raids Vault Row */}
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-semibold text-slate-200">Raid Bosses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateVault('raidBosses', Math.max(0, vault.raidBosses - 1))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-amber-300 w-5 text-center">
                      {vault.raidBosses}
                    </span>
                    <button
                      onClick={() => onUpdateVault('raidBosses', Math.min(8, vault.raidBosses + 1))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {raidSlots.map((slot) => (
                    <div
                      key={slot.tier}
                      className={`p-2 rounded-lg border text-center transition ${
                        slot.unlocked
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-sm shadow-amber-500/10'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block">
                        Slot {slot.tier} ({slot.threshold} Bosses)
                      </span>
                      <span className="text-xs font-semibold mt-0.5 block">
                        {slot.unlocked ? '✨ Unlocked' : `${vault.raidBosses}/${slot.threshold}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dungeons Vault Row */}
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold text-slate-200">Mythic+ Dungeons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateVault('dungeons', Math.max(0, vault.dungeons - 1))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-sky-300 w-5 text-center">
                      {vault.dungeons}
                    </span>
                    <button
                      onClick={() => onUpdateVault('dungeons', Math.min(10, vault.dungeons + 1))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {dungeonSlots.map((slot) => (
                    <div
                      key={slot.tier}
                      className={`p-2 rounded-lg border text-center transition ${
                        slot.unlocked
                          ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 shadow-sm shadow-sky-500/10'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block">
                        Slot {slot.tier} ({slot.threshold} Runs)
                      </span>
                      <span className="text-xs font-semibold mt-0.5 block">
                        {slot.unlocked ? '✨ Unlocked' : `${vault.dungeons}/${slot.threshold}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* World / Delves Vault Row */}
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">World &amp; Delves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateVault('delves', Math.max(0, vault.delves - 1))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-emerald-300 w-5 text-center">
                      {vault.delves}
                    </span>
                    <button
                      onClick={() => onUpdateVault('delves', Math.min(10, vault.delves + 1))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {delveSlots.map((slot) => (
                    <div
                      key={slot.tier}
                      className={`p-2 rounded-lg border text-center transition ${
                        slot.unlocked
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-sm shadow-emerald-500/10'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block">
                        Slot {slot.tier} ({slot.threshold} Delves)
                      </span>
                      <span className="text-xs font-semibold mt-0.5 block">
                        {slot.unlocked ? '✨ Unlocked' : `${vault.delves}/${slot.threshold}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Raid Lockout Matrix (Current + Legacy Runs) */}
          <div className="bg-[#121829] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-slate-100 text-sm">Raid &amp; Legacy Lockouts</h3>
              </div>
              <span className="text-[11px] text-slate-400">Weekly Clears</span>
            </div>

            <div className="space-y-2.5 mt-3">
              {MOCK_RAIDS.map((raid) => {
                const raidProg = progress.raidProgress[raid.id] || {};
                const isCleared = Object.values(raidProg).some((val) => val > 0);

                return (
                  <div
                    key={raid.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                      isCleared
                        ? 'bg-slate-900/50 border-emerald-900/40 text-slate-300'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate text-slate-100">
                          {raid.name}
                        </span>
                        {raid.isCurrentTier && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Current Tier
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate mt-0.5">
                        <span>{raid.expansion}</span>
                        {raid.notableDrop && (
                          <>
                            <span>&bull;</span>
                            <span className="text-amber-300/80 truncate">
                              🎁 {raid.notableDrop}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const newCount = isCleared ? 0 : 1;
                        onUpdateRaidLockout(raid.id, raid.difficulties[0], newCount);
                      }}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition shrink-0 ${
                        isCleared
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isCleared ? '✓ Cleared' : 'Available'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Character Scratchpad / Goals */}
          <div className="bg-[#121829] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Weekly Goals &amp; Scratchpad ({character.name})
              </h4>
            </div>
            <textarea
              value={progress.notes || ''}
              onChange={(e) => onUpdateNotes(e.target.value)}
              placeholder="e.g., Farm +8 Stonevault for weapon, craft 636 wrist with embellishment, do 2 more Hallowfall keyflames..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 resize-y min-h-[70px]"
            />
          </div>
        </div>

        {/* Right Column: Weekly Quests Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#121829] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Weekly Activity Checklist</h3>
                  <p className="text-xs text-slate-400">
                    Pinnacle rewards, weekly events, world bosses, and rep caches
                  </p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 text-xs">
                {['All', 'World Boss', 'Delve / Spark', 'Pinnacle Quest', 'Reputation / Weekly'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist items */}
            <div className="divide-y divide-slate-800/80 mt-2">
              {filteredActivities.map((act) => {
                const isDone = !!progress.activitiesCompleted[act.id];

                return (
                  <div
                    key={act.id}
                    onClick={() => onUpdateActivity(act.id, !isDone)}
                    className={`py-3 px-2 flex items-start gap-3 rounded-xl transition cursor-pointer group ${
                      isDone
                        ? 'bg-emerald-950/15 opacity-75'
                        : 'hover:bg-slate-850 hover:bg-slate-900/60'
                    }`}
                  >
                    <button
                      className="mt-0.5 text-amber-400 shrink-0 focus:outline-none"
                      aria-label={isDone ? 'Mark uncompleted' : 'Mark completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-semibold transition ${
                            isDone
                              ? 'line-through text-slate-400'
                              : 'text-slate-100 group-hover:text-amber-200'
                          }`}
                        >
                          {act.title}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {act.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-0.5">
                        {act.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-400" />
                          {act.zone}
                        </span>
                        <span className="text-amber-300/90 flex items-center gap-1">
                          <Gift className="w-3 h-3 text-amber-400" />
                          {act.rewardSummary}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
