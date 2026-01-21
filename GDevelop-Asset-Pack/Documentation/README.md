# DJT: Devious Jezebel Trickery - GDevelop 5 Asset Pack

## Complete Asset Pack for Modern Mega Man-Inspired Platformers

**Version:** 1.0.0  
**Author:** DJT Team  
**License:** MIT  
**GDevelop Version:** 5.0.0+

---

## 📦 Overview

The DJT Asset Pack is a comprehensive collection of behaviors, scripts, and utilities designed to create Modern Mega Man-inspired platformer games in GDevelop 5. Built specifically for the **DJT: Devious Jezebel Trickery** game but fully reusable for any platformer project.

### What's Included

✅ **Advanced Player Movement** - Wall-sliding, dashing, double-jump, variable jump height  
✅ **Weapon System** - 7 unique weapons with switching, ammo management, and charge shots  
✅ **Enemy AI** - State-based AI with multiple enemy types and attack patterns  
✅ **Boss Battle System** - Multi-phase bosses with complex attack patterns  
✅ **HUD & UI** - Complete interface system with health bars, weapon display, mini-map  
✅ **Level Utilities** - Moving platforms, hazards, checkpoints, secret areas  
✅ **Progression System** - Upgrades, difficulty scaling, save/load  
✅ **Documentation & Examples** - Full guides and example scenes

---

## 🚀 Quick Start

### Installation

1. Download the DJT Asset Pack
2. In GDevelop 5, open your project
3. Go to **Extensions** → **Import Extension**
4. Navigate to the `GDevelop-Asset-Pack/Extensions/` folder
5. Import the extensions you need
6. Add behaviors to your objects in the scene editor

### Basic Setup (5 Minutes)

1. **Create Player Object**
   - Add a Sprite object named "Player"
   - Add the `DJT Platformer Movement` behavior
   - Add the `DJT Weapon Manager` behavior
   - Set up animations: Idle, Run, Jump, Fall, WallSlide, Dash

2. **Create Ground**
   - Add Platform objects for ground
   - Enable collision with Player

3. **Initialize HUD**
   - In scene events, at beginning:
   ```
   Call function: gdjs.initializeDJTHUD(runtimeScene)
   Call function: gdjs.initializeDJTProgression(runtimeScene)
   ```

4. **Run and Test!**
   - WASD/Arrows: Move
   - Space/W: Jump
   - LShift: Sprint
   - LCtrl: Dash
   - J/Left Mouse: Fire weapon
   - E/Q: Switch weapons

---

## 🎮 Core Systems

### 1. Player Movement System

**Extension:** `DJT_PlayerMovement.json`  
**Script:** `Scripts/DJT_PlayerMovement.js`

#### Features
- **Variable Jump Height:** Tap for short jump, hold for full jump
- **Double Jump:** Second jump in mid-air
- **Wall Slide:** Slide down walls, jump off at 45° angle
- **Dash:** Quick directional burst with cooldown
- **Sprint:** Hold Shift for 1.5x speed
- **Input Buffering:** 5-frame buffer for responsive controls

#### Configuration Parameters
```
Max Run Speed: 250 px/s
Sprint Speed: 375 px/s
Gravity: 600 px/s²
Jump Speed: 450 px/s
Dash Distance: 200 px
Dash Cooldown: 0.5 s
Wall Slide Speed: 80 px/s
Enable Double Jump: Yes
Input Buffer Frames: 5
```

#### Usage
1. Add behavior to player sprite
2. Configure parameters in behavior properties
3. In events, handle collision detection:
   ```
   Condition: Player is colliding with Ground
   Action: Call DJTPlatformerMovement.setOnGround(true)
   
   Condition: Player is colliding with Wall (left)
   Action: Call DJTPlatformerMovement.setOnWall(true, -1)
   ```

#### Controls
- **Left/Right** or **A/D**: Horizontal movement
- **Space** or **W** or **Up**: Jump
- **LShift**: Sprint
- **LCtrl**: Dash

---

### 2. Weapon System

**Extension:** `DJT_WeaponSystem.json`  
**Script:** `Scripts/DJT_WeaponSystem.js`

#### 7 Weapon Types

