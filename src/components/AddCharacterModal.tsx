'use client';

import React, { useState } from 'react';
import { Character, CharacterClass, Faction } from '../types/wow';
import { X, UserPlus, RefreshCw, Sparkles } from 'lucide-react';
import { loadBnetCredentials } from '../lib/storage';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCharacter: (character: Character) => void;
}

const CLASSES: CharacterClass[] = [
  'Death Knight',
  'Demon Hunter',
  'Druid',
  'Evoker',
  'Hunter',
  'Mage',
  'Monk',
  'Paladin',
  'Priest',
  'Rogue',
  'Shaman',
  'Warlock',
  'Warrior',
];

export default function AddCharacterModal({
  isOpen,
  onClose,
  onAddCharacter,
}: AddCharacterModalProps) {
  const [name, setName] = useState('');
  const [realm, setRealm] = useState('Moon Guard');
  const [region, setRegion] = useState<'us' | 'eu'>('us');
  const [charClass, setCharClass] = useState<CharacterClass>('Druid');
  const [spec, setSpec] = useState('Restoration');
  const [level, setLevel] = useState(80);
  const [itemLevel, setItemLevel] = useState(615);
  const [faction, setFaction] = useState<Faction>('Alliance');
  const [race, setRace] = useState('Night Elf');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [renderUrl, setRenderUrl] = useState<string | undefined>();
  const [isMain, setIsMain] = useState(false);

  const [isFetchingBnet, setIsFetchingBnet] = useState(false);
  const [fetchMessage, setFetchMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchFromBnet = async () => {
    if (!name.trim() || !realm.trim()) {
      setFetchMessage('Please enter character name and realm first.');
      return;
    }

    setIsFetchingBnet(true);
    setFetchMessage('Querying Battle.net API...');

    try {
      const creds = loadBnetCredentials();
      const res = await fetch('/api/blizzard/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          region,
          characterName: name.trim(),
          realm: realm.trim(),
          action: 'character',
        }),
      });

      const data = await res.json();
      if (data.success && data.character) {
        const c = data.character;
        if (c.name) setName(c.name);
        if (c.class && CLASSES.includes(c.class as CharacterClass)) {
          setCharClass(c.class as CharacterClass);
        }
        if (c.spec) setSpec(c.spec);
        if (c.level) setLevel(c.level);
        if (c.itemLevel) setItemLevel(c.itemLevel);
        if (c.faction) setFaction(c.faction === 'Horde' ? 'Horde' : 'Alliance');
        if (c.race) setRace(c.race);
        if (c.avatarUrl) setAvatarUrl(c.avatarUrl);
        if (c.renderUrl) setRenderUrl(c.renderUrl);

        setFetchMessage(`✓ Successfully imported ${c.name} (ilvl ${c.itemLevel || c.averageItemLevel}) from Battle.net!`);
      } else {
        setFetchMessage(`✗ ${data.error || 'Character lookup failed.'}`);
      }
    } catch (err: any) {
      setFetchMessage(`✗ Network error: ${err.message}`);
    } finally {
      setIsFetchingBnet(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: name.trim(),
      realm: realm.trim(),
      region,
      class: charClass,
      spec: spec.trim() || 'DPS',
      level,
      itemLevel,
      faction,
      race: race.trim() || 'Unknown',
      avatarUrl,
      renderUrl,
      isMain,
    };

    onAddCharacter(newChar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121829] border border-slate-750 border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Add New Character / Alt</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Enter character name and realm to auto-fetch from Blizzard, or fill in manually.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Character Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., LeaAnne"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Realm / Server *
              </label>
              <input
                type="text"
                required
                value={realm}
                onChange={(e) => setRealm(e.target.value)}
                placeholder="Moon Guard"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFetchFromBnet}
              disabled={isFetchingBnet}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-200 transition flex items-center justify-center gap-1.5"
            >
              {isFetchingBnet ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching live data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>Auto-Fill from Battle.net API</span>
                </>
              )}
            </button>
          </div>

          {fetchMessage && (
            <div className="text-[11px] p-2 rounded-lg bg-slate-900 border border-slate-750 text-slate-300">
              {fetchMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as 'us' | 'eu')}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="us">US / Americas</option>
                <option value="eu">EU / Europe</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Class
              </label>
              <select
                value={charClass}
                onChange={(e) => setCharClass(e.target.value as CharacterClass)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Specialization
              </label>
              <input
                type="text"
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                placeholder="Restoration"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Item Level (iLvl)
              </label>
              <input
                type="number"
                value={itemLevel}
                onChange={(e) => setItemLevel(Number(e.target.value))}
                min={1}
                max={700}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Race
              </label>
              <input
                type="text"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                placeholder="Night Elf"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Faction
              </label>
              <select
                value={faction}
                onChange={(e) => setFaction(e.target.value as Faction)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Alliance">Alliance 🦁</option>
                <option value="Horde">Horde 🐺</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isMain"
              checked={isMain}
              onChange={(e) => setIsMain(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0"
            />
            <label htmlFor="isMain" className="text-xs text-slate-300 font-medium cursor-pointer">
              Set as primary Main character ⭐
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition shadow-md"
            >
              Add to Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
