# Elara (The Hacker) - Complete Generation Script

## Character Overview

**Name**: Elara  
**Council Role**: Digital Warfare Specialist  
**Aesthetic**: Cyberpunk hacker with holographic effects  
**Color Scheme**: Near-black, gray, neon green/cyan accents  
**Build**: Slim, agile

## Character Specifications

### Physical Attributes
- **Height**: 7.0 inches (compact build)
- **Build**: Slim, minimal muscle definition
- **Head proportion**: 1.15x (more stylized)
- **Posture**: Relaxed but alert, tech-focused

### Design Elements
- **Casual tech-wear**: Hoodie with circuit patterns
- **Holographic projectors**: Wrist and shoulder mounted
- **Data cables**: Integrated into clothing
- **AR glasses**: Always worn, glowing displays
- **Fingerless gloves**: With haptic sensors
- **Sneakers**: High-tech, silent tread

### Personality Traits
- Brilliant, calculating
- Socially awkward but confident online
- Mischievous smirk
- Eyes rarely visible (AR glasses)

## Python Script: `character_elara.py`

```python
import bpy
from mathutils import Vector

# =============================================================================
# ELARA CONFIGURATION
# =============================================================================

CHARACTER_CONFIG = {
    "height": 7.0,
    "head_size": 1.15,
    "torso_length": 2.2,
    "leg_length": 3.4,
    "arm_length": 2.6,
    "body_type": "slim",
    "shoulder_width": 1.3,
    "hip_width": 1.2,
    "muscle_definition": 0.2
}

ELARA_PALETTE = {
    "primary": (0.05, 0.05, 0.1),    # Near black
    "secondary": (0.3, 0.3, 0.35),   # Gray tech-wear
    "accent": (0.2, 1.0, 0.3),       # Neon green
    "emission": (0.0, 1.0, 0.5),     # Green glow
    "skin": (0.8, 0.7, 0.65),        # Pale skin
    "hair": (0.15, 0.3, 0.4)         # Teal-tinted dark hair
}

ACCESSORIES = {
    "ar_glasses": True,
    "hoodie": True,
    "holo_projectors": True,
    "data_cables": True,
    "wrist_computer": True
}

# =============================================================================
# CLOTHING CREATION
# =============================================================================

def create_elara_hoodie(body_obj, armature):
    """Create oversized hoodie with tech details"""
    print("Creating hacker hoodie...")
    
    # Base hoodie mesh
    bpy.ops.mesh.primitive_cube_add()
    hoodie = bpy.context.active_object
    hoodie.name = "Elara_Hoodie"
    
    # Position at torso
    spine_bone = armature.pose.bones.get("C_Spine_03")
    if spine_bone:
        hoodie.location = armature.matrix_world @ spine_bone.head
        hoodie.location.z += 0.3
    
    # Scale oversized
    hoodie.scale = (0.75, 0.5, 1.0)
    
    # Add subdivision for organic look
    subsurf = hoodie.modifiers.new(name="Subdivision", type='SUBSURF')
    subsurf.levels = 2
    
    # Add cloth simulation (optional)
    # cloth = hoodie.modifiers.new(name="Cloth", type='CLOTH')
    
    # Create hood
    hood = create_hood(hoodie, armature)
    
    # Add circuit pattern detail
    add_circuit_patterns(hoodie)
    
    print("  Hoodie created")
    return hoodie

def create_hood(hoodie, armature):
    """Create hood piece"""
    bpy.ops.mesh.primitive_cone_add(vertices=8)
    hood = bpy.context.active_object
    hood.name = "Hoodie_Hood"
    
    # Position at head
    head_bone = armature.pose.bones.get("C_Head")
    if head_bone:
        hood.location = armature.matrix_world @ head_bone.head
        hood.location.z += 0.2
        hood.rotation_euler.x = -0.3  # Tilt back
    
    # Scale
    hood.scale = (0.4, 0.5, 0.6)
    
    # Parent to hoodie
    hood.parent = hoodie
    
    return hood

def add_circuit_patterns(hoodie):
    """Add glowing circuit patterns to hoodie surface"""
    # This would use geometry nodes or texture in full implementation
    # For now, add emission material regions
    
    mat = bpy.data.materials.new(name="MAT_Elara_Hoodie_Circuits")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    # Base + Emission mix
    output = nodes.new('ShaderNodeOutputMaterial')
    mix = nodes.new('ShaderNodeMixShader')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    emission = nodes.new('ShaderNodeEmission')
    
    # Circuit pattern using wave texture
    wave = nodes.new('ShaderNodeTexWave')
    wave.wave_type = 'BANDS'
    wave.inputs['Scale'].default_value = 30.0
    
    color_ramp = nodes.new('ShaderNodeValToRGB')
    color_ramp.color_ramp.elements[0].position = 0.3
    color_ramp.color_ramp.elements[1].position = 0.35
    color_ramp.color_ramp.elements[1].color = (*ELARA_PALETTE["accent"], 1.0)
    
    # Connect
    links.new(wave.outputs['Color'], color_ramp.inputs['Fac'])
    links.new(color_ramp.outputs['Color'], mix.inputs['Fac'])
    links.new(color_ramp.outputs['Color'], emission.inputs['Color'])
    emission.inputs['Strength'].default_value = 3.0
    
    links.new(bsdf.outputs['BSDF'], mix.inputs[1])
    links.new(emission.outputs['Emission'], mix.inputs[2])
    links.new(mix.outputs['Shader'], output.inputs['Surface'])
    
    hoodie.data.materials.append(mat)

def create_ar_glasses(armature):
    """Create AR glasses with holographic displays"""
    if not ACCESSORIES["ar_glasses"]:
        return None
    
    print("Creating AR glasses...")
    
    # Frame
    bpy.ops.mesh.primitive_torus_add(major_radius=0.3, minor_radius=0.02)
    glasses = bpy.context.active_object
    glasses.name = "Elara_ARGlasses"
    
    # Position at head
    head_bone = armature.pose.bones.get("C_Head")
    if head_bone:
        glasses.location = armature.matrix_world @ head_bone.head
        glasses.location.z += 0.6  # Eye level
        glasses.location.y += 0.1  # Forward
        glasses.rotation_euler.y = 1.5708
    
    glasses.scale = (0.15, 0.25, 1.0)
    
    # Create lens with emission
    create_ar_lenses(glasses)
    
    print("  AR glasses created")
    return glasses

def create_ar_lenses(glasses):
    """Create holographic lens displays"""
    for side in [-1, 1]:  # Left and right
        bpy.ops.mesh.primitive_plane_add()
        lens = bpy.context.active_object
        lens.name = f"ARLens_{'L' if side < 0 else 'R'}"
        
        lens.parent = glasses
        lens.location = (side * 0.15, 0, 0)
        lens.scale = (0.4, 0.5, 1)
        lens.rotation_euler.y = 1.5708
        
        # Holographic material
        mat = bpy.data.materials.new(name=f"MAT_ARLens_{side}")
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        nodes.clear()
        
        # Emission with scanlines
        output = nodes.new('ShaderNodeOutputMaterial')
        emission = nodes.new('ShaderNodeEmission')
        
        # Animated scanlines
        wave = nodes.new('ShaderNodeTexWave')
        wave.wave_type = 'BANDS'
        wave.inputs['Scale'].default_value = 50.0
        
        color_ramp = nodes.new('ShaderNodeValToRGB')
        color_ramp.color_ramp.elements[0].color = (0, 0.5, 0.3, 0.5)
        color_ramp.color_ramp.elements[1].color = (*ELARA_PALETTE["emission"], 1.0)
        
        mat.node_tree.links.new(wave.outputs['Color'], color_ramp.inputs['Fac'])
        mat.node_tree.links.new(color_ramp.outputs['Color'], emission.inputs['Color'])
        emission.inputs['Strength'].default_value = 4.0
        mat.node_tree.links.new(emission.outputs['Emission'], output.inputs['Surface'])
        
        lens.data.materials.append(mat)
        mat.blend_method = 'BLEND'

# =============================================================================
# HOLOGRAPHIC EFFECTS
# =============================================================================

def create_holo_projectors(armature):
    """Create wrist and shoulder mounted hologram projectors"""
    if not ACCESSORIES["holo_projectors"]:
        return []
    
    print("Creating holographic projectors...")
    projectors = []
    
    # Wrist projectors
    for side in ['L', 'R']:
        wrist_proj = create_wrist_projector(armature, side)
        projectors.append(wrist_proj)
    
    # Shoulder projector
    shoulder_proj = create_shoulder_projector(armature)
    projectors.append(shoulder_proj)
    
    print(f"  Created {len(projectors)} projectors")
    return projectors

def create_wrist_projector(armature, side):
    """Create wrist-mounted holo projector"""
    prefix = "L_" if side == 'L' else "R_"
    
    bpy.ops.mesh.primitive_cylinder_add(vertices=8)
    projector = bpy.context.active_object
    projector.name = f"HoloProjector_Wrist_{side}"
    
    # Position at wrist
    hand_bone = armature.pose.bones.get(f"{prefix}Hand")
    if hand_bone:
        projector.location = armature.matrix_world @ hand_bone.head
        projector.rotation_euler.x = 1.5708
    
    projector.scale = (0.08, 0.08, 0.05)
    
    # Add hologram above projector
    if side == 'L':  # Main display on left wrist
        hologram = create_hologram_display(projector, "data_stream")
    else:
        hologram = create_hologram_display(projector, "icon_grid")
    
    return projector

def create_shoulder_projector(armature):
    """Create shoulder-mounted projector"""
    bpy.ops.mesh.primitive_cube_add()
    projector = bpy.context.active_object
    projector.name = "HoloProjector_Shoulder"
    
    # Position at shoulder
    upper_arm = armature.pose.bones.get("L_UpperArm")
    if upper_arm:
        projector.location = armature.matrix_world @ upper_arm.head
        projector.location.z += 0.2
    
    projector.scale = (0.12, 0.08, 0.1)
    
    # Add rotating hologram
    hologram = create_hologram_display(projector, "rotating_data")
    
    return projector

def create_hologram_display(projector, display_type):
    """Create holographic display above projector"""
    bpy.ops.mesh.primitive_plane_add()
    hologram = bpy.context.active_object
    hologram.name = f"Hologram_{display_type}"
    
    hologram.parent = projector
    hologram.location = (0, 0, 0.3)
    hologram.scale = (0.5, 0.5, 1)
    
    # Hologram material based on type
    mat = create_hologram_material(display_type)
    hologram.data.materials.append(mat)
    
    # Add animation
    if display_type == "rotating_data":
        hologram.rotation_mode = 'XYZ'
        hologram.keyframe_insert(data_path="rotation_euler", frame=1, index=2)
        hologram.rotation_euler.z += 6.28319  # 360 degrees
        hologram.keyframe_insert(data_path="rotation_euler", frame=120, index=2)
        
        # Set interpolation to linear
        if hologram.animation_data:
            for fcurve in hologram.animation_data.action.fcurves:
                for keyframe in fcurve.keyframe_points:
                    keyframe.interpolation = 'LINEAR'
    
    return hologram

def create_hologram_material(display_type):
    """Create material for holographic display"""
    mat = bpy.data.materials.new(name=f"MAT_Hologram_{display_type}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    
    if display_type == "data_stream":
        # Scrolling text/data effect
        wave = nodes.new('ShaderNodeTexWave')
        wave.wave_type = 'BANDS'
        wave.inputs['Scale'].default_value = 20.0
        
        mapping = nodes.new('ShaderNodeMapping')
        mapping.inputs['Location'].default_value[2] = 0  # Animate this
        
        tex_coord = nodes.new('ShaderNodeTexCoord')
        links.new(tex_coord.outputs['UV'], mapping.inputs['Vector'])
        links.new(mapping.outputs['Vector'], wave.inputs['Vector'])
        links.new(wave.outputs['Color'], emission.inputs['Color'])
    
    elif display_type == "icon_grid":
        # Grid of icons
        voronoi = nodes.new('ShaderNodeTexVoronoi')
        voronoi.inputs['Scale'].default_value = 10.0
        links.new(voronoi.outputs['Distance'], emission.inputs['Color'])
    
    else:  # rotating_data
        # Circular data pattern
        wave = nodes.new('ShaderNodeTexWave')
        wave.wave_type = 'RINGS'
        wave.inputs['Scale'].default_value = 15.0
        links.new(wave.outputs['Color'], emission.inputs['Color'])
    
    # Color adjustment
    color_ramp = nodes.new('ShaderNodeValToRGB')
    color_ramp.color_ramp.elements[0].color = (0, 0.3, 0.2, 0.3)
    color_ramp.color_ramp.elements[1].color = (*ELARA_PALETTE["emission"], 1.0)
    
    # Final connection
    links.new(emission.outputs['Emission'], output.inputs['Surface'])
    emission.inputs['Strength'].default_value = 5.0
    
    mat.blend_method = 'BLEND'
    return mat

# =============================================================================
# ACCESSORIES
# =============================================================================

def create_data_cables(armature):
    """Create visible data cables integrated into outfit"""
    if not ACCESSORIES["data_cables"]:
        return []
    
    print("Creating data cables...")
    cables = []
    
    # Cable from wrist to shoulder
    cable1 = create_cable_segment(
        armature,
        "L_Hand",
        "L_UpperArm",
        segments=12
    )
    cables.append(cable1)
    
    # Cable from shoulder to back
    cable2 = create_cable_segment(
        armature,
        "L_UpperArm",
        "C_Spine_04",
        segments=8
    )
    cables.append(cable2)
    
    print(f"  Created {len(cables)} data cables")
    return cables

def create_cable_segment(armature, start_bone_name, end_bone_name, segments=10):
    """Create a cable between two bones"""
    start_bone = armature.pose.bones.get(start_bone_name)
    end_bone = armature.pose.bones.get(end_bone_name)
    
    if not start_bone or not end_bone:
        return None
    
    start_pos = armature.matrix_world @ start_bone.head
    end_pos = armature.matrix_world @ end_bone.head
    
    # Create curve
    curve_data = bpy.data.curves.new(name=f"Cable_{start_bone_name}_to_{end_bone_name}", type='CURVE')
    curve_data.dimensions = '3D'
    
    polyline = curve_data.splines.new('NURBS')
    polyline.points.add(segments - 1)
    
    for i in range(segments):
        t = i / (segments - 1)
        # Simple lerp with slight sag
        pos = start_pos.lerp(end_pos, t)
        pos.z -= 0.1 * (1 - abs(2*t - 1))  # Sag in middle
        
        polyline.points[i].co = (*pos, 1.0)
    
    # Create cable object
    cable = bpy.data.objects.new(f"Cable_{start_bone_name}_to_{end_bone_name}", curve_data)
    bpy.context.collection.objects.link(cable)
    
    # Set cable thickness
    curve_data.bevel_depth = 0.01
    curve_data.bevel_resolution = 4
    
    # Cable material
    mat = bpy.data.materials.new(name="MAT_DataCable")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (0.1, 0.1, 0.15, 1.0)
        bsdf.inputs['Metallic'].default_value = 0.7
        bsdf.inputs['Roughness'].default_value = 0.3
        bsdf.inputs['Emission'].default_value = (*ELARA_PALETTE["accent"], 1.0)
        bsdf.inputs['Emission Strength'].default_value = 0.5
    
    cable.data.materials.append(mat)
    
    return cable

def create_wrist_computer(armature, side='L'):
    """Create wrist-mounted computer"""
    if not ACCESSORIES["wrist_computer"]:
        return None
    
    print(f"Creating wrist computer on {side} arm...")
    
    prefix = "L_" if side == 'L' else "R_"
    
    bpy.ops.mesh.primitive_cube_add()
    computer = bpy.context.active_object
    computer.name = f"WristComputer_{side}"
    
    # Position at forearm
    forearm_bone = armature.pose.bones.get(f"{prefix}Forearm")
    if forearm_bone:
        computer.location = armature.matrix_world @ forearm_bone.center
    
    computer.scale = (0.12, 0.08, 0.05)
    
    # Add screen
    bpy.ops.mesh.primitive_plane_add()
    screen = bpy.context.active_object
    screen.name = f"WristComputer_Screen_{side}"
    screen.parent = computer
    screen.location = (0, 0, 0.03)
    screen.scale = (0.8, 0.9, 1)
    
    # Screen material
    mat = bpy.data.materials.new(name=f"MAT_WristScreen_{side}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value = (*ELARA_PALETTE["emission"], 1.0)
    emission.inputs['Strength'].default_value = 3.0
    
    output = nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(emission.outputs['Emission'], output.inputs['Surface'])
    
    screen.data.materials.append(mat)
    
    return computer

def create_elara_hair(armature):
    """Create teal-tinted dark hair"""
    print("Creating hair...")
    
    head_bone = armature.pose.bones.get("C_Head")
    if not head_bone:
        return None
    
    # Ponytail style
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8)
    scalp = bpy.context.active_object
    scalp.name = "Elara_Hair_Scalp"
    
    scalp.location = armature.matrix_world @ head_bone.head
    scalp.location.z += 0.7
    scalp.scale = (0.35, 0.3, 0.25)
    
    # Particle system
    particle_mod = scalp.modifiers.new(name="Hair", type='PARTICLE_SYSTEM')
    particles = scalp.particle_systems[0]
    psettings = particles.settings
    
    psettings.type = 'HAIR'
    psettings.count = 8000
    psettings.hair_length = 1.2  # Longer hair
    psettings.child_type = 'INTERPOLATED'
    psettings.child_nbr = 4
    
    # Material
    mat = bpy.data.materials.new(name="MAT_Elara_Hair")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*ELARA_PALETTE["hair"], 1.0)
        bsdf.inputs['Roughness'].default_value = 0.5
        # Slight emission for teal tint
        bsdf.inputs['Emission'].default_value = (0.1, 0.2, 0.25, 1.0)
        bsdf.inputs['Emission Strength'].default_value = 0.3
    
    scalp.data.materials.append(mat)
    
    return scalp

# =============================================================================
# MAIN ELARA GENERATION
# =============================================================================

def generate_elara_character():
    """Main function to generate complete Elara character"""
    print("=" * 60)
    print("GENERATING ELARA (THE HACKER)")
    print("=" * 60)
    
    # Get base rig and body
    armature = bpy.data.objects.get("DJT_Base_Rig")
    body = bpy.data.objects.get("Body_Complete")
    
    if not armature or not body:
        print("ERROR: Base rig and body required. Run base scripts first.")
        return
    
    print("\n[1/6] Creating clothing...")
    hoodie = create_elara_hoodie(body, armature)
    
    print("\n[2/6] Creating AR glasses...")
    glasses = create_ar_glasses(armature)
    
    print("\n[3/6] Creating holographic systems...")
    projectors = create_holo_projectors(armature)
    
    print("\n[4/6] Creating accessories...")
    cables = create_data_cables(armature)
    wrist_comp = create_wrist_computer(armature, 'L')
    
    print("\n[5/6] Creating hair...")
    hair = create_elara_hair(armature)
    
    print("\n[6/6] Organizing scene...")
    organize_elara_scene(armature, body, hoodie, glasses, projectors, cables, wrist_comp, hair)
    
    print("\n" + "=" * 60)
    print("ELARA CHARACTER COMPLETE!")
    print("=" * 60)
    print("\nKey Features:")
    print("- Holographic wrist displays")
    print("- AR glasses with data streams")
    print("- Animated hologram projectors")
    print("- Integrated data cables")

def organize_elara_scene(armature, body, hoodie, glasses, projectors, cables, wrist_comp, hair):
    """Organize into collection"""
    if "Elara" not in bpy.data.collections:
        elara_col = bpy.data.collections.new("Elara")
        bpy.context.scene.collection.children.link(elara_col)
    else:
        elara_col = bpy.data.collections["Elara"]
    
    objects = [armature, body, hoodie, glasses, wrist_comp, hair] + projectors + cables
    for obj in objects:
        if obj and obj.name in bpy.context.scene.collection.objects:
            bpy.context.scene.collection.objects.unlink(obj)
            if obj.name not in elara_col.objects:
                elara_col.objects.link(obj)
    
    for obj in objects:
        if obj and obj != armature:
            obj.parent = armature

# =============================================================================
# EXECUTION
# =============================================================================

if __name__ == "__main__":
    generate_elara_character()
```

## Usage Instructions

Same workflow as Protagonist - run base scripts first, then this character script.

## Key Features

### Holographic Systems
- **Wrist displays**: Scrolling data streams
- **AR glasses**: Constant data overlay
- **Shoulder projector**: Rotating 3D models
- **Animated effects**: All holograms have motion

### Tech Integration
- **Data cables**: Visible fiber optics
- **Wrist computer**: Functional-looking interface
- **Circuit patterns**: Glowing traces on clothing

### Casual Hacker Aesthetic
- **Oversized hoodie**: With hood option
- **Comfortable sneakers**: Silent, practical
- **Minimal armor**: Relies on evasion, not protection

## Pose Suggestions

1. **Hacking Stance**: Examining wrist display
2. **Code Flow**: Both hands manipulating holograms
3. **Data Dive**: Intense focus on AR display
4. **Casual Confident**: Hands in pockets, smirking
5. **System Breach**: Dramatic gesture, data exploding

## Related Documentation

- **Compare**: [Character_Protagonist.md](Character_Protagonist.md)
- **Next**: [Character_Morgana.md](Character_Morgana.md)

---

**Character**: Elara (The Hacker)  
**Script Version**: 1.0  
**Last Updated**: January 2026