| Weapon | Damage | Ammo | Special Ability |
|--------|--------|------|-----------------|
| **Energy Shot** | 10 | ∞ | Fast, basic projectile |
| **Spark Chain** | 25 | 8 | Homing projectiles |
| **Gravity Well** | 15 | 6 | Slows enemies |
| **Plasma Beam** | 40 | 10 | Chargeable shot |
| **Decoy Clone** | 0 | 5 | Creates duplicate |
| **Sonic Pulse** | 20 | 7 | Knockback wave |
| **Fractal Mirror** | 30 | 10 | Reflects projectiles |

#### Features
- **Weapon Switching:** Press 1-7 or cycle with E/Q
- **Ammo Management:** Limited ammo, pickups refill
- **Charge Shots:** Hold fire button to charge (Plasma Beam)
- **Melee Attacks:** Press K for close-range strike
- **Cooldown System:** 0.3s base fire rate

#### Usage
1. Add behavior to player sprite
2. Unlock weapons via script:
   ```javascript
   weaponSystem.unlockWeapon(1); // Unlock Spark Chain
   ```
3. Handle projectile creation in events:
   ```
   Condition: Variable "ProjectileQueue" > 0
   Action: Create object from JSON data
   Action: Pop from ProjectileQueue
   ```

#### Controls
- **J** or **Left Mouse**: Fire weapon
- **K**: Melee attack
- **1-7**: Select weapon directly
- **E/Q**: Cycle weapons

---

### 3. Enemy AI System

**Extension:** `DJT_EnemyAI.json`  
**Script:** `Scripts/DJT_EnemyAI.js`

#### Enemy Types
- **Minion:** Fast, low HP (100), simple patterns
- **Elite:** Armored, medium HP (250), predictable patterns  
- **Boss:** High HP (varies), complex multi-phase patterns

#### AI States
1. **Idle:** Standing still
2. **Patrol:** Moving along path
3. **Alert:** Detected player, moving to attack
4. **Attack:** Executing attack pattern
5. **Flee:** Low HP, retreating (minions only)

#### Configuration
```
Enemy Type: minion/elite/boss
Max Health: 100
Damage: 10
Detection Radius: 300 px
Move Speed: 150 px/s
Attack Rate: 1.0 s
Telegraph Time: 0.5 s
```

#### Attack Patterns
- **Projectile:** Shoots at player
- **Melee:** Close-range strike
- **Summon:** Spawns additional minions

#### Usage
1. Add behavior to enemy sprite
2. Set enemy type and parameters
3. Handle damage in events:
   ```
   Condition: Enemy is colliding with PlayerProjectile
   Action: Call DJTEnemyAI.takeDamage(projectileDamage)
   ```

---

### 4. Boss Battle System

**Extension:** `DJT_BossBattle.json`  
**Script:** `Scripts/DJT_BossBattle.js`

#### Features
- **Multi-Phase System:** Up to 5 phases
- **Phase Transitions:** Automatic at HP thresholds (75%, 50%, 25%, 10%)
- **Attack Patterns:** Customizable per phase
- **Telegraph System:** Visual warnings before attacks
- **Weapon Drops:** Unlocks weapons on defeat

#### Attack Types
1. **Projectile Volley:** Multiple projectiles in spread pattern
2. **Homing:** Tracking projectiles
3. **Arena Hazard:** Spawn environmental dangers
4. **Summon Minions:** Spawn helper enemies
5. **Melee Rush:** Dash toward player
6. **Special:** Boss-specific unique attacks

#### Council Bosses (DJT Game)

##### Boss 1: Elara (Hacker)
- **Weapon Drop:** Spark Chain
- **Attacks:** Code projectiles, homing drones, arena shutdown
- **Arena:** Digital grid with moving platforms

##### Boss 2: Vesper (CEO)
- **Weapon Drop:** Gravity Well
- **Attacks:** Briefcase projectiles, summoned guards, power surge
- **Arena:** Executive office with falling furniture

##### Boss 3: Nyx (Scientist)
- **Weapon Drop:** Plasma Beam
- **Attacks:** Chemical blasts, toxic clouds, lab explosions
- **Arena:** Hazardous laboratory with conveyor belts

