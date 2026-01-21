# **DJT: Devious Jezebel Trickery \- Platformer Game**

## **GDevelop 5 AI Builder Prompt Engineering Document**

---

## **EXECUTIVE SUMMARY**

Create a Modern Mega Man-inspired platformer game based on the DJT webcomic. The game features a playable protagonist fighting against targets from the Council's schemes. Each level is a themed stage representing different trolls/targets. Gameplay combines tight platforming controls, boss encounters, and weapon variety. Target complexity: AAA indie standard with polished mechanics.

---

## **SECTION 1: CORE GAME CONCEPT**

### **Primary Prompt for AI Builder:**

"Build a 2D side-scrolling platformer game inspired by Modern Mega Man (Mega Man 11, Mega Man 12\) and Mega Man X series. The game is titled 'DJT: Devious Jezebel Trickery.' The player controls a female protagonist—a resistance fighter infiltrating the Council's operations to expose their schemes. The game has 6 main levels (each representing a different Council member's domain), a hub world, and a final boss confrontation. Use vibrant, high-contrast art style with neon accents (pinks, purples, blues) against dark backgrounds, matching the webcomic's aesthetic. Implement tight platforming mechanics with wall-sliding, dashing, and multiple weapon pickups. Include boss battles where the player adapts strategies based on the boss's attack patterns."

### **Key Thematic Elements:**

* **Protagonist**: A skilled infiltrator fighting against arrogance and corruption  
* **Settings**: Corporate tower, underground lab, hacker den, manipulative CEO's penthouse, artist's chaos studio, sci-fi facility  
* **Tone**: Dark satire meets action, witty dialogue in story sequences, high energy during combat  
* **Visual Identity**: Neon cyberpunk meets comic book art; exaggerated character expressions

---

## **SECTION 2: DETAILED GAME MECHANICS**

### **2.1 Player Movement & Controls**

**Prompt for AI Builder:**

"Implement responsive platformer movement controls: WASD or Arrow Keys for left/right movement with variable jump height (short tap \= short jump, held \= full jump). Jumping should feel snappy with 5-frame input buffer for wall jump detection. Add a double-jump ability. Implement a dash mechanic: Shift or Space (configurable) for a quick directional dash with 0.5-second cooldown. Add wall-slide mechanic: When touching a wall mid-air, player slides down slowly. Wall jump: Jump away from wall at 45-degree angle. All movement should feel tight and responsive like Mega Man 11\. Include sprint capability: Hold Shift to move faster (1.5x speed). Deceleration should feel natural with slight momentum on landing."

**Specific Requirements:**

* Jump height: 150-200 pixels  
* Max run speed: 250 pixels/sec  
* Dash distance: 200 pixels, instant acceleration  
* Wall-slide speed: 80 pixels/sec downward  
* Gravity: 600 pixels/sec²

### **2.2 Combat System**

**Prompt for AI Builder:**

"Design a weapon pickup and switching system similar to Mega Man. The player starts with a basic projectile weapon (Energy Shot). Each of the 6 bosses drops a unique weapon upon defeat with special mechanics: 1\) Spark Chain (homing projectiles), 2\) Gravity Well (slows enemies), 3\) Plasma Beam (charged shots), 4\) Decoy Clone (duplicates player), 5\) Sonic Pulse (knocks back enemies), 6\) Fractal Mirror (reflects projectiles). Weapon switching: Use E/Q keys or number keys 1-6. Each weapon has limited ammunition (recharges slowly or from pickups). Melee attacks: Click/Space near enemy for a close-range strike (fast, low damage). Implement a cooldown system: Each weapon has a 0.3-second fire rate. Players can hold down mouse/key to charge certain weapons. Include environmental hazards that interact with weapons (e.g., Gravity Well slows moving platforms)."

**Weapon Balance:**

* Basic shot: Fast, infinite ammo, low damage  
* Special weapons: Limited ammo, high damage, unique effects  
* Melee: Quick, low damage, short range

### **2.3 Enemy Design**

**Prompt for AI Builder:**

