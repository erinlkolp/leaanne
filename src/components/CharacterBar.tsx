'use client';

import React from 'react';
import { Character } from '../types/wow';
import { CLASS_COLORS } from '../data/gameData';
import { UserPlus, Star, Trash2, RefreshCw } from 'lucide-react';

interface CharacterBarProps {
  characters: Character[];
  selectedCharId: string;
  onSelectCharacter: (id: string) => void;
  onOpenAddModal: () => void;
  onDeleteCharacter: (id: string) => void;
  onSyncCharacter: () => void;
  isSyncing: boolean;
}

export default function CharacterBar({
  characters,
  selectedCharId,
  onSelectCharacter,
  onOpenAddModal,
  onDeleteCharacter,
  onSyncCharacter,
  isSyncing,
}: CharacterBarProps) {
  return (
    <div className="bg-[#101728]/80 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin scrollbar-thumb-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1.5 shrink-0">
            <span>Character:</span>
          </span>

          {characters.length === 0 ? (
            <span className="text-xs text-slate-500 italic">
              No characters added yet. Click &ldquo;Add Character&rdquo; to start.
            </span>
          ) : (
            characters.map((char) => {
              const isSelected = char.id === selectedCharId;
              const classColor = CLASS_COLORS[char.class] || '#fbbf24';

              return (
                <div
                  key={char.id}
                  className="relative group shrink-0"
                >
                  <button
                    onClick={() => onSelectCharacter(char.id)}
                    style={{
                      borderColor: isSelected ? classColor : 'rgba(51, 65, 85, 0.6)',
                      boxShadow: isSelected ? `0 0 12px ${classColor}33` : 'none',
                    }}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-slate-800/95 text-white'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {/* Class indicator dot or avatar */}
                    {char.avatarUrl ? (
                      <img
                        src={char.avatarUrl}
                        alt={char.name}
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: classColor }}
                      />
                    )}

                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-bold"
                          style={{ color: isSelected ? classColor : undefined }}
                        >
                          {char.name}
                        </span>
                        {char.isMain && (
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>{char.spec}</span>
                        <span>&bull;</span>
                        <span className="text-amber-300/90 font-mono font-semibold">
                          {char.itemLevel} iLvl
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Quick delete on hover for alts */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove ${char.name} from your roster?`)) {
                        onDeleteCharacter(char.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-0.5 shadow transition-opacity"
                    title={`Delete ${char.name}`}
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Action Buttons: Sync & Add Alt */}
        <div className="flex items-center gap-2 shrink-0">
          {characters.length > 0 && (
            <button
              onClick={onSyncCharacter}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-lg transition"
              title="Sync this character's gear, spec, and raid lockouts from Battle.net"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Active Alt</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Character</span>
          </button>
        </div>
      </div>
    </div>
  );
}
