// DJT Level Utilities - Core Script
// Level design utilities for platformer levels

/**
 * DJT Level Design Utilities
 * 
 * Provides reusable level mechanics:
 * - Moving platforms (waypoint-based)
 * - Crumbling blocks (time-based destruction)
 * - Conveyor belts (speed modifiers)
 * - Spike traps (instant death hazards)
 * - Laser grids (timing-based obstacles)
 * - Checkpoints (save progress)
 * - Secret areas (hidden collectibles)
 * - Environmental hazards (lava, acid, etc.)
 */

// Moving Platform
gdjs.DJTMovingPlatform = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.speed = behaviorData.Speed || 100;
    this.loop = behaviorData.Loop !== false;
    this.pauseTime = behaviorData.PauseTime || 1.0;
    
    // Waypoints
    this.waypoints = [];
    this.currentWaypoint = 0;
    this.isReversing = false;
    this.pauseTimer = 0;
    
    // Set initial waypoint as starting position
    this.waypoints.push({ x: object.getX(), y: object.getY() });
  }
  
  addWaypoint(x, y) {
    this.waypoints.push({ x, y });
  }
  
  update(dt) {
    if (this.waypoints.length < 2) return;
    
    // Handle pause at waypoint
    if (this.pauseTimer > 0) {
      this.pauseTimer -= dt;
      return;
    }
    
    // Get target waypoint
    const target = this.waypoints[this.currentWaypoint];
    const currentX = this.object.getX();
    const currentY = this.object.getY();
    
    // Calculate direction
    const dx = target.x - currentX;
    const dy = target.y - currentY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 2) {
      // Reached waypoint
      this.pauseTimer = this.pauseTime;
      this.moveToNextWaypoint();
    } else {
      // Move toward target
      const ratio = (this.speed * dt) / distance;
      this.object.setX(currentX + dx * ratio);
      this.object.setY(currentY + dy * ratio);
    }
  }
  
  moveToNextWaypoint() {
    if (this.loop) {
      // Loop back to start
      this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
    } else {
      // Ping-pong between waypoints
      if (!this.isReversing) {
        this.currentWaypoint++;
        if (this.currentWaypoint >= this.waypoints.length) {
          this.currentWaypoint = this.waypoints.length - 2;
          this.isReversing = true;
        }
      } else {
        this.currentWaypoint--;
        if (this.currentWaypoint < 0) {
          this.currentWaypoint = 1;
          this.isReversing = false;
        }
      }
    }
  }
};

// Crumbling Block
gdjs.DJTCrumblingBlock = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.crumbleTime = behaviorData.CrumbleTime || 1.5;
    this.respawnTime = behaviorData.RespawnTime || 3.0;
    this.canRespawn = behaviorData.CanRespawn !== false;
    
    // State
    this.isIntact = true;
    this.isCrumbling = false;
    this.crumbleTimer = 0;
    this.respawnTimer = 0;
    this.playerTouching = false;
    this.originalX = object.getX();
    this.originalY = object.getY();
  }
  
  update(dt) {
    if (this.isIntact) {
      // Check if player is standing on it
      if (this.playerTouching) {
        if (!this.isCrumbling) {
          this.startCrumbling();
        }
        
        this.crumbleTimer -= dt;
        
        if (this.crumbleTimer <= 0) {
          this.crumble();
        } else {
          // Shake effect as warning
          const shake = Math.sin(this.crumbleTimer * 20) * 2;
          this.object.setX(this.originalX + shake);
        }
      }
    } else if (this.canRespawn) {
      // Respawn countdown
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) {
        this.respawn();
      }
    }
    
    this.playerTouching = false; // Reset, will be set by collision check
  }
  
  startCrumbling() {
    this.isCrumbling = true;
    this.crumbleTimer = this.crumbleTime;
    // Play warning animation/sound
  }
  
  crumble() {
    this.isIntact = false;
    this.isCrumbling = false;
    this.object.setVisible(false);
    // Disable collision
    this.respawnTimer = this.respawnTime;
    // Play crumble effect
  }
  
  respawn() {
    this.isIntact = true;
    this.object.setVisible(true);
    this.object.setX(this.originalX);
    this.object.setY(this.originalY);
    // Enable collision
  }
  
  onPlayerTouch() {
    this.playerTouching = true;
  }
};

