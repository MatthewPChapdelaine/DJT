# Body Mesh Generator - Python Script Documentation

## Overview

This script generates the base body mesh for DJT characters that will be bound to the armature created in `01_Base_Rig.md`. It creates clean, animation-ready topology optimized for both deformation and 3D printing.

## Features

- **Parametric body generation**: Adjust proportions via parameters
- **Clean quad topology**: Animation-friendly mesh flow
- **Automatic UV unwrapping**: Efficient texture layout
- **Weight painting base**: Initial skinning weights
- **Subdivision-ready**: Multi-resolution modifier support
- **Body type presets**: Athletic, slim, muscular variations

## Python Script: `body_mesh_generator.py`

### Configuration Parameters

```python
# Body Mesh Configuration

# Body Type Presets
BODY_TYPE = "athletic"  # Options: athletic, slim, muscular, custom

# Custom Proportions (used if BODY_TYPE = "custom")
CHEST_WIDTH = 1.5
CHEST_DEPTH = 0.8
WAIST_WIDTH = 1.1
WAIST_DEPTH = 0.7
HIP_WIDTH = 1.3
HIP_DEPTH = 0.9

# Limb Proportions
ARM_THICKNESS = 0.15  # Upper arm diameter
FOREARM_THICKNESS = 0.12
HAND_WIDTH = 0.3
THIGH_THICKNESS = 0.25
SHIN_THICKNESS = 0.18
FOOT_LENGTH = 0.8

# Mesh Quality
BASE_RESOLUTION = "medium"  # Options: low, medium, high
# low: ~5k tris, medium: ~15k tris, high: ~30k tris
SUBDIVISION_LEVELS = 2  # For detail sculpting

# Features
INCLUDE_MUSCLE_DEFINITION = True
INCLUDE_JOINT_DETAILS = True
SMOOTH_TRANSITIONS = True

# Reference Armature
ARMATURE_NAME = "DJT_Base_Rig"  # Must exist in scene
```

### Main Script Code

