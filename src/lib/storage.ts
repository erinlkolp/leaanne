import { Character, CharacterProgress, MountItem, PetItem } from '../types/wow';
import { MOCK_CHARACTERS, INITIAL_PROGRESS, MOCK_MOUNTS, MOCK_PETS } from '../data/mockData';

const STORAGE_KEYS = {
  CHARACTERS: 'leaanne_wow_characters',
  PROGRESS: 'leaanne_wow_progress',
  MOUNTS: 'leaanne_wow_mounts',
  PETS: 'leaanne_wow_pets',
  SELECTED_CHAR: 'leaanne_wow_selected_char',
  REGION: 'leaanne_wow_region',
  BNET_CREDS: 'leaanne_wow_bnet_creds',
};

export interface BnetCredentials {
  clientId: string;
  clientSecret: string;
  region: 'us' | 'eu';
}

export function loadCharacters(): Character[] {
  if (typeof window === 'undefined') return MOCK_CHARACTERS;
  const stored = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
  if (!stored) return MOCK_CHARACTERS;
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_CHARACTERS;
  }
}

export function saveCharacters(chars: Character[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(chars));
}

export function loadProgress(): Record<string, CharacterProgress> {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (!stored) return INITIAL_PROGRESS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: Record<string, CharacterProgress>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function loadMounts(): MountItem[] {
  if (typeof window === 'undefined') return MOCK_MOUNTS;
  const stored = localStorage.getItem(STORAGE_KEYS.MOUNTS);
  if (!stored) return MOCK_MOUNTS;
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_MOUNTS;
  }
}

export function saveMounts(mounts: MountItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MOUNTS, JSON.stringify(mounts));
}

export function loadPets(): PetItem[] {
  if (typeof window === 'undefined') return MOCK_PETS;
  const stored = localStorage.getItem(STORAGE_KEYS.PETS);
  if (!stored) return MOCK_PETS;
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_PETS;
  }
}

export function savePets(pets: PetItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
}

export function loadSelectedCharId(): string {
  if (typeof window === 'undefined') return 'char-1';
  return localStorage.getItem(STORAGE_KEYS.SELECTED_CHAR) || 'char-1';
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
