# Protagonist Character - Complete Generation Script

## Character Overview

**Name**: The Infiltrator (Protagonist)  
**Role**: Resistance fighter exposing the Council's schemes  
**Aesthetic**: Tactical cyberpunk with tech accents  
**Color Scheme**: Dark blue, silver, cyan highlights  
**Build**: Athletic, agile

## Character Specifications

### Physical Attributes
- **Height**: 7.5 inches (slightly shorter for agility)
- **Build**: Athletic, lean muscle definition
- **Head proportion**: 1.1x (slightly stylized)
- **Posture**: Confident, action-ready stance

### Design Elements
- **Tactical bodysuit** with armored panels
- **Tech gauntlets** with holographic display
- **Utility belt** with gadgets
- **Visor/goggles** (optional, can be worn or stored)
- **Short/mid-length hair** pulled back practically
- **Combat boots** with magnetic soles

### Personality Traits (for expression/pose)
- Determined, focused
- Intelligent, analytical
- Brave but cautious
- Slight smirk (signature expression)

## Python Script: `character_protagonist.py`

```python
import bpy
import sys
import os

# Add script directory to path to import base scripts
script_dir = os.path.dirname(bpy.data.filepath)
if script_dir not in sys.path:
    sys.path.append(script_dir)

# Import base generation functions
# NOTE: In actual use, these would be imported from separate .py files
# from base_rig_generator import generate_base_rig
# from body_mesh_generator import generate_body_mesh
# from material_system import generate_materials

# =============================================================================
# PROTAGONIST CONFIGURATION
# =============================================================================

# Override base configuration for Protagonist
CHARACTER_CONFIG = {
    # Physical proportions
    "height": 7.5,
    "head_size": 1.1,
    "torso_length": 2.4,
    "leg_length": 3.6,
    "arm_length": 2.7,
    
    # Body type
    "body_type": "athletic",
    "shoulder_width": 1.5,
    "hip_width": 1.3,
    "muscle_definition": 0.7,  # 0-1 scale
    
    # Features
    "include_fingers": True,
    "include_toes": True,
    "include_face_rig": True,
    
    # Style
    "style_exaggeration": 0.3,
    "heroic_proportions": True
}

# Material colors
PROTAGONIST_PALETTE = {
    "primary": (0.1, 0.2, 0.4),      # Dark blue bodysuit
    "secondary": (0.5, 0.6, 0.7),    # Silver armor panels
    "accent": (0.2, 0.8, 1.0),       # Cyan tech elements
    "emission": (0.3, 0.9, 1.0),     # Bright cyan glow
    "skin": (0.7, 0.5, 0.4),         # Skin tone (face/hands)
    "hair": (0.15, 0.1, 0.08)        # Dark brown hair
}

# Accessory configuration
ACCESSORIES = {
    "visor": True,
    "gauntlets": True,
    "utility_belt": True,
    "shoulder_armor": True,
    "knee_pads": True,
    "weapon_holster": True
}

# =============================================================================
# CUSTOM MESH ADDITIONS
# =============================================================================

def create_protagonist_bodysuit(body_obj):
    """Add bodysuit geometry over base mesh"""
    print("Creating protagonist bodysuit...")
    
    # Duplicate body mesh
    bpy.ops.object.select_all(action='DESELECT')
    body_obj.select_set(True)
    bpy.context.view_layer.objects.active = body_obj
    bpy.ops.object.duplicate()
    
    suit_obj = bpy.context.active_object
    suit_obj.name = "Protagonist_Bodysuit"
    
    # Apply solidify modifier for thickness
    solidify = suit_obj.modifiers.new(name="Solidify", type='SOLIDIFY')
    solidify.thickness = 0.02  # 2cm thick suit
    solidify.offset = 1.0  # Outside
    
    # Add subdivision for smooth look
    subsurf = suit_obj.modifiers.new(name="Subdivision", type='SUBSURF')
    subsurf.levels = 2
    
    print("  Bodysuit created")
    return suit_obj

def create_armor_panels(armature):
    """Create hard armor panels on shoulders, chest, knees"""
    print("Creating armor panels...")
    
    armor_pieces = []
    
    # Chest plate
    chest_plate = create_chest_plate(armature)
    armor_pieces.append(chest_plate)
    
    # Shoulder pads
    for side in ['L', 'R']:
        shoulder = create_shoulder_armor(armature, side)
        armor_pieces.append(shoulder)
    
    # Forearm guards
    for side in ['L', 'R']:
        forearm = create_forearm_guard(armature, side)
        armor_pieces.append(forearm)
    
    # Knee pads
    if ACCESSORIES["knee_pads"]:
        for side in ['L', 'R']:
            knee = create_knee_pad(armature, side)
            armor_pieces.append(knee)
    
    print(f"  Created {len(armor_pieces)} armor pieces")
    return armor_pieces

def create_chest_plate(armature):
    """Create chest armor plate"""
    bpy.ops.mesh.primitive_cube_add()
    chest_plate = bpy.context.active_object
    chest_plate.name = "Armor_Chest"
    
    # Position at chest
    spine_bone = armature.pose.bones.get("C_Spine_04")
    if spine_bone:
        chest_plate.location = armature.matrix_world @ spine_bone.head
        chest_plate.location.z += 0.3
    
    # Scale
    chest_plate.scale = (0.6, 0.15, 0.4)
    
    # Add bevel for hard surface look
    bpy.ops.object.modifier_add(type='BEVEL')
    chest_plate.modifiers["Bevel"].width = 0.02
    chest_plate.modifiers["Bevel"].segments = 3
    
    return chest_plate

def create_shoulder_armor(armature, side):
    """Create shoulder armor piece"""
    prefix = "L_" if side == 'L' else "R_"
    
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2)
    shoulder = bpy.context.active_object
    shoulder.name = f"Armor_Shoulder_{side}"
    
    # Position at shoulder
    arm_bone = armature.pose.bones.get(f"{prefix}UpperArm")
    if arm_bone:
        shoulder.location = armature.matrix_world @ arm_bone.head
    
    # Scale and flatten
    shoulder.scale = (0.3, 0.3, 0.2)
    
    return shoulder

def create_forearm_guard(armature, side):
    """Create forearm tech gauntlet"""
    prefix = "L_" if side == 'L' else "R_"
    
    bpy.ops.mesh.primitive_cylinder_add(vertices=8)
    gauntlet = bpy.context.active_object
    gauntlet.name = f"Gauntlet_{side}"
    
    # Position at forearm
    forearm_bone = armature.pose.bones.get(f"{prefix}Forearm")
    if forearm_bone:
        gauntlet.location = armature.matrix_world @ forearm_bone.center
        gauntlet.rotation_euler.x = 1.5708  # 90 degrees
    
    # Scale
    gauntlet.scale = (0.15, 0.15, 0.25)
    
    # Add holographic display panel
    if side == 'L':  # Left arm has holo display
        display = create_holo_display(gauntlet)
    
    return gauntlet

def create_holo_display(gauntlet):
    """Create holographic display on gauntlet"""
    bpy.ops.mesh.primitive_plane_add()
    display = bpy.context.active_object
    display.name = "HoloDisplay"
    
    # Position on gauntlet
    display.parent = gauntlet
    display.location = (0, 0, 0.15)
    display.scale = (0.4, 0.3, 1)
    
    # Add emission material
    mat = bpy.data.materials.new(name="MAT_HoloDisplay")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    # Emission shader
    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value = (*PROTAGONIST_PALETTE["emission"], 1.0)
    emission.inputs['Strength'].default_value = 5.0
    
    output = nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(emission.outputs['Emission'], output.inputs['Surface'])
    
    display.data.materials.append(mat)
    
    return display

def create_knee_pad(armature, side):
    """Create knee protection"""
    prefix = "L_" if side == 'L' else "R_"
    
    bpy.ops.mesh.primitive_uv_sphere_add()
    knee_pad = bpy.context.active_object
    knee_pad.name = f"Armor_Knee_{side}"
    
    # Position at knee
    shin_bone = armature.pose.bones.get(f"{prefix}Shin")
    if shin_bone:
        knee_pad.location = armature.matrix_world @ shin_bone.head
    
    # Scale and flatten front
    knee_pad.scale = (0.18, 0.12, 0.18)
    
    return knee_pad

def create_utility_belt(armature):
    """Create utility belt with pouches"""
    print("Creating utility belt...")
    
    # Belt main
    bpy.ops.mesh.primitive_torus_add(major_radius=0.6, minor_radius=0.05)
    belt = bpy.context.active_object
    belt.name = "UtilityBelt"
    
    # Position at waist
    spine_bone = armature.pose.bones.get("C_Spine_02")
    if spine_bone:
        belt.location = armature.matrix_world @ spine_bone.head
        belt.location.z += 0.1
    
    # Add pouches
    pouches = []
    for i, angle in enumerate([0, 45, 90, 270, 315]):
        pouch = create_belt_pouch(belt, angle)
        pouches.append(pouch)
    
    print(f"  Belt with {len(pouches)} pouches created")
    return belt

def create_belt_pouch(belt, angle):
    """Create individual belt pouch"""
    import math
    
    bpy.ops.mesh.primitive_cube_add()
    pouch = bpy.context.active_object
    pouch.name = f"BeltPouch_{angle}"
    
    # Position around belt
    rad = math.radians(angle)
    radius = 0.65
    pouch.location = belt.location + bpy.mathutils.Vector((
        math.cos(rad) * radius,
        math.sin(rad) * radius,
        0
    ))
    
    # Scale small
    pouch.scale = (0.08, 0.08, 0.1)
    pouch.parent = belt
    
    return pouch

def create_visor(armature):
    """Create tech visor/goggles"""
    if not ACCESSORIES["visor"]:
        return None
    
    print("Creating visor...")
    
    bpy.ops.mesh.primitive_cylinder_add(vertices=16)
    visor = bpy.context.active_object
    visor.name = "Visor"
    
    # Position at head
    head_bone = armature.pose.bones.get("C_Head")
    if head_bone:
        visor.location = armature.matrix_world @ head_bone.head
        visor.location.z += 0.6  # Eye level
        visor.rotation_euler.y = 1.5708  # 90 degrees
    
    # Scale
    visor.scale = (0.15, 0.5, 0.05)
    
    # Add transparent emission material
    mat = bpy.data.materials.new(name="MAT_Visor")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    # Mix transparent and emission
    output = nodes.new('ShaderNodeOutputMaterial')
    mix = nodes.new('ShaderNodeMixShader')
    transparent = nodes.new('ShaderNodeBsdfTransparent')
    emission = nodes.new('ShaderNodeEmission')
    
    emission.inputs['Color'].default_value = (0.3, 0.9, 1.0, 0.3)
    emission.inputs['Strength'].default_value = 2.0
    mix.inputs['Fac'].default_value = 0.7
    
    mat.node_tree.links.new(transparent.outputs[0], mix.inputs[1])
    mat.node_tree.links.new(emission.outputs[0], mix.inputs[2])
    mat.node_tree.links.new(mix.outputs[0], output.inputs['Surface'])
    
    visor.data.materials.append(mat)
    mat.blend_method = 'BLEND'
    
    print("  Visor created")
    return visor

def create_hair(armature):
    """Create hair using particles or mesh"""
    print("Creating hair...")
    
    # Get head bone
    head_bone = armature.pose.bones.get("C_Head")
    if not head_bone:
        return None
    
    # Create scalp mesh for hair base
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8)
    scalp = bpy.context.active_object
    scalp.name = "Hair_Scalp"
    
    # Position on head
    scalp.location = armature.matrix_world @ head_bone.head
    scalp.location.z += 0.7
    scalp.scale = (0.35, 0.3, 0.25)
    
    # Delete bottom half
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.mesh.select_mode(type='VERT')
    bpy.ops.object.mode_set(mode='OBJECT')
    
    for vert in scalp.data.vertices:
        if vert.co.z < 0:
            vert.select = True
    
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.delete(type='VERT')
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Add hair particle system
    particle_mod = scalp.modifiers.new(name="Hair", type='PARTICLE_SYSTEM')
    particles = scalp.particle_systems[0]
    psettings = particles.settings
    
    psettings.type = 'HAIR'
    psettings.count = 5000
    psettings.hair_length = 0.8
    psettings.render_type = 'PATH'
    psettings.child_type = 'INTERPOLATED'
    psettings.child_nbr = 3
    
    # Hair material
    mat = bpy.data.materials.new(name="MAT_Hair")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*PROTAGONIST_PALETTE["hair"], 1.0)
        bsdf.inputs['Roughness'].default_value = 0.6
    
    scalp.data.materials.append(mat)
    
    print("  Hair created")
    return scalp

# =============================================================================
# WEAPON CREATION
# =============================================================================

def create_weapon(armature):
    """Create signature weapon"""
    print("Creating signature weapon...")
    
    if not ACCESSORIES["weapon_holster"]:
        return None
    
    # Create energy baton
    bpy.ops.mesh.primitive_cylinder_add(vertices=12)
    weapon = bpy.context.active_object
    weapon.name = "Weapon_EnergyBaton"
    
    # Scale to baton size
    weapon.scale = (0.04, 0.04, 0.6)
    
    # Position at hip holster
    spine_bone = armature.pose.bones.get("C_Spine_02")
    if spine_bone:
        weapon.location = armature.matrix_world @ spine_bone.head
        weapon.location.x += 0.3  # Right hip
        weapon.rotation_euler.y = 0.3
    
    # Add grip and energy blade sections
    create_weapon_details(weapon)
    
    # Material - metallic handle, glowing blade
    mat = bpy.data.materials.new(name="MAT_Weapon")
    mat.use_nodes = True
    # ... material setup ...
    
    print("  Weapon created")
    return weapon

def create_weapon_details(weapon):
    """Add grip and blade details to weapon"""
    # Handle grip
    bpy.ops.mesh.primitive_torus_add(major_radius=0.05, minor_radius=0.01)
    grip1 = bpy.context.active_object
    grip1.name = "Weapon_Grip1"
    grip1.parent = weapon
    grip1.location = (0, 0, -0.3)
    
    # Energy emitter
    bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=8)
    emitter = bpy.context.active_object
    emitter.name = "Weapon_Emitter"
    emitter.parent = weapon
    emitter.location = (0, 0, 0.6)
    emitter.scale = (0.8, 0.8, 0.5)

# =============================================================================
# MAIN PROTAGONIST GENERATION
# =============================================================================

def generate_protagonist_character():
    """Main function to generate complete Protagonist character"""
    print("=" * 60)
    print("GENERATING PROTAGONIST CHARACTER")
    print("=" * 60)
    
    # Step 1: Generate base rig
    print("\n[1/8] Generating base rig...")
    # armature = generate_base_rig(CHARACTER_CONFIG)
    # For now, get existing armature
    armature = bpy.data.objects.get("DJT_Base_Rig")
    if not armature:
        print("ERROR: Base rig not found. Run 01_Base_Rig.py first.")
        return
    
    # Step 2: Generate base body mesh
    print("\n[2/8] Generating body mesh...")
    # body = generate_body_mesh(armature, CHARACTER_CONFIG)
    body = bpy.data.objects.get("Body_Complete")
    if not body:
        print("ERROR: Body mesh not found. Run 02_Body_Mesh.py first.")
        return
    
    # Step 3: Create bodysuit
    print("\n[3/8] Creating bodysuit...")
    bodysuit = create_protagonist_bodysuit(body)
    
    # Step 4: Create armor pieces
    print("\n[4/8] Creating armor...")
    armor_pieces = create_armor_panels(armature)
    
    # Step 5: Create accessories
    print("\n[5/8] Creating accessories...")
    belt = create_utility_belt(armature)
    visor = create_visor(armature)
    hair = create_hair(armature)
    
    # Step 6: Create weapon
    print("\n[6/8] Creating weapon...")
    weapon = create_weapon(armature)
    
    # Step 7: Setup materials
    print("\n[7/8] Setting up materials...")
    # materials = generate_materials("Protagonist", PROTAGONIST_PALETTE)
    
    # Step 8: Final organization
    print("\n[8/8] Organizing scene...")
    organize_protagonist_scene(armature, body, bodysuit, armor_pieces, belt, visor, hair, weapon)
    
    print("\n" + "=" * 60)
    print("PROTAGONIST CHARACTER COMPLETE!")
    print("=" * 60)
    print("\nNext steps:")
    print("- Refine weight painting in Weight Paint mode")
    print("- Add facial details and expressions")
    print("- Create action poses")
    print("- Render turnaround views")

def organize_protagonist_scene(armature, body, bodysuit, armor_pieces, belt, visor, hair, weapon):
    """Organize all parts into collections"""
    
    # Create main collection
    if "Protagonist" not in bpy.data.collections:
        protagonist_col = bpy.data.collections.new("Protagonist")
        bpy.context.scene.collection.children.link(protagonist_col)
    else:
        protagonist_col = bpy.data.collections["Protagonist"]
    
    # Move objects to collection
    objects = [armature, body, bodysuit, belt, visor, hair, weapon] + armor_pieces
    for obj in objects:
        if obj and obj.name in bpy.context.scene.collection.objects:
            bpy.context.scene.collection.objects.unlink(obj)
            if obj.name not in protagonist_col.objects:
                protagonist_col.objects.link(obj)
    
    # Parent all to armature
    for obj in objects:
        if obj and obj != armature:
            obj.parent = armature

# =============================================================================
# EXECUTION
# =============================================================================

if __name__ == "__main__":
    generate_protagonist_character()
```

