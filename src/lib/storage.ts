import { Character, CharacterProgress, MountItem, PetItem } from '../types/wow';
import { DEFAULT_MOUNTS, DEFAULT_PETS } from '../data/gameData';

const STORAGE_KEYS = {
  CHARACTERS: 'leaanne_wow_characters_v2',
  PROGRESS: 'leaanne_wow_progress_v2',
  MOUNTS: 'leaanne_wow_mounts_v2',
  PETS: 'leaanne_wow_pets_v2',
  SELECTED_CHAR: 'leaanne_wow_selected_char_v2',
  REGION: 'leaanne_wow_region',
  BNET_CREDS: 'leaanne_wow_bnet_creds',
};

export interface BnetCredentials {
  clientId: string;
  clientSecret: string;
  region: 'us' | 'eu';
}

export function loadCharacters(): Character[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    // Filter out any legacy mock character IDs
    return parsed.filter(
      (c: Character) =>
        !['char-1', 'char-2', 'char-3', 'char-4', 'char-5'].includes(c.id) &&
        !['Silvermist', 'Aurorastrike', 'Sunwhisper', 'Shadowmelody'].includes(c.name)
    );
  } catch {
    return [];
  }
}

export function saveCharacters(chars: Character[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(chars));
}

export function loadProgress(): Record<string, CharacterProgress> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, CharacterProgress>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function loadMounts(): MountItem[] {
  if (typeof window === 'undefined') return DEFAULT_MOUNTS;
  const stored = localStorage.getItem(STORAGE_KEYS.MOUNTS);
  if (!stored) return DEFAULT_MOUNTS;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_MOUNTS;
  }
}

export function saveMounts(mounts: MountItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MOUNTS, JSON.stringify(mounts));
}

export function loadPets(): PetItem[] {
  if (typeof window === 'undefined') return DEFAULT_PETS;
  const stored = localStorage.getItem(STORAGE_KEYS.PETS);
  if (!stored) return DEFAULT_PETS;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PETS;
  }
}

export function savePets(pets: PetItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
}

export function loadSelectedCharId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.SELECTED_CHAR) || '';
}

export function saveSelectedCharId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SELECTED_CHAR, id);
}

export function loadRegion(): 'us' | 'eu' {
  if (typeof window === 'undefined') return 'us';
  return (localStorage.getItem(STORAGE_KEYS.REGION) as 'us' | 'eu') || 'us';
}

export function saveRegion(region: 'us' | 'eu'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.REGION, region);
}

export function loadBnetCredentials(): BnetCredentials {
  if (typeof window === 'undefined') {
    return { clientId: '', clientSecret: '', region: 'us' };
  }
  const stored = localStorage.getItem(STORAGE_KEYS.BNET_CREDS);
  if (!stored) return { clientId: '', clientSecret: '', region: 'us' };
  try {
    return JSON.parse(stored);
  } catch {
    return { clientId: '', clientSecret: '', region: 'us' };
  }
}

export function saveBnetCredentials(creds: BnetCredentials): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BNET_CREDS, JSON.stringify(creds));
}

export function clearAllLocalData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.MOUNTS);
  localStorage.removeItem(STORAGE_KEYS.PETS);
  localStorage.removeItem(STORAGE_KEYS.SELECTED_CHAR);
  // Also clean up any v1 legacy keys
  localStorage.removeItem('leaanne_wow_characters');
  localStorage.removeItem('leaanne_wow_progress');
  localStorage.removeItem('leaanne_wow_mounts');
  localStorage.removeItem('leaanne_wow_pets');
  localStorage.removeItem('leaanne_wow_selected_char');
}
