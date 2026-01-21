# DJT Blender Characters - Quick Reference

## Overview

This folder contains Python scripts and documentation for generating 3D character models for the **DJT: Devious Jezebel Trickery** universe in Blender 3D. All characters are designed as toy-model quality figures suitable for 3D printing, animation, and promotional materials.

## Quick Start Guide

### Prerequisites

- **Blender 3.6+** installed
- Basic familiarity with Blender interface
- Python scripting enabled (default in Blender)

### Basic Workflow

1. **Foundation Setup**
   ```
   Read: 00_FOUNDATION.md (project overview)
   ```

2. **Create Base Rig**
   ```
   Script: 01_Base_Rig.md
   Time: ~2 minutes
   Output: Complete armature with IK/FK
   ```

3. **Generate Body Mesh**
   ```
   Script: 02_Body_Mesh.md
   Time: ~3 minutes
   Output: Rigged body mesh with UV mapping
   ```

4. **Apply Materials**
   ```
   Script: 07_Materials.md
   Time: ~1 minute
   Output: PBR materials with neon effects
   ```

5. **Generate Character**
   ```
   Script: Character_[Name].md
   Time: ~5 minutes
   Output: Complete character with accessories
   ```

## File Structure

```
Blender-Characters/
├── 00_FOUNDATION.md              # Project overview and guidelines
├── 01_Base_Rig.md                # Armature generation
├── 02_Body_Mesh.md               # Body mesh generation
├── 07_Materials.md               # Material and shader system
├── Character_Protagonist.md      # The Infiltrator (hero)
├── Character_Elara.md            # The Hacker
├── Character_Morgana.md          # The CEO
├── Character_Vesper.md           # The Scientist (to be created)
├── Character_Sable.md            # The Manipulator (to be created)
├── Character_Nyx.md              # The Artist (to be created)
├── Character_Jezebel.md          # Council Leader (to be created)
└── README.md                     # This file
```

## Character Roster

### Main Characters

| Character | Height | Build | Color Scheme | Status |
|-----------|--------|-------|--------------|--------|
| **Protagonist** | 7.5" | Athletic | Dark blue, silver, cyan | ✅ Complete |
| **Elara** | 7.0" | Slim | Black, gray, neon green | ✅ Complete |
| **Morgana** | 8.5" | Commanding | Deep purple, gold | ✅ Complete |
| **Vesper** | 7.5" | Asymmetric | Burgundy, chrome | 📝 Planned |
| **Sable** | 7.8" | Elegant | Black, red | 📝 Planned |
| **Nyx** | 7.2" | Chaotic | White, rainbow neon | 📝 Planned |
| **Jezebel** | 8.0" | Regal | Purple-black, gold | 📝 Planned |

### Character Quick Reference

**Protagonist (The Infiltrator)**
- Tactical bodysuit with armor panels
- Tech gauntlets with holographic display
- Energy baton weapon
- Determined, heroic aesthetic

**Elara (The Hacker)**
- Casual hoodie with circuit patterns
- AR glasses with data streams
- Holographic wrist projectors
- Digital warfare specialist

**Morgana (The CEO)**
- Sharp-tailored power suit
- Exaggerated shoulder pads
- Stiletto heels and claw jewelry
- Commanding, intimidating presence

## Script Execution Order

### For New Characters

```
1. [ONCE] Generate base rig
   └─> Run: 01_Base_Rig.py

2. [ONCE] Generate body mesh
   └─> Run: 02_Body_Mesh.py

3. [PER CHARACTER] Apply materials
   └─> Set CHARACTER_NAME in 07_Materials.py
   └─> Run: 07_Materials.py

4. [PER CHARACTER] Generate character
   └─> Run: Character_[Name].py
```

### For Variations

```
1. Adjust body proportions in base config
2. Re-run 02_Body_Mesh.py
3. Apply character materials
4. Generate character accessories
```

## Common Parameters

### Body Type Presets

