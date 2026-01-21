// DJT Enemy AI System - Core Script
// Implements state-based enemy AI with multiple types

/**
 * DJT Enemy AI System
 * 
 * Enemy Types:
 * - Minion: Fast, low HP, simple patterns
 * - Elite: Armored, medium HP, predictable patterns
 * - Boss: High HP, complex multi-phase patterns
 * 
 * AI States:
 * - Idle: Standing still, minimal animation
 * - Patrol: Moving along path, not alerted
 * - Alert: Detected player, preparing to attack
 * - Attack: Executing attack pattern
 * - Flee: Low HP, retreating
 */

gdjs.DJTEnemyAI = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.enemyType = behaviorData.EnemyType || "minion";
    this.maxHealth = behaviorData.MaxHealth || 100;
    this.damage = behaviorData.Damage || 10;
    this.detectionRadius = behaviorData.DetectionRadius || 300;
    this.moveSpeed = behaviorData.MoveSpeed || 150;
    this.attackRate = behaviorData.AttackRate || 1.0;
    this.telegraphTime = behaviorData.TelegraphTime || 0.5;
    
    // State
    this.currentHealth = this.maxHealth;
    this.currentState = "Idle";
    this.targetPlayer = null;
    this.lastKnownPlayerPos = { x: 0, y: 0 };
    this.attackCooldown = 0;
    this.telegraphTimer = 0;
    this.isTelegraphing = false;
    this.patrolDirection = 1;
    this.patrolStartX = object.getX();
    this.patrolDistance = 200;
    this.fleeThreshold = 0.25; // Flee at 25% HP
    
    // Attack pattern data
    this.attackPattern = this.getAttackPatternForType();
    this.currentAttackPhase = 0;
  }
  
  doStepPreEvents(runtimeScene) {
    const dt = runtimeScene.getElapsedTime();
    this.update(dt);
  }
  
  update(dt) {
    // Update timers
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }
    if (this.telegraphTimer > 0) {
      this.telegraphTimer -= dt;
      if (this.telegraphTimer <= 0) {
        this.executeAttack();
        this.isTelegraphing = false;
      }
    }
    
    // Find player
    this.findPlayer();
    
    // State machine
    switch (this.currentState) {
      case "Idle":
        this.updateIdle(dt);
        break;
      case "Patrol":
        this.updatePatrol(dt);
        break;
      case "Alert":
        this.updateAlert(dt);
        break;
      case "Attack":
        this.updateAttack(dt);
        break;
      case "Flee":
        this.updateFlee(dt);
        break;
    }
    
    // Check flee condition
    if (this.currentHealth / this.maxHealth < this.fleeThreshold && 
        this.enemyType === "minion") {
      this.setState("Flee");
    }
    
    // Update animations
    this.updateAnimation();
  }
  
  findPlayer() {
    // Find player object (simplified - would use GDevelop's object picking)
    const players = this.scene.getObjects("Player");
    if (players.length > 0) {
      const player = players[0];
      const distance = this.getDistance(player);
      
      if (distance <= this.detectionRadius) {
        this.targetPlayer = player;
        this.lastKnownPlayerPos = {
          x: player.getX(),
          y: player.getY()
        };
        
        if (this.currentState === "Idle" || this.currentState === "Patrol") {
          this.setState("Alert");
        }
      } else if (distance > this.detectionRadius * 1.5) {
        // Lost player
        this.targetPlayer = null;
        if (this.currentState !== "Idle" && this.currentState !== "Patrol") {
          this.setState("Idle");
        }
      }
    }
  }
  
  updateIdle(dt) {
    // Just stand there, transition to patrol after a bit
    // Could add idle animation logic here
  }
  
  updatePatrol(dt) {
    // Simple back-and-forth patrol
    const currentX = this.object.getX();
    const distance = Math.abs(currentX - this.patrolStartX);
    
    if (distance >= this.patrolDistance) {
      this.patrolDirection *= -1;
    }
    
    this.object.setX(currentX + (this.patrolDirection * this.moveSpeed * dt));
  }
  
  updateAlert(dt) {
    if (!this.targetPlayer) {
      this.setState("Idle");
      return;
    }
    
    // Move toward player
    const playerX = this.targetPlayer.getX();
    const myX = this.object.getX();
    const direction = playerX > myX ? 1 : -1;
    
    this.object.setX(myX + (direction * this.moveSpeed * 0.8 * dt));
    
    // Check if in attack range
    if (this.getDistance(this.targetPlayer) <= 200) {
      this.setState("Attack");
    }
  }
  
  updateAttack(dt) {
    if (!this.targetPlayer) {
      this.setState("Idle");
      return;
    }
    
    // Start telegraph if cooldown is ready
    if (!this.isTelegraphing && this.attackCooldown <= 0) {
      this.startTelegraph();
    }
    
    // Keep distance
    const distance = this.getDistance(this.targetPlayer);
    if (distance > 250) {
      this.setState("Alert");
    }
  }
  
  updateFlee(dt) {
    if (!this.targetPlayer) {
      this.setState("Idle");
      return;
    }
    
    // Run away from player
    const playerX = this.targetPlayer.getX();
    const myX = this.object.getX();
    const direction = playerX > myX ? -1 : 1;
    
    this.object.setX(myX + (direction * this.moveSpeed * 1.2 * dt));
  }
  
  startTelegraph() {
    this.isTelegraphing = true;
    this.telegraphTimer = this.telegraphTime;
    
    // Visual telegraph effect (flash, color change, etc.)
    // Would be implemented via GDevelop effects
  }
  
  executeAttack() {
    const pattern = this.attackPattern[this.currentAttackPhase];
    
    switch (pattern.type) {
      case "projectile":
        this.fireProjectile(pattern);
        break;
      case "melee":
        this.performMelee(pattern);
        break;
      case "summon":
        this.summonMinions(pattern);
        break;
    }
    
    this.attackCooldown = this.attackRate;
    
    // Cycle attack phase for variety
    this.currentAttackPhase = (this.currentAttackPhase + 1) % this.attackPattern.length;
  }
  
  fireProjectile(pattern) {
    const projectileData = {
      type: "EnemyProjectile",
      x: this.object.getX(),
      y: this.object.getY(),
      damage: this.damage,
      speed: pattern.speed || 300,
      direction: this.targetPlayer ? 
        (this.targetPlayer.getX() > this.object.getX() ? 1 : -1) : 1,
      count: pattern.count || 1,
      spread: pattern.spread || 0
    };
    
    this.scene.getVariables().get("EnemyProjectileQueue")
      .pushValue(JSON.stringify(projectileData));
  }
  
  performMelee(pattern) {
    const meleeData = {
      x: this.object.getX(),
      y: this.object.getY(),
      damage: this.damage * 1.5,
      range: pattern.range || 80,
      direction: this.targetPlayer ? 
        (this.targetPlayer.getX() > this.object.getX() ? 1 : -1) : 1
    };
    
    this.scene.getVariables().get("EnemyMeleeQueue")
      .pushValue(JSON.stringify(meleeData));
  }
  
  summonMinions(pattern) {
    const summonData = {
      type: "Drone",
      x: this.object.getX(),
      y: this.object.getY(),
      count: pattern.count || 3
    };
    
    this.scene.getVariables().get("SummonQueue")
      .pushValue(JSON.stringify(summonData));
  }
  
  getAttackPatternForType() {
    switch (this.enemyType) {
      case "minion":
        return [
          { type: "projectile", speed: 300, count: 1 }
        ];
      case "elite":
        return [
          { type: "projectile", speed: 400, count: 3, spread: 30 },
          { type: "melee", range: 100 }
        ];
      case "boss":
        return [
          { type: "projectile", speed: 500, count: 5, spread: 45 },
          { type: "melee", range: 120 },
          { type: "summon", count: 3 }
        ];
      default:
        return [{ type: "projectile", speed: 300, count: 1 }];
    }
  }
  
  setState(newState) {
    if (this.currentState !== newState) {
      this.currentState = newState;
      this.onStateChange(newState);
    }
  }
  
  onStateChange(newState) {
    // Reset state-specific variables
    switch (newState) {
      case "Patrol":
        this.patrolStartX = this.object.getX();
        break;
      case "Alert":
        this.attackCooldown = 0.5; // Small delay before first attack
        break;
    }
  }
  
  takeDamage(amount) {
    this.currentHealth -= amount;
    
    if (this.currentHealth <= 0) {
      this.die();
    } else {
      // Hit reaction
      this.flashRed();
    }
  }
  
  die() {
    // Death animation and cleanup
    // Award points to player
    // Drop items/ammo
    const dropData = {
      type: this.enemyType,
      x: this.object.getX(),
      y: this.object.getY(),
      points: this.getPointValue()
    };
    
    this.scene.getVariables().get("EnemyDeathQueue")
      .pushValue(JSON.stringify(dropData));
    
    // Remove object
    this.object.deleteFromScene();
  }
  
  getPointValue() {
    switch (this.enemyType) {
      case "minion": return 100;
      case "elite": return 250;
      case "boss": return 500;
      default: return 50;
    }
  }
  
  flashRed() {
    // Apply red flash effect
    // Would use GDevelop's color effects
  }
  
  updateAnimation() {
    let animation = "Idle";
    
    switch (this.currentState) {
      case "Patrol":
      case "Alert":
      case "Flee":
        animation = "Walk";
        break;
      case "Attack":
        if (this.isTelegraphing) {
          animation = "Telegraph";
        } else {
          animation = "Attack";
        }
        break;
    }
    
    if (this.object.setAnimation) {
      this.object.setAnimation(animation);
    }
  }
  
  getDistance(target) {
    const dx = target.getX() - this.object.getX();
    const dy = target.getY() - this.object.getY();
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // Public methods
  getCurrentState() {
    return this.currentState;
  }
  
  getHealthPercent() {
    return (this.currentHealth / this.maxHealth) * 100;
  }
  
  isAlerted() {
    return this.currentState === "Alert" || this.currentState === "Attack";
  }
};
