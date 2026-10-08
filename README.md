# ⚔️ LeaAnne's WoW Companion

A personalized, modern **World of Warcraft Web Companion & Alt Tracker** designed for LeaAnne to keep open on a second monitor, tablet, or laptop while adventuring across Azeroth.

---

## 🚀 Quick Start on Windows (1-Click Run)

### Method 1: The 1-Click Launcher (Easiest)
1. Make sure you have **[Node.js](https://nodejs.org)** installed on your Windows machine (download the **LTS** version if you don't have it yet).
2. Double-click the **`start.bat`** file in this folder.
3. The script will automatically:
   - Verify Node.js is installed
   - Install dependencies on first run
   - Open your browser directly to `http://localhost:3000`
   - Keep the local server running

### Method 2: PowerShell
Right-click **`start.ps1`** and choose **Run with PowerShell**, or open PowerShell in this directory and run:
```powershell
.\start.ps1
```

### Method 3: Command Prompt / Terminal
```bash
npm install
npm run dev
```
Then visit **`http://localhost:3000`** in your browser.

---

## 🔑 How to Obtain Blizzard API Credentials (Step-by-Step)

The companion comes pre-loaded with rich sample data for LeaAnne so it works completely offline right out of the box. 

When you want to connect live character and armory data directly from Blizzard's servers, follow these steps to obtain a free API key in ~2 minutes:

### Step 1: Sign In to Blizzard Developer Portal
1. Go to **[develop.battle.net](https://develop.battle.net)**.
2. Click **Log In** in the top right and sign in with your regular Battle.net account.

### Step 2: Create an API Client
1. Once logged in, click your profile in the top-right corner and select **API Access** (or navigate to `https://develop.battle.net/access/clients`).
2. Click the blue **Create Client** button.

### Step 3: Configure the Client Details
Fill out the client creation form:
* **Client Name**: `LeaAnne WoW Companion`
* **Redirect URLs**: `http://localhost:3000`
* **Service URL** *(optional)*: `http://localhost:3000`
* **Intended Use**: Select *Personal / Non-commercial*
* Check the box agreeing to the API Terms of Use, then click **Save**.

### Step 4: Copy Your Credentials
1. Under your new client, copy your **Client ID** (a long alphanumeric string).
2. Click **Generate Secret** (or **Show Secret**) and copy your **Client Secret**.

### Step 5: Add Credentials to Your App

You have two simple ways to provide these credentials:

#### Option A: Via `.env.local` File (Recommended for Local Dev)
1. In the project root, make a copy of `.env.example` and name it `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` in Notepad or your text editor and paste your credentials:
   ```env
   BLIZZARD_CLIENT_ID=your_actual_client_id_here
   BLIZZARD_CLIENT_SECRET=your_actual_client_secret_here
   BLIZZARD_REGION=us
   ```
3. Save the file and restart the app (`start.bat`).

#### Option B: Via the In-App Settings Modal
1. In the dashboard header, click the blue **Battle.net API** button.
2. Paste your **Client ID** and **Client Secret**.
3. Click **Test & Save Credentials** to verify a successful OAuth handshake with Blizzard's servers.

---

## 🔒 Security & Git Credential Protection

Your Blizzard API secrets and personal account data will **never be leaked to Git**:

* A strict [`.gitignore`](file:///.gitignore) is pre-configured in this repository.
* It explicitly excludes:
  * `.env`, `.env.local`, `.env*.local`
  * `credentials.json`, `client_secret*.json`, `*.token`, `*secret*.txt`, `*bnet*.key`
  * Local backup exports (`wow-companion-backup*.json`)
* Only the dummy template [`.env.example`](file:///.env.example) (with placeholder values) is tracked by Git.

---

## ✨ Features Built for LeaAnne

### 1. 🛡️ Weekly Reset & Lockout Matrix
* **Live Weekly Reset Countdown**: Live countdown timer for both **US (Tuesdays 15:00 UTC)** and **EU (Wednesdays 05:00 UTC)** with a 1-click region toggle.
* **The Great Vault Tracker**:
  * Track Raid bosses (2 / 4 / 6)
  * Mythic+ Dungeon completions (1 / 4 / 8)
  * Delves & World objectives (2 / 4 / 8)
  * Visual glowing vault chests light up as requirements are met.
* **Weekly Activity Checklist**:
  * Weekly World Boss (*Kordac & seasonal bosses*)
  * Pinnacle Quests (*Special Assignments, Spark of Omens, Delver's Journey*)
  * Events (*Theater Troupe, Spreading The Light, Timewalking weekly cache*)
  * Harmonized Silk Catalyst charge check
* **Raid Lockouts**: Current-tier raid checklist (*Nerub-ar Palace*) plus legacy weekly farm runs (*Icecrown Citadel, Tempest Keep, Ulduar, Antorus, Return to Karazhan, Firelands*).
* **Character Scratchpad**: Save notes and gear priorities per character.

### 2. 🐎 Mount & Pet Collector Hub
* **Weekly Farm Route**: Automatically filters rare drop mounts that she can farm this week across her alts (*Invincible, Ashes of Al'ar, Mimiron's Head, Midnight, Shackled Ur'zul*).
* **Per-Alt Attempt Logging**: Log which characters have run each raid/dungeon this week with a single click (e.g. `[✓] Run on LeaAnne`).
* **Battle Pet Roster**: Filterable battle pet collection with combat family types, acquisition guides, and battle advice (*Anubisath Idol, Chrominius, Unborn Val'kyr, Baa'l*).
* **Wowhead Integration**: One-click direct links to Wowhead item guides for drop maps and spawn coordinates.
* **Wishlist & Filter System**: Sort by Missing Only, Wishlist, Expansion, or search by zone/boss name.

### 3. 👥 Account-Wide Alt Matrix
* Side-by-side comparison table of all characters on her roster.
* At-a-glance check of World Boss status, Spark progress, Bountiful Delves, Great Vault unlocks, and legacy mount runs completed.
* Quick-switch button to jump right into any alt's weekly checklist.

### 4. 💾 Zero-Hassle Data Persistence
* All progress, checkmarks, notes, and wishlist items are **automatically saved in the browser's local storage**.
* Refreshing the page or restarting your computer won't wipe progress.
* **Export / Import Backup**: One-click JSON backup export so she can back up or transfer her records between computers.
* **Fresh Week Reset**: One-click button to clear weekly checkboxes when Tuesday arrives.

---

## 🛠️ Tech Stack
* **Framework**: Next.js 16 (App Router)
* **UI**: React 19, Tailwind CSS v4, Lucide Icons
* **Language**: TypeScript
* **State & Storage**: LocalStorage with Export/Import JSON
* **API Integration**: Next.js Server Route (`/api/blizzard/sync`) with Battle.net OAuth2 Client Credentials