```python
# Athletic (Protagonist, Morgana)
BODY_TYPE = "athletic"
# Output: Balanced, toned physique

# Slim (Elara, Nyx)
BODY_TYPE = "slim"
# Output: Lean, agile build

# Muscular (Vesper - cybernetic)
BODY_TYPE = "muscular"
# Output: Strong, imposing build
```

### Height Guidelines

- **7.0" - 7.5"**: Standard characters
- **7.5" - 8.0"**: Heroic/commanding
- **8.0"+**: Dominant presence (Morgana, Jezebel)

### Color Palettes

Each character has signature colors in `CHARACTER_PALETTES`:
- `primary`: Main body/clothing color
- `secondary`: Accent elements
- `accent`: Detail highlights
- `emission`: Neon glow color
- `skin`: Skin tone
- `hair`: Hair color

## Customization Tips

### Adjusting Proportions

```python
# In character script
CHARACTER_CONFIG = {
    "height": 8.0,          # Total height
    "body_type": "athletic", # Preset type
    "shoulder_width": 1.6,  # Broader
    "muscle_definition": 0.7 # More defined
}
```

### Changing Colors

```python
# In character script
PALETTE = {
    "primary": (R, G, B),    # 0-1 range
    "emission": (R, G, B),   # Glow color
    # ... etc
}
```

### Toggling Accessories

```python
# In character script
ACCESSORIES = {
    "visor": False,          # Disable
    "weapon_holster": True,  # Enable
    # ... etc
}
```

## Export Options

### For 3D Printing

```python
# In Blender:
# 1. Select character objects
# 2. File > Export > STL
# 3. Settings:
#    - Scale: 1.0 (already in inches)
#    - Apply Modifiers: Yes
#    - Selection Only: Yes

# Recommended: Export parts separately
# - Head
# - Body
# - Arms (L/R)
# - Legs (L/R)
# - Accessories
```

### For Game Engines

```python
# In Blender:
# 1. Bake textures (BAKE_TEXTURES = True)
# 2. File > Export > FBX
# 3. Settings:
#    - Scale: Custom (0.01 for Unity)
#    - Apply Modifiers: Yes
#    - Armature: Yes
#    - Bake Animation: Yes (if rigged)
```

### For Rendering

```python
# Keep multi-object setup
# Use Cycles engine
# Resolution: 4K for promotional
# Samples: 256+ for final quality
```

## Troubleshooting

### Common Issues

**Problem**: Script errors on execution
- **Solution**: Ensure Blender 3.6+, run base scripts first

**Problem**: Mesh doesn't align with armature
- **Solution**: Ensure armature at world origin (0,0,0)

**Problem**: Materials look flat
- **Solution**: Switch to Rendered view (Z key > Rendered)
- Enable Bloom in Eevee render settings

**Problem**: Character parts separated
- **Solution**: Parent all objects to armature
- Organize in collections

### Performance Tips

- Use Eevee for real-time preview
- Switch to Cycles for final renders
- Disable subdivision in viewport
- Use Simplify settings for complex scenes

## Workflow Tips

### Efficient Character Creation

1. **Create template file**: Base rig + body
2. **Save versions**: Incremental saves (v01, v02, etc.)
3. **Use collections**: Organize by character
4. **Test poses early**: Catch rigging issues
5. **Bake incrementally**: Save texture versions

### Batch Processing

```python
# Create multiple characters in one session:
for character in ["Protagonist", "Elara", "Morgana"]:
    CHARACTER_NAME = character
    generate_materials()
    generate_character()
    organize_scene()
```

## Animation Quickstart

### Pose Mode Basics

```
1. Select armature
2. Tab or Ctrl+Tab > Pose Mode
3. Select bones:
   - Click bone
   - Shift+Click for multiple
4. Transform:
   - G: Move
   - R: Rotate
   - S: Scale
5. Insert keyframe: I
```

### Suggested Action Poses

**Protagonist**:
- Hero landing
- Combat stance
- Hacking holodisplay