"Create 3 categories of enemies: 1\) Minions (fast, low HP, easy patterns), 2\) Elites (armored, medium HP, predictable patterns), 3\) Bosses (high HP, complex multi-phase patterns, dialogue). Minions include: Drones (hover and shoot), Sentries (stationary turrets), Cultists (melee attackers). Elites include: Shielded Guards, Rocket Launchers, Teleporting Ninjas. All enemies should have telegraphed attacks (visual wind-up, color flash before projectiles). Implement AI states: Idle, Patrol, Alert, Attack, Flee. Enemies should react to player position with a 300-pixel detection radius. Include sound effects for all enemy actions. Boss battles should have distinct phases with attack pattern changes at 75%, 50%, and 25% HP. Bosses should have 2-3 second attack delays for counterplay."

### **2.4 Level Design**

**Prompt for AI Builder:**

"Design 6 main levels plus a tutorial and final boss stage. Each level is 2000+ pixels wide with multiple vertical sections. Implement environmental variety: moving platforms, crumbling blocks (break after 1-2 seconds), conveyor belts, spike traps, lava pits (instant death), laser grids. Include 2-3 secret areas per level with optional pickups or lore items. Levels should escalate in difficulty: Level 1 (tutorial basics), Levels 2-4 (intermediate, learn new mechanics), Levels 5-6 (advanced, combined mechanics). Place checkpoints every 400-600 pixels horizontally to avoid excessive backtracking. Implement a visual progression indicator (mini-map on HUD showing checkpoint and boss location)."

**Level Themes:**

1. **Hacker's Den**: Neon grids, moving data blocks, digital aesthetic  
2. **Corporate Tower**: Glass platforms, falling elevators, office hazards  
3. **Secret Lab**: Crumbling structures, chemical pools, unstable tech  
4. **CEO's Penthouse**: Luxury environment twisted into danger, height-based challenges  
5. **Art Studio Chaos**: Unpredictable hazards, illusions, color-shift mechanics  
6. **Council Chamber**: Combination of all previous mechanics, multi-stage boss arena

### **2.5 Progression & Upgrades**

**Prompt for AI Builder:**

"Implement a progression system: Players earn 'Hack Points' from defeating enemies and collecting items (100 points per minion, 250 per elite, 500 per boss). In the hub world, players spend Hack Points at an upgrade terminal to unlock: \+5 HP, faster weapon swap (0.2 → 0.15 sec), dash cooldown reduction, wall-slide speed increase, charge shot capacity. Each upgrade costs 200-500 points progressively. Also implement a difficulty modifier system: Easy (1.5x HP, 0.5x enemy damage), Normal (baseline), Hard (2x enemy damage, 0.75x player HP), Nightmare (3x enemy damage, randomized enemy placements). Display current stats on hub HUD."

---

## **SECTION 3: BOSS BATTLES (Council Members)**

### **Boss Battle Template for AI Builder:**

**Prompt:**

"Create 6 distinct boss battles, one per Council member. Each boss should have 3 phases with unique attack patterns. Bosses should use the arena effectively (300+ pixels tall and wide). Include telegraph animations (2-3 frames of wind-up before attacks). Boss attack types: Projectile volleys (3-5 projectiles), homing attacks (track player for 2-3 seconds), arena hazards (spawn during fight), summon minions (3-5 weak enemies at phase changes). Implement a health bar HUD at top, with damage numbers floating above bosses. Each boss should have 150-250 HP on Normal difficulty. After defeating a boss, play a 3-second victory animation, then display 'Acquired \[Weapon Name\]\!' with weapon description. Include post-defeat dialogue (2-3 lines from defeated boss and player). Store boss-defeat status to prevent re-fighting."

### **Individual Boss Specifications:**

**Boss 1 \- Elara (Hacker):**

* Attacks: Code projectiles, homing drones, arena shutdown (darkens screen briefly)  
* Weapon Drop: Spark Chain (homing projectiles, 8 ammo)  
* Arena: Digital grid with moving platforms

**Boss 2 \- Vesper (CEO):**

* Attacks: Briefcase projectiles, summoned guards, power surge (pushes player)  
* Weapon Drop: Gravity Well (slowing field, 6 ammo)  
* Arena: Executive office with falling furniture

**Boss 3 \- Nyx (Scientist):**

* Attacks: Chemical blasts, toxic clouds, lab explosions  
* Weapon Drop: Plasma Beam (charged shot, 10 ammo)  
* Arena: Hazardous laboratory with conveyor belts

**Boss 4 \- Lilith (Artist):**

