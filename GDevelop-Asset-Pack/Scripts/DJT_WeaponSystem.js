// DJT Weapon System - Core Script
// Implements Mega Man-style weapon switching and combat

/**
 * DJT Weapon System
 * 
 * Weapon Types:
 * 1. Energy Shot (Basic) - Infinite ammo, fast projectile
 * 2. Spark Chain - Homing projectiles (8 ammo)
 * 3. Gravity Well - Slowing field (6 ammo)
 * 4. Plasma Beam - Charged shot (10 ammo)
 * 5. Decoy Clone - Creates duplicate (5 ammo)
 * 6. Sonic Pulse - Knockback wave (7 ammo)
 * 7. Fractal Mirror - Reflects projectiles (10 ammo)
 */

gdjs.DJTWeaponSystem = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.baseFireRate = behaviorData.FireRate || 0.3;
    this.chargeTime = behaviorData.ChargeTime || 1.0;
    this.meleeDamage = behaviorData.MeleeDamage || 50;
    this.meleeRange = behaviorData.MeleeRange || 80;
    
    // Weapon definitions
    this.weaponData = {
      0: { // Energy Shot
        name: "Energy Shot",
        damage: 10,
        speed: 600,
        fireRate: 0.3,
        ammo: -1, // Infinite
        maxAmmo: -1,
        canCharge: false,
        projectileType: "EnergyShot"
      },
      1: { // Spark Chain
        name: "Spark Chain",
        damage: 25,
        speed: 400,
        fireRate: 0.5,
        ammo: 8,
        maxAmmo: 8,
        canCharge: false,
        projectileType: "SparkChain",
        special: "homing"
      },
      2: { // Gravity Well
        name: "Gravity Well",
        damage: 15,
        speed: 300,
        fireRate: 0.8,
        ammo: 6,
        maxAmmo: 6,
        canCharge: false,
        projectileType: "GravityWell",
        special: "slow_field"
      },
      3: { // Plasma Beam
        name: "Plasma Beam",
        damage: 40,
        speed: 800,
        fireRate: 0.6,
        ammo: 10,
        maxAmmo: 10,
        canCharge: true,
        projectileType: "PlasmaBeam"
      },
      4: { // Decoy Clone
        name: "Decoy Clone",
        damage: 0,
        speed: 0,
        fireRate: 1.5,
        ammo: 5,
        maxAmmo: 5,
        canCharge: false,
        projectileType: "DecoyClone",
        special: "summon_clone"
      },
      5: { // Sonic Pulse
        name: "Sonic Pulse",
        damage: 20,
        speed: 500,
        fireRate: 0.7,
        ammo: 7,
        maxAmmo: 7,
        canCharge: false,
        projectileType: "SonicPulse",
        special: "knockback"
      },
      6: { // Fractal Mirror
        name: "Fractal Mirror",
        damage: 30,
        speed: 700,
        fireRate: 0.5,
        ammo: 10,
        maxAmmo: 10,
        canCharge: false,
        projectileType: "FractalMirror",
        special: "reflect"
      }
    };
    
    // State
    this.currentWeapon = 0;
    this.unlockedWeapons = [0]; // Start with Energy Shot
    this.fireCooldown = 0;
    this.isCharging = false;
    this.chargeTimer = 0;
    this.facingDirection = 1;
  }
  
  doStepPreEvents(runtimeScene) {
    const dt = runtimeScene.getElapsedTime();
    this.update(dt);
  }
  
  update(dt) {
    // Update cooldown
    if (this.fireCooldown > 0) {
      this.fireCooldown -= dt;
    }
    
    // Handle input
    this.handleWeaponSwitch();
    this.handleFiring(dt);
    this.handleMelee();
  }
  
  handleWeaponSwitch() {
    const scene = this.scene;
    const input = scene.getGame().getInputManager();
    
    // Number key switching
    for (let i = 0; i <= 6; i++) {
      if (input.wasKeyReleased(String(i + 1)) && this.unlockedWeapons.includes(i)) {
        this.switchWeapon(i);
        return;
      }
    }
    
    // Q/E cycling
    if (input.wasKeyReleased("q")) {
      this.cycleWeapon(-1);
    } else if (input.wasKeyReleased("e")) {
      this.cycleWeapon(1);
    }
  }
  
  handleFiring(dt) {
    const scene = this.scene;
    const input = scene.getGame().getInputManager();
    const weapon = this.weaponData[this.currentWeapon];
    
    const firePressed = input.isMouseButtonPressed("Left") || 
                       input.isKeyPressed("j");
    const fireReleased = input.wasMouseButtonReleased("Left") || 
                        input.wasKeyReleased("j");
    
    // Charging logic
    if (weapon.canCharge && firePressed && this.fireCooldown <= 0) {
      this.isCharging = true;
      this.chargeTimer += dt;
      
      if (this.chargeTimer >= this.chargeTime) {
        this.chargeTimer = this.chargeTime; // Cap at max
      }
    }
    
    if (fireReleased && this.isCharging) {
      // Release charged shot
      const chargeMultiplier = this.chargeTimer / this.chargeTime;
      this.fireWeapon(chargeMultiplier);
      this.isCharging = false;
      this.chargeTimer = 0;
    } else if (firePressed && !weapon.canCharge && this.fireCooldown <= 0) {
      // Normal shot
      this.fireWeapon(1.0);
    }
  }
  
  handleMelee() {
    const scene = this.scene;
    const input = scene.getGame().getInputManager();
    
    if (input.wasKeyReleased("k") && this.fireCooldown <= 0) {
      this.performMelee();
    }
  }
  
  fireWeapon(chargeMultiplier = 1.0) {
    const weapon = this.weaponData[this.currentWeapon];
    
    // Check ammo
    if (weapon.ammo === 0) {
      // Play empty sound
      return;
    }
    
    // Create projectile
    this.createProjectile(weapon, chargeMultiplier);
    
    // Consume ammo
    if (weapon.ammo > 0) {
      weapon.ammo -= 1;
    }
    
    // Set cooldown
    this.fireCooldown = weapon.fireRate;
  }
  
  createProjectile(weapon, chargeMultiplier) {
    // Get projectile spawn position
    const x = this.object.getX() + (this.facingDirection * 40);
    const y = this.object.getY();
    
    // Create projectile object (this would interface with GDevelop's object creation)
    const projectileData = {
      type: weapon.projectileType,
      x: x,
      y: y,
      damage: weapon.damage * chargeMultiplier,
      speed: weapon.speed,
      direction: this.facingDirection,
      special: weapon.special,
      charged: chargeMultiplier >= 1.0
    };
    
    // This would be handled by a global function in GDevelop
    // gdjs.evtTools.object.createObjectOnScene(...)
    this.scene.getVariables().get("ProjectileQueue").pushValue(JSON.stringify(projectileData));
  }
  
  performMelee() {
    // Create melee hitbox
    const x = this.object.getX() + (this.facingDirection * this.meleeRange / 2);
    const y = this.object.getY();
    
    const meleeData = {
      x: x,
      y: y,
      damage: this.meleeDamage,
      range: this.meleeRange,
      direction: this.facingDirection
    };
    
    this.scene.getVariables().get("MeleeQueue").pushValue(JSON.stringify(meleeData));
    this.fireCooldown = 0.2; // Short cooldown for melee
  }
  
  switchWeapon(weaponIndex) {
    if (this.unlockedWeapons.includes(weaponIndex)) {
      this.currentWeapon = weaponIndex;
      this.isCharging = false;
      this.chargeTimer = 0;
      // Trigger weapon switch animation/sound
    }
  }
  
  cycleWeapon(direction) {
    const currentIndex = this.unlockedWeapons.indexOf(this.currentWeapon);
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) {
      newIndex = this.unlockedWeapons.length - 1;
    } else if (newIndex >= this.unlockedWeapons.length) {
      newIndex = 0;
    }
    
    this.switchWeapon(this.unlockedWeapons[newIndex]);
  }
  
  unlockWeapon(weaponIndex) {
    if (!this.unlockedWeapons.includes(weaponIndex)) {
      this.unlockedWeapons.push(weaponIndex);
      this.unlockedWeapons.sort((a, b) => a - b);
      
      // Reset ammo for newly unlocked weapon
      this.weaponData[weaponIndex].ammo = this.weaponData[weaponIndex].maxAmmo;
    }
  }
  
  addAmmo(weaponIndex, amount) {
    const weapon = this.weaponData[weaponIndex];
    if (weapon.maxAmmo > 0) {
      weapon.ammo = Math.min(weapon.ammo + amount, weapon.maxAmmo);
    }
  }
  
  refillAllAmmo() {
    for (let i = 0; i <= 6; i++) {
      const weapon = this.weaponData[i];
      if (weapon.maxAmmo > 0) {
        weapon.ammo = weapon.maxAmmo;
      }
    }
  }
  
  // Public getters
  getCurrentWeapon() {
    return this.weaponData[this.currentWeapon];
  }
  
  getCurrentWeaponIndex() {
    return this.currentWeapon;
  }
  
  getWeaponAmmo(weaponIndex) {
    return this.weaponData[weaponIndex].ammo;
  }
  
  isWeaponUnlocked(weaponIndex) {
    return this.unlockedWeapons.includes(weaponIndex);
  }
  
  getChargePercent() {
    return (this.chargeTimer / this.chargeTime) * 100;
  }
  
  setFacingDirection(direction) {
    this.facingDirection = direction;
  }
};
