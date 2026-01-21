// DJT Player Movement - Core Script
// Implements tight platformer controls inspired by Modern Mega Man

/**
 * DJT Platformer Movement System
 * Handles all player movement mechanics including:
 * - WASD/Arrow key movement with variable jump
 * - Double jump
 * - Dash with cooldown
 * - Wall slide and wall jump
 * - Sprint
 * - Input buffering for responsive controls
 */

gdjs.DJTPlatformerMovement = class {
  constructor(runtimeScene, object, behaviorData) {
    this.object = object;
    this.scene = runtimeScene;
    
    // Movement parameters from behavior properties
    this.maxRunSpeed = behaviorData.MaxRunSpeed || 250;
    this.sprintSpeed = behaviorData.SprintSpeed || 375;
    this.gravity = behaviorData.Gravity || 600;
    this.jumpSpeed = behaviorData.JumpSpeed || 450;
    this.dashDistance = behaviorData.DashDistance || 200;
    this.dashCooldown = behaviorData.DashCooldown || 0.5;
    this.wallSlideSpeed = behaviorData.WallSlideSpeed || 80;
    this.doubleJumpEnabled = behaviorData.DoubleJumpEnabled !== false;
    this.inputBufferFrames = behaviorData.InputBufferFrames || 5;
    
    // State variables
    this.velocityX = 0;
    this.velocityY = 0;
    this.isOnGround = false;
    this.isOnWall = false;
    this.wallDirection = 0; // -1 for left, 1 for right
    this.hasDoubleJump = false;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashCooldownTimer = 0;
    
    // Input buffering
    this.jumpBuffered = false;
    this.jumpBufferTimer = 0;
    this.dashBuffered = false;
    this.dashBufferTimer = 0;
    
    // Animation state
    this.facingDirection = 1; // 1 for right, -1 for left
    this.currentAnimation = "Idle";
  }
  
  doStepPreEvents(runtimeScene) {
    const dt = runtimeScene.getElapsedTime();
    this.update(dt);
  }
  
  update(dt) {
    // Update timers
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= dt;
    }
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
    }
    if (this.dashBufferTimer > 0) {
      this.dashBufferTimer -= dt;
    }
    
    // Check ground and wall collision
    this.checkCollisions();
    
    // Handle input
    this.handleInput();
    
    // Apply gravity
    if (!this.isDashing && !this.isOnGround) {
      if (this.isOnWall) {
        // Wall slide
        this.velocityY = Math.min(this.velocityY + this.gravity * dt, this.wallSlideSpeed);
      } else {
        // Normal gravity
        this.velocityY += this.gravity * dt;
      }
    }
    
    // Handle dash
    if (this.isDashing) {
      this.dashTimer -= dt;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.velocityX *= 0.5; // Slow down after dash
      }
    }
    
    // Apply velocity
    this.object.setX(this.object.getX() + this.velocityX * dt);
    this.object.setY(this.object.getY() + this.velocityY * dt);
    
    // Update animations
    this.updateAnimation();
  }
  
  handleInput() {
    const scene = this.scene;
    const leftPressed = scene.getGame().getInputManager().isKeyPressed("Left") || 
                       scene.getGame().getInputManager().isKeyPressed("a");
    const rightPressed = scene.getGame().getInputManager().isKeyPressed("Right") || 
                        scene.getGame().getInputManager().isKeyPressed("d");
    const jumpPressed = scene.getGame().getInputManager().wasKeyReleased("Space") ||
                       scene.getGame().getInputManager().wasKeyReleased("w") ||
                       scene.getGame().getInputManager().wasKeyReleased("Up");
    const jumpHeld = scene.getGame().getInputManager().isKeyPressed("Space") ||
                    scene.getGame().getInputManager().isKeyPressed("w") ||
                    scene.getGame().getInputManager().isKeyPressed("Up");
    const sprintPressed = scene.getGame().getInputManager().isKeyPressed("LShift");
    const dashPressed = scene.getGame().getInputManager().wasKeyReleased("LControl");
    
    // Horizontal movement
    if (!this.isDashing) {
      let moveSpeed = this.maxRunSpeed;
      if (sprintPressed && this.isOnGround) {
        moveSpeed = this.sprintSpeed;
      }
      
      if (leftPressed && !rightPressed) {
        this.velocityX = -moveSpeed;
        this.facingDirection = -1;
      } else if (rightPressed && !leftPressed) {
        this.velocityX = moveSpeed;
        this.facingDirection = 1;
      } else {
        // Deceleration
        this.velocityX *= 0.8;
        if (Math.abs(this.velocityX) < 10) {
          this.velocityX = 0;
        }
      }
    }
    
    // Jump input buffering
    if (jumpPressed) {
      this.jumpBuffered = true;
      this.jumpBufferTimer = this.inputBufferFrames / 60; // Convert frames to seconds
    }
    
    // Jump logic
    if (this.jumpBuffered && this.jumpBufferTimer > 0) {
      if (this.isOnGround) {
        // Ground jump
        this.velocityY = -this.jumpSpeed;
        this.hasDoubleJump = true;
        this.jumpBuffered = false;
        this.isOnGround = false;
      } else if (this.isOnWall) {
        // Wall jump
        this.velocityY = -this.jumpSpeed;
        this.velocityX = -this.wallDirection * this.maxRunSpeed * 1.2;
        this.hasDoubleJump = true;
        this.jumpBuffered = false;
        this.isOnWall = false;
      } else if (this.hasDoubleJump && this.doubleJumpEnabled) {
        // Double jump
        this.velocityY = -this.jumpSpeed * 0.9;
        this.hasDoubleJump = false;
        this.jumpBuffered = false;
      }
    }
    
    // Variable jump height
    if (!jumpHeld && this.velocityY < 0) {
      this.velocityY *= 0.5; // Cut jump short if button released
    }
    
    // Dash input buffering
    if (dashPressed) {
      this.dashBuffered = true;
      this.dashBufferTimer = this.inputBufferFrames / 60;
    }
    
    // Dash logic
    if (this.dashBuffered && this.dashBufferTimer > 0 && 
        this.dashCooldownTimer <= 0 && !this.isDashing) {
      this.isDashing = true;
      this.dashTimer = 0.15; // Dash duration
      this.dashCooldownTimer = this.dashCooldown;
      this.velocityX = this.facingDirection * this.dashDistance / this.dashTimer;
      this.velocityY = 0;
      this.dashBuffered = false;
    }
  }
  
  checkCollisions() {
    // This is a simplified collision check
    // In GDevelop, you would use the built-in collision system
    // These flags would be set by collision events in your game
    
    // Reset states (will be set by external collision events)
    this.isOnGround = false;
    this.isOnWall = false;
  }
  
  updateAnimation() {
    let newAnimation = "Idle";
    
    if (this.isDashing) {
      newAnimation = "Dash";
    } else if (!this.isOnGround) {
      if (this.velocityY < 0) {
        newAnimation = "Jump";
      } else {
        newAnimation = "Fall";
      }
      if (this.isOnWall) {
        newAnimation = "WallSlide";
      }
    } else if (Math.abs(this.velocityX) > 50) {
      newAnimation = "Run";
    }
    
    if (newAnimation !== this.currentAnimation) {
      this.currentAnimation = newAnimation;
      // Set animation on object
      if (this.object.setAnimation) {
        this.object.setAnimation(newAnimation);
      }
    }
    
    // Flip sprite based on direction
    if (this.facingDirection === -1) {
      this.object.flipX(true);
    } else {
      this.object.flipX(false);
    }
  }
  
  // Public methods for external use
  setOnGround(onGround) {
    if (onGround && !this.isOnGround) {
      this.hasDoubleJump = true;
    }
    this.isOnGround = onGround;
  }
  
  setOnWall(onWall, direction) {
    this.isOnWall = onWall;
    this.wallDirection = direction;
  }
  
  getVelocityX() {
    return this.velocityX;
  }
  
  getVelocityY() {
    return this.velocityY;
  }
  
  isDashingState() {
    return this.isDashing;
  }
};
