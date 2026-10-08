'use client';

import React, { useState } from 'react';
import { MountItem, PetItem, Character } from '../types/wow';
import { Sparkles, Star, ExternalLink, Check, Search, Compass, Heart, AlertCircle } from 'lucide-react';

interface MountPetTrackerViewProps {
  mounts: MountItem[];
  pets: PetItem[];
  activeCharacter: Character;
  onToggleMountOwned: (mountId: string) => void;
  onToggleMountWishlist: (mountId: string) => void;
  onToggleMountAttempt: (mountId: string, charId: string) => void;
  onTogglePetOwned: (petId: string) => void;
}

export default function MountPetTrackerView({
  mounts,
  pets,
  activeCharacter,
  onToggleMountOwned,
  onToggleMountWishlist,
  onToggleMountAttempt,
  onTogglePetOwned,
}: MountPetTrackerViewProps) {
  const [activeTab, setActiveTab] = useState<'mounts' | 'pets'>('mounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unowned' | 'wishlist' | 'farmRoute'>('farmRoute');

  // Mount filter logic
  const filteredMounts = mounts.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.expansion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bossOrSource.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'unowned') return !m.owned;
    if (filterMode === 'wishlist') return m.isWishlist;
    if (filterMode === 'farmRoute') {
      // Priority farm route: unowned drops that can be run
      return !m.owned && (m.sourceType === 'Raid Drop' || m.sourceType === 'Dungeon Drop');
    }
    return true;
  });

  // Pet filter logic
  const filteredPets = pets.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.expansion.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'unowned') return !p.owned;
    return true;
  });

  const ownedMountsCount = mounts.filter((m) => m.owned).length;
  const ownedPetsCount = pets.filter((p) => p.owned).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Sub-nav & Collection Stats */}
      <div className="bg-[#121829] border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">
                Mount &amp; Pet Collector Hub
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Track weekly farm attempts across alts, browse drop rates, and plan your collection route.
            </p>
          </div>

          {/* Mounts vs Pets Sub-tab switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('mounts')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'mounts'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🐴 Rare Mounts</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">
                {ownedMountsCount}/{mounts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pets')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'pets'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🐾 Battle Pets</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">
                {ownedPetsCount}/{pets.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'mounts' ? 'mounts, zones, or bosses...' : 'pets or families...'}`}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {activeTab === 'mounts' && (
              <button
                onClick={() => setFilterMode('farmRoute')}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
                  filterMode === 'farmRoute'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Weekly Farm Route</span>
              </button>
            )}

            <button
              onClick={() => setFilterMode('unowned')}
              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                filterMode === 'unowned'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Missing Only
            </button>

            {activeTab === 'mounts' && (
              <button
                onClick={() => setFilterMode('wishlist')}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition ${
                  filterMode === 'wishlist'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Wishlist</span>
              </button>
            )}

            <button
              onClick={() => setFilterMode('all')}
              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                filterMode === 'all'
                  ? 'bg-slate-700 border-slate-600 text-white font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Items
            </button>
          </div>
        </div>
      </div>

      {/* Mounts Grid */}
      {activeTab === 'mounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMounts.map((mount) => {
            const hasAttempted = mount.weeklyAttempts?.[activeCharacter.id];
            const totalAttemptsThisWeek = Object.values(mount.weeklyAttempts || {}).filter(Boolean).length;

            return (
              <div
                key={mount.id}
                className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  mount.owned
                    ? 'bg-emerald-950/15 border-emerald-900/40'
                    : 'bg-[#121829] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shadow-inner shrink-0">
                        {mount.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-100">
                            {mount.name}
                          </h3>
                          {mount.owned && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Collected
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-amber-300/90 font-medium">
                            {mount.sourceType}
                          </span>
                          <span>&bull;</span>
                          <span>{mount.expansion}</span>
                        </div>
                      </div>
                    </div>

                    {/* Wishlist Star */}
                    <button
                      onClick={() => onToggleMountWishlist(mount.id)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 transition"
                      title={mount.isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          mount.isWishlist
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Drop Details & Location */}
                  <div className="mt-3 bg-slate-950/60 rounded-xl p-2.5 border border-slate-850 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Boss / Source:</span>
                      <span className="font-semibold text-slate-200">
                        {mount.bossOrSource}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Zone / Instance:</span>
                      <span className="text-sky-300 font-medium">
                        {mount.zone}
                      </span>
                    </div>

                    {mount.dropRate && (
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Estimated Drop:</span>
                        <span className="text-amber-400 font-mono font-bold">
                          {mount.dropRate}
                        </span>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                      &ldquo;{mount.notes}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Card Footer: Weekly Farm Attempt Button & Wowhead Link */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Mark Attempt on Active Alt */}
                    {!mount.owned && (
                      <button
                        onClick={() => onToggleMountAttempt(mount.id, activeCharacter.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                          hasAttempted
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                        title={`Log farm attempt for ${activeCharacter.name}`}
                      >
                        {hasAttempted ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Run on {activeCharacter.name}</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-slate-600" />
                            <span>Run on {activeCharacter.name}</span>
                          </>
                        )}
                      </button>
                    )}

                    {totalAttemptsThisWeek > 0 && !mount.owned && (
                      <span className="text-[10px] text-slate-400">
                        ({totalAttemptsThisWeek} alt{totalAttemptsThisWeek > 1 ? 's' : ''} run)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleMountOwned(mount.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${
                        mount.owned
                          ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          : 'bg-purple-600/20 border-purple-500/40 text-purple-300 hover:bg-purple-600/30'
                      }`}
                    >
                      {mount.owned ? 'Mark Unowned' : 'Mark Owned'}
                    </button>

                    <a
                      href={mount.wowheadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                      title="View on Wowhead"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pets Grid */}
      {activeTab === 'pets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                pet.owned
                  ? 'bg-emerald-950/15 border-emerald-900/40'
                  : 'bg-[#121829] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shadow-inner shrink-0">
                      {pet.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-100">
                          {pet.name}
                        </h3>
                        {pet.owned && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Collected
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-purple-300 font-semibold px-1.5 py-0.2 rounded bg-purple-500/10 border border-purple-500/20">
                          {pet.family}
                        </span>
                        <span>&bull;</span>
                        <span>{pet.expansion}</span>
                      </div>
                    </div>
                  </div>

                  {pet.level && (
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      Lvl {pet.level}
                    </span>
                  )}
                </div>

                <div className="mt-3 bg-slate-950/60 rounded-xl p-2.5 border border-slate-850 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Zone / Dungeon:</span>
                    <span className="text-sky-300 font-medium">{pet.zone}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Source:</span>
                    <span className="text-slate-200">{pet.sourceType}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                    &ldquo;{pet.notes}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onTogglePetOwned(pet.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                    pet.owned
                      ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      : 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                  }`}
                >
                  {pet.owned ? 'Mark Unowned' : 'Mark Collected'}
                </button>

                <a
                  href={pet.wowheadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                  title="View Pet Guide on Wowhead"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
