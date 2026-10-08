'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CharacterBar from '../components/CharacterBar';
import WeeklyLockoutsView from '../components/WeeklyLockoutsView';
import MountPetTrackerView from '../components/MountPetTrackerView';
import AltRosterMatrix from '../components/AltRosterMatrix';
import AddCharacterModal from '../components/AddCharacterModal';
import BnetSettingsModal from '../components/BnetSettingsModal';
import { Character, CharacterProgress, MountItem, PetItem } from '../types/wow';
import {
  loadCharacters,
  saveCharacters,
  loadProgress,
  saveProgress,
  loadMounts,
  saveMounts,
  loadPets,
  savePets,
  loadSelectedCharId,
  saveSelectedCharId,
  loadRegion,
  saveRegion,
  loadBnetCredentials,
  clearAllLocalData,
} from '../lib/storage';
import { DEFAULT_MOUNTS, DEFAULT_PETS } from '../data/gameData';
import { Shield, Sparkles, UserPlus } from 'lucide-react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharId, setSelectedCharId] = useState<string>('');
  const [progress, setProgress] = useState<Record<string, CharacterProgress>>({});
  const [mounts, setMounts] = useState<MountItem[]>(DEFAULT_MOUNTS);
  const [pets, setPets] = useState<PetItem[]>(DEFAULT_PETS);
  const [region, setRegion] = useState<'us' | 'eu'>('us');

  const [activeTab, setActiveTab] = useState<'weekly' | 'mounts' | 'roster' | 'settings'>('weekly');
  const [isAddCharOpen, setIsAddCharOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncingChar, setIsSyncingChar] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsClient(true);
    const loadedChars = loadCharacters();
    setCharacters(loadedChars);

    const loadedSelected = loadSelectedCharId();
    if (loadedSelected && loadedChars.some((c) => c.id === loadedSelected)) {
      setSelectedCharId(loadedSelected);
    } else if (loadedChars.length > 0) {
      setSelectedCharId(loadedChars[0].id);
    } else {
      setSelectedCharId('');
    }

    setProgress(loadProgress());
    setMounts(loadMounts());
    setPets(loadPets());
    setRegion(loadRegion());
  }, []);

  // Sync to local storage
  const updateCharacters = (chars: Character[]) => {
    setCharacters(chars);
    saveCharacters(chars);
  };

  const updateProgress = (newProg: Record<string, CharacterProgress>) => {
    setProgress(newProg);
    saveProgress(newProg);
  };

  const updateMounts = (newMounts: MountItem[]) => {
    setMounts(newMounts);
    saveMounts(newMounts);
  };

  const updatePets = (newPets: PetItem[]) => {
    setPets(newPets);
    savePets(newPets);
  };

  const handleSelectCharacter = (id: string) => {
    setSelectedCharId(id);
    saveSelectedCharId(id);
  };

  const handleRegionChange = (newRegion: 'us' | 'eu') => {
    setRegion(newRegion);
    saveRegion(newRegion);
  };

  const activeCharacter: Character | null =
    characters.find((c) => c.id === selectedCharId) || (characters.length > 0 ? characters[0] : null);

  const currentProg = activeCharacter && progress[activeCharacter.id]
    ? progress[activeCharacter.id]
    : {
        characterId: activeCharacter?.id || '',
        activitiesCompleted: {},
        raidProgress: {},
        greatVault: { raidBosses: 0, dungeons: 0, delves: 0 },
        notes: '',
      };

  // Weekly Activity toggle
  const handleUpdateActivity = (actId: string, completed: boolean) => {
    if (!activeCharacter) return;
    const updated = {
      ...progress,
      [activeCharacter.id]: {
        ...currentProg,
        activitiesCompleted: {
          ...currentProg.activitiesCompleted,
          [actId]: completed,
        },
      },
    };
    updateProgress(updated);
  };

  // Vault updates
  const handleUpdateVault = (type: 'raidBosses' | 'dungeons' | 'delves', value: number) => {
    if (!activeCharacter) return;
    const updated = {
      ...progress,
      [activeCharacter.id]: {
        ...currentProg,
        greatVault: {
          ...currentProg.greatVault,
          [type]: value,
        },
      },
    };
    updateProgress(updated);
  };

  // Raid lockout updates
  const handleUpdateRaidLockout = (raidId: string, difficulty: string, bosses: number) => {
    if (!activeCharacter) return;
    const prevRaidProg = currentProg.raidProgress[raidId] || {};
    const updated = {
      ...progress,
      [activeCharacter.id]: {
        ...currentProg,
        raidProgress: {
          ...currentProg.raidProgress,
          [raidId]: {
            ...prevRaidProg,
            [difficulty]: bosses,
          },
        },
      },
    };
    updateProgress(updated);
  };

  // Character notes update
  const handleUpdateNotes = (notes: string) => {
    if (!activeCharacter) return;
    const updated = {
      ...progress,
      [activeCharacter.id]: {
        ...currentProg,
        notes,
      },
    };
    updateProgress(updated);
  };

  // Mount handlers
  const handleToggleMountOwned = (mountId: string) => {
    const updated = mounts.map((m) => (m.id === mountId ? { ...m, owned: !m.owned } : m));
    updateMounts(updated);
  };

  const handleToggleMountWishlist = (mountId: string) => {
    const updated = mounts.map((m) =>
      m.id === mountId ? { ...m, isWishlist: !m.isWishlist } : m
    );
    updateMounts(updated);
  };

  const handleToggleMountAttempt = (mountId: string, charId: string) => {
    const updated = mounts.map((m) => {
      if (m.id !== mountId) return m;
      const currentAttempts = m.weeklyAttempts || {};
      const currentVal = !!currentAttempts[charId];
      return {
        ...m,
        weeklyAttempts: {
          ...currentAttempts,
          [charId]: !currentVal,
        },
      };
    });
    updateMounts(updated);
  };

  // Pet handlers
  const handleTogglePetOwned = (petId: string) => {
    const updated = pets.map((p) => (p.id === petId ? { ...p, owned: !p.owned } : p));
    updatePets(updated);
  };

  // Reset week
  const handleResetWeek = () => {
    if (
      !confirm(
        'Start a fresh week? This will clear weekly quest checkmarks, Vault numbers, and lockout checkmarks across all alts.'
      )
    ) {
      return;
    }

    const resetProg: Record<string, CharacterProgress> = {};
    characters.forEach((char) => {
      resetProg[char.id] = {
        characterId: char.id,
        activitiesCompleted: {},
        raidProgress: {},
        greatVault: { raidBosses: 0, dungeons: 0, delves: 0 },
        notes: progress[char.id]?.notes || '',
      };
    });
    updateProgress(resetProg);

    // Reset weekly mount attempts
    const resetMounts = mounts.map((m) => ({
      ...m,
      weeklyAttempts: {},
    }));
    updateMounts(resetMounts);
  };

  // Clear all local data
  const handleResetToDefaults = () => {
    clearAllLocalData();
    setCharacters([]);
    setSelectedCharId('');
    setProgress({});
    setMounts(DEFAULT_MOUNTS);
    setPets(DEFAULT_PETS);
  };

  // Export JSON
  const handleExportData = () => {
    const data = {
      characters,
      progress,
      mounts,
      pets,
      region,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wow-companion-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.characters) updateCharacters(parsed.characters);
        if (parsed.progress) updateProgress(parsed.progress);
        if (parsed.mounts) updateMounts(parsed.mounts);
        if (parsed.pets) updatePets(parsed.pets);
        if (parsed.region) handleRegionChange(parsed.region);
        alert('Data backup successfully restored!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Add character
  const handleAddCharacter = (newChar: Character) => {
    const updated = [...characters, newChar];
    updateCharacters(updated);
    setSelectedCharId(newChar.id);
    saveSelectedCharId(newChar.id);
  };

  // Delete character
  const handleDeleteCharacter = (charId: string) => {
    const updated = characters.filter((c) => c.id !== charId);
    updateCharacters(updated);
    if (selectedCharId === charId) {
      const nextId = updated.length > 0 ? updated[0].id : '';
      setSelectedCharId(nextId);
      saveSelectedCharId(nextId);
    }
  };

  // Sync active character directly with Battle.net API
  const handleSyncActiveCharacter = async () => {
    if (!activeCharacter) return;
    setIsSyncingChar(true);
    try {
      const creds = loadBnetCredentials();
      const res = await fetch('/api/blizzard/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          region: activeCharacter.region || creds.region,
          characterName: activeCharacter.name,
          realm: activeCharacter.realm,
          action: 'character',
        }),
      });

      const data = await res.json();
      if (data.success && data.character) {
        const c = data.character;
        const updatedChars = characters.map((char) =>
          char.id === activeCharacter.id
            ? {
                ...char,
                level: c.level || char.level,
                itemLevel: c.itemLevel || c.averageItemLevel || char.itemLevel,
                spec: c.spec || char.spec,
                class: c.class || char.class,
                avatarUrl: c.avatarUrl || char.avatarUrl,
                renderUrl: c.renderUrl || char.renderUrl,
              }
            : char
        );
        updateCharacters(updatedChars);

        if (data.raidProgress && Object.keys(data.raidProgress).length > 0) {
          updateProgress({
            ...progress,
            [activeCharacter.id]: {
              ...currentProg,
              raidProgress: {
                ...currentProg.raidProgress,
                ...data.raidProgress,
              },
            },
          });
        }
        alert(`✓ Synced ${c.name} from Battle.net! Current item level: ${c.itemLevel || c.averageItemLevel}`);
      } else {
        alert(`✗ Could not sync character: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`✗ Network error: ${err.message}`);
    } finally {
      setIsSyncingChar(false);
    }
  };

  // Sync account mounts from Battle.net
  const handleSyncMountsFromBnet = (ownedMountNames: string[]) => {
    const normalizedOwned = new Set(ownedMountNames.map((n) => n.toLowerCase().trim()));
    const updatedMounts = mounts.map((m) => {
      const isOwned =
        m.owned ||
        normalizedOwned.has(m.name.toLowerCase().trim()) ||
        Array.from(normalizedOwned).some(
          (ownedName) =>
            ownedName.includes(m.name.toLowerCase().trim()) ||
            m.name.toLowerCase().trim().includes(ownedName)
        );
      return isOwned ? { ...m, owned: true } : m;
    });
    updateMounts(updatedMounts);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading Azeroth Companion...</p>
        </div>
      </div>
    );
  }

  const ownedMountsCount = mounts.filter((m) => m.owned).length;

  // Placeholder character for collection tab if roster is empty
  const fallbackMountChar: Character = activeCharacter || {
    id: 'placeholder',
    name: 'Character',
    realm: '',
    region,
    class: 'Druid',
    spec: '',
    level: 80,
    itemLevel: 0,
    faction: 'Alliance',
    race: '',
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        region={region}
        setRegion={handleRegionChange}
        onResetWeek={handleResetWeek}
        openSettings={() => setIsSettingsOpen(true)}
        totalAlts={characters.length}
        totalMountsOwned={ownedMountsCount}
        totalMountsCount={mounts.length}
      />

      {/* Character Selector Bar (shown on weekly and mounts tabs) */}
      <CharacterBar
        characters={characters}
        selectedCharId={activeCharacter?.id || ''}
        onSelectCharacter={handleSelectCharacter}
        onOpenAddModal={() => setIsAddCharOpen(true)}
        onDeleteCharacter={handleDeleteCharacter}
        onSyncCharacter={handleSyncActiveCharacter}
        isSyncing={isSyncingChar}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'weekly' && (
          activeCharacter ? (
            <WeeklyLockoutsView
              character={activeCharacter}
              progress={currentProg}
              onUpdateActivity={handleUpdateActivity}
              onUpdateVault={handleUpdateVault}
              onUpdateRaidLockout={handleUpdateRaidLockout}
              onUpdateNotes={handleUpdateNotes}
            />
          ) : (
            <div className="bg-[#121829] border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
                🛡️
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Welcome to LeaAnne&apos;s WoW Companion!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                Track weekly world bosses, Great Vault progression, raid lockouts, and rare mounts.
                Add your character to begin tracking your weekly adventures.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setIsAddCharOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Character / Import from Battle.net</span>
                </button>
                <button
                  onClick={() => setActiveTab('mounts')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Browse Mount &amp; Pet Collector</span>
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'mounts' && (
          <MountPetTrackerView
            mounts={mounts}
            pets={pets}
            activeCharacter={fallbackMountChar}
            onToggleMountOwned={handleToggleMountOwned}
            onToggleMountWishlist={handleToggleMountWishlist}
            onToggleMountAttempt={handleToggleMountAttempt}
            onTogglePetOwned={handleTogglePetOwned}
            onSyncMountsFromBnet={handleSyncMountsFromBnet}
          />
        )}

        {activeTab === 'roster' && (
          <AltRosterMatrix
            characters={characters}
            progress={progress}
            mounts={mounts}
            onSelectCharacter={(id) => {
              handleSelectCharacter(id);
              setActiveTab('weekly');
            }}
            onOpenAddModal={() => setIsAddCharOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            World of Warcraft &amp; Blizzard Entertainment are trademarks of Blizzard Entertainment, Inc.
          </p>
          <p className="text-slate-400">
            Crafted for LeaAnne &bull; Run locally with <code className="text-amber-400">npm run dev</code>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddCharacterModal
        isOpen={isAddCharOpen}
        onClose={() => setIsAddCharOpen(false)}
        onAddCharacter={handleAddCharacter}
      />

      <BnetSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetToDefaults={handleResetToDefaults}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />
    </div>
  );
}
