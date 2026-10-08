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
} from '../lib/storage';
import { MOCK_CHARACTERS, INITIAL_PROGRESS, MOCK_MOUNTS, MOCK_PETS } from '../data/mockData';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [characters, setCharacters] = useState<Character[]>(MOCK_CHARACTERS);
  const [selectedCharId, setSelectedCharId] = useState<string>('char-1');
  const [progress, setProgress] = useState<Record<string, CharacterProgress>>(INITIAL_PROGRESS);
  const [mounts, setMounts] = useState<MountItem[]>(MOCK_MOUNTS);
  const [pets, setPets] = useState<PetItem[]>(MOCK_PETS);
  const [region, setRegion] = useState<'us' | 'eu'>('us');

  const [activeTab, setActiveTab] = useState<'weekly' | 'mounts' | 'roster' | 'settings'>('weekly');
  const [isAddCharOpen, setIsAddCharOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsClient(true);
    setCharacters(loadCharacters());
    setSelectedCharId(loadSelectedCharId());
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

  const activeCharacter =
    characters.find((c) => c.id === selectedCharId) || characters[0] || MOCK_CHARACTERS[0];

  const currentProg = progress[activeCharacter.id] || {
    characterId: activeCharacter.id,
    activitiesCompleted: {},
    raidProgress: {},
    greatVault: { raidBosses: 0, dungeons: 0, delves: 0 },
    notes: '',
  };

  // Weekly Activity toggle
  const handleUpdateActivity = (actId: string, completed: boolean) => {
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
    if (!confirm('Start a fresh week? This will clear weekly quest checkmarks, Vault numbers, and lockout checkmarks across all alts.')) {
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

  // Reset to default sample data
  const handleResetToDefaults = () => {
    updateCharacters(MOCK_CHARACTERS);
    updateProgress(INITIAL_PROGRESS);
    updateMounts(MOCK_MOUNTS);
    updatePets(MOCK_PETS);
    setSelectedCharId('char-1');
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
  };

  // Delete character
  const handleDeleteCharacter = (charId: string) => {
    const updated = characters.filter((c) => c.id !== charId);
    updateCharacters(updated);
    if (selectedCharId === charId && updated.length > 0) {
      setSelectedCharId(updated[0].id);
    }
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
        selectedCharId={activeCharacter.id}
        onSelectCharacter={handleSelectCharacter}
        onOpenAddModal={() => setIsAddCharOpen(true)}
        onDeleteCharacter={handleDeleteCharacter}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'weekly' && (
          <WeeklyLockoutsView
            character={activeCharacter}
            progress={currentProg}
            onUpdateActivity={handleUpdateActivity}
            onUpdateVault={handleUpdateVault}
            onUpdateRaidLockout={handleUpdateRaidLockout}
            onUpdateNotes={handleUpdateNotes}
          />
        )}

        {activeTab === 'mounts' && (
          <MountPetTrackerView
            mounts={mounts}
            pets={pets}
            activeCharacter={activeCharacter}
            onToggleMountOwned={handleToggleMountOwned}
            onToggleMountWishlist={handleToggleMountWishlist}
            onToggleMountAttempt={handleToggleMountAttempt}
            onTogglePetOwned={handleTogglePetOwned}
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
