# Morgana (The CEO) - Complete Generation Script

## Character Overview

**Name**: Morgana  
**Council Role**: Corporate Manipulation Specialist  
**Aesthetic**: Power suit with menacing elegance  
**Color Scheme**: Deep purple, gold, sharp metallics  
**Build**: Tall, commanding presence

## Character Specifications

### Physical Attributes
- **Height**: 8.5 inches (tallest character - dominance)
- **Build**: Fit, toned, imposing
- **Head proportion**: 1.0x (realistic for authority)
- **Posture**: Upright, commanding, sharp angles

### Design Elements
- **Tailored power suit**: Sharp lines, exaggerated shoulders
- **High heels**: Stiletto, adding height and danger
- **Metallic accessories**: Sharp jewelry as weapons
- **Slicked hair**: Severe updo or sleek bob
- **Manicured nails**: Extended, claw-like
- **Intimidating presence**: Every detail calculated

### Personality Traits
- Ruthless, calculating
- Supremely confident
- Cold, elegant menace
- Subtle cruel smile

## Python Script: `character_morgana.py`

```python
import bpy
from mathutils import Vector
import math

# =============================================================================
# MORGANA CONFIGURATION
# =============================================================================

CHARACTER_CONFIG = {
    "height": 8.5,
    "head_size": 1.0,
    "torso_length": 2.8,
    "leg_length": 4.0,
    "arm_length": 2.9,
    "body_type": "athletic",
    "shoulder_width": 1.7,  # Wider for power suit
    "hip_width": 1.3,
    "muscle_definition": 0.6
}

MORGANA_PALETTE = {
    "primary": (0.15, 0.05, 0.2),    # Deep purple suit
    "secondary": (0.6, 0.5, 0.2),    # Gold accents
    "accent": (0.5, 0.1, 0.6),       # Purple details
    "emission": (0.8, 0.3, 1.0),     # Purple glow
    "skin": (0.75, 0.65, 0.6),       # Pale commanding presence
    "hair": (0.05, 0.02, 0.08),      # Near black with purple tint
    "metal": (0.85, 0.75, 0.4)       # Gold metal
}

ACCESSORIES = {
    "power_suit": True,
    "high_heels": True,
    "sharp_jewelry": True,
    "shoulder_pads": True,
    "claw_nails": True
}

# =============================================================================
# POWER SUIT CREATION
# =============================================================================

def create_morgana_power_suit(body_obj, armature):
    """Create tailored power suit with sharp lines"""
    print("Creating power suit...")
    
    # Jacket
    jacket = create_suit_jacket(body_obj, armature)
    
    # Pants
    pants = create_suit_pants(body_obj, armature)
    
    # Shoulder pads
    if ACCESSORIES["shoulder_pads"]:
        shoulders = []
        for side in ['L', 'R']:
            shoulder = create_exaggerated_shoulder(armature, side)
            shoulders.append(shoulder)
    
    print("  Power suit created")
    return jacket, pants

def create_suit_jacket(body_obj, armature):
    """Create fitted jacket with sharp lapels"""
    bpy.ops.mesh.primitive_cube_add()
    jacket = bpy.context.active_object
    jacket.name = "Morgana_Jacket"
    
    # Position at torso
    spine_bone = armature.pose.bones.get("C_Spine_03")
    if spine_bone:
        jacket.location = armature.matrix_world @ spine_bone.head
        jacket.location.z += 0.4
    
    # Scale to fitted
    jacket.scale = (0.7, 0.4, 1.1)
    
    # Add sharp edge modifiers
    bevel = jacket.modifiers.new(name="SharpEdges", type='BEVEL')
    bevel.width = 0.01
    bevel.segments = 2
    bevel.limit_method = 'ANGLE'
    bevel.angle_limit = math.radians(30)
    
    # Lapels
    create_suit_lapels(jacket, armature)
    
    # Material - purple with subtle pattern
    create_suit_material(jacket)
    
    return jacket

def create_suit_lapels(jacket, armature):
    """Create sharp lapels on jacket"""
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cone_add(vertices=3)
        lapel = bpy.context.active_object
        lapel.name = f"Jacket_Lapel_{'L' if side < 0 else 'R'}"
        
        lapel.parent = jacket
        lapel.location = (side * 0.3, 0.2, 0.5)
        lapel.rotation_euler = (1.5708, 0, 0)
        lapel.scale = (0.3, 0.4, 0.2)

def create_suit_pants(body_obj, armature):
    """Create fitted suit pants"""
    bpy.ops.mesh.primitive_cylinder_add(vertices=12)
    pants = bpy.context.active_object
    pants.name = "Morgana_Pants"
    
    # Position at hips
    spine_bone = armature.pose.bones.get("C_Spine_01")
    if spine_bone:
        pants.location = armature.matrix_world @ spine_bone.head
        pants.location.z += 1.5
    
    pants.scale = (0.6, 0.6, 2.0)
    
    return pants

def create_suit_material(obj):
    """Create material for suit with subtle pattern"""
    mat = bpy.data.materials.new(name="MAT_Morgana_Suit")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    
    # Base purple color
    color_node = nodes.new('ShaderNodeRGB')
    color_node.outputs[0].default_value = (*MORGANA_PALETTE["primary"], 1.0)
    
    # Subtle fabric texture
    wave = nodes.new('ShaderNodeTexWave')
    wave.wave_type = 'BANDS'
    wave.inputs['Scale'].default_value = 100.0
    wave.inputs['Distortion'].default_value = 0.5
    
    mix_color = nodes.new('ShaderNodeMix')
    mix_color.data_type = 'RGBA'
    mix_color.inputs['Factor'].default_value = 0.05
    
    links.new(color_node.outputs['Color'], mix_color.inputs['A'])
    links.new(wave.outputs['Color'], mix_color.inputs['B'])
    links.new(mix_color.outputs['Result'], bsdf.inputs['Base Color'])
    
    # Fabric properties
    bsdf.inputs['Roughness'].default_value = 0.5
    bsdf.inputs['Sheen'].default_value = 0.3  # Fabric sheen
    bsdf.inputs['Specular'].default_value = 0.4
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    obj.data.materials.append(mat)

def create_exaggerated_shoulder(armature, side):
    """Create dramatic shoulder pads"""
    prefix = "L_" if side == 'L' else "R_"
    
    # Sharp angular shoulder pad
    bpy.ops.mesh.primitive_cube_add()
    shoulder = bpy.context.active_object
    shoulder.name = f"ShoulderPad_{side}"
    
    # Position at shoulder
    arm_bone = armature.pose.bones.get(f"{prefix}UpperArm")
    if arm_bone:
        shoulder.location = armature.matrix_world @ arm_bone.head
        shoulder.location.z += 0.2
    
    # Scale - wide and angular
    shoulder.scale = (0.4, 0.3, 0.15)
    
    # Sharp bevel
    bevel = shoulder.modifiers.new(name="SharpEdge", type='BEVEL')
    bevel.width = 0.015
    bevel.segments = 1
    
    # Gold accent material
    create_gold_material(shoulder)
    
    return shoulder

# =============================================================================
# METALLIC ACCESSORIES
# =============================================================================

def create_sharp_jewelry(armature):
    """Create dangerous-looking jewelry"""
    if not ACCESSORIES["sharp_jewelry"]:
        return []
    
    print("Creating sharp jewelry...")
    jewelry = []
    
    # Necklace with sharp pendant
    necklace = create_sharp_necklace(armature)
    jewelry.append(necklace)
    
    # Bracelet with spikes
    for side in ['L', 'R']:
        bracelet = create_spike_bracelet(armature, side)
        jewelry.append(bracelet)
    
    # Rings with claws
    for side in ['L', 'R']:
        rings = create_claw_rings(armature, side)
        jewelry.extend(rings)
    
    print(f"  Created {len(jewelry)} jewelry pieces")
    return jewelry

def create_sharp_necklace(armature):
    """Create necklace with sharp geometric pendant"""
    # Chain
    bpy.ops.mesh.primitive_torus_add(major_radius=0.3, minor_radius=0.01)
    necklace = bpy.context.active_object
    necklace.name = "Jewelry_Necklace"
    
    # Position at neck
    neck_bone = armature.pose.bones.get("C_Neck")
    if neck_bone:
        necklace.location = armature.matrix_world @ neck_bone.head
        necklace.location.z += 0.3
    
    # Pendant - sharp diamond shape
    bpy.ops.mesh.primitive_cone_add(vertices=4)
    pendant = bpy.context.active_object
    pendant.name = "Jewelry_Pendant"
    pendant.parent = necklace
    pendant.location = (0, 0.15, -0.15)
    pendant.rotation_euler = (0, 0, math.radians(45))
    pendant.scale = (0.15, 0.15, 0.25)
    
    # Gold material
    create_gold_material(necklace)
    create_gold_material(pendant)
    
    # Add purple gem
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2)
    gem = bpy.context.active_object
    gem.name = "Jewelry_Gem"
    gem.parent = pendant
    gem.location = (0, 0, 0)
    gem.scale = (0.3, 0.3, 0.3)
    
    create_gem_material(gem)
    
    return necklace

def create_spike_bracelet(armature, side):
    """Create bracelet with spikes"""
    prefix = "L_" if side == 'L' else "R_"
    
    # Band
    bpy.ops.mesh.primitive_torus_add(major_radius=0.15, minor_radius=0.02)
    bracelet = bpy.context.active_object
    bracelet.name = f"Jewelry_Bracelet_{side}"
    
    # Position at wrist
    hand_bone = armature.pose.bones.get(f"{prefix}Hand")
    if hand_bone:
        bracelet.location = armature.matrix_world @ hand_bone.head
        bracelet.rotation_euler.y = 1.5708
    
    # Add spikes around bracelet
    for i in range(8):
        angle = (i / 8) * 2 * math.pi
        bpy.ops.mesh.primitive_cone_add(vertices=4)
        spike = bpy.context.active_object
        spike.name = f"Bracelet_Spike_{side}_{i}"
        spike.parent = bracelet
        
        spike.location = (
            math.cos(angle) * 0.15,
            math.sin(angle) * 0.15,
            0
        )
        spike.rotation_euler = (1.5708, 0, angle)
        spike.scale = (0.05, 0.05, 0.1)
        
        create_gold_material(spike)
    
    create_gold_material(bracelet)
    
    return bracelet

def create_claw_rings(armature, side):
    """Create rings with claw extensions"""
    if not ACCESSORIES["claw_nails"]:
        return []
    
    prefix = "L_" if side == 'L' else "R_"
    rings = []
    
    # Ring on index and middle finger
    for finger in ["Index", "Middle"]:
        bone_name = f"{prefix}{finger}_02"
        finger_bone = armature.pose.bones.get(bone_name)
        if not finger_bone:
            continue
        
        # Ring band
        bpy.ops.mesh.primitive_torus_add(major_radius=0.04, minor_radius=0.008)
        ring = bpy.context.active_object
        ring.name = f"Ring_{side}_{finger}"
        
        ring.location = armature.matrix_world @ finger_bone.head
        ring.rotation_euler.y = 1.5708
        
        # Claw extension
        bpy.ops.mesh.primitive_cone_add(vertices=4)
        claw = bpy.context.active_object
        claw.name = f"Claw_{side}_{finger}"
        claw.parent = ring
        claw.location = (0, 0.15, 0)
        claw.rotation_euler = (1.5708, 0, 0)
        claw.scale = (0.02, 0.02, 0.25)
        
        create_gold_material(ring)
        create_gold_material(claw)
        
        rings.append(ring)
    
    return rings

def create_gold_material(obj):
    """Create metallic gold material"""
    mat = bpy.data.materials.new(name=f"MAT_Gold_{obj.name}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*MORGANA_PALETTE["metal"], 1.0)
        bsdf.inputs['Metallic'].default_value = 1.0
        bsdf.inputs['Roughness'].default_value = 0.2
        bsdf.inputs['Specular'].default_value = 1.0
    
    obj.data.materials.append(mat)

def create_gem_material(obj):
    """Create glowing purple gem material"""
    mat = bpy.data.materials.new(name=f"MAT_Gem_{obj.name}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    
    # Mix glass and emission
    mix = nodes.new('ShaderNodeMixShader')
    glass = nodes.new('ShaderNodeBsdfGlass')
    emission = nodes.new('ShaderNodeEmission')
    
    glass.inputs['Color'].default_value = (*MORGANA_PALETTE["accent"], 1.0)
    glass.inputs['Roughness'].default_value = 0.0
    glass.inputs['IOR'].default_value = 2.4  # High refraction
    
    emission.inputs['Color'].default_value = (*MORGANA_PALETTE["emission"], 1.0)
    emission.inputs['Strength'].default_value = 3.0
    
    mix.inputs['Fac'].default_value = 0.7
    links.new(glass.outputs['BSDF'], mix.inputs[1])
    links.new(emission.outputs['Emission'], mix.inputs[2])
    links.new(mix.outputs['Shader'], output.inputs['Surface'])
    
    obj.data.materials.append(mat)

# =============================================================================
# FOOTWEAR
# =============================================================================

def create_high_heels(armature, side):
    """Create stiletto high heels"""
    if not ACCESSORIES["high_heels"]:
        return None
    
    prefix = "L_" if side == 'L' else "R_"
    
    print(f"Creating high heel for {side} foot...")
    
    # Shoe body
    bpy.ops.mesh.primitive_cube_add()
    shoe = bpy.context.active_object
    shoe.name = f"HighHeel_{side}"
    
    # Position at foot
    foot_bone = armature.pose.bones.get(f"{prefix}Foot")
    if foot_bone:
        shoe.location = armature.matrix_world @ foot_bone.head
        shoe.location.z += 0.05
    
    shoe.scale = (0.12, 0.35, 0.08)
    
    # Heel spike
    bpy.ops.mesh.primitive_cylinder_add(vertices=8)
    heel = bpy.context.active_object
    heel.name = f"Heel_Spike_{side}"
    heel.parent = shoe
    heel.location = (0, -0.15, -0.25)
    heel.scale = (0.08, 0.08, 2.5)
    
    # Sharp tip
    bpy.ops.mesh.primitive_cone_add(vertices=8)
    tip = bpy.context.active_object
    tip.name = f"Heel_Tip_{side}"
    tip.parent = heel
    tip.location = (0, 0, -0.3)
    tip.scale = (1.2, 1.2, 0.3)
    
    # Materials - black with gloss
    create_leather_material(shoe)
    create_metal_heel_material(heel)
    create_metal_heel_material(tip)
    
    return shoe

def create_leather_material(obj):
    """Create glossy black leather material"""
    mat = bpy.data.materials.new(name=f"MAT_Leather_{obj.name}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (0.05, 0.05, 0.08, 1.0)
        bsdf.inputs['Roughness'].default_value = 0.3
        bsdf.inputs['Specular'].default_value = 0.8
        bsdf.inputs['Sheen'].default_value = 0.2
    
    obj.data.materials.append(mat)

def create_metal_heel_material(obj):
    """Create metallic heel material"""
    mat = bpy.data.materials.new(name=f"MAT_MetalHeel_{obj.name}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (0.6, 0.6, 0.65, 1.0)
        bsdf.inputs['Metallic'].default_value = 1.0
        bsdf.inputs['Roughness'].default_value = 0.15
    
    obj.data.materials.append(mat)

# =============================================================================
# HAIR
# =============================================================================

def create_morgana_hair(armature):
    """Create slicked back severe hairstyle"""
    print("Creating hair...")
    
    head_bone = armature.pose.bones.get("C_Head")
    if not head_bone:
        return None
    
    # Scalp base
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8)
    scalp = bpy.context.active_object
    scalp.name = "Morgana_Hair"
    
    scalp.location = armature.matrix_world @ head_bone.head
    scalp.location.z += 0.7
    scalp.scale = (0.35, 0.3, 0.3)
    
    # Tight, severe style - less particles, more controlled
    particle_mod = scalp.modifiers.new(name="Hair", type='PARTICLE_SYSTEM')
    particles = scalp.particle_systems[0]
    psettings = particles.settings
    
    psettings.type = 'HAIR'
    psettings.count = 3000  # Fewer for sleek look
    psettings.hair_length = 0.6  # Short, controlled
    psettings.child_type = 'SIMPLE'
    psettings.child_nbr = 2
    
    # Slicked back effect
    psettings.use_clump_curve = True
    psettings.clump_factor = 0.8
    
    # Material - dark with purple sheen
    mat = bpy.data.materials.new(name="MAT_Morgana_Hair")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*MORGANA_PALETTE["hair"], 1.0)
        bsdf.inputs['Roughness'].default_value = 0.2  # Very glossy
        bsdf.inputs['Specular'].default_value = 1.0
        # Purple sheen
        bsdf.inputs['Sheen'].default_value = 0.5
        bsdf.inputs['Sheen Tint'].default_value = (*MORGANA_PALETTE["accent"], 1.0)
    
    scalp.data.materials.append(mat)
    
    return scalp

# =============================================================================
# MAIN MORGANA GENERATION
# =============================================================================

def generate_morgana_character():
    """Main function to generate complete Morgana character"""
    print("=" * 60)
    print("GENERATING MORGANA (THE CEO)")
    print("=" * 60)
    
    armature = bpy.data.objects.get("DJT_Base_Rig")
    body = bpy.data.objects.get("Body_Complete")
    
    if not armature or not body:
        print("ERROR: Base rig and body required.")
        return
    
    print("\n[1/5] Creating power suit...")
    jacket, pants = create_morgana_power_suit(body, armature)
    
    print("\n[2/5] Creating jewelry...")
    jewelry = create_sharp_jewelry(armature)
    
    print("\n[3/5] Creating footwear...")
    heels = [create_high_heels(armature, side) for side in ['L', 'R']]
    
    print("\n[4/5] Creating hair...")
    hair = create_morgana_hair(armature)
    
    print("\n[5/5] Organizing scene...")
    organize_morgana_scene(armature, body, jacket, pants, jewelry, heels, hair)
    
    print("\n" + "=" * 60)
    print("MORGANA CHARACTER COMPLETE!")
    print("=" * 60)
    print("\nKey Features:")
    print("- Commanding power suit with exaggerated shoulders")
    print("- Sharp metallic jewelry as weapons")
    print("- Dangerous stiletto heels")
    print("- Severe, controlled hairstyle")

def organize_morgana_scene(armature, body, jacket, pants, jewelry, heels, hair):
    """Organize into collection"""
    if "Morgana" not in bpy.data.collections:
        morgana_col = bpy.data.collections.new("Morgana")
        bpy.context.scene.collection.children.link(morgana_col)
    else:
        morgana_col = bpy.data.collections["Morgana"]
    
    objects = [armature, body, jacket, pants, hair] + jewelry + heels
    for obj in objects:
        if obj and obj.name in bpy.context.scene.collection.objects:
            bpy.context.scene.collection.objects.unlink(obj)
            if obj.name not in morgana_col.objects:
                morgana_col.objects.link(obj)
    
    for obj in objects:
        if obj and obj != armature:
            obj.parent = armature

# =============================================================================
# EXECUTION
# =============================================================================

if __name__ == "__main__":
    generate_morgana_character()
```