* Attacks: Paint splashes (spread on hit), illusion clones (3 decoys), color-blind zones  
* Weapon Drop: Decoy Clone (creates duplicate, 5 ammo)  
* Arena: Chaotic art studio with platforms that shift color

**Boss 5 \- Zane (Tech CEO from Episode 1):**

* Attacks: AI-controlled drones, app notifications (slow player), paranoia wave (inverts controls)  
* Weapon Drop: Sonic Pulse (knockback wave, 7 ammo)  
* Arena: Yacht penthouse with hacking terminals

**Boss 6 \- Council Avatar (Final Boss):**

* Attacks: Combination of all previous boss attacks, summons minions, multi-phase (5 phases, 350 HP)  
* Weapon Drop: Fractal Mirror (reflects projectiles, 10 ammo)  
* Arena: Massive Council chamber with dynamic hazards

---

## **SECTION 4: HUD & UI SYSTEMS**

### **Prompt for AI Builder:**

"Create a persistent HUD with the following elements: 1\) Health bar (top-left, red with white outline), 2\) Current weapon display (top-center, shows weapon icon and remaining ammo), 3\) Mini-map (top-right, 150x100 pixels, shows player position, checkpoints, boss location, collectibles), 4\) Score/Hack Points counter (bottom-left), 5\) Weapon wheel (press Tab to open, shows all collected weapons with icons). Implement pause menu: Press P or Esc to pause, show resume/settings/main menu buttons. Settings menu should allow: Master volume, music toggle, SFX volume, control remapping, difficulty selection, graphics options (resolution, fullscreen). Death screen: Show 'You Were Defeated' with retry/return-to-hub options. Boss health bars: Large health bar above boss during boss fights, with boss name on left. Dialogue box system: Center-screen text boxes for story dialogue, fade in/out over 0.5 seconds, auto-advance or click-to-continue. Implement visual juice: Screen shake on hits (0.1 second), hit freeze frames (0.05 second pause on impact), floating damage numbers (scrolling upward, fade out)."

---

## **SECTION 5: AUDIO & VISUAL STYLE**

### **Visual Prompt for AI Builder:**

"Use a neon cyberpunk comic book art style. Primary colors: Bright pink (\#FF1493), electric blue (\#00D4FF), deep purple (\#4B0082), acid green (\#00FF00) against dark charcoal backgrounds (\#1a1a1a). Player character: Female protagonist with sharp features, cyan and pink color palette, expressive eyes. Enemies: Bold outlines, exaggerated shapes. Bosses: 256x256 pixel sprites minimum, detailed with 8-16 animation frames per attack. Projectiles: Glowing effects with motion blur. Platforms: High contrast, clearly defined edges. Environmental effects: Glow, particles for explosions, screen distortion for sci-fi events. UI: Pixel-perfect fonts, neon text shadows, glowing buttons."

### **Audio Prompt for AI Builder:**

"Create 8 music tracks: 1\) Main Hub (calm, exploratory, electronic 120 BPM), 2-7) Level themes (upbeat, synth-heavy, 130-150 BPM, remixes of core melody with level-specific instruments), 8\) Boss Battle theme (intense, drum-heavy, 160 BPM with pause sections). Implement dynamic music: Music speeds up during boss second phase, slows during low-HP sections. Sound effects: Jumping (8-bit jump sound, 100ms), weapon fire (varies by weapon: 150ms), enemy hit (punch sound), enemy defeat (ascending tones), boss defeat (epic 2-second fanfare), damage taken (hurt tone \+ pitch drop). UI sounds: Menu selection (beep), pause (soft chime), level complete (victory fanfare). All audio should support stereo panning based on projectile position (left/right channels). Implement volume ducking: Music reduces 20% during dialogue."

---

## **SECTION 6: STORY & NARRATIVE INTEGRATION**

### **Narrative Prompt for AI Builder:**

"Implement a story structure integrated into gameplay. Hub World: Shows three terminals—Level Select (access any completed level or new ones in order), Upgrade Shop (spend Hack Points), Lore Terminal (read 2-3 sentence descriptions of each Council member and the player's mission). Before each level: 1-2 sentence briefing explaining why this target is being infiltrated. During levels: Hidden lore collectibles (e-mails, encrypted files) that unlock bonus dialogue when collected (10 total, 2-3 per level). Boss intro: Pre-battle dialogue (2-3 exchanges between player and boss), 3-second video/animation. Boss defeat: Defeated boss provides information about the Council's next move. Final boss intro: Extended cinematicsequence (15-20 seconds) showing the Council's master plan, player's determination. Post-game: Credits roll with webcomic-style art panels showing the Council's downfall and world implications."

