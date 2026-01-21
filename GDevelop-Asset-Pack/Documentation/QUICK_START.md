# DJT Asset Pack - Quick Start Guide

## Get Your Game Running in 10 Minutes!

### Step 1: Import the Asset Pack (2 minutes)

1. Open GDevelop 5
2. Create a new project or open an existing one
3. Click **Extensions** in the project manager
4. Click **Import Extension**
5. Navigate to `GDevelop-Asset-Pack/Extensions/`
6. Import all `.json` files:
   - DJT_PlayerMovement.json
   - DJT_WeaponSystem.json
   - DJT_EnemyAI.json
   - DJT_BossBattle.json
   - DJT_HUD.json
   - DJT_LevelUtils.json
   - DJT_Progression.json

### Step 2: Create Your Player (3 minutes)

1. **Add Player Sprite**
   - Click **Add a new object** → **Sprite**
   - Name it "Player"
   - Add placeholder sprite (64x64 recommended)

2. **Add Animations**
   Create these animations (can use same sprite temporarily):
   - Idle
   - Run
   - Jump
   - Fall
   - WallSlide
   - Dash
   - Attack
   - Hurt

3. **Add Behaviors**
   - Select Player object → **Edit Behaviors**
   - Add **DJT Platformer Movement**
   - Add **DJT Weapon Manager**
   - Keep default settings for now

4. **Place Player in Scene**
   - Drag Player object into scene
   - Position at starting location (e.g., X: 100, Y: 300)

### Step 3: Create Level Platforms (1 minute)

1. **Add Ground**
   - Add new Sprite object named "Ground"
   - Make it a long rectangle (e.g., 800x32)
   - Add **Platform** behavior (built-in GDevelop)
   - Place multiple Ground objects to create a level

2. **Add Walls** (optional)
   - Create Sprite object named "Wall"
   - Add Platform behavior
   - Place walls for boundaries

### Step 4: Set Up Game Logic (3 minutes)

1. **Initialize Systems**
   - Open Events sheet
   - Add event: **At the beginning of the scene**
   - Add action: **Run JavaScript code**
   ```javascript
   gdjs.initializeDJTHUD(runtimeScene);
   gdjs.initializeDJTProgression(runtimeScene);
   ```

2. **Handle Ground Collision**
   - Add event: **Player is in collision with Ground**
   - Add sub-event: **Trigger once**
   - Add action: **Run JavaScript code**
   ```javascript
   // Get player behavior instance
   const player = runtimeScene.getObjects("Player")[0];
   // Tell movement system player is on ground
   runtimeScene.getVariables().get("PlayerIsOnGround").setNumber(1);
   ```

3. **Handle Wall Collision**
   - Add event: **Player is in collision with Wall**
   - Add condition: **Player X position < Wall X position**
   - Add action: Set variable "PlayerOnWallLeft" to 1
   - Add event: **Player is in collision with Wall**
   - Add condition: **Player X position > Wall X position**
   - Add action: Set variable "PlayerOnWallRight" to 1

4. **Initialize Player Stats**
   - Add scene variable "PlayerHealth" = 100
   - Add scene variable "PlayerMaxHealth" = 100
   - Add scene variable "PlayerHackPoints" = 0

### Step 5: Test Basic Movement (1 minute)

1. Click **Preview** (or press Ctrl+P)
2. Test controls:
   - **A/D or Arrow Keys:** Move left/right
   - **W or Space:** Jump
   - **W/Space (in air):** Double jump
   - **Shift:** Sprint
   - **Ctrl:** Dash
   - **J:** Fire weapon

### 🎉 You're Done!

You now have a basic platformer with:
- ✅ Smooth movement controls
- ✅ Double jump
- ✅ Wall sliding
- ✅ Dash ability
- ✅ Basic weapon system

---

## Next Steps

### Add Enemies

1. Create enemy sprite object
2. Add **DJT Enemy AI** behavior
3. Set enemy type: "minion"
4. Place in level
5. Add collision event: Enemy colliding with Player Projectile
6. Action: Run JavaScript code
   ```javascript
   const enemy = runtimeScene.getObjects("Enemy")[0];
   // enemy.getBehavior("DJTEnemyAI").takeDamage(10);
   ```

### Add HUD Elements

1. **Health Bar**
   - Add Rectangle Shape object named "HealthBar"
   - Set color to red
   - Position at top-left (20, 20)

2. **Weapon Display**
   - Add Sprite object named "WeaponIcon"
   - Position at top-center

3. **Update HUD Each Frame**
   - Add event: **Forever** (no conditions)
   - Add action: Run JavaScript code
   ```javascript
   if (gdjs.DJTHUDManager) {
     gdjs.DJTHUDManager.update(runtimeScene.getElapsedTime() / 1000);
   }
   ```

### Create Your First Boss

1. Create boss sprite (256x256 recommended)
2. Add **DJT Boss Battle** behavior
3. Configure:
   - Boss Name: "Test Boss"
   - Max Health: 150
   - Phase Count: 2
   - Weapon Drop ID: 1
4. Add trigger zone to start battle
5. Test boss fight!

---

## Control Scheme Reference

### Keyboard Controls
| Action | Keys |
|--------|------|
| Move Left | A, Left Arrow |
| Move Right | D, Right Arrow |
| Jump | W, Space, Up Arrow |
| Sprint | Left Shift |
| Dash | Left Ctrl |
| Fire Weapon | J, Left Mouse |
| Melee | K |
| Weapon 1 | 1 |
| Weapon 2 | 2 |
| Weapon 3 | 3 |
| Weapon 4 | 4 |
| Weapon 5 | 5 |
| Weapon 6 | 6 |
| Weapon 7 | 7 |
| Next Weapon | E |
| Previous Weapon | Q |
| Pause | P, Escape |

---

## Common Issues & Quick Fixes

### Player Falls Through Ground
**Fix:** Make sure Ground objects have the **Platform** behavior enabled.

### Double Jump Not Working
**Fix:** Check that "Enable Double Jump" is set to "yes" in Player Movement behavior properties.

### Weapons Not Unlocking
**Fix:** Use this code to unlock weapons:
```javascript
const weaponMgr = runtimeScene.getObjects("Player")[0]
  .getBehavior("DJTWeaponManager");
weaponMgr.unlockWeapon(1); // Unlock weapon ID 1
```

### No Sound Effects
**Fix:** Import audio files into Resources and trigger them in events when actions occur.

---

## Performance Tips

1. **Limit Active Objects:** Keep enemies/projectiles under 50 total
2. **Use Object Pools:** Reuse projectiles instead of creating/destroying
3. **Optimize Collisions:** Use object groups for collision checks
4. **Test Early:** Preview on target platform frequently

---

## Where to Go Next

📖 **Full Documentation:** See `Documentation/README.md`  
🎮 **Examples:** Check `Examples/` folder (coming soon)  
💬 **Support:** Discord server or GitHub Issues  
🎨 **Assets:** Need sprites/audio? Check asset pack resources  

---

**Happy Game Making!** 🚀

*DJT Asset Pack v1.0.0*
