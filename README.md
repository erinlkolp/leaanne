# ⚔️ Leaanne's WoW Companion

A personalized, modern **World of Warcraft Web Companion & Alt Tracker** designed to run seamlessly on a second monitor, tablet, or laptop while playing.

---

## 🚀 Quick Start on Windows (1-Click Run)

### Method 1: The 1-Click Launcher (Easiest)
1. Make sure you have **[Node.js](https://nodejs.org)** installed on your Windows machine (download the LTS version if you don't have it yet).
2. Double-click the **`start.bat`** file in this folder.
3. The script will automatically:
   - Verify Node.js is installed
   - Install dependencies if running for the first time
   - Launch your web browser to `http://localhost:3000`
   - Keep the local server running

### Method 2: Command Line
Open PowerShell or Command Prompt in this folder and run:
```bash
npm install
npm run dev
```
Then visit **`http://localhost:3000`** in your browser.

---

## ✨ Features

### 1. Weekly Reset & Lockout Matrix
* **Live Weekly Reset Countdown**: Automatically tracks time remaining until weekly reset for both **US (Tuesdays 15:00 UTC)** and **EU (Wednesdays 05:00 UTC)** with instant toggle.
* **The Great Vault Tracker**:
  * Track Raid bosses (2 / 4 / 6)
  * Mythic+ Dungeon completions (1 / 4 / 8)
  * Delves & World objectives (2 / 4 / 8)
  * Interactive `+` / `-` buttons that light up unlocked vault slots.
* **Weekly Activity Checklist**:
  * Weekly World Boss (*Kordac & seasonal bosses*)
  * Pinnacle Quests (*Special Assignments, Spark of Omens, Delver's Journey*)
  * Events (*Theater Troupe, Spreading The Light, Timewalking weekly cache*)
  * Harmonized Silk Catalyst charge check
* **Raid Lockouts**: Current-tier raid checklist (*Nerub-ar Palace*) plus legacy weekly farm runs (*Icecrown Citadel, Tempest Keep, Ulduar, Antorus, Return to Karazhan, Firelands*).
* **Character Scratchpad**: Save notes and gear priorities per character.

### 2. Mount & Pet Collector Hub
* **Weekly Farm Route**: Automatically filters rare drop mounts that she can farm this week across her alts (e.g. *Invincible, Ashes of Al'ar, Mimiron's Head, Midnight, Shackled Ur'zul*).
* **Per-Alt Attempt Logging**: Log which characters have run each raid/dungeon this week with a single click.
* **Battle Pet Roster**: Filterable battle pet collection with combat family types, acquisition guides, and combat utility notes (*Anubisath Idol, Chrominius, Unborn Val'kyr, Baa'l*).
* **Wowhead Integration**: One-click direct links to Wowhead item guides for drop maps and spawn coordinates.
* **Wishlist & Filter System**: Sort by Missing Only, Wishlist, Expansion, or search by zone/boss name.

### 3. Account-Wide Alt Matrix
* Side-by-side comparison table of all characters on her roster.
* At-a-glance check of World Boss status, Spark progress, Bountiful Delves, Great Vault unlocks, and legacy mount runs completed.
* Quick-switch button to jump right into any alt's weekly checklist.

### 4. Zero Hassle Data Persistence
* All progress, checkmarks, notes, and wishlist items are **automatically saved in the browser's local storage**.
* Refreshing the page or restarting your computer won't wipe progress.
* **Export / Import Backup**: One-click JSON backup export so she never loses her notes or collection records.
* **Fresh Week Reset**: One-click button to clear weekly checkboxes when Tuesday arrives.

---

## ⚡ Connecting the Battle.net API (Optional)

The companion comes preloaded with rich sample data so it works out of the box with zero setup. If you wish to connect live data from Blizzard:

1. Visit **[develop.battle.net](https://develop.battle.net)** and log in with your Blizzard account.
2. Go to **API Access** &rarr; **Create Client**.
3. Name it `WoW Companion` and set the Redirect URI to `http://localhost:3000`.
4. Click the **Battle.net API** button in the dashboard header and paste your **Client ID** and **Client Secret**.

---

## 🛠️ Tech Stack
* **Framework**: Next.js 16 (App Router)
* **UI**: React 19, Tailwind CSS v4, Lucide Icons
* **Language**: TypeScript
* **State**: LocalStorage with Export/Import JSON