##### Boss 4: Lilith (Artist)
- **Weapon Drop:** Decoy Clone
- **Attacks:** Paint splashes, illusion clones, color-blind zones
- **Arena:** Chaotic art studio with shifting platforms

##### Boss 5: Zane (Tech CEO)
- **Weapon Drop:** Sonic Pulse
- **Attacks:** AI drones, app notifications, paranoia wave
- **Arena:** Yacht penthouse with hacking terminals

##### Boss 6: Council Avatar (Final)
- **Weapon Drop:** Fractal Mirror
- **Attacks:** Combination of all previous attacks
- **Arena:** Massive Council chamber, 5 phases

#### Usage
1. Add behavior to boss sprite
2. Configure boss properties:
   ```
   Boss Name: "Elara"
   Max Health: 250
   Phase Count: 3
   Attack Delay: 2.0
   Weapon Drop ID: 1
   ```
3. Start battle in events:
   ```
   Action: Call DJTBossBattle.startBattle()
   ```
4. Handle defeat:
   ```
   Condition: Boss health <= 0
   Action: Display weapon acquired message
   Action: Unlock weapon in progression system
   ```

---

### 5. HUD & UI System

**Extension:** `DJT_HUD.json`  
**Script:** `Scripts/DJT_HUD.js`

#### Components
- **Health Bar:** Red bar at top-left
- **Weapon Display:** Current weapon icon and ammo at top-center
- **Mini-Map:** Level overview at top-right
- **Hack Points:** Score counter at bottom-left
- **Boss Health Bar:** Large bar at top during boss fights
- **Dialogue Box:** Center-screen for story dialogue
- **Pause Menu:** P or Esc to pause
- **Settings Menu:** Volume, controls, graphics
- **Damage Numbers:** Floating numbers on hits
- **Screen Effects:** Shake and freeze frames

#### Screen Effects
- **Screen Shake:** Camera shake on damage
- **Hit Freeze:** 0.05s time slow on hits for impact
- **Damage Numbers:** Floating numbers showing damage dealt

#### Usage
Initialize at scene start:
```javascript
gdjs.initializeDJTHUD(runtimeScene);
```

Update each frame:
```javascript
gdjs.DJTHUDManager.update(dt);
```

Trigger effects:
```javascript
// Player takes damage
gdjs.DJTHUDManager.onHit(damage);

// Boss takes damage
gdjs.DJTHUDManager.onBossDamage(damage, x, y);

// Show boss health bar
gdjs.DJTHUDManager.showBossHealthBar("Elara", 250);
```

---

### 6. Level Design Utilities

**Extension:** `DJT_LevelUtils.json`  
**Script:** `Scripts/DJT_LevelUtils.js`

#### Available Utilities

##### Moving Platform
- Waypoint-based movement
- Configurable speed and pause time
- Loop or ping-pong patterns

##### Crumbling Block
- Breaks after player stands on it (configurable time)
- Optional respawn
- Warning shake effect

##### Conveyor Belt
- Pushes player in direction
- Configurable speed
- Visual texture scrolling

##### Spike Trap
- Instant death or damage
- Optional retractable (timed on/off)
- Warning animations

##### Laser Grid
- Timed on/off cycles
- Telegraph warning
- Configurable damage

##### Checkpoint
- Saves player progress
- Visual activation effect
- Respawn point on death

##### Secret Area
- Hidden collectibles/bonuses
- Rewards: Hack Points, Health, Ammo, Lore
- Discovery notification

##### Environmental Hazard
- Lava, acid, toxic water, etc.
- Damage over time or instant death
- Visual effects

#### Usage Example: Moving Platform
```javascript
// Create moving platform
const platform = runtimeScene.createObject("MovingPlatform");
const movingBehavior = new gdjs.DJTMovingPlatform(runtimeScene, platform, {
  Speed: 100,
  Loop: true,
  PauseTime: 1.0
});

// Add waypoints
movingBehavior.addWaypoint(500, 300);
movingBehavior.addWaypoint(700, 300);
movingBehavior.addWaypoint(700, 500);
movingBehavior.addWaypoint(500, 500);
```

---

### 7. Progression System

**Extension:** `DJT_Progression.json`  
**Script:** `Scripts/DJT_Progression.js`