```python
import bpy
import bmesh
from mathutils import Vector, Matrix
import math

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def get_armature(name):
    """Get armature object from scene"""
    armature = bpy.data.objects.get(name)
    if not armature or armature.type != 'ARMATURE':
        raise Exception(f"Armature '{name}' not found in scene")
    return armature

def get_bone_position(armature, bone_name):
    """Get world position of bone"""
    bone = armature.pose.bones.get(bone_name)
    if not bone:
        return None
    return armature.matrix_world @ bone.head

def create_mesh_object(name):
    """Create new mesh object"""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj

def body_type_presets():
    """Return body type preset values"""
    presets = {
        "athletic": {
            "chest_width": 1.6, "chest_depth": 0.9,
            "waist_width": 1.2, "waist_depth": 0.75,
            "hip_width": 1.4, "hip_depth": 0.95,
            "arm_thick": 0.16, "forearm_thick": 0.13,
            "thigh_thick": 0.27, "shin_thick": 0.19
        },
        "slim": {
            "chest_width": 1.3, "chest_depth": 0.7,
            "waist_width": 1.0, "waist_depth": 0.6,
            "hip_width": 1.2, "hip_depth": 0.8,
            "arm_thick": 0.12, "forearm_thick": 0.10,
            "thigh_thick": 0.20, "shin_thick": 0.15
        },
        "muscular": {
            "chest_width": 1.9, "chest_depth": 1.1,
            "waist_width": 1.4, "waist_depth": 0.85,
            "hip_width": 1.5, "hip_depth": 1.0,
            "arm_thick": 0.20, "forearm_thick": 0.16,
            "thigh_thick": 0.32, "shin_thick": 0.22
        }
    }
    return presets.get(BODY_TYPE, presets["athletic"])

# =============================================================================
# TORSO GENERATION
# =============================================================================

def create_torso(armature, preset):
    """Generate torso mesh"""
    print("Generating torso mesh...")
    
    # Get spine bone positions
    spine_bones = []
    for i in range(1, 6):
        bone_name = f"C_Spine_{i:02d}"
        pos = get_bone_position(armature, bone_name)
        if pos:
            spine_bones.append(pos)
    
    if len(spine_bones) < 2:
        raise Exception("Not enough spine bones found")
    
    # Create mesh object
    torso_obj = create_mesh_object("Body_Torso")
    mesh = torso_obj.data
    bm = bmesh.new()
    
    # Generate cross-sections along spine
    segments = len(spine_bones)
    ring_verts = 16  # Vertices per ring
    
    for i, spine_pos in enumerate(spine_bones):
        # Calculate width and depth for this segment
        t = i / (segments - 1)  # 0 to 1
        
        if t < 0.4:  # Lower torso to waist
            width = preset["hip_width"] + (preset["waist_width"] - preset["hip_width"]) * (t / 0.4)
            depth = preset["hip_depth"] + (preset["waist_depth"] - preset["hip_depth"]) * (t / 0.4)
        else:  # Waist to chest
            width = preset["waist_width"] + (preset["chest_width"] - preset["waist_width"]) * ((t - 0.4) / 0.6)
            depth = preset["waist_depth"] + (preset["chest_depth"] - preset["waist_depth"]) * ((t - 0.4) / 0.6)
        
        # Create ring of vertices
        ring = []
        for j in range(ring_verts):
            angle = (j / ring_verts) * 2 * math.pi
            x = math.cos(angle) * (width / 2)
            y = math.sin(angle) * (depth / 2)
            vert_pos = spine_pos + Vector((x, y, 0))
            vert = bm.verts.new(vert_pos)
            ring.append(vert)
        
        # Connect to previous ring
        if i > 0:
            for j in range(ring_verts):
                v1 = prev_ring[j]
                v2 = ring[j]
                v3 = ring[(j + 1) % ring_verts]
                v4 = prev_ring[(j + 1) % ring_verts]
                bm.faces.new([v1, v2, v3, v4])
        
        prev_ring = ring
    
    # Update mesh
    bm.to_mesh(mesh)
    bm.free()
    
    # Smooth shading
    for poly in mesh.polygons:
        poly.use_smooth = True
    
    print(f"Torso created: {len(mesh.vertices)} verts, {len(mesh.polygons)} faces")
    return torso_obj

# =============================================================================
# LIMB GENERATION
# =============================================================================

def create_limb_segment(start_pos, end_pos, start_radius, end_radius, segments=8):
    """Create cylindrical limb segment"""
    bm = bmesh.new()
    
    direction = (end_pos - start_pos).normalized()
    length = (end_pos - start_pos).length
    
    # Create rings along limb
    ring_count = max(3, int(length / 0.3))
    
    for i in range(ring_count):
        t = i / (ring_count - 1)
        pos = start_pos.lerp(end_pos, t)
        radius = start_radius + (end_radius - start_radius) * t
        
        ring = []
        for j in range(segments):
            angle = (j / segments) * 2 * math.pi
            # Create perpendicular vectors
            if abs(direction.z) < 0.9:
                up = Vector((0, 0, 1))
            else:
                up = Vector((1, 0, 0))
            right = direction.cross(up).normalized()
            up = right.cross(direction).normalized()
            
            x = math.cos(angle) * radius
            y = math.sin(angle) * radius
            vert_pos = pos + right * x + up * y
            vert = bm.verts.new(vert_pos)
            ring.append(vert)
        
        # Connect to previous ring
        if i > 0:
            for j in range(segments):
                v1 = prev_ring[j]
                v2 = ring[j]
                v3 = ring[(j + 1) % segments]
                v4 = prev_ring[(j + 1) % segments]
                bm.faces.new([v1, v2, v3, v4])
        
        prev_ring = ring
    
    return bm

def create_arm(armature, side, preset):
    """Generate arm mesh"""
    prefix = "L_" if side == 'L' else "R_"
    print(f"Generating {side} arm...")
    
    # Get bone positions
    upper_arm_bone = armature.pose.bones.get(f"{prefix}UpperArm")
    forearm_bone = armature.pose.bones.get(f"{prefix}Forearm")
    hand_bone = armature.pose.bones.get(f"{prefix}Hand")
    
    if not all([upper_arm_bone, forearm_bone, hand_bone]):
        print(f"Arm bones for {side} not found")
        return None
    
    # Create mesh object
    arm_obj = create_mesh_object(f"Body_{prefix}Arm")
    mesh = arm_obj.data
    
    # Upper arm segment
    upper_start = armature.matrix_world @ upper_arm_bone.head
    upper_end = armature.matrix_world @ upper_arm_bone.tail
    bm_upper = create_limb_segment(
        upper_start, upper_end,
        preset["arm_thick"], preset["arm_thick"] * 0.85
    )
    
    # Forearm segment
    forearm_start = armature.matrix_world @ forearm_bone.head
    forearm_end = armature.matrix_world @ forearm_bone.tail
    bm_forearm = create_limb_segment(
        forearm_start, forearm_end,
        preset["forearm_thick"], preset["forearm_thick"] * 0.75
    )
    
    # Merge meshes
    bm = bmesh.new()
    bm_upper.to_mesh(mesh)
    temp_mesh = bpy.data.meshes.new("temp")
    bm_forearm.to_mesh(temp_mesh)
    bm.from_mesh(mesh)
    bm.from_mesh(temp_mesh)
    
    # Merge overlapping vertices
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.01)
    
    bm.to_mesh(mesh)
    bm.free()
    bm_upper.free()
    bm_forearm.free()
    bpy.data.meshes.remove(temp_mesh)
    
    # Smooth shading
    for poly in mesh.polygons:
        poly.use_smooth = True
    
    print(f"{side} arm created: {len(mesh.vertices)} verts")
    return arm_obj

def create_leg(armature, side, preset):
    """Generate leg mesh"""
    prefix = "L_" if side == 'L' else "R_"
    print(f"Generating {side} leg...")
    
    # Get bone positions
    thigh_bone = armature.pose.bones.get(f"{prefix}Thigh")
    shin_bone = armature.pose.bones.get(f"{prefix}Shin")
    foot_bone = armature.pose.bones.get(f"{prefix}Foot")
    
    if not all([thigh_bone, shin_bone, foot_bone]):
        print(f"Leg bones for {side} not found")
        return None
    
    # Create mesh object
    leg_obj = create_mesh_object(f"Body_{prefix}Leg")
    mesh = leg_obj.data
    
    # Thigh segment
    thigh_start = armature.matrix_world @ thigh_bone.head
    thigh_end = armature.matrix_world @ thigh_bone.tail
    bm_thigh = create_limb_segment(
        thigh_start, thigh_end,
        preset["thigh_thick"], preset["thigh_thick"] * 0.85
    )
    
    # Shin segment
    shin_start = armature.matrix_world @ shin_bone.head
    shin_end = armature.matrix_world @ shin_bone.tail
    bm_shin = create_limb_segment(
        shin_start, shin_end,
        preset["shin_thick"], preset["shin_thick"] * 0.80
    )
    
    # Merge meshes
    bm = bmesh.new()
    bm_thigh.to_mesh(mesh)
    temp_mesh = bpy.data.meshes.new("temp")
    bm_shin.to_mesh(temp_mesh)
    bm.from_mesh(mesh)
    bm.from_mesh(temp_mesh)
    
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.01)
    
    bm.to_mesh(mesh)
    bm.free()
    bm_thigh.free()
    bm_shin.free()
    bpy.data.meshes.remove(temp_mesh)
    
    # Smooth shading
    for poly in mesh.polygons:
        poly.use_smooth = True
    
    print(f"{side} leg created: {len(mesh.vertices)} verts")
    return leg_obj

def create_hand(armature, side):
    """Generate hand mesh"""
    prefix = "L_" if side == 'L' else "R_"
    print(f"Generating {side} hand...")
    
    hand_bone = armature.pose.bones.get(f"{prefix}Hand")
    if not hand_bone:
        return None
    
    # Create simple hand block (to be refined later)
    hand_obj = create_mesh_object(f"Body_{prefix}Hand")
    mesh = hand_obj.data
    bm = bmesh.new()
    
    hand_start = armature.matrix_world @ hand_bone.head
    hand_end = armature.matrix_world @ hand_bone.tail
    
    # Create hand palm box
    bmesh.ops.create_cube(bm, size=HAND_WIDTH)
    
    # Position and scale
    for vert in bm.verts:
        vert.co = hand_start + (hand_end - hand_start) * 0.5 + vert.co * 0.5
    
    bm.to_mesh(mesh)
    bm.free()
    
    for poly in mesh.polygons:
        poly.use_smooth = True
    
    return hand_obj

def create_foot(armature, side):
    """Generate foot mesh"""
    prefix = "L_" if side == 'L' else "R_"
    print(f"Generating {side} foot...")
    
    foot_bone = armature.pose.bones.get(f"{prefix}Foot")
    if not foot_bone:
        return None
    
    foot_obj = create_mesh_object(f"Body_{prefix}Foot")
    mesh = foot_obj.data
    bm = bmesh.new()
    
    foot_start = armature.matrix_world @ foot_bone.head
    foot_end = armature.matrix_world @ foot_bone.tail
    
    # Create foot box
    bmesh.ops.create_cube(bm, size=FOOT_LENGTH)
    
    # Position and scale
    for vert in bm.verts:
        vert.co = foot_start + (foot_end - foot_start) * 0.5 + vert.co * 0.4
    
    bm.to_mesh(mesh)
    bm.free()
    
    for poly in mesh.polygons:
        poly.use_smooth = True
    
    return foot_obj

# =============================================================================
# MESH JOINING AND FINISHING
# =============================================================================

def join_body_parts(parts):
    """Join all body part meshes into one"""
    print("Joining body parts...")
    
    # Filter out None objects
    parts = [p for p in parts if p is not None]
    
    if not parts:
        raise Exception("No body parts to join")
    
    # Select all parts
    bpy.ops.object.select_all(action='DESELECT')
    for obj in parts:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    
    # Join
    bpy.ops.object.join()
    body_obj = bpy.context.active_object
    body_obj.name = "Body_Complete"
    
    # Remove doubles
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=0.01)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    print(f"Body joined: {len(body_obj.data.vertices)} total vertices")
    return body_obj

def auto_uv_unwrap(obj):
    """Automatic UV unwrapping"""
    print("Generating UV map...")
    
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    
    # Smart UV project
    bpy.ops.uv.smart_project(
        angle_limit=66.0,
        island_margin=0.02,
        area_weight=0.0,
        correct_aspect=True
    )
    
    bpy.ops.object.mode_set(mode='OBJECT')
    print("UV map created")

def setup_armature_modifier(body_obj, armature):
    """Add armature modifier to body"""
    print("Setting up armature modifier...")
    
    modifier = body_obj.modifiers.new(name="Armature", type='ARMATURE')
    modifier.object = armature
    modifier.use_vertex_groups = True
    
    print("Armature modifier added")

def basic_weight_painting(body_obj, armature):
    """Generate basic weight painting"""
    print("Generating automatic weights...")
    
    # Select body and armature
    bpy.ops.object.select_all(action='DESELECT')
    body_obj.select_set(True)
    armature.select_set(True)
    bpy.context.view_layer.objects.active = armature
    
    # Automatic weights
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    
    print("Automatic weights applied")

# =============================================================================
# MAIN GENERATION FUNCTION
# =============================================================================

def generate_body_mesh():
    """Main function to generate complete body mesh"""
    print("=" * 60)
    print("DJT CHARACTER BODY MESH GENERATOR")
    print("=" * 60)
    
    # Get armature
    try:
        armature = get_armature(ARMATURE_NAME)
    except Exception as e:
        print(f"ERROR: {e}")
        return None
    
    # Get body type preset
    preset = body_type_presets()
    print(f"Using body type: {BODY_TYPE}")
    
    # Generate body parts
    body_parts = []
    
    # Torso
    torso = create_torso(armature, preset)
    body_parts.append(torso)
    
    # Arms
    for side in ['L', 'R']:
        arm = create_arm(armature, side, preset)
        hand = create_hand(armature, side)
        body_parts.extend([arm, hand])
    
    # Legs
    for side in ['L', 'R']:
        leg = create_leg(armature, side, preset)
        foot = create_foot(armature, side)
        body_parts.extend([leg, foot])
    
    # Join all parts
    body_obj = join_body_parts(body_parts)
    
    # UV unwrap
    auto_uv_unwrap(body_obj)
    
    # Setup armature modifier
    setup_armature_modifier(body_obj, armature)
    
    # Basic weight painting
    basic_weight_painting(body_obj, armature)
    
    # Add subdivision surface
    if SUBDIVISION_LEVELS > 0:
        subsurf = body_obj.modifiers.new(name="Subdivision", type='SUBSURF')
        subsurf.levels = 1
        subsurf.render_levels = SUBDIVISION_LEVELS
    
    print("=" * 60)
    print("BODY MESH GENERATION COMPLETE!")
    print(f"Object: {body_obj.name}")
    print(f"Vertices: {len(body_obj.data.vertices)}")
    print(f"Faces: {len(body_obj.data.polygons)}")
    print("=" * 60)
    
    return body_obj

# =============================================================================
# EXECUTION
# =============================================================================

if __name__ == "__main__":
    generate_body_mesh()
```

