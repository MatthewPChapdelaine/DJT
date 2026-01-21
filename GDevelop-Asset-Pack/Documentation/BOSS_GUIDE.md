# DJT Boss Creation Guide

## Complete Guide to Creating Epic Boss Battles

This guide will teach you how to create compelling, multi-phase boss battles using the DJT Boss Battle system.

---

## Table of Contents
1. [Boss Design Philosophy](#boss-design-philosophy)
2. [Setting Up a Basic Boss](#setting-up-a-basic-boss)
3. [Creating Custom Attack Patterns](#creating-custom-attack-patterns)
4. [Multi-Phase Design](#multi-phase-design)
5. [Boss-Specific Mechanics](#boss-specific-mechanics)
6. [Testing and Balancing](#testing-and-balancing)
7. [Council Boss Templates](#council-boss-templates)

---

## Boss Design Philosophy

### The Three Pillars of Great Boss Fights

1. **Readability:** Players must clearly see what's happening
   - Telegraph all attacks with visual cues
   - Use distinct colors for different attack types
   - Provide audio cues for major attacks

2. **Fairness:** Challenges should be skill-based, not luck-based
   - Give 2-3 seconds between attacks for counterplay
   - Ensure attacks are dodgeable
   - Avoid instant-death mechanics (except as environmental hazards)

3. **Escalation:** Difficulty should increase gradually
   - Phase 1: Learn basic patterns
   - Phase 2: Combine patterns, add new mechanics
   - Phase 3: All patterns together at faster pace

### Modern Mega Man Boss Design
- **Pattern Memorization:** Each attack has a specific timing
- **Adaptive Difficulty:** Bosses react to player position
- **Weapon Weaknesses:** Certain weapons deal bonus damage
- **Counterplay Windows:** Brief moments to deal damage safely

---

## Setting Up a Basic Boss

### Step 1: Create Boss Sprite

```
Sprite: "Boss_TestBoss"
Size: 256x256 pixels
Animations:
  - Idle (looping, 4-8 frames)
  - Transition (one-shot, 8-12 frames)
  - Telegraph (looping, 2-4 frames, flashing)
  - Attack_Projectile (one-shot, 6-10 frames)
  - Attack_Melee (one-shot, 8-12 frames)
  - Hurt (one-shot, 3-5 frames)
  - Defeat (one-shot, 12-20 frames)
```

### Step 2: Add Boss Behavior

1. Select boss sprite in Objects panel
2. Click **Edit Behaviors**
3. Add **DJT Boss Battle** behavior
4. Configure properties:
   ```
   Boss Name: "Test Boss"
   Max Health: 200
   Phase Count: 3
   Attack Delay: 2.5
   Weapon Drop ID: 1
   ```

### Step 3: Create Boss Arena

```
Arena Requirements:
- Width: 800-1200 pixels
- Height: 600-800 pixels
- Floor: Solid platform
- Optional: Moving platforms, hazards
- Boundaries: Walls on left/right
- No escape routes
```

### Step 4: Add Battle Trigger

```
Event: Player enters BossTriggerZone
Actions:
  - Lock player in arena (close doors, barriers)
  - Start boss battle: Call boss.startBattle()
  - Show boss health bar
  - Play boss intro music
  - Display intro dialogue
```

---

## Creating Custom Attack Patterns

### Attack Pattern Structure

```javascript
{
  type: "attack_type",
  damage: 25,
  count: 5,
  speed: 400,
  telegraphTime: 0.5,
  animation: "Attack_Projectile"
}
```

### Available Attack Types

#### 1. Projectile Volley
Fires multiple projectiles in a spread pattern.

```javascript
{
  type: "projectile_volley",
  count: 5,              // Number of projectiles
  spread: 45,            // Spread angle in degrees
  damage: 20,
  speed: 400,            // Projectile speed (px/s)
  telegraphTime: 0.5,
  sprite: "EnergyBall"
}
```

**Use Cases:**
- Basic ranged attack
- Area denial
- Pattern memorization challenge

#### 2. Homing Attack
Spawns tracking projectiles.

```javascript
{
  type: "homing",
  count: 3,                // Number of homing projectiles
  damage: 25,
  speed: 300,
  homingStrength: 0.1,     // Turning speed
  lifetime: 5.0,           // Seconds before despawn
  telegraphTime: 0.6
}
```

**Use Cases:**
- Pressure player to keep moving
- Punish static positioning
- Force defensive play

#### 3. Arena Hazard
Spawns environmental danger zones.

```javascript
{
  type: "arena_hazard",
  hazardType: "Fire",      // Fire, Laser, Toxic, Electric
  damage: 15,
  duration: 5.0,           // How long hazard lasts
  size: 100,               // Radius in pixels
  x: 400,                  // Position (optional, random if not set)
  y: 500,
  telegraphTime: 0.7
}
```

**Use Cases:**
- Reduce safe space
- Force position changes
- Combine with other attacks

#### 4. Summon Minions
Spawns helper enemies.

```javascript
{
  type: "summon_minions",
  count: 3,
  minionType: "Drone",     // Enemy type to spawn
  minionHealth: 30,
  telegraphTime: 0.8
}
```

**Use Cases:**
- Add complexity mid-fight
- Test player multi-target handling
- Create combo opportunities

#### 5. Melee Rush
Boss charges at player.

```javascript
{
  type: "melee_rush",
  speed: 600,
  damage: 35,
  telegraphTime: 0.6
}
```

**Use Cases:**
- Close distance gaps
- Break camping strategies
- High risk, high reward dodging

#### 6. Special Attack
Custom boss-specific mechanics.

```javascript
{
  type: "special",
  specialType: "invert_controls",  // Your custom effect
  damage: 0,
  duration: 5.0,
  telegraphTime: 1.0
}
```

**Use Cases:**
- Unique boss identity
- Story-driven mechanics
- Advanced challenge

---

## Multi-Phase Design

### Phase Transitions

Phases trigger automatically at HP thresholds:
- **Phase 2:** 75% HP
- **Phase 3:** 50% HP
- **Phase 4:** 25% HP
- **Phase 5:** 10% HP

### Phase Design Strategy

#### Phase 1: Introduction (100% → 75% HP)
- **Goal:** Teach player the boss's basic patterns
- **Attacks:** 1-2 simple patterns
- **Speed:** Slow, 2.5-3 seconds between attacks
- **Example:**
```javascript
{
  attacks: [
    { type: "projectile_volley", count: 3, spread: 30, damage: 15, telegraphTime: 0.6 },
    { type: "projectile_volley", count: 5, spread: 60, damage: 10, telegraphTime: 0.6 }
  ]
}
```

#### Phase 2: Complexity (75% → 50% HP)
- **Goal:** Combine patterns, add new mechanics
- **Attacks:** 3-4 patterns with variety
- **Speed:** Medium, 2.0-2.5 seconds between attacks
- **New Elements:** Add homing or hazards
- **Example:**
```javascript
{
  attacks: [
    { type: "projectile_volley", count: 5, spread: 45, damage: 20, telegraphTime: 0.5 },
    { type: "homing", count: 2, damage: 20, telegraphTime: 0.6 },
    { type: "arena_hazard", hazardType: "Fire", damage: 15, duration: 5.0, telegraphTime: 0.7 }
  ]
}
```

#### Phase 3: Chaos (50% → 0% HP)
- **Goal:** Test mastery of all patterns
- **Attacks:** 4-6 patterns, all previous plus new
- **Speed:** Fast, 1.5-2.0 seconds between attacks
- **Challenge:** Multiple mechanics at once
- **Example:**
```javascript
{
  attacks: [
    { type: "projectile_volley", count: 8, spread: 90, damage: 25, telegraphTime: 0.4 },
    { type: "homing", count: 4, damage: 25, telegraphTime: 0.5 },
    { type: "summon_minions", count: 3, minionType: "Drone", telegraphTime: 0.7 },
    { type: "melee_rush", speed: 700, damage: 35, telegraphTime: 0.5 },
    { type: "arena_hazard", hazardType: "Laser", damage: 20, duration: 4.0, telegraphTime: 0.6 }
  ]
}
```

### Advanced: 4-5 Phase Bosses

For final bosses or special encounters:

#### Phase 4: Desperation (25% → 10% HP)
- Faster attacks (1.0-1.5s delay)
- Combines multiple attack types simultaneously
- Boss may become more aggressive

#### Phase 5: Last Stand (10% → 0% HP)
- Ultimate attack(s)
- All-out assault
- May include cutscene or special mechanic

---

## Boss-Specific Mechanics

### Custom Phase Transitions

Override `onPhaseChange()` to add custom behavior:

```javascript
// In boss script
onPhaseChange(phase) {
  switch(phase) {
    case 2:
      // Spawn permanent hazard
      this.spawnArenaHazard({
        hazardType: "Fire",
        damage: 10,
        duration: 999,
        x: 400,
        y: 500
      });
      break;
    case 3:
      // Make boss faster
      this.attackDelay = 1.5;
      // Change boss color to red
      this.object.setColor("255;0;0");
      break;
  }
}
```

### Special Attack Implementation

Create unique mechanics per boss:

```javascript
executeSpecialAttack(attack) {
  switch(attack.specialType) {
    case "invert_controls":
      // Flip player controls
      this.scene.getVariables().get("ControlsInverted").setNumber(1);
      setTimeout(() => {
        this.scene.getVariables().get("ControlsInverted").setNumber(0);
      }, attack.duration * 1000);
      break;
      
    case "darkness":
      // Darken screen
      this.scene.getLayer("").setLightingLayer(true);
      setTimeout(() => {
        this.scene.getLayer("").setLightingLayer(false);
      }, attack.duration * 1000);
      break;
      
    case "clone_summon":
      // Spawn boss clone
      const clone = this.scene.createObject("BossClone");
      clone.setPosition(this.object.getX() + 200, this.object.getY());
      break;
  }
}
```

---

## Testing and Balancing

### Testing Checklist

✅ **Readability**
- [ ] All attacks are clearly telegraphed
- [ ] Different attack types are visually distinct
- [ ] Telegraph times feel fair (0.4-0.8s)

✅ **Fairness**
- [ ] Every attack is dodgeable
- [ ] Attack delays allow counterplay (2-3s)
- [ ] No unavoidable damage
- [ ] Boss doesn't spam same attack repeatedly

✅ **Difficulty Curve**
- [ ] Phase 1 is learnable
- [ ] Phase 2 challenges without overwhelming
- [ ] Phase 3 tests mastery
- [ ] HP thresholds feel right (not too fast/slow)

✅ **Player Feedback**
- [ ] Damage numbers appear on hits
- [ ] Boss flashes when damaged
- [ ] Phase transitions are dramatic
- [ ] Health bar updates correctly

### Balancing Tips

**Boss Health:**
- **Early Game Boss:** 150-200 HP
- **Mid Game Boss:** 200-300 HP
- **Late Game Boss:** 300-400 HP
- **Final Boss:** 400-500 HP (multiple phases)

**Damage Values:**
- **Weak Attack:** 10-15 damage
- **Medium Attack:** 15-25 damage
- **Strong Attack:** 25-40 damage
- **Ultimate Attack:** 40-60 damage

**Attack Speed:**
- **Phase 1:** 2.5-3.0s delay
- **Phase 2:** 2.0-2.5s delay
- **Phase 3+:** 1.5-2.0s delay

**Telegraph Time:**
- **Fast Attack:** 0.3-0.4s
- **Medium Attack:** 0.5-0.6s
- **Slow/Powerful:** 0.7-1.0s

---

## Council Boss Templates

### Boss 1: Elara (Hacker)

**Theme:** Digital/Cyber  
**Weapon Drop:** Spark Chain (ID: 1)  
**Difficulty:** Easy (tutorial boss)

**Phase 1: Initialization**
```javascript
{
  attacks: [
    { 
      type: "projectile_volley",
      count: 3,
      spread: 30,
      damage: 15,
      speed: 350,
      telegraphTime: 0.6,
      sprite: "CodeProjectile"
    },
    {
      type: "homing",
      count: 2,
      damage: 18,
      speed: 280,
      homingStrength: 0.08,
      telegraphTime: 0.7
    }
  ]
}
```

**Phase 2: Corrupted**
```javascript
{
  attacks: [
    { type: "projectile_volley", count: 5, spread: 50, damage: 18, telegraphTime: 0.5 },
    { type: "homing", count: 3, damage: 20, telegraphTime: 0.6 },
    { type: "special", specialType: "arena_shutdown", duration: 3.0, telegraphTime: 0.8 }
  ]
}
```

**Phase 3: System Crash**
```javascript
{
  attacks: [
    { type: "projectile_volley", count: 7, spread: 70, damage: 22, telegraphTime: 0.4 },
    { type: "homing", count: 5, damage: 22, telegraphTime: 0.5 },
    { type: "arena_hazard", hazardType: "Electric", damage: 15, duration: 5.0, telegraphTime: 0.6 },
    { type: "special", specialType: "data_storm", damage: 20, telegraphTime: 0.7 }
  ]
}
```

**Custom Mechanics:**
- **Arena Shutdown:** Screen briefly goes dark
- **Data Storm:** Random projectiles spawn from edges

---

### Boss 2: Vesper (CEO)

**Theme:** Corporate/Business  
**Weapon Drop:** Gravity Well (ID: 2)  
**Difficulty:** Medium

**Phase 1: Professional**
- Briefcase projectiles (straight line)
- Summons 2 security guards

**Phase 2: Aggressive Takeover**
- Faster projectiles
- Power surge (pushes player back)
- Summons 3 guards

**Phase 3: Hostile Acquisition**
- Money rain (projectiles from above)
- Desk slam (shockwave)
- Constant guards spawning

---

### Boss 3: Nyx (Scientist)

**Theme:** Lab/Chemical  
**Weapon Drop:** Plasma Beam (ID: 3)  
**Difficulty:** Medium-Hard

**Phase 1: Experiment**
- Chemical blasts (slow projectiles)
- Toxic clouds (hazards)

**Phase 2: Hypothesis**
- Multi-element projectiles
- Lab equipment falls from ceiling
- Conveyor belts activate

**Phase 3: Conclusion**
- Rapid fire explosions
- Entire arena becomes hazardous
- Boss teleports around arena

---

### Boss 4: Lilith (Artist)

**Theme:** Art/Chaos  
**Weapon Drop:** Decoy Clone (ID: 4)  
**Difficulty:** Hard

**Phase 1: Sketch**
- Paint splash projectiles
- Creates 1 illusion clone

**Phase 2: Composition**
- Color-blind zones (screen filter)
- 2-3 illusion clones
- Paint trails on floor (hazard)

**Phase 3: Masterpiece**
- Reality warping (platform positions shift)
- Many clones
- Full arena paint hazards

---

### Boss 5: Zane (Tech CEO)

**Theme:** Technology/Apps  
**Weapon Drop:** Sonic Pulse (ID: 5)  
**Difficulty:** Hard

**Phase 1: Beta Test**
- AI drones (homing)
- App notifications (slow player)

**Phase 2: Release**
- More aggressive drones
- Social media attacks (random effects)
- Server crashes (arena hazards)

**Phase 3: Viral**
- Paranoia wave (inverts controls temporarily)
- Overwhelming notifications
- Maximum drone swarm

---

### Boss 6: Council Avatar (Final)

**Theme:** All Previous Bosses Combined  
**Weapon Drop:** Fractal Mirror (ID: 6)  
**Difficulty:** Very Hard

**Phase 1:** Uses Elara's attacks  
**Phase 2:** Adds Vesper's mechanics  
**Phase 3:** Adds Nyx's hazards  
**Phase 4:** Adds Lilith's illusions  
**Phase 5:** All attacks at maximum speed

Each phase mirrors a previous boss but faster and more dangerous.

---

## Best Practices Summary

1. **Start Simple:** First boss should be tutorial-level
2. **Telegraph Everything:** 0.5-0.8s warning for all attacks
3. **Test with Others:** Watch real players fight your boss
4. **Record Playtests:** Look for confusion or frustration
5. **Iterate:** Adjust based on feedback
6. **Balance Rewards:** Powerful weapons for harder bosses
7. **Tell a Story:** Boss dialogue adds personality
8. **Make It Fair:** Skill should beat luck every time

---

**Happy Boss Crafting!** 👾

*DJT Asset Pack v1.0.0 - Boss Creation Guide*