## Usage Instructions

### Complete Workflow

1. **Run base scripts first**:
   - `01_Base_Rig.py` - Creates armature
   - `02_Body_Mesh.py` - Creates body
   
2. **Run protagonist script**:
   - Set CHARACTER_CONFIG parameters
   - Enable/disable accessories in ACCESSORIES dict
   - Run script: **Alt+P**

3. **Post-generation refinement**:
   - Weight paint adjustments
   - Texture painting details
   - Pose testing

### Customization Options

```python
# Adjust character build
CHARACTER_CONFIG["muscle_definition"] = 0.5  # Leaner
CHARACTER_CONFIG["height"] = 8.0  # Taller

# Toggle accessories
ACCESSORIES["visor"] = False  # No visor
ACCESSORIES["weapon_holster"] = False  # No weapon

# Change colors
PROTAGONIST_PALETTE["primary"] = (0.15, 0.0, 0.25)  # Purple suit instead
```

## Key Features

### Tactical Bodysuit
- Form-fitting over base body
- Armored panel inserts
- Tech integration points

### Tech Gauntlets
- Left arm: Holographic display
- Right arm: Standard protection
- Glowing cyan accents

### Signature Weapon
- Energy baton design
- Collapsible (animation-ready)
- Holstered at hip

## Export Recommendations

```python
# For 3D printing
- Separate parts for printing
- Add connectors/pegs
- Export as STL

# For game engine
- Bake textures first
- Single mesh with armature
- Export as FBX/glTF

# For rendering
- Keep multi-object setup
- Use Subdivision Surface
- Render with Cycles
```

## Pose Suggestions

1. **Hero Pose**: Wide stance, confident
2. **Combat Stance**: Low, weapon ready
3. **Stealth Crouch**: Focused, alert
4. **Hacking**: Examining holodisplay
5. **Victory**: Weapon raised, smirking

## Related Documentation

- **Base**: [01_Base_Rig.md](01_Base_Rig.md), [02_Body_Mesh.md](02_Body_Mesh.md)
- **Materials**: [07_Materials.md](07_Materials.md)
- **Compare**: [Character_Elara.md](Character_Elara.md)

---

**Character**: Protagonist (The Infiltrator)  
**Script Version**: 1.0  
**Last Updated**: January 2026