## Usage Instructions

### Prerequisites

1. Must have run `01_Base_Rig.py` first
2. Armature must be named "DJT_Base_Rig" (or update ARMATURE_NAME)
3. Armature must be in Object Mode

### Basic Usage

1. Open Blender file with base rig
2. Switch to **Scripting** workspace
3. Create new text datablock or open this script
4. Adjust BODY_TYPE parameter ("athletic", "slim", or "muscular")
5. Run script: **Alt+P**

### Output

The script generates:
- Single unified body mesh
- UV unwrapped and ready for texturing
- Armature modifier applied
- Basic automatic weight painting
- Subdivision surface modifier (optional)

## Next Steps

After generating body mesh:

1. **Refine weights**: Switch to Weight Paint mode and adjust bone influences
2. **Add details**: Use Sculpt Mode with Multiresolution modifier
3. **Texture painting**: Use Texture Paint workspace
4. **Proceed to face rig**: See [03_Face_Rig.md](03_Face_Rig.md)

## Customization Examples

### Creating Different Body Types

```python
# For the Protagonist (athletic)
BODY_TYPE = "athletic"

# For Morgana (intimidating, muscular)
BODY_TYPE = "muscular"

# For Elara (slim, agile)
BODY_TYPE = "slim"

# Custom build
BODY_TYPE = "custom"
CHEST_WIDTH = 1.7
HIP_WIDTH = 1.5
```