**Elara**:
- Code flowing
- Data manipulation
- Casual lean

**Morgana**:
- Power pose
- Dismissive gesture
- Intimidating lean

## Rendering Showcase

### Turnaround Setup

```python
# 8 cameras at 45° intervals
# 3 heights: Eye level, low angle, high angle
# Clean background: Neutral gray
# Even lighting: 3-point setup
```

### Dramatic Lighting

```
- Key light: Strong, from side
- Rim light: Neon color (cyan/purple)
- Fill light: Soft, opposite side
- Background: Dark with gradient
```

### Material Showcase

```
- Close-up shots of:
  - Face details
  - Armor/clothing materials
  - Glowing elements
  - Weapon/accessories
```

## Community & Contribution

### Extending the System

1. **New characters**: Follow existing templates
2. **New accessories**: Modular approach
3. **Style variations**: Adjust presets
4. **Animation ribs**: Build on base rig

### Sharing Assets

- Export as .blend with linked assets
- Include texture files
- Document custom modifications
- Credit base system

## Resources

### Learning

- **Blender Manual**: https://docs.blender.org/
- **Python API**: https://docs.blender.org/api/
- **Character Modeling**: YouTube tutorials, CGCookie
- **Rigging**: Rigify docs, Pierrick Picaut

### Assets

- **Textures**: Texture Haven, Poly Haven
- **References**: Art Station, Pinterest
- **3D Printing**: Thingiverse, MyMiniFactory

### Community

- **Blender Artists**: Forum and gallery
- **r/blender**: Reddit community
- **BlenderNation**: News and tutorials
- **DJT Discord**: Project-specific (if established)

## Future Roadmap

### Planned Additions

- [ ] Remaining Council members (Vesper, Sable, Nyx, Jezebel)
- [ ] Enemy/minion character sets
- [ ] Facial rig system (03_Face_Rig.md)
- [ ] Hair system improvements (04_Hair_System.md)
- [ ] Clothing generator (05_Clothing_System.md)
- [ ] Accessory library (06_Accessories.md)
- [ ] Export optimization (08_Export_Setup.md)
- [ ] Pose library
- [ ] Animation presets
- [ ] 3D print optimization guide

### Stretch Goals

- Variant designs (battle-damaged, alternate costumes)
- Environmental props matching character themes
- Diorama bases
- Articulated joint system for physical toys
- Integration with game engines (Unity, Unreal)

## Version History

**v1.0** - January 2026
- Initial foundation document
- Base rig system
- Body mesh generator
- Material system
- Three complete characters (Protagonist, Elara, Morgana)
- Quick start guide

---

## Contact & Support

For questions, issues, or contributions to the DJT Character Model system, please refer to the main project documentation or community channels.

**Project**: DJT - Devious Jezebel Trickery  
**Character System Version**: 1.0  
**Last Updated**: January 2026  
**Blender Compatibility**: 3.6+

---

## Quick Command Reference

### Blender Shortcuts

```
Essential:
- Tab: Edit/Object mode toggle
- Ctrl+Tab: Pose mode (on armature)
- Z: Shading menu
- Alt+P: Run script
- Ctrl+S: Save
- Shift+A: Add object
- X: Delete
- G/R/S: Move/Rotate/Scale
- I: Insert keyframe (Pose mode)

Modeling:
- E: Extrude
- Ctrl+R: Loop cut
- Alt+Click: Select loop
- Ctrl+B: Bevel
- W: Subdivision

Useful:
- Numpad 0: Camera view
- Numpad 7: Top view
- F12: Render
- Shift+D: Duplicate
```

### Script Execution

```bash
# From Blender Python console:
import bpy
exec(open("/path/to/script.py").read())

# Or from Scripting workspace:
# 1. Load script
# 2. Alt+P to run
```

---

**Ready to create your DJT character army? Start with [00_FOUNDATION.md](00_FOUNDATION.md)!**
