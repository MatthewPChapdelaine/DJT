// DJT Progression System - Core Script
// Player progression, upgrades, and save system

/**
 * DJT Progression System
 * 
 * Features:
 * - Hack Points currency system
 * - Upgrade terminal in hub world
 * - Multiple upgrade categories
 * - Difficulty scaling
 * - Save/load functionality
 * - Progress tracking
 * - Achievement system
 */

gdjs.DJTProgression = class {
  constructor(runtimeScene) {
    this.scene = runtimeScene;
    
    // Player stats
    this.hackPoints = 0;
    this.maxHealth = 100;
    this.currentHealth = 100;
    this.difficulty = "Normal"; // Easy, Normal, Hard, Nightmare
    
    // Upgrades
    this.upgrades = {
      maxHP: {
        level: 0,
        maxLevel: 5,
        cost: [200, 300, 400, 500, 600],
        bonus: [10, 10, 15, 15, 20],
        name: "Max Health Boost",
        description: "Increase maximum health"
      },
      weaponSwapSpeed: {
        level: 0,
        maxLevel: 3,
        cost: [250, 350, 500],
        bonus: [0.05, 0.05, 0.1], // Reduce swap time
        name: "Quick Swap",
        description: "Faster weapon switching"
      },
      dashCooldown: {
        level: 0,
        maxLevel: 3,
        cost: [300, 400, 600],
        bonus: [0.1, 0.1, 0.15], // Reduce cooldown
        name: "Rapid Dash",
        description: "Shorter dash cooldown"
      },
      wallSlideControl: {
        level: 0,
        maxLevel: 3,
        cost: [200, 300, 400],
        bonus: [10, 15, 20], // Reduce slide speed
        name: "Wall Grip",
        description: "Better wall slide control"
      },
      chargeSpeed: {
        level: 0,
        maxLevel: 3,
        cost: [350, 450, 600],
        bonus: [0.15, 0.2, 0.25], // Reduce charge time
        name: "Quick Charge",
        description: "Faster weapon charging"
      },
      damageBoost: {
        level: 0,
        maxLevel: 5,
        cost: [300, 400, 500, 700, 900],
        bonus: [0.1, 0.1, 0.15, 0.15, 0.2], // Damage multiplier
        name: "Power Up",
        description: "Increase damage dealt"
      },
      ammoEfficiency: {
        level: 0,
        maxLevel: 3,
        cost: [400, 500, 700],
        bonus: [0.2, 0.2, 0.3], // Chance to not consume ammo
        name: "Ammo Conservation",
        description: "Chance to preserve ammo"
      }
    };
    
    // Progress tracking
    this.bossesDefeated = [];
    this.weaponsUnlocked = [0]; // Start with basic weapon
    this.levelsCompleted = [];
    this.secretsFound = [];
    this.loreCollected = [];
    
    // Difficulty modifiers
    this.difficultySettings = {
      Easy: {
        playerHPMultiplier: 1.5,
        enemyDamageMultiplier: 0.5,
        enemyHPMultiplier: 0.8,
        hackPointsMultiplier: 0.8
      },
      Normal: {
        playerHPMultiplier: 1.0,
        enemyDamageMultiplier: 1.0,
        enemyHPMultiplier: 1.0,
        hackPointsMultiplier: 1.0
      },
      Hard: {
        playerHPMultiplier: 0.75,
        enemyDamageMultiplier: 2.0,
        enemyHPMultiplier: 1.5,
        hackPointsMultiplier: 1.5
      },
      Nightmare: {
        playerHPMultiplier: 0.5,
        enemyDamageMultiplier: 3.0,
        enemyHPMultiplier: 2.0,
        hackPointsMultiplier: 2.0
      }
    };
    
    this.loadGameData();
  }
  
  // Hack Points
  addHackPoints(amount) {
    const modifier = this.difficultySettings[this.difficulty].hackPointsMultiplier;
    const adjusted = Math.floor(amount * modifier);
    this.hackPoints += adjusted;
    
    // Show notification
    this.showNotification(`+${adjusted} Hack Points`);
    
    this.saveGameData();
  }
  
  spendHackPoints(amount) {
    if (this.hackPoints >= amount) {
      this.hackPoints -= amount;
      this.saveGameData();
      return true;
    }
    return false;
  }
  
  getHackPoints() {
    return this.hackPoints;
  }
  
  // Upgrades
  canAffordUpgrade(upgradeKey) {
    const upgrade = this.upgrades[upgradeKey];
    if (upgrade.level >= upgrade.maxLevel) {
      return false;
    }
    const cost = upgrade.cost[upgrade.level];
    return this.hackPoints >= cost;
  }
  
  purchaseUpgrade(upgradeKey) {
    const upgrade = this.upgrades[upgradeKey];
    
    if (upgrade.level >= upgrade.maxLevel) {
      return { success: false, message: "Maximum level reached" };
    }
    
    const cost = upgrade.cost[upgrade.level];
    
    if (!this.spendHackPoints(cost)) {
      return { success: false, message: "Insufficient Hack Points" };
    }
    
    upgrade.level++;
    this.applyUpgrade(upgradeKey);
    this.saveGameData();
    
    return { 
      success: true, 
      message: `Upgraded ${upgrade.name} to level ${upgrade.level}!`
    };
  }
  
  applyUpgrade(upgradeKey) {
    const upgrade = this.upgrades[upgradeKey];
    const bonus = upgrade.bonus[upgrade.level - 1];
    
    switch (upgradeKey) {
      case "maxHP":
        this.maxHealth += bonus;
        this.currentHealth = Math.min(this.currentHealth + bonus, this.maxHealth);
        break;
      case "weaponSwapSpeed":
        // Applied in weapon system
        break;
      case "dashCooldown":
        // Applied in movement system
        break;
      case "wallSlideControl":
        // Applied in movement system
        break;
      case "chargeSpeed":
        // Applied in weapon system
        break;
      case "damageBoost":
        // Applied to damage calculations
        break;
      case "ammoEfficiency":
        // Applied in weapon system
        break;
    }
  }
  
  getUpgradeBonus(upgradeKey) {
    const upgrade = this.upgrades[upgradeKey];
    let total = 0;
    for (let i = 0; i < upgrade.level; i++) {
      total += upgrade.bonus[i];
    }
    return total;
  }
  
  getUpgradeInfo(upgradeKey) {
    const upgrade = this.upgrades[upgradeKey];
    return {
      name: upgrade.name,
      description: upgrade.description,
      level: upgrade.level,
      maxLevel: upgrade.maxLevel,
      cost: upgrade.level < upgrade.maxLevel ? upgrade.cost[upgrade.level] : null,
      nextBonus: upgrade.level < upgrade.maxLevel ? upgrade.bonus[upgrade.level] : null
    };
  }
  
  getAllUpgrades() {
    const result = {};
    for (const key in this.upgrades) {
      result[key] = this.getUpgradeInfo(key);
    }
    return result;
  }
  
  // Difficulty
  setDifficulty(difficulty) {
    if (this.difficultySettings[difficulty]) {
      this.difficulty = difficulty;
      this.applyDifficultyModifiers();
      this.saveGameData();
    }
  }
  
  getDifficulty() {
    return this.difficulty;
  }
  
  getDifficultyModifiers() {
    return this.difficultySettings[this.difficulty];
  }
  
  applyDifficultyModifiers() {
    const modifiers = this.difficultySettings[this.difficulty];
    
    // Adjust max health
    const baseHealth = 100;
    this.maxHealth = Math.floor(baseHealth * modifiers.playerHPMultiplier);
    
    // Recalculate with upgrades
    this.maxHealth += this.getUpgradeBonus("maxHP");
    
    // Adjust current health proportionally
    const healthPercent = this.currentHealth / this.maxHealth;
    this.currentHealth = Math.floor(this.maxHealth * healthPercent);
  }
  
  // Progress Tracking
  markBossDefeated(bossName, weaponID) {
    if (!this.bossesDefeated.includes(bossName)) {
      this.bossesDefeated.push(bossName);
    }
    
    if (!this.weaponsUnlocked.includes(weaponID)) {
      this.weaponsUnlocked.push(weaponID);
    }
    
    this.saveGameData();
  }
  
  markLevelCompleted(levelID) {
    if (!this.levelsCompleted.includes(levelID)) {
      this.levelsCompleted.push(levelID);
    }
    
    this.saveGameData();
  }
  
  markSecretFound(secretID) {
    if (!this.secretsFound.includes(secretID)) {
      this.secretsFound.push(secretID);
    }
    
    this.saveGameData();
  }
  
  markLoreCollected(loreID) {
    if (!this.loreCollected.includes(loreID)) {
      this.loreCollected.push(loreID);
    }
    
    this.saveGameData();
  }
  
  isBossDefeated(bossName) {
    return this.bossesDefeated.includes(bossName);
  }
  
  isWeaponUnlocked(weaponID) {
    return this.weaponsUnlocked.includes(weaponID);
  }
  
  isLevelCompleted(levelID) {
    return this.levelsCompleted.includes(levelID);
  }
  
  getCompletionPercent() {
    const totalBosses = 6;
    const totalSecrets = 10;
    const totalLore = 10;
    
    const bossPercent = (this.bossesDefeated.length / totalBosses) * 40;
    const secretPercent = (this.secretsFound.length / totalSecrets) * 30;
    const lorePercent = (this.loreCollected.length / totalLore) * 30;
    
    return Math.floor(bossPercent + secretPercent + lorePercent);
  }
  
  // Save/Load
  saveGameData() {
    const saveData = {
      hackPoints: this.hackPoints,
      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,
      difficulty: this.difficulty,
      upgrades: {},
      bossesDefeated: this.bossesDefeated,
      weaponsUnlocked: this.weaponsUnlocked,
      levelsCompleted: this.levelsCompleted,
      secretsFound: this.secretsFound,
      loreCollected: this.loreCollected,
      timestamp: Date.now()
    };
    
    // Save upgrade levels only
    for (const key in this.upgrades) {
      saveData.upgrades[key] = this.upgrades[key].level;
    }
    
    // Use GDevelop's storage
    if (typeof gdjs !== 'undefined' && gdjs.evtTools && gdjs.evtTools.storage) {
      gdjs.evtTools.storage.writeStringInJSONFile(
        "DJT_SaveData",
        "save",
        JSON.stringify(saveData)
      );
    } else {
      // Fallback to localStorage
      localStorage.setItem("DJT_SaveData", JSON.stringify(saveData));
    }
  }
  
  loadGameData() {
    let saveData = null;
    
    // Try GDevelop storage first
    if (typeof gdjs !== 'undefined' && gdjs.evtTools && gdjs.evtTools.storage) {
      const dataStr = gdjs.evtTools.storage.readStringFromJSONFile("DJT_SaveData", "save");
      if (dataStr) {
        try {
          saveData = JSON.parse(dataStr);
        } catch (e) {
          console.error("Failed to parse save data", e);
        }
      }
    } else {
      // Fallback to localStorage
      const dataStr = localStorage.getItem("DJT_SaveData");
      if (dataStr) {
        try {
          saveData = JSON.parse(dataStr);
        } catch (e) {
          console.error("Failed to parse save data", e);
        }
      }
    }
    
    if (saveData) {
      this.hackPoints = saveData.hackPoints || 0;
      this.maxHealth = saveData.maxHealth || 100;
      this.currentHealth = saveData.currentHealth || 100;
      this.difficulty = saveData.difficulty || "Normal";
      this.bossesDefeated = saveData.bossesDefeated || [];
      this.weaponsUnlocked = saveData.weaponsUnlocked || [0];
      this.levelsCompleted = saveData.levelsCompleted || [];
      this.secretsFound = saveData.secretsFound || [];
      this.loreCollected = saveData.loreCollected || [];
      
      // Restore upgrade levels
      if (saveData.upgrades) {
        for (const key in saveData.upgrades) {
          if (this.upgrades[key]) {
            this.upgrades[key].level = saveData.upgrades[key];
          }
        }
      }
    }
  }
  
  resetProgress() {
    this.hackPoints = 0;
    this.maxHealth = 100;
    this.currentHealth = 100;
    this.difficulty = "Normal";
    this.bossesDefeated = [];
    this.weaponsUnlocked = [0];
    this.levelsCompleted = [];
    this.secretsFound = [];
    this.loreCollected = [];
    
    // Reset upgrades
    for (const key in this.upgrades) {
      this.upgrades[key].level = 0;
    }
    
    this.saveGameData();
  }
  
  // Notifications
  showNotification(message) {
    // Display notification on screen
    // Would use GDevelop's UI system
    console.log("Notification:", message);
  }
  
  // Stats for display
  getStats() {
    return {
      hackPoints: this.hackPoints,
      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,
      difficulty: this.difficulty,
      bossesDefeated: this.bossesDefeated.length,
      weaponsUnlocked: this.weaponsUnlocked.length,
      secretsFound: this.secretsFound.length,
      loreCollected: this.loreCollected.length,
      completionPercent: this.getCompletionPercent(),
      upgradeLevels: Object.keys(this.upgrades).reduce((acc, key) => {
        acc[key] = this.upgrades[key].level;
        return acc;
      }, {})
    };
  }
};

