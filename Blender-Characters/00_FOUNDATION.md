# DJT Character Models - Blender 3D Foundation Document

## Project Overview

This folder contains a comprehensive system for creating rigged toy model characters for the **DJT: Devious Jezebel Trickery** universe using Blender 3D and Python scripting. The models are designed as stylized, collectible-quality figures suitable for:

- 3D printing
- Animation reference
- Game asset development
- Promotional materials
- Collectible figure production

## Design Philosophy

### Style Guidelines
- **Semi-realistic proportions** with exaggerated features for character personality
- **Toy-friendly geometry**: Clean topology suitable for 3D printing
- **Modular design**: Interchangeable parts and accessories
- **Scale**: 1 Blender unit = 1 inch (figures approximately 6-8 inches tall)
- **Aesthetic**: Dark cyberpunk meets comic book art with neon accents

### Color Palette
- **Council Members**: Dark palettes (blacks, deep purples, burgundy) with neon highlights
- **Protagonist**: Lighter tones with blue/teal accents for contrast
- **Accents**: Neon pinks, purples, cyans against dark backgrounds
- **Materials**: Mix of matte plastics, metallic details, and translucent energy effects

## Character Roster

### Main Characters

1. **The Protagonist (Infiltrator)**
   - Female resistance fighter
   - Tactical gear with tech accents
   - Athletic build, determined expression
   - Signature colors: Dark blue, silver, cyan highlights

2. **Elara (The Hacker)**
   - Digital aesthetic integration
   - Holographic projections accessories
   - Neon green/cyan accents
   - Casual tech-wear style

3. **Morgana (The CEO)**
   - Power suit with intimidating presence
   - Corporate luxury meets menace
   - Deep purple and gold color scheme
   - Sharp, angular design elements

4. **Dr. Vesper (The Scientist)**
   - Lab coat with cybernetic enhancements
   - Mad scientist aesthetic
   - Burgundy and chrome accents
   - Asymmetrical design elements

5. **Sable (The Manipulator)**
   - Elegant, seductive design
   - Fashion-forward with sinister edge
   - Black and red color scheme
   - Flowing elements (hair, coat)

6. **Nyx (The Artist)**
   - Chaotic, unpredictable aesthetic
   - Paint splatters and artistic tools
   - Rainbow neon accents
   - Expressive, dynamic poses

7. **The Jezebel (Council Leader)**
   - Regal, commanding presence
   - Combination of all Council aesthetics
   - Deep purple, black, and gold
   - Crown or headpiece element

## Technical Specifications

### Model Requirements

#### Geometry Standards
- **Polygon count**: 15,000-30,000 tris per character (toy model detail)
- **Topology**: Quad-based for deformation areas, tris acceptable for rigid parts
- **UV mapping**: Single 2K texture atlas per character
- **Level of detail**: Medium-high detail suitable for close-up views

#### Rigging Standards
- **Bone count**: 60-100 bones per character
- **IK/FK switching**: Available for arms and legs
- **Facial rig**: 20-30 shape keys for expressions
- **Custom properties**: Pose sliders for quick adjustments
- **Control rig**: User-friendly interface with color-coded controllers

#### Materials and Textures
- **PBR workflow**: Base Color, Metallic, Roughness, Normal, Emission
- **Texture resolution**: 2048x2048 per character
- **Material slots**: 1-3 per character (base, accessories, effects)
- **Shader nodes**: Procedural setup for flexibility

### 3D Printing Considerations
- **Wall thickness**: Minimum 2mm for structural integrity
- **Hollowing**: Large pieces hollowed with drainage holes
- **Support structures**: Minimize overhangs, design split points
- **Connector system**: Pegs and sockets for modular assembly
- **Base plate**: Integrated stand connection points

## Python Script Architecture

### Script Structure

Each character generation follows a modular pipeline:

1. **01_Base_Rig.md**: Core armature and control system
2. **02_Body_Mesh.md**: Base body geometry generation
3. **03_Face_Rig.md**: Facial animation system
4. **04_Hair_System.md**: Hair/fur generation and styling
5. **05_Clothing_System.md**: Outfit generation with cloth simulation
6. **06_Accessories.md**: Props and accessories generation
7. **07_Materials.md**: Shader setup and texture baking
8. **08_Export_Setup.md**: Export configurations for various uses

### Character-Specific Scripts

Individual character scripts combine base systems with unique elements:

- **Protagonist.md**: Tactical gear, weapons, determined expressions
- **Elara.md**: Holographic effects, tech accessories, casual style
- **Morgana.md**: Power suit, intimidating features, sharp angles
- **Vesper.md**: Lab coat, cybernetics, asymmetrical design
- **Sable.md**: Elegant clothing, seductive poses, flowing elements
- **Nyx.md**: Chaotic design, paint effects, artistic tools
- **Jezebel.md**: Regal design, combined aesthetics, crown element

## Workflow Overview

### Step-by-Step Process