// Conveyor Belt
gdjs.DJTConveyorBelt = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.conveyorSpeed = behaviorData.ConveyorSpeed || 100;
    this.direction = behaviorData.Direction || 1; // 1 for right, -1 for left
  }
  
  applyForceToPlayer(player, dt) {
    // Check if player is on the belt
    const playerBottom = player.getY() + player.getHeight() / 2;
    const beltTop = this.object.getY() - this.object.getHeight() / 2;
    
    if (Math.abs(playerBottom - beltTop) < 10) {
      // Apply conveyor force
      const force = this.conveyorSpeed * this.direction * dt;
      player.setX(player.getX() + force);
    }
  }
  
  update(dt) {
    // Animate belt texture scrolling
    // Would use texture offset in GDevelop
  }
};

// Spike Trap
gdjs.DJTSpikeTrap = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.damage = behaviorData.Damage || 999; // Instant death by default
    this.damageType = behaviorData.DamageType || "instant_death";
    this.isRetractable = behaviorData.IsRetractable || false;
    this.retractTime = behaviorData.RetractTime || 2.0;
    
    // State
    this.isExtended = true;
    this.retractTimer = 0;
  }
  
  update(dt) {
    if (this.isRetractable) {
      this.retractTimer -= dt;
      
      if (this.retractTimer <= 0) {
        this.isExtended = !this.isExtended;
        this.retractTimer = this.retractTime;
        
        // Play extend/retract animation
        if (this.isExtended) {
          this.extend();
        } else {
          this.retract();
        }
      }
    }
  }
  
  extend() {
    this.object.setAnimation("Extended");
    // Enable collision
  }
  
  retract() {
    this.object.setAnimation("Retracted");
    // Disable collision
  }
  
  onPlayerCollision(player) {
    if (this.isExtended) {
      if (this.damageType === "instant_death") {
        // Kill player instantly
        this.scene.getVariables().get("PlayerHealth").setNumber(0);
      } else {
        // Deal damage
        const currentHealth = this.scene.getVariables().get("PlayerHealth").getValue();
        this.scene.getVariables().get("PlayerHealth").setNumber(currentHealth - this.damage);
      }
    }
  }
};

// Laser Grid
gdjs.DJTLaserGrid = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.damage = behaviorData.Damage || 25;
    this.onTime = behaviorData.OnTime || 2.0;
    this.offTime = behaviorData.OffTime || 1.0;
    this.telegraphTime = behaviorData.TelegraphTime || 0.5;
    
    // State
    this.isActive = false;
    this.isTelegraphing = false;
    this.cycleTimer = 0;
  }
  
  update(dt) {
    this.cycleTimer -= dt;
    
    if (this.cycleTimer <= 0) {
      if (this.isActive) {
        // Turn off
        this.deactivate();
        this.cycleTimer = this.offTime;
      } else {
        // Telegraph then turn on
        if (!this.isTelegraphing) {
          this.startTelegraph();
          this.cycleTimer = this.telegraphTime;
        } else {
          this.activate();
          this.cycleTimer = this.onTime;
        }
      }
    }
  }
  
  startTelegraph() {
    this.isTelegraphing = true;
    // Show warning effect (flashing, color change)
    this.object.setOpacity(128);
  }
  
  activate() {
    this.isActive = true;
    this.isTelegraphing = false;
    this.object.setOpacity(255);
    // Enable hitbox
  }
  
  deactivate() {
    this.isActive = false;
    this.object.setOpacity(0);
    // Disable hitbox
  }
  
  onPlayerCollision(player) {
    if (this.isActive) {
      const currentHealth = this.scene.getVariables().get("PlayerHealth").getValue();
      this.scene.getVariables().get("PlayerHealth").setNumber(currentHealth - this.damage);
    }
  }
};