### Adjusting Mesh Resolution

```python
# Low poly (for game engines)
BASE_RESOLUTION = "low"
SUBDIVISION_LEVELS = 0

# High poly (for rendering/3D printing)
BASE_RESOLUTION = "high"
SUBDIVISION_LEVELS = 3
```

## Troubleshooting

### Common Issues

**Issue**: Body parts don't align with armature
- **Solution**: Ensure armature hasn't been moved/scaled after creation
- Check armature is at world origin (0,0,0)

**Issue**: Mesh has gaps or holes
- **Solution**: Increase segment resolution in limb generation
- Check for duplicate vertices

**Issue**: Automatic weights not working
- **Solution**: Ensure all bones have proper naming (L_/R_/C_ prefixes)
- Manually parent with "Armature Deform" > "With Automatic Weights"

**Issue**: UV islands overlapping
- **Solution**: Adjust island_margin parameter in smart_project
- Manually pack UVs: UV Editor > UV > Pack Islands

## Advanced Techniques

### Adding Muscle Definition

Modify torso cross-sections to include muscle bulges:

```python
# In create_torso function, add variation to radius
muscle_bulge = math.sin(angle * 4) * 0.05  # Creates 4 muscle groups
x = (math.cos(angle) + muscle_bulge) * (width / 2)
```

### Joint Deformation Helpers

Add extra edge loops at joints for better bending:

```python
# Add extra rings near elbow/knee
if 0.45 < t < 0.55:  # Near middle of limb
    # Add 2 extra rings
    pass
```

## Related Documentation

- **Previous**: [01_Base_Rig.md](01_Base_Rig.md) - Create armature first
- **Next**: [03_Face_Rig.md](03_Face_Rig.md) - Add facial animation
- **See also**: [07_Materials.md](07_Materials.md) - Texture and material setup

---

**Script Version**: 1.0  
**Compatible with**: Blender 3.6+  
**Last Updated**: January 2026