1. **Setup**: Run base rig script to create armature foundation
2. **Blocking**: Generate basic mesh proportions
3. **Sculpting**: Refine details using multiresolution modifier
4. **Retopology**: Create clean animation-ready topology
5. **UV Unwrapping**: Layout UVs efficiently for texture painting
6. **Rigging**: Bind mesh to armature with weight painting
7. **Facial Setup**: Add shape keys and drivers for expressions
8. **Materials**: Setup PBR materials and texture maps
9. **Accessories**: Add character-specific items and props
10. **Testing**: Pose testing and animation checks
11. **Export**: Generate final files for target platforms

### Automation Features

The Python scripts automate:
- Armature generation with naming conventions
- Mesh generation from proportional parameters
- Weight painting initial pass
- Material node setup
- UV unwrapping optimization
- Export batch processing

## File Organization

```
Blender-Characters/
├── 00_FOUNDATION.md (this file)
├── 01_Base_Rig.md
├── 02_Body_Mesh.md
├── 03_Face_Rig.md
├── 04_Hair_System.md
├── 05_Clothing_System.md
├── 06_Accessories.md
├── 07_Materials.md
├── 08_Export_Setup.md
├── Character_Protagonist.md
├── Character_Elara.md
├── Character_Morgana.md
├── Character_Vesper.md
├── Character_Sable.md
├── Character_Nyx.md
└── Character_Jezebel.md
```

## Dependencies and Requirements

### Software Requirements
- **Blender 3.6+** (LTS recommended)
- **Python 3.10+** (bundled with Blender)
- **Add-ons** (optional):
  - Rigify (built-in, for advanced rigging)
  - Node Wrangler (built-in, for shader workflow)
  - Mesh: F2 (built-in, for modeling)

### Python Libraries
- `bpy` (Blender Python API - included)
- `mathutils` (vector math - included)
- `bmesh` (mesh editing - included)
- `numpy` (optional, for advanced calculations)

### Texture Resources
- Substance Painter (optional, for texture authoring)
- Photoshop/GIMP (for texture editing)
- Texture Haven (free PBR textures)

## Usage Instructions

### Running Scripts

1. Open Blender
2. Switch to **Scripting** workspace
3. Open script file (e.g., `01_Base_Rig.py`)
4. Configure parameters at top of script
5. Run script: Alt+P or click "Run Script" button
6. Follow prompts for character-specific options

### Customization

Each script includes configurable parameters:

```python
# Character Configuration
CHARACTER_HEIGHT = 8.0  # inches
BODY_TYPE = "athletic"  # options: slim, athletic, muscular
HEAD_PROPORTION = 1.1  # multiplier from realistic
STYLE_EXAGGERATION = 0.3  # 0=realistic, 1=stylized
```

### Best Practices

1. **Always start with base rig** before running character-specific scripts
2. **Save incremental versions** after each major step
3. **Test poses regularly** to catch rigging issues early
4. **Keep polygon count in check** for 3D printing compatibility
5. **Use layers/collections** to organize character components
6. **Document custom modifications** for consistency across characters

## Rendering and Presentation

### Showcase Renders
- **Lighting**: Three-point lighting with neon rim lights
- **Background**: Dark with subtle gradients
- **Camera**: Slightly low angle for heroic/menacing feel
- **Resolution**: 4K for promotional materials
- **Render engine**: Cycles for final quality, Eevee for previews

### Turnaround Views
- **8 angles**: 45° increments around character
- **3 heights**: Eye level, low angle, high angle
- **Clean background**: Neutral gray for clarity
- **Lighting**: Even, soft lighting to show all details

## Version Control and Collaboration

### Naming Conventions
- Blend files: `DJT_[CharacterName]_v[XX].blend`
- Textures: `DJT_[CharacterName]_[MapType].png`
- Scripts: `[Number]_[SystemName].py`
- Exports: `DJT_[CharacterName]_[Format]_[Date].ext`

### Git Integration
- Track `.blend` files with Git LFS
- Include scripts in standard Git
- `.gitignore` for cache and temp files
- Commit messages follow character development stages

## Future Expansion

### Planned Additions
- Enemy/minion character sets
- Environmental prop sets matching character themes
- Pose library for common actions
- Animation presets for game integration
- Variant designs (alternate costumes, battle-damaged)

### Community Contributions
- Template for custom character additions
- Style guide for maintaining visual consistency
- Export formats for various game engines
- 3D printing optimization guides

## Support and Resources

### Learning Resources
- Blender manual: https://docs.blender.org/
- Python API docs: https://docs.blender.org/api/
- Character modeling tutorials: YouTube, CGCookie, Blender Cloud
- Rigging tutorials: Rigify documentation, Pierrick Picaut

### Community
- Blender Artists forum
- r/blender subreddit
- DJT project Discord (if established)
- BlenderNation for inspiration

---

**Created**: January 2026  
**Version**: 1.0  
**Maintained by**: DJT Character Asset Team  
**License**: Project-specific, all rights reserved