// Global progression instance
gdjs.DJTProgressionManager = null;

// Initialize progression system
gdjs.initializeDJTProgression = function(runtimeScene) {
  if (!gdjs.DJTProgressionManager) {
    gdjs.DJTProgressionManager = new gdjs.DJTProgression(runtimeScene);
  }
  return gdjs.DJTProgressionManager;
};

// Helper functions for GDevelop events
gdjs.DJTProgressionHelpers = {
  addHackPoints: function(amount) {
    if (gdjs.DJTProgressionManager) {
      gdjs.DJTProgressionManager.addHackPoints(amount);
    }
  },
  
  getHackPoints: function() {
    return gdjs.DJTProgressionManager ? gdjs.DJTProgressionManager.getHackPoints() : 0;
  },
  
  purchaseUpgrade: function(upgradeKey) {
    if (gdjs.DJTProgressionManager) {
      return gdjs.DJTProgressionManager.purchaseUpgrade(upgradeKey);
    }
    return { success: false, message: "System not initialized" };
  },
  
  getDifficulty: function() {
    return gdjs.DJTProgressionManager ? gdjs.DJTProgressionManager.getDifficulty() : "Normal";
  },
  
  setDifficulty: function(difficulty) {
    if (gdjs.DJTProgressionManager) {
      gdjs.DJTProgressionManager.setDifficulty(difficulty);
    }
  }
};