## Usage Instructions

Run after base scripts. Creates commanding, intimidating CEO character.

## Key Features

### Power Suit
- **Sharp tailoring**: Angular, aggressive lines
- **Exaggerated shoulders**: Dominance and authority
- **Perfect fit**: Custom-tailored appearance
- **Subtle patterns**: Fabric texture detail

### Dangerous Accessories
- **Sharp jewelry**: Every piece could be a weapon
- **Claw rings**: Extended nail/claw hybrids
- **Spike bracelets**: Defensive and offensive
- **Gem accents**: Glowing purple power

### Commanding Presence
- **Tall stature**: Tallest character (8.5 inches)
- **Stiletto heels**: Adding danger and height
- **Severe styling**: Everything calculated
- **Cold elegance**: Beauty as weapon

## Pose Suggestions

1. **Executive Power**: Arms crossed, commanding
2. **Boardroom Dominance**: Leaning forward, intimidating
3. **Calculating**: Examining nails (claws), plotting
4. **Dismissive**: Hand wave, contemptuous
5. **Victory**: Heel on defeated foe

## Color Variations

```python
# Darker, more menacing
MORGANA_PALETTE["primary"] = (0.08, 0.0, 0.15)

# Red instead of purple (alternate)
MORGANA_PALETTE["primary"] = (0.2, 0.0, 0.05)
MORGANA_PALETTE["accent"] = (0.8, 0.1, 0.15)
```

---

**Character**: Morgana (The CEO)  
**Script Version**: 1.0  
**Last Updated**: January 2026
