export type CharacterClass =
  | 'Death Knight'
  | 'Demon Hunter'
  | 'Druid'
  | 'Evoker'
  | 'Hunter'
  | 'Mage'
  | 'Monk'
  | 'Paladin'
  | 'Priest'
  | 'Rogue'
  | 'Shaman'
  | 'Warlock'
  | 'Warrior';

export type Faction = 'Alliance' | 'Horde';

export interface Character {
  id: string;
  name: string;
  realm: string;
  region: 'us' | 'eu';
  class: CharacterClass;
  spec: string;
  level: number;
  itemLevel: number;
  faction: Faction;
  race: string;
  avatarUrl?: string;
  renderUrl?: string;
  isMain?: boolean;
}

export interface WeeklyActivity {
  id: string;
  title: string;
  category: 'World Boss' | 'Pinnacle Quest' | 'Delve / Spark' | 'Event / Timewalking' | 'Reputation / Weekly';
  description: string;
  zone: string;
  rewardSummary: string;
}

export interface RaidLockout {
  id: string;
  name: string;
  expansion: string;
  bossCount: number;
  difficulties: ('LFR' | 'Normal' | 'Heroic' | 'Mythic')[];
  notableDrop?: string;
  isCurrentTier?: boolean;
}

export interface GreatVaultSlot {
  type: 'Raid' | 'Dungeon' | 'World';
  tier: 1 | 2 | 3;
  threshold: number; // e.g. 2, 4, 6 bosses or 1, 4, 8 dungeons/delves
  currentProgress: number;
  unlocked: boolean;
  rewardIlvl?: number;
}

export interface MountItem {
  id: string;
  name: string;
  icon: string;
  expansion: string;
  sourceType: 'Raid Drop' | 'Dungeon Drop' | 'Rare Spawn' | 'Vendor / Gold' | 'Achievement' | 'Reputation';
  zone: string;
  bossOrSource: string;
  dropRate?: string;
  notes: string;
  wowheadUrl: string;
  owned: boolean;
  isWishlist?: boolean;
  weeklyAttempts?: Record<string, boolean>; // characterId -> attempted this week
}

export interface PetItem {
  id: string;
  name: string;
  icon: string;
  family: 'Beast' | 'Dragonkin' | 'Flying' | 'Humanoid' | 'Magical' | 'Mechanical' | 'Undead' | 'Aquatic' | 'Elemental' | 'Critter';
  expansion: string;
  sourceType: 'Wild Battle Pet' | 'Raid Drop' | 'Vendor' | 'Achievement' | 'Quest';
  zone: string;
  notes: string;
  wowheadUrl: string;
  owned: boolean;
  level?: number;
  rarity?: 'Rare' | 'Uncommon' | 'Common';
}

export interface CharacterProgress {
  characterId: string;
  activitiesCompleted: Record<string, boolean>; // activityId -> boolean
  raidProgress: Record<string, { [difficulty: string]: number }>; // raidId -> { Heroic: 8, Normal: 8 }
  greatVault: {
    raidBosses: number;
    dungeons: number;
    delves: number;
  };
  notes?: string;
}
