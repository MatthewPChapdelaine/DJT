# DJT: Devious Jezebel Trickery

**A Modern Mega Man-Inspired Platformer Game & Media Project**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![GDevelop](https://img.shields.io/badge/GDevelop-5.0%2B-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## 🎮 About DJT

**DJT: Devious Jezebel Trickery** is a Modern Mega Man-inspired platformer featuring a Council of Evil Women who use highly intelligent and creative (yet criminally insane) tactics. The game combines tight platforming controls, a diverse weapon system, epic boss battles, and a neon cyberpunk comic book aesthetic.

This repository contains:
- 📚 Complete game design documents
- 🎯 Fully-built GDevelop 5 Asset Pack
- 🛠️ Reusable behaviors and scripts
- 📖 Comprehensive documentation

---

## ✨ Features

### Player Mechanics
- **Advanced Movement:** Wall-sliding, dashing, double-jump, variable jump height
- **Weapon System:** 7 unique weapons with switching, ammo management, and charge shots
- **Combat:** Projectiles, melee attacks, and weapon-specific special abilities

### Enemy & Boss AI
- **Smart Enemies:** State-based AI with patrol, alert, attack, and flee behaviors
- **Epic Boss Battles:** Multi-phase bosses with complex attack patterns
- **6 Council Members:** Each with unique mechanics and weapon drops

### Game Systems
- **Progression:** Hack Points currency and 7 upgrade categories
- **Difficulty Modes:** Easy, Normal, Hard, and Nightmare
- **Save System:** Automatic progress tracking
- **Level Utilities:** Moving platforms, hazards, checkpoints, secrets

### Visual & Audio
- **Neon Cyberpunk Style:** High-contrast comic book aesthetic
- **Dynamic HUD:** Health bars, weapon display, mini-map, damage numbers
- **Screen Effects:** Camera shake, hit freeze, visual juice

---

## 📦 GDevelop 5 Asset Pack

The complete, production-ready asset pack is located in `/GDevelop-Asset-Pack/`.

### What's Included

```
GDevelop-Asset-Pack/
├── Extensions/              # 7 GDevelop extensions
│   ├── DJT_PlayerMovement.json
│   ├── DJT_WeaponSystem.json
│   ├── DJT_EnemyAI.json
│   ├── DJT_BossBattle.json
│   ├── DJT_HUD.json
│   ├── DJT_LevelUtils.json
│   └── DJT_Progression.json
├── Scripts/                 # JavaScript implementations
├── Documentation/           # Complete guides
│   ├── README.md           # Full documentation
│   ├── QUICK_START.md      # 10-minute setup
│   └── BOSS_GUIDE.md       # Boss creation guide
└── Examples/               # Example scenes (coming soon)
```

### Quick Start

1. **Install:**
   - Open GDevelop 5
   - Import extensions from `GDevelop-Asset-Pack/Extensions/`

2. **Setup (10 minutes):**
   - Follow `/GDevelop-Asset-Pack/Documentation/QUICK_START.md`

3. **Build:**
   - Use the asset pack to create your own platformer!

### Documentation

📖 **[Full Documentation](GDevelop-Asset-Pack/Documentation/README.md)** - Complete asset pack guide  
🚀 **[Quick Start Guide](GDevelop-Asset-Pack/Documentation/QUICK_START.md)** - Get running in 10 minutes  
👾 **[Boss Creation Guide](GDevelop-Asset-Pack/Documentation/BOSS_GUIDE.md)** - Create epic boss battles

---

## 🎨 Design Documents

### Game Design
- **[DJT - Devious Jezebel Trickery.md](DJT%20-%20Devious%20Jezebel%20Trickery.md)** - Webcomic concept
- **[DJT_ Devious Jezebel Trickery - Platformer Game.md](DJT_%20Devious%20Jezebel%20Trickery%20-%20Platformer%20Game.md)** - Complete game design document

### Game Concept
**Protagonist:** A skilled infiltrator fighting against the Council's schemes  
**Antagonists:** 6 Council members, each with unique domains and abilities  
**Gameplay:** Tight platforming + weapon variety + boss battles  
**Aesthetic:** Neon cyberpunk meets comic book art

---

## 🚀 Getting Started

### For Game Developers

1. **Clone Repository:**
   ```bash
   git clone https://github.com/your-username/DJT.git
   cd DJT
   ```

2. **Open GDevelop 5:**
   - Import extensions from `GDevelop-Asset-Pack/Extensions/`

3. **Follow Quick Start:**
   - See `GDevelop-Asset-Pack/Documentation/QUICK_START.md`

4. **Build Your Game:**
   - Use the asset pack as a foundation
   - Customize to your theme

### For Asset Pack Users

The DJT Asset Pack is **fully reusable** for any platformer project:
- ✅ Use with any game theme
- ✅ Customize all parameters
- ✅ Extend with your own mechanics
- ✅ Free for personal and commercial use (MIT License)

---

## 🎮 Game Structure

### 6 Main Levels + Hub World

1. **Hacker's Den** → Boss: Elara → Weapon: Spark Chain
2. **Corporate Tower** → Boss: Vesper → Weapon: Gravity Well
3. **Secret Lab** → Boss: Nyx → Weapon: Plasma Beam
4. **CEO's Penthouse** → Boss: Lilith → Weapon: Decoy Clone
5. **Art Studio Chaos** → Boss: (Artist Boss) → Weapon: (TBD)
6. **Council Chamber** → Boss: Council Avatar → Weapon: Fractal Mirror

**Hub World:** Upgrade terminal, level select, lore terminal

---

## 🛠️ Technical Details

### Built With
- **Game Engine:** GDevelop 5
- **Language:** JavaScript (behaviors & scripts)
- **Format:** JSON (extensions)
- **Target Platforms:** Web, Windows, macOS, Linux

### System Requirements (Asset Pack)
- **GDevelop:** Version 5.0.0 or higher
- **Target Performance:** 60 FPS
- **Memory:** Under 200MB
- **Resolution:** 1280x720 minimum

### Performance Optimizations
- Object pooling for projectiles
- Efficient collision detection
- Asset optimization
- 60 FPS target on modern hardware

---

## 📊 Asset Pack Features by Category

### Movement & Controls
- ✅ Variable jump height
- ✅ Double jump
- ✅ Wall slide & wall jump
- ✅ Dash with cooldown
- ✅ Sprint
- ✅ Input buffering (5 frames)
- ✅ Momentum-based physics

### Combat System
- ✅ 7 unique weapons
- ✅ Weapon switching (1-7 keys or E/Q)
- ✅ Ammo management
- ✅ Charge shots
- ✅ Melee attacks
- ✅ Projectile system
- ✅ Damage calculation

### AI & Enemies
- ✅ State machine (Idle, Patrol, Alert, Attack, Flee)
- ✅ 3 enemy types (Minion, Elite, Boss)
- ✅ Attack telegraphing
- ✅ Detection radius
- ✅ Multiple attack patterns

### Boss Battles
- ✅ Multi-phase system (1-5 phases)
- ✅ 6 attack types
- ✅ HP-based phase transitions
- ✅ Dialogue system
- ✅ Weapon drops
- ✅ Boss health bars

### UI & HUD
- ✅ Health bar
- ✅ Weapon display with ammo
- ✅ Mini-map
- ✅ Boss health bar
- ✅ Dialogue boxes
- ✅ Pause menu
- ✅ Settings menu
- ✅ Damage numbers
- ✅ Screen shake & hit freeze

### Level Design
- ✅ Moving platforms
- ✅ Crumbling blocks
- ✅ Conveyor belts
- ✅ Spike traps
- ✅ Laser grids
- ✅ Checkpoints
- ✅ Secret areas
- ✅ Environmental hazards

### Progression
- ✅ Hack Points currency
- ✅ 7 upgrade categories
- ✅ 4 difficulty modes
- ✅ Save/load system
- ✅ Boss completion tracking
- ✅ Collectible tracking
- ✅ Achievement framework

---

## 🎨 Visual Style

**Neon Cyberpunk Comic Book Aesthetic**

### Color Palette
- **Bright Pink:** #FF1493 (primary)
- **Electric Blue:** #00D4FF (secondary)
- **Deep Purple:** #4B0082 (tertiary)
- **Acid Green:** #00FF00 (highlight)
- **Dark Charcoal:** #1A1A1A (background)

### Art Requirements
- Bold outlines
- High contrast
- Glow effects
- Exaggerated expressions
- Motion blur on projectiles

---

## 🤝 Contributing

This asset pack is open for contributions!

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Contribution Ideas
- Additional boss patterns
- New weapon types
- Enemy variants
- Level utilities
- Documentation improvements
- Example scenes

---

## 📄 License

**MIT License**

Free to use in personal and commercial projects.

See [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

**Created by:** DJT Team  
**Design by:** @dd1_of_x  
**Inspired by:** Mega Man series (Capcom)

### Acknowledgments
- Modern Mega Man game mechanics
- GDevelop 5 community
- Open source contributors

---

## 📧 Support & Community

### Get Help
- 📖 **Documentation:** See `/GDevelop-Asset-Pack/Documentation/`
- 💬 **Discord:** [Coming Soon]
- 🐛 **Issues:** [GitHub Issues](https://github.com/your-username/DJT/issues)
- 📧 **Email:** support@djt-game.com

### Stay Updated
- ⭐ **Star this repo** to follow development
- 👁️ **Watch** for updates
- 🍴 **Fork** to customize

---

## 🗺️ Roadmap

### Version 1.0.0 (Current)
- ✅ Complete asset pack
- ✅ All core systems
- ✅ Full documentation

### Version 1.1.0 (Planned)
- [ ] Example scenes
- [ ] Visual assets (sprites)
- [ ] Audio assets (SFX & music)
- [ ] Video tutorials

### Version 2.0.0 (Future)
- [ ] Mobile touch controls
- [ ] Gamepad support
- [ ] New weapon types
- [ ] Boss rush mode
- [ ] Endless mode

---

## 📊 Stats

- **7 Extensions** - Complete game systems
- **8 JavaScript Files** - ~4,000 lines of code
- **7 Weapon Types** - Unique special abilities
- **6 Boss Battles** - Council members
- **4 Difficulty Modes** - Scalable challenge
- **3 Documentation Guides** - Complete reference

---

## 🎯 Use Cases

Perfect for:
- 🎮 **Platformer Games** - Modern Mega Man style
- 📚 **Learning GDevelop** - Study production-quality code
- 🛠️ **Rapid Prototyping** - Build games faster
- 🎨 **Game Jams** - Pre-built systems
- 🏫 **Teaching** - Example of good practices

---

## 🌟 Why Use This Asset Pack?

✅ **Production Ready** - Not a prototype, fully implemented  
✅ **Well Documented** - Every feature explained  
✅ **Highly Customizable** - Adjust all parameters  
✅ **Best Practices** - Clean code, optimized performance  
✅ **Free & Open** - MIT license, use anywhere  
✅ **Active Support** - Issues and PRs welcome  

---

**Build Your Own Mega Man-Style Platformer Today!** 🚀

*DJT: Devious Jezebel Trickery - Asset Pack v1.0.0*