---

## **SECTION 7: TECHNICAL SPECIFICATIONS**

### **Performance & Compatibility Prompt:**

"Optimize for browsers and desktop (Windows, Mac, Linux). Target frame rate: 60 FPS. Ensure smooth gameplay with max 50 simultaneous entities (enemies \+ projectiles \+ particles). Implement object pooling for projectiles and particles to avoid garbage collection stutters. Memory target: Under 200MB for full game. Load times: Level transitions under 2 seconds. Implement auto-save on boss defeat and level completion. Save data should store: Boss completion status, obtained weapons, Hack Points, current health, difficulty setting. Ensure pixel-perfect collision detection for platforming precision."

### **File Structure Prompt:**

"Organize assets in GDevelop as follows: Sprites folder (Player, Enemies/Bosses, Projectiles, Platforms, UI elements), Animations folder (idle, run, jump, attack, hurt for all characters), Audio folder (Music, SFX), Scenes folder (MainMenu, HubWorld, Level1-6, BossBattles, FinalBoss, GameOver, Victory). Use naming conventions: \[Type\]*\[Name\]*\[State\] (e.g., Enemy\_Drone\_Idle, Boss\_Elara\_Phase1). Create object groups: Enemies, Projectiles, Platforms, Hazards for efficient collision detection."

---

## **SECTION 8: EXTENDED FEATURES (Post-Launch)**

### **Future Content Prompt:**

"Plan for post-launch updates: New Game+ mode (2x enemy health, 1.5x enemy speed, new weapon variations), Daily Challenge mode (random level generator with modifiers, leaderboard), Character skins (alternative player designs based on webcomic art), Boss Rush mode (fight all bosses consecutively for speedrun records), Endless mode (survive infinite enemy waves), Crossover episodes (tease future webcomic seasons through Easter eggs and hidden scenes)."

---

## **SECTION 9: TESTING CHECKLIST**

### **Quality Assurance Prompt:**

"Verify the following during testing: 1\) Movement feels responsive, no input lag. 2\) Jump physics are consistent and predictable. 3\) Hitboxes match sprite visuals within 5 pixels. 4\) Bosses follow intended attack patterns without AI bugs. 5\) All weapons function correctly with ammo limits. 6\) Difficulty scaling feels balanced (playable on Easy, challenging on Hard). 7\) No game-breaking bugs or sequence breaks. 8\) Audio syncs with visuals, no stuttering. 9\) Save/load functionality persists correctly. 10\) Accessibility: Ensure colorblind-friendly mode, rebindable controls, subtitle support for all dialogue."

---

## **SECTION 10: PROMPT DELIVERY INSTRUCTIONS**

### **How to Use This Document in GDevelop 5 AI Builder:**

1. **Copy each section's prompt** into the GDevelop AI Builder input field  
2. **Use context from Section 1** as the foundation; provide it first  
3. **Follow with specific sections** (Mechanics 2.1-2.5, Bosses, HUD, Audio/Visual) for detailed implementation  
4. **Request iterative refinement**: "Refine \[Section X\] by \[specific requirement\]"  
5. **Ask for troubleshooting**: If generated code has bugs, ask AI: "The \[feature\] is not working as expected. Fix \[specific issue\]."  
6. **Test after major additions**: Generate one section, test in preview, then add the next section  
7. **Use screenshots/descriptions**: Ask AI Builder to generate visual mockups or describe asset requirements

---

## **FINAL INTEGRATION NOTE**

This document bridges the DJT webcomic narrative into an action-packed platformer. The game celebrates the Council through enemy designs and boss encounters while casting the player as a resistance fighter—creating thematic coherence between comic and game. The Modern Mega Man framework ensures tight gameplay that feels polished and professional-grade.

**Target Completion Time**: 6-8 weeks for core game, with post-launch content planned.

**Recommended Approach**: Start with Sections 2.1-2.3 (core movement/combat), test heavily, then add levels and bosses sequentially.

