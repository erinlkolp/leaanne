'use client';

import React from 'react';
import { Character, CharacterProgress, MountItem } from '../types/wow';
import { CLASS_COLORS } from '../data/gameData';
import { Trophy, CheckCircle2, XCircle, ArrowRight, UserPlus } from 'lucide-react';

interface AltRosterMatrixProps {
  characters: Character[];
  progress: Record<string, CharacterProgress>;
  mounts: MountItem[];
  onSelectCharacter: (charId: string) => void;
  onOpenAddModal?: () => void;
}

export default function AltRosterMatrix({
  characters,
  progress,
  mounts,
  onSelectCharacter,
  onOpenAddModal,
}: AltRosterMatrixProps) {
  if (characters.length === 0) {
    return (
      <div className="bg-[#121829] border border-slate-800 rounded-2xl p-8 text-center shadow-lg max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl mx-auto mb-3">
          👥
        </div>
        <h3 className="text-lg font-bold text-white">No Characters in Roster</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Add your characters to compare weekly lockouts, Great Vault progress, and mount farm runs side-by-side.
        </p>
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Character / Import from Battle.net</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#121829] border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>👥</span>
              <span>Account-Wide Alt Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Compare weekly lockouts, Great Vault progress, and farming status across all your alts at a glance.
            </p>
          </div>
        </div>

        {/* Responsive Table / Card Matrix */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-3">Character</th>
                <th className="pb-3 text-center">World Boss</th>
                <th className="pb-3 text-center">Weekly Spark</th>
                <th className="pb-3 text-center">Bountiful Delves</th>
                <th className="pb-3 text-center">Great Vault</th>
                <th className="pb-3 text-center">Legacy Mounts Farmed</th>
                <th className="pb-3 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {characters.map((char) => {
                const charProg = progress[char.id] || {
                  activitiesCompleted: {},
                  raidProgress: {},
                  greatVault: { raidBosses: 0, dungeons: 0, delves: 0 },
                };
                const classColor = CLASS_COLORS[char.class] || '#fbbf24';

                const worldBossDone = !!charProg.activitiesCompleted['act-world-boss'];
                const sparkDone = !!charProg.activitiesCompleted['act-spark-quest'];
                const delvesDone = !!charProg.activitiesCompleted['act-bountiful-delves'];

                // Calculate vault slots
                const v = charProg.greatVault;
                const rSlots = [2, 4, 6].filter((t) => v.raidBosses >= t).length;
                const dSlots = [1, 4, 8].filter((t) => v.dungeons >= t).length;
                const wSlots = [2, 4, 8].filter((t) => v.delves >= t).length;
                const totalVault = rSlots + dSlots + wSlots;

                // Mounts farmed by this char
                const mountsFarmed = mounts.filter(
                  (m) => m.weeklyAttempts?.[char.id]
                ).length;

                return (
                  <tr
                    key={char.id}
                    className="hover:bg-slate-900/40 transition group"
                  >
                    {/* Character Identity */}
                    <td className="py-3.5 pl-3">
                      <div className="flex items-center gap-2.5">
                        {char.avatarUrl ? (
                          <img
                            src={char.avatarUrl}
                            alt={char.name}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: classColor }}
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-200">
                            <span style={{ color: classColor }}>{char.name}</span>
                            {char.isMain && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-md font-semibold">
                                Main
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {char.spec} {char.class} &bull;{' '}
                            <span className="text-amber-300 font-mono">
                              {char.itemLevel} iLvl
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* World Boss */}
                    <td className="py-3.5 text-center">
                      {worldBossDone ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Killed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Weekly Spark */}
                    <td className="py-3.5 text-center">
                      {sparkDone ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Bountiful Delves */}
                    <td className="py-3.5 text-center">
                      {delvesDone ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>4/4 Done</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Great Vault */}
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full border ${
                          totalVault >= 6
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : totalVault > 0
                            ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        <Trophy className="w-3 w-3" />
                        <span>{totalVault}/9 Slots</span>
                      </span>
                    </td>

                    {/* Mounts Farmed */}
                    <td className="py-3.5 text-center">
                      <span className="font-mono text-slate-300 font-semibold">
                        {mountsFarmed} runs logged
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 pr-3 text-right">
                      <button
                        onClick={() => onSelectCharacter(char.id)}
                        className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
