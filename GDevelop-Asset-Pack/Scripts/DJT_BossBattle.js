// DJT Boss Battle System - Core Script
// Implements multi-phase boss battles with complex patterns

/**
 * DJT Boss Battle System
 * 
 * Features:
 * - Multiple phases with different attack patterns
 * - Phase transitions at HP thresholds (75%, 50%, 25%)
 * - Attack telegraphing and delays for counterplay
 * - Boss-specific mechanics per Council member
 * - Dialogue system integration
 * - Weapon drops on defeat
 * 
 * Council Bosses:
 * 1. Elara (Hacker) - Code projectiles, homing drones, arena shutdown
 * 2. Vesper (CEO) - Briefcase projectiles, summoned guards, power surge
 * 3. Nyx (Scientist) - Chemical blasts, toxic clouds, lab explosions
 * 4. Lilith (Artist) - Paint splashes, illusion clones, color-blind zones
 * 5. Zane (Tech CEO) - AI drones, app notifications, paranoia wave
 * 6. Council Avatar (Final) - All previous attacks, multi-phase
 */

gdjs.DJTBossBattle = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.bossName = behaviorData.BossName || "Generic Boss";
    this.maxHealth = behaviorData.MaxHealth || 250;
    this.phaseCount = Math.min(Math.max(behaviorData.PhaseCount || 3, 1), 5);
    this.attackDelay = behaviorData.AttackDelay || 2.0;
    this.weaponDropID = behaviorData.WeaponDropID || 0;
    
    // State
    this.currentHealth = this.maxHealth;
    this.currentPhase = 1;
    this.isInvulnerable = false;
    this.isPhaseTransitioning = false;
    this.attackTimer = this.attackDelay;
    this.telegraphTimer = 0;
    this.isTelegraphing = false;
    this.currentAttackIndex = 0;
    this.battleStarted = false;
    this.isDefeated = false;
    
    // Phase thresholds
    this.phaseThresholds = [1.0, 0.75, 0.50, 0.25, 0.10];
    
    // Attack patterns per phase (will be customized per boss)
    this.attackPatterns = this.getDefaultAttackPatterns();
    
    // Arena state
    this.arenaHazards = [];
    this.summonedMinions = [];
  }
  
  doStepPreEvents(runtimeScene) {
    const dt = runtimeScene.getElapsedTime();
    this.update(dt);
  }
  
  update(dt) {
    if (!this.battleStarted || this.isDefeated) {
      return;
    }
    
    // Update timers
    if (this.attackTimer > 0) {
      this.attackTimer -= dt;
    }
    
    if (this.telegraphTimer > 0) {
      this.telegraphTimer -= dt;
      if (this.telegraphTimer <= 0) {
        this.executeAttack();
        this.isTelegraphing = false;
      }
    }
    
    // Check for phase transition
    this.checkPhaseTransition();
    
    // Execute attacks
    if (!this.isPhaseTransitioning && !this.isTelegraphing && this.attackTimer <= 0) {
      this.startNextAttack();
    }
    
    // Update arena hazards
    this.updateArenaHazards(dt);
    
    // Update animations
    this.updateAnimation();
  }
  
  startBattle() {
    this.battleStarted = true;
    this.showIntroDialogue();
    // Lock player in arena
    // Start battle music
  }
  
  checkPhaseTransition() {
    const healthPercent = this.currentHealth / this.maxHealth;
    const nextPhase = this.currentPhase + 1;
    
    if (nextPhase <= this.phaseCount && 
        healthPercent <= this.phaseThresholds[nextPhase - 1] &&
        !this.isPhaseTransitioning) {
      this.transitionToPhase(nextPhase);
    }
  }
  
  transitionToPhase(phase) {
    this.isPhaseTransitioning = true;
    this.isInvulnerable = true;
    this.currentPhase = phase;
    
    // Play transition animation/effect
    this.playPhaseTransitionEffect();
    
    // Reset attack pattern
    this.currentAttackIndex = 0;
    
    // Phase-specific setup
    this.onPhaseChange(phase);
    
    // End transition after delay
    setTimeout(() => {
      this.isPhaseTransitioning = false;
      this.isInvulnerable = false;
      this.attackTimer = this.attackDelay * 0.5; // Shorter delay after transition
    }, 2000);
  }
  
  onPhaseChange(phase) {
    // Override per boss for phase-specific mechanics
    // Examples:
    // - Spawn arena hazards
    // - Change movement pattern
    // - Summon minions
    // - Modify attack patterns
    
    console.log(`Boss ${this.bossName} entering phase ${phase}`);
  }
  
  startNextAttack() {
    const pattern = this.attackPatterns[this.currentPhase - 1];
    if (!pattern || !pattern.attacks || pattern.attacks.length === 0) {
      return;
    }
    
    // Get current attack
    const attack = pattern.attacks[this.currentAttackIndex];
    
    // Start telegraph
    this.isTelegraphing = true;
    this.telegraphTimer = attack.telegraphTime || 0.5;
    this.currentAttack = attack;
    
    // Play telegraph visual
    this.showTelegraph(attack);
  }
  
  executeAttack() {
    const attack = this.currentAttack;
    
    switch (attack.type) {
      case "projectile_volley":
        this.attackProjectileVolley(attack);
        break;
      case "homing":
        this.attackHoming(attack);
        break;
      case "arena_hazard":
        this.spawnArenaHazard(attack);
        break;
      case "summon_minions":
        this.summonMinions(attack);
        break;
      case "melee_rush":
        this.attackMeleeRush(attack);
        break;
      case "special":
        this.executeSpecialAttack(attack);
        break;
    }
    
    // Reset timer and cycle attack
    this.attackTimer = this.attackDelay;
    this.currentAttackIndex = (this.currentAttackIndex + 1) % 
      this.attackPatterns[this.currentPhase - 1].attacks.length;
  }
  
  attackProjectileVolley(attack) {
    const count = attack.count || 5;
    const spread = attack.spread || 45;
    const speed = attack.speed || 400;
    
    // Get player position for targeting
    const players = this.scene.getObjects("Player");
    let targetAngle = 0;
    if (players.length > 0) {
      const player = players[0];
      const dx = player.getX() - this.object.getX();
      const dy = player.getY() - this.object.getY();
      targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    }
    
    // Spawn projectiles in a spread
    for (let i = 0; i < count; i++) {
      const angle = targetAngle + (spread * (i / (count - 1)) - spread / 2);
      
      const projectileData = {
        type: "BossProjectile",
        x: this.object.getX(),
        y: this.object.getY(),
        damage: attack.damage || 25,
        speed: speed,
        angle: angle,
        sprite: attack.sprite || "EnergyBall"
      };
      
      this.scene.getVariables().get("BossProjectileQueue")
        .pushValue(JSON.stringify(projectileData));
    }
  }
  
  attackHoming(attack) {
    const count = attack.count || 3;
    
    for (let i = 0; i < count; i++) {
      const projectileData = {
        type: "HomingProjectile",
        x: this.object.getX(),
        y: this.object.getY(),
        damage: attack.damage || 20,
        speed: attack.speed || 300,
        homingStrength: attack.homingStrength || 0.1,
        lifetime: attack.lifetime || 5.0
      };
      
      // Stagger spawns
      setTimeout(() => {
        this.scene.getVariables().get("BossProjectileQueue")
          .pushValue(JSON.stringify(projectileData));
      }, i * 500);
    }
  }
  
  spawnArenaHazard(attack) {
    const hazardData = {
      type: attack.hazardType || "Fire",
      x: attack.x || this.scene.getViewportWidth() / 2,
      y: attack.y || this.scene.getViewportHeight() - 100,
      damage: attack.damage || 15,
      duration: attack.duration || 5.0,
      size: attack.size || 100
    };
    
    this.arenaHazards.push(hazardData);
    this.scene.getVariables().get("HazardQueue")
      .pushValue(JSON.stringify(hazardData));
  }
  
  summonMinions(attack) {
    const count = attack.count || 3;
    const minionType = attack.minionType || "Drone";
    
    for (let i = 0; i < count; i++) {
      const summonData = {
        type: minionType,
        x: this.object.getX() + ((i - count / 2) * 100),
        y: this.object.getY() - 50,
        health: attack.minionHealth || 30
      };
      
      this.summonedMinions.push(summonData);
      this.scene.getVariables().get("SummonQueue")
        .pushValue(JSON.stringify(summonData));
    }
  }
  
  attackMeleeRush(attack) {
    // Boss dashes toward player
    const players = this.scene.getObjects("Player");
    if (players.length > 0) {
      const player = players[0];
      const rushData = {
        targetX: player.getX(),
        targetY: player.getY(),
        speed: attack.speed || 600,
        damage: attack.damage || 30
      };
      
      // This would trigger a movement behavior
      this.scene.getVariables().get("BossRushQueue")
        .pushValue(JSON.stringify(rushData));
    }
  }
  
  executeSpecialAttack(attack) {
    // Boss-specific special attacks
    // Override per boss implementation
    console.log(`Executing special attack: ${attack.specialType}`);
  }
  
  updateArenaHazards(dt) {
    // Update active hazards
    this.arenaHazards = this.arenaHazards.filter(hazard => {
      hazard.duration -= dt;
      return hazard.duration > 0;
    });
  }
  
  takeDamage(amount) {
    if (this.isInvulnerable || this.isDefeated) {
      return;
    }
    
    this.currentHealth -= amount;
    
    // Flash effect
    this.flashDamage();
    
    // Spawn damage number
    this.showDamageNumber(amount);
    
    if (this.currentHealth <= 0) {
      this.defeat();
    }
  }
  
  defeat() {
    this.isDefeated = true;
    this.isInvulnerable = true;
    this.battleStarted = false;
    
    // Play defeat animation
    this.playDefeatAnimation();
    
    // Show defeat dialogue
    this.showDefeatDialogue();
    
    // Drop weapon
    this.dropWeapon();
    
    // Award points
    this.awardPoints();
    
    // Mark boss as defeated
    this.markBossDefeated();
  }
  
  dropWeapon() {
    const weaponData = {
      weaponID: this.weaponDropID,
      x: this.object.getX(),
      y: this.object.getY(),
      bossName: this.bossName
    };
    
    this.scene.getVariables().get("WeaponDropQueue")
      .pushValue(JSON.stringify(weaponData));
  }
  
  awardPoints() {
    const points = 500;
    // Add to player's Hack Points
    this.scene.getVariables().get("PlayerHackPoints").add(points);
  }
  
  markBossDefeated() {
    // Set boss defeat flag in save data
    const bossKey = `Boss_${this.bossName.replace(/\s/g, '')}_Defeated`;
    this.scene.getVariables().get(bossKey).setNumber(1);
  }
  
  showIntroDialogue() {
    const dialogueData = {
      speaker: this.bossName,
      text: this.getIntroDialogue(),
      duration: 3.0
    };
    
    this.scene.getVariables().get("DialogueQueue")
      .pushValue(JSON.stringify(dialogueData));
  }
  
  showDefeatDialogue() {
    const dialogueData = {
      speaker: this.bossName,
      text: this.getDefeatDialogue(),
      duration: 3.0
    };
    
    this.scene.getVariables().get("DialogueQueue")
      .pushValue(JSON.stringify(dialogueData));
  }
  
  getIntroDialogue() {
    // Override per boss
    return "You dare challenge me?";
  }
  
  getDefeatDialogue() {
    // Override per boss
    return "Impossible... I was so close...";
  }
  
  getDefaultAttackPatterns() {
    // Default 3-phase pattern
    return [
      { // Phase 1
        attacks: [
          { type: "projectile_volley", count: 3, spread: 30, damage: 20, telegraphTime: 0.5 },
          { type: "projectile_volley", count: 5, spread: 60, damage: 15, telegraphTime: 0.5 }
        ]
      },
      { // Phase 2
        attacks: [
          { type: "projectile_volley", count: 5, spread: 45, damage: 20, telegraphTime: 0.4 },
          { type: "homing", count: 3, damage: 20, telegraphTime: 0.6 },
          { type: "arena_hazard", hazardType: "Fire", damage: 15, duration: 5.0, telegraphTime: 0.7 }
        ]
      },
      { // Phase 3
        attacks: [
          { type: "projectile_volley", count: 8, spread: 90, damage: 25, telegraphTime: 0.3 },
          { type: "homing", count: 5, damage: 25, telegraphTime: 0.5 },
          { type: "summon_minions", count: 3, minionType: "Drone", minionHealth: 30, telegraphTime: 0.8 },
          { type: "melee_rush", speed: 700, damage: 35, telegraphTime: 0.6 }
        ]
      }
    ];
  }
  
  showTelegraph(attack) {
    // Visual indication of attack
    // Flash, color change, warning symbol, etc.
  }
  
  playPhaseTransitionEffect() {
    // Screen flash, boss invulnerability glow, etc.
  }
  
  flashDamage() {
    // Red flash effect
  }
  
  showDamageNumber(amount) {
    const damageData = {
      value: amount,
      x: this.object.getX(),
      y: this.object.getY() - 50
    };
    
    this.scene.getVariables().get("DamageNumberQueue")
      .pushValue(JSON.stringify(damageData));
  }
  
  playDefeatAnimation() {
    if (this.object.setAnimation) {
      this.object.setAnimation("Defeat");
    }
  }
  
  updateAnimation() {
    if (this.isDefeated) return;
    
    let animation = "Idle";
    
    if (this.isPhaseTransitioning) {
      animation = "Transition";
    } else if (this.isTelegraphing) {
      animation = "Telegraph";
    } else if (this.currentAttack) {
      animation = this.currentAttack.animation || "Attack";
    }
    
    if (this.object.setAnimation) {
      this.object.setAnimation(animation);
    }
  }
  
  // Public methods
  getHealthPercent() {
    return (this.currentHealth / this.maxHealth) * 100;
  }
  
  getCurrentPhase() {
    return this.currentPhase;
  }
  
  isVulnerable() {
    return !this.isInvulnerable && !this.isDefeated;
  }
  
  getBossName() {
    return this.bossName;
  }
};
