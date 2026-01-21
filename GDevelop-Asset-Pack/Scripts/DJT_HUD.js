// DJT HUD System - Core Script
// Implements comprehensive UI and HUD elements

/**
 * DJT HUD System
 * 
 * Components:
 * - Player health bar
 * - Current weapon display with ammo
 * - Mini-map
 * - Hack Points counter
 * - Boss health bar
 * - Dialogue system
 * - Pause menu
 * - Settings menu
 * - Damage numbers
 * - Screen effects (shake, hit freeze)
 */

gdjs.DJTHUD = class {
  constructor(runtimeScene) {
    this.scene = runtimeScene;
    
    // HUD elements (would be GDevelop objects)
    this.elements = {
      healthBar: null,
      weaponDisplay: null,
      ammoText: null,
      miniMap: null,
      hackPointsText: null,
      bossHealthBar: null,
      bossNameText: null,
      dialogueBox: null,
      dialogueText: null,
      pauseMenu: null,
      settingsMenu: null
    };
    
    // State
    this.isPaused = false;
    this.isInSettings = false;
    this.bossHealthVisible = false;
    this.dialogueActive = false;
    this.currentDialogue = null;
    this.dialogueTimer = 0;
    
    // Screen effects
    this.screenShakeIntensity = 0;
    this.screenShakeDuration = 0;
    this.hitFreezeTimer = 0;
    
    // Damage numbers
    this.damageNumbers = [];
    
    // Weapon icons (would be loaded from assets)
    this.weaponIcons = {
      0: "EnergyShot_Icon",
      1: "SparkChain_Icon",
      2: "GravityWell_Icon",
      3: "PlasmaBeam_Icon",
      4: "DecoyClone_Icon",
      5: "SonicPulse_Icon",
      6: "FractalMirror_Icon"
    };
    
    this.initializeHUD();
  }
  
  initializeHUD() {
    // Create or find HUD objects
    // In GDevelop, these would be created in the scene
    // This is a simplified initialization
    
    // Position HUD elements
    this.positionHealthBar(20, 20);
    this.positionWeaponDisplay(20, 60);
    this.positionMiniMap(this.scene.getViewportWidth() - 170, 20);
    this.positionHackPoints(20, this.scene.getViewportHeight() - 60);
  }
  
  update(dt) {
    // Handle input
    this.handlePauseInput();
    
    // Update screen effects
    this.updateScreenEffects(dt);
    
    // Update dialogue
    if (this.dialogueActive) {
      this.updateDialogue(dt);
    }
    
    // Update damage numbers
    this.updateDamageNumbers(dt);
    
    // Update HUD elements
    this.updateHealthBar();
    this.updateWeaponDisplay();
    this.updateHackPoints();
    
    if (this.bossHealthVisible) {
      this.updateBossHealthBar();
    }
  }
  
  handlePauseInput() {
    const input = this.scene.getGame().getInputManager();
    
    if (input.wasKeyReleased("p") || input.wasKeyReleased("Escape")) {
      if (!this.isInSettings) {
        this.togglePause();
      }
    }
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.showPauseMenu();
      // Pause game logic
      this.scene.getTimeManager().setTimeScale(0);
    } else {
      this.hidePauseMenu();
      // Resume game
      this.scene.getTimeManager().setTimeScale(1);
    }
  }
  
  // Health Bar
  updateHealthBar() {
    const player = this.getPlayer();
    if (!player) return;
    
    // Get player health from behavior or variable
    const currentHealth = this.scene.getVariables().get("PlayerHealth").getValue();
    const maxHealth = this.scene.getVariables().get("PlayerMaxHealth").getValue();
    const healthPercent = (currentHealth / maxHealth) * 100;
    
    // Update health bar visual
    // In GDevelop, this would resize a sprite or update a progress bar
    if (this.elements.healthBar) {
      this.elements.healthBar.setWidth(200 * (healthPercent / 100));
      
      // Color coding
      if (healthPercent <= 25) {
        this.elements.healthBar.setColor("255;0;0"); // Red
      } else if (healthPercent <= 50) {
        this.elements.healthBar.setColor("255;255;0"); // Yellow
      } else {
        this.elements.healthBar.setColor("0;255;0"); // Green
      }
    }
  }
  
  positionHealthBar(x, y) {
    // Position health bar and label
    // Would create text object for "HP" label
    // Would create filled rectangle for health bar
  }
  
  // Weapon Display
  updateWeaponDisplay() {
    const weaponSystem = this.getPlayerWeaponSystem();
    if (!weaponSystem) return;
    
    const currentWeapon = weaponSystem.getCurrentWeapon();
    const currentIndex = weaponSystem.getCurrentWeaponIndex();
    
    // Update weapon icon
    if (this.elements.weaponDisplay) {
      this.elements.weaponDisplay.setAnimation(this.weaponIcons[currentIndex]);
    }
    
    // Update ammo text
    if (this.elements.ammoText) {
      const ammo = currentWeapon.ammo;
      if (ammo === -1) {
        this.elements.ammoText.setString("∞");
      } else {
        this.elements.ammoText.setString(`${ammo}/${currentWeapon.maxAmmo}`);
      }
    }
    
    // Show charge bar if charging
    if (weaponSystem.isCharging) {
      const chargePercent = weaponSystem.getChargePercent();
      this.showChargeBar(chargePercent);
    } else {
      this.hideChargeBar();
    }
  }
  
  positionWeaponDisplay(x, y) {
    // Position weapon icon and ammo text
  }
  
  showChargeBar(percent) {
    // Display charge meter
  }
  
  hideChargeBar() {
    // Hide charge meter
  }
  
  // Mini-map
  updateMiniMap() {
    const player = this.getPlayer();
    if (!player) return;
    
    // Update player position on mini-map
    // Show checkpoints, collectibles, boss location
    // This would use a camera/viewport system in GDevelop
  }
  
  positionMiniMap(x, y) {
    // Create mini-map background and elements
  }
  
  // Hack Points
  updateHackPoints() {
    const points = this.scene.getVariables().get("PlayerHackPoints").getValue();
    
    if (this.elements.hackPointsText) {
      this.elements.hackPointsText.setString(`HACK POINTS: ${Math.floor(points)}`);
    }
  }
  
  positionHackPoints(x, y) {
    // Position points counter
  }
  
  // Boss Health Bar
  showBossHealthBar(bossName, maxHealth) {
    this.bossHealthVisible = true;
    
    // Create large boss health bar at top of screen
    const centerX = this.scene.getViewportWidth() / 2;
    
    if (this.elements.bossNameText) {
      this.elements.bossNameText.setString(bossName);
      this.elements.bossNameText.setPosition(centerX - 100, 20);
    }
    
    // Initialize boss health bar
    this.bossMaxHealth = maxHealth;
  }
  
  updateBossHealthBar() {
    const boss = this.getBoss();
    if (!boss) {
      this.hideBossHealthBar();
      return;
    }
    
    const currentHealth = boss.currentHealth || 0;
    const healthPercent = (currentHealth / this.bossMaxHealth) * 100;
    
    if (this.elements.bossHealthBar) {
      this.elements.bossHealthBar.setWidth(600 * (healthPercent / 100));
    }
  }
  
  hideBossHealthBar() {
    this.bossHealthVisible = false;
    // Hide boss health bar elements
  }
  
  // Dialogue System
  showDialogue(speaker, text, duration = 3.0) {
    this.dialogueActive = true;
    this.currentDialogue = { speaker, text };
    this.dialogueTimer = duration;
    
    if (this.elements.dialogueBox) {
      this.elements.dialogueBox.setVisible(true);
    }
    
    if (this.elements.dialogueText) {
      this.elements.dialogueText.setString(`${speaker}: ${text}`);
    }
  }
  
  updateDialogue(dt) {
    this.dialogueTimer -= dt;
    
    if (this.dialogueTimer <= 0) {
      this.hideDialogue();
    }
  }
  
  hideDialogue() {
    this.dialogueActive = false;
    this.currentDialogue = null;
    
    if (this.elements.dialogueBox) {
      this.elements.dialogueBox.setVisible(false);
    }
  }
  
  // Pause Menu
  showPauseMenu() {
    if (this.elements.pauseMenu) {
      this.elements.pauseMenu.setVisible(true);
    }
    
    // Show menu options: Resume, Settings, Main Menu
  }
  
  hidePauseMenu() {
    if (this.elements.pauseMenu) {
      this.elements.pauseMenu.setVisible(false);
    }
  }
  
  // Settings Menu
  showSettingsMenu() {
    this.isInSettings = true;
    
    if (this.elements.settingsMenu) {
      this.elements.settingsMenu.setVisible(true);
    }
    
    // Show settings: Volume, Controls, Graphics, Difficulty
  }
  
  hideSettingsMenu() {
    this.isInSettings = false;
    
    if (this.elements.settingsMenu) {
      this.elements.settingsMenu.setVisible(false);
    }
  }
  
  // Damage Numbers
  spawnDamageNumber(value, x, y) {
    const damageNumber = {
      value: value,
      x: x,
      y: y,
      lifetime: 1.0,
      velocityY: -100 // Float upward
    };
    
    this.damageNumbers.push(damageNumber);
    
    // Create text object at position
    // Would use GDevelop's text object
  }
  
  updateDamageNumbers(dt) {
    this.damageNumbers = this.damageNumbers.filter(dmg => {
      dmg.lifetime -= dt;
      dmg.y += dmg.velocityY * dt;
      
      // Update position and fade
      // Would update actual text object
      
      return dmg.lifetime > 0;
    });
  }
  
  // Screen Effects
  screenShake(intensity, duration) {
    this.screenShakeIntensity = intensity;
    this.screenShakeDuration = duration;
  }
  
  hitFreeze(duration) {
    this.hitFreezeTimer = duration;
    // Slow down time temporarily
    this.scene.getTimeManager().setTimeScale(0.1);
  }
  
  updateScreenEffects(dt) {
    // Screen shake
    if (this.screenShakeDuration > 0) {
      this.screenShakeDuration -= dt;
      
      // Apply camera offset
      const offsetX = (Math.random() - 0.5) * this.screenShakeIntensity;
      const offsetY = (Math.random() - 0.5) * this.screenShakeIntensity;
      
      // Apply to camera
      // this.scene.getLayer("").getCameraX() += offsetX;
      
      if (this.screenShakeDuration <= 0) {
        // Reset camera
        this.screenShakeIntensity = 0;
      }
    }
    
    // Hit freeze
    if (this.hitFreezeTimer > 0) {
      this.hitFreezeTimer -= dt;
      
      if (this.hitFreezeTimer <= 0) {
        // Restore time scale
        this.scene.getTimeManager().setTimeScale(1);
      }
    }
  }
  
  // Helper methods
  getPlayer() {
    const players = this.scene.getObjects("Player");
    return players.length > 0 ? players[0] : null;
  }
  
  getBoss() {
    const bosses = this.scene.getObjects("Boss");
    return bosses.length > 0 ? bosses[0] : null;
  }
  
  getPlayerWeaponSystem() {
    const player = this.getPlayer();
    if (!player) return null;
    
    // Get weapon system behavior
    // Would access the behavior instance
    return null; // Placeholder
  }
  
  // Public methods
  onHit(damage) {
    this.screenShake(5, 0.1);
    this.hitFreeze(0.05);
  }
  
  onBossDamage(damage, x, y) {
    this.spawnDamageNumber(damage, x, y);
    this.screenShake(3, 0.08);
  }
  
  onLevelComplete() {
    // Show level complete UI
  }
  
  onGameOver() {
    // Show game over screen
  }
};

// Global HUD instance
gdjs.DJTHUDManager = null;

// Initialize HUD on scene start
gdjs.initializeDJTHUD = function(runtimeScene) {
  if (!gdjs.DJTHUDManager) {
    gdjs.DJTHUDManager = new gdjs.DJTHUD(runtimeScene);
  }
  return gdjs.DJTHUDManager;
};