#### Features
- **Hack Points:** Currency for upgrades
- **Upgrade System:** 7 upgrade categories
- **Difficulty Scaling:** 4 difficulty levels
- **Save/Load:** Automatic save system
- **Progress Tracking:** Bosses, secrets, lore

#### Upgrades

| Upgrade | Max Level | Total Cost | Effect |
|---------|-----------|------------|--------|
| **Max Health Boost** | 5 | 2000 | +70 total HP |
| **Quick Swap** | 3 | 1100 | -0.2s weapon swap |
| **Rapid Dash** | 3 | 1300 | -0.35s dash cooldown |
| **Wall Grip** | 3 | 900 | -45 px/s slide speed |
| **Quick Charge** | 3 | 1400 | -0.6s charge time |
| **Power Up** | 5 | 2800 | +70% damage |
| **Ammo Conservation** | 3 | 1600 | +70% save chance |

#### Difficulty Levels

| Difficulty | Player HP | Enemy Damage | Enemy HP | Points |
|------------|-----------|--------------|----------|--------|
| **Easy** | +50% | -50% | -20% | -20% |
| **Normal** | 100% | 100% | 100% | 100% |
| **Hard** | -25% | +100% | +50% | +50% |
| **Nightmare** | -50% | +200% | +100% | +100% |

#### Usage
Initialize system:
```javascript
gdjs.initializeDJTProgression(runtimeScene);
```

Award points:
```javascript
gdjs.DJTProgressionHelpers.addHackPoints(100);
```

Purchase upgrade:
```javascript
const result = gdjs.DJTProgressionHelpers.purchaseUpgrade("maxHP");
if (result.success) {
  // Show success message
} else {
  // Show error message
}
```

Set difficulty:
```javascript
gdjs.DJTProgressionHelpers.setDifficulty("Hard");
```

Track progress:
```javascript
const progression = gdjs.DJTProgressionManager;
progression.markBossDefeated("Elara", 1);
progression.markLevelCompleted(1);
progression.markSecretFound(3);
```

---

## 🎨 Visual Style Guide

### Neon Cyberpunk Comic Book Aesthetic

**Color Palette:**
- **Bright Pink:** #FF1493 (primary accent)
- **Electric Blue:** #00D4FF (secondary accent)
- **Deep Purple:** #4B0082 (tertiary accent)
- **Acid Green:** #00FF00 (highlight)
- **Dark Charcoal:** #1A1A1A (background)

**Art Style:**
- Bold outlines on all sprites
- High contrast for readability
- Glow effects on UI elements
- Neon text shadows
- Motion blur on fast projectiles
- Comic book style expressions

**Animation Requirements:**
- Player: Idle, Run, Jump, Fall, WallSlide, Dash, Attack, Hurt
- Enemies: Idle, Walk, Telegraph, Attack, Hurt, Death
- Bosses: Idle, Transition, Telegraph, Attack (multiple), Hurt, Defeat

---

## 🎵 Audio Guide

### Music Tracks (8 Total)
1. **Main Hub:** Calm, exploratory, 120 BPM, electronic
2-7. **Level Themes:** Upbeat synth-heavy, 130-150 BPM
8. **Boss Battle:** Intense drum-heavy, 160 BPM

### Sound Effects
- **Movement:** Jump (8-bit), Dash (whoosh), Land (thud)
- **Combat:** Weapon fire (varies), Hit (punch), Enemy defeat (ascending tones)
- **UI:** Menu selection (beep), Pause (soft chime), Level complete (fanfare)
- **Boss:** Telegraph (warning), Phase transition (dramatic), Defeat (epic fanfare)

---

## 📁 File Structure