// Checkpoint
gdjs.DJTCheckpoint = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.checkpointID = behaviorData.CheckpointID || 0;
    
    // State
    this.isActivated = false;
  }
  
  onPlayerTouch(player) {
    if (!this.isActivated) {
      this.activate();
      this.saveCheckpoint();
    }
  }
  
  activate() {
    this.isActivated = true;
    this.object.setAnimation("Activated");
    // Play sound effect
    // Show visual effect
  }
  
  saveCheckpoint() {
    // Save player state
    this.scene.getVariables().get("LastCheckpointID").setNumber(this.checkpointID);
    this.scene.getVariables().get("LastCheckpointX").setNumber(this.object.getX());
    this.scene.getVariables().get("LastCheckpointY").setNumber(this.object.getY());
    
    // Save game data
    // Would use GDevelop's storage system
  }
};

// Secret Area
gdjs.DJTSecretArea = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.secretID = behaviorData.SecretID || 0;
    this.rewardType = behaviorData.RewardType || "hackpoints"; // hackpoints, ammo, health, lore
    this.rewardAmount = behaviorData.RewardAmount || 100;
    
    // State
    this.isDiscovered = false;
  }
  
  onPlayerEnter(player) {
    if (!this.isDiscovered) {
      this.discover();
    }
  }
  
  discover() {
    this.isDiscovered = true;
    
    // Grant reward
    switch (this.rewardType) {
      case "hackpoints":
        const points = this.scene.getVariables().get("PlayerHackPoints").getValue();
        this.scene.getVariables().get("PlayerHackPoints").setNumber(points + this.rewardAmount);
        break;
      case "health":
        const health = this.scene.getVariables().get("PlayerHealth").getValue();
        const maxHealth = this.scene.getVariables().get("PlayerMaxHealth").getValue();
        this.scene.getVariables().get("PlayerHealth")
          .setNumber(Math.min(health + this.rewardAmount, maxHealth));
        break;
      case "lore":
        // Unlock lore entry
        this.scene.getVariables().get(`Lore_${this.secretID}_Unlocked`).setNumber(1);
        break;
    }
    
    // Show discovery effect
    // Play sound
    // Display message
  }
};

// Environmental Hazard (Lava, Acid, etc.)
gdjs.DJTEnvironmentalHazard = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Configuration
    this.hazardType = behaviorData.HazardType || "lava"; // lava, acid, water, toxic
    this.damagePerSecond = behaviorData.DamagePerSecond || 50;
    this.isInstantDeath = behaviorData.IsInstantDeath || false;
    
    // State
    this.playerInHazard = false;
  }
  
  update(dt) {
    if (this.playerInHazard) {
      if (this.isInstantDeath) {
        this.scene.getVariables().get("PlayerHealth").setNumber(0);
      } else {
        const currentHealth = this.scene.getVariables().get("PlayerHealth").getValue();
        this.scene.getVariables().get("PlayerHealth")
          .setNumber(currentHealth - (this.damagePerSecond * dt));
      }
    }
    
    this.playerInHazard = false; // Reset, will be set by collision check
  }
  
  onPlayerCollision() {
    this.playerInHazard = true;
  }
};

// Export for GDevelop
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DJTMovingPlatform: gdjs.DJTMovingPlatform,
    DJTCrumblingBlock: gdjs.DJTCrumblingBlock,
    DJTConveyorBelt: gdjs.DJTConveyorBelt,
    DJTSpikeTrap: gdjs.DJTSpikeTrap,
    DJTLaserGrid: gdjs.DJTLaserGrid,
    DJTCheckpoint: gdjs.DJTCheckpoint,
    DJTSecretArea: gdjs.DJTSecretArea,
    DJTEnvironmentalHazard: gdjs.DJTEnvironmentalHazard
  };
}