```
GDevelop-Asset-Pack/
├── package.json                    # Asset pack metadata
├── Extensions/                     # GDevelop extensions
│   ├── DJT_PlayerMovement.json
│   ├── DJT_WeaponSystem.json
│   ├── DJT_EnemyAI.json
│   ├── DJT_BossBattle.json
│   ├── DJT_HUD.json
│   ├── DJT_LevelUtils.json
│   └── DJT_Progression.json
├── Scripts/                        # JavaScript implementations
│   ├── DJT_PlayerMovement.js
│   ├── DJT_WeaponSystem.js
│   ├── DJT_EnemyAI.js
│   ├── DJT_BossBattle.js
│   ├── DJT_HUD.js
│   ├── DJT_LevelUtils.js
│   └── DJT_Progression.js
├── Prefabs/                        # Reusable object templates
│   └── (to be added with sprites)
├── Examples/                       # Example scenes
│   └── (to be added)
└── Documentation/
    ├── README.md                   # This file
    ├── QUICK_START.md              # Quick start guide
    ├── API_REFERENCE.md            # Detailed API docs
    └── BOSS_GUIDE.md               # Boss creation guide
```

---

## 🔧 Technical Specifications

### Performance
- **Target Frame Rate:** 60 FPS
- **Max Simultaneous Entities:** 50 (enemies + projectiles + particles)
- **Memory Target:** Under 200MB
- **Load Times:** Level transitions under 2 seconds

### Optimization
- **Object Pooling:** For projectiles and particles
- **Collision Optimization:** Use object groups
- **Culling:** Off-screen object deactivation
- **Asset Management:** Compressed sprites, optimized audio

### Compatibility
- **Platforms:** Web (HTML5), Windows, macOS, Linux
- **Mobile:** Optional touch controls (to be added)
- **Controllers:** Gamepad support (to be added)

---

## 🎯 Best Practices

### Level Design
1. Place checkpoints every 400-600 pixels
2. Telegraph all hazards visually
3. Test jump distances carefully
4. Balance difficulty curve gradually
5. Hide secrets in logical but non-obvious places

### Boss Design
1. Start with simple patterns in phase 1
2. Increase complexity each phase
3. Give players 2-3 seconds between attacks
4. Telegraph all attacks clearly
5. Test pattern fairness extensively

### Performance
1. Limit active projectiles to 20
2. Use sprite sheets for animations
3. Compress audio files
4. Test on target hardware early
5. Profile regularly during development

---

## 🚨 Troubleshooting

### Player Falls Through Platforms
- Ensure Platform behavior is on ground objects
- Check collision masks overlap correctly
- Verify player has Platform Character behavior OR custom movement is handling collisions

### Weapons Not Firing
- Check that `ProjectileQueue` variable exists
- Verify weapon is unlocked: `weaponSystem.isWeaponUnlocked(index)`
- Confirm ammo is available
- Check fire rate cooldown

### Boss Not Taking Damage
- Verify boss is not invulnerable (during phase transition)
- Check collision between projectile and boss
- Ensure `takeDamage()` is called in events
- Confirm damage calculation is correct

### HUD Not Displaying
- Ensure `gdjs.initializeDJTHUD()` is called
- Check that HUD objects exist in scene
- Verify layer visibility
- Call `update()` each frame

### Save Data Not Persisting
- Check browser localStorage permissions
- Verify `saveGameData()` is called after changes
- Test in published build (may not work in preview)
- Check console for save errors

---

## 📚 Additional Resources

### Example Projects
- **DJT Full Game:** Complete implementation (coming soon)
- **Simple Platformer:** Basic setup tutorial (coming soon)
- **Boss Rush Mode:** Boss battle showcase (coming soon)

### Community
- **GitHub Repository:** [github.com/djt-team/gdevelop-asset-pack](#)
- **Discord Server:** [discord.gg/djt](#)
- **Forums:** [forum.gdevelop.io/djt](#)

### Documentation
- **API Reference:** Detailed method documentation
- **Video Tutorials:** Step-by-step guides
- **Boss Creation Guide:** How to create custom bosses
- **Level Design Tips:** Best practices

---

## 📄 License

MIT License - Free to use in personal and commercial projects.

---

## 🙏 Credits

**Created by:** DJT Team  
**Based on:** DJT: Devious Jezebel Trickery design documents  
**Inspired by:** Mega Man series, Mega Man X, Mega Man 11, Mega Man 12

---

## 📧 Support

For support, questions, or feedback:
- **Email:** support@djt-game.com
- **GitHub Issues:** [github.com/djt-team/gdevelop-asset-pack/issues](#)
- **Discord:** [discord.gg/djt](#)

---

**Version 1.0.0** | Last Updated: January 2026
