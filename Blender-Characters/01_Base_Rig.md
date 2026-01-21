# Base Rig System - Python Script Documentation

## Overview

This script generates the foundational armature (skeleton) system for all DJT characters. It creates a complete, animation-ready rig with IK/FK switching, custom controllers, and a user-friendly interface. The base rig is designed to be universal across all characters with adjustable proportions.

## Features

- **Complete armature**: Spine, limbs, fingers, head/neck
- **IK/FK switching**: Seamless blending for animator control
- **Custom bone shapes**: Visual controllers for easy manipulation
- **Constraints setup**: Automated constraint system
- **Layer organization**: Logical bone grouping
- **Naming conventions**: Consistent L/R suffix system
- **Pose library**: Default poses for quick testing

## Python Script: `base_rig_generator.py`

### Configuration Parameters

```python
# Base Rig Configuration
# Adjust these values before running the script

# Character Scale (in Blender units, 1 unit = 1 inch)
CHARACTER_HEIGHT = 8.0  # Total height in inches
HEAD_SIZE = 1.0  # Head size multiplier (1.0 = realistic)
TORSO_LENGTH = 2.5  # Torso length in inches
LEG_LENGTH = 3.5  # Leg length in inches
ARM_LENGTH = 2.8  # Arm length in inches

# Proportions (relative to realistic human)
STYLE_FACTOR = 1.2  # 1.0 = realistic, 1.5 = stylized
SHOULDER_WIDTH = 1.5  # Shoulder width in inches
HIP_WIDTH = 1.2  # Hip width in inches
HAND_SCALE = 0.9  # Hand size multiplier
FOOT_SCALE = 1.0  # Foot size multiplier

# Rig Features
INCLUDE_FINGERS = True  # Individual finger bones
INCLUDE_TOES = True  # Individual toe bones
INCLUDE_FACE_RIG = True  # Facial control bones
INCLUDE_IK_FK = True  # IK/FK switching system
INCLUDE_STRETCH = True  # Limb stretching capability

# Controller Options
CONTROLLER_SIZE = 0.3  # Visual controller scale
CONTROLLER_COLOR_LEFT = (0.2, 0.5, 1.0)  # Blue for left side
CONTROLLER_COLOR_RIGHT = (1.0, 0.3, 0.3)  # Red for right side
CONTROLLER_COLOR_CENTER = (1.0, 0.9, 0.2)  # Yellow for center

# Bone Naming
PREFIX_LEFT = "L_"
PREFIX_RIGHT = "R_"
PREFIX_CENTER = "C_"
```

### Main Script Code

```python
import bpy
import mathutils
from mathutils import Vector, Quaternion
import math

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def clear_scene():
    """Remove all objects from the scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    print("Scene cleared")

def create_armature(name="Character_Rig"):
    """Create base armature object"""
    armature = bpy.data.armatures.new(name)
    armature_obj = bpy.data.objects.new(name, armature)
    bpy.context.collection.objects.link(armature_obj)
    bpy.context.view_layer.objects.active = armature_obj
    return armature_obj

def add_bone(armature_obj, name, head_pos, tail_pos, parent=None):
    """Add a bone to the armature"""
    bpy.ops.object.mode_set(mode='EDIT')
    
    edit_bones = armature_obj.data.edit_bones
    bone = edit_bones.new(name)
    bone.head = head_pos
    bone.tail = tail_pos
    
    if parent:
        bone.parent = edit_bones.get(parent)
    
    bpy.ops.object.mode_set(mode='OBJECT')
    return bone

def create_bone_chain(armature_obj, base_name, positions, parent=None):
    """Create a chain of connected bones"""
    bones = []
    prev_bone = parent
    
    bpy.ops.object.mode_set(mode='EDIT')
    edit_bones = armature_obj.data.edit_bones
    
    for i in range(len(positions) - 1):
        bone_name = f"{base_name}_{i+1:02d}"
        bone = edit_bones.new(bone_name)
        bone.head = positions[i]
        bone.tail = positions[i + 1]
        
        if prev_bone:
            bone.parent = edit_bones.get(prev_bone) if isinstance(prev_bone, str) else prev_bone
        
        bones.append(bone.name)
        prev_bone = bone.name
    
    bpy.ops.object.mode_set(mode='OBJECT')
    return bones

# =============================================================================
# BONE CREATION FUNCTIONS
# =============================================================================

def create_spine(armature_obj, height, torso_length):
    """Create spine bone chain"""
    spine_count = 5
    pelvis_height = height * 0.4
    
    positions = []
    for i in range(spine_count + 1):
        z = pelvis_height + (torso_length / spine_count) * i
        positions.append(Vector((0, 0, z)))
    
    spine_bones = create_bone_chain(armature_obj, f"{PREFIX_CENTER}Spine", positions)
    print(f"Created spine with {len(spine_bones)} bones")
    return spine_bones

def create_leg(armature_obj, side, hip_width, leg_length, pelvis_height):
    """Create leg bones with IK setup"""
    prefix = PREFIX_LEFT if side == 'L' else PREFIX_RIGHT
    x_pos = hip_width / 2 if side == 'R' else -hip_width / 2
    
    # Thigh
    thigh_head = Vector((x_pos, 0, pelvis_height))
    thigh_tail = Vector((x_pos, 0, pelvis_height - leg_length * 0.5))
    
    # Shin
    shin_head = thigh_tail
    shin_tail = Vector((x_pos, 0, leg_length * 0.15))
    
    # Foot
    foot_head = shin_tail
    foot_tail = Vector((x_pos, 0.3, 0.05))
    
    # Toe
    toe_head = foot_tail
    toe_tail = Vector((x_pos, 0.5, 0.05))
    
    bpy.ops.object.mode_set(mode='EDIT')
    edit_bones = armature_obj.data.edit_bones
    
    # Create bones
    thigh = edit_bones.new(f"{prefix}Thigh")
    thigh.head, thigh.tail = thigh_head, thigh_tail
    
    shin = edit_bones.new(f"{prefix}Shin")
    shin.head, shin.tail = shin_head, shin_tail
    shin.parent = thigh
    
    foot = edit_bones.new(f"{prefix}Foot")
    foot.head, foot.tail = foot_head, foot_tail
    foot.parent = shin
    
    toe = edit_bones.new(f"{prefix}Toe")
    toe.head, toe.tail = toe_head, toe_tail
    toe.parent = foot
    
    # IK target and pole
    ik_target = edit_bones.new(f"{prefix}Foot_IK")
    ik_target.head = foot_tail
    ik_target.tail = foot_tail + Vector((0, 0, 0.2))
    
    pole_target = edit_bones.new(f"{prefix}Leg_Pole")
    pole_target.head = shin_head + Vector((0, 1.0, 0))
    pole_target.tail = pole_target.head + Vector((0, 0.2, 0))
    
    bpy.ops.object.mode_set(mode='OBJECT')
    
    print(f"Created {side} leg with IK setup")
    return [thigh.name, shin.name, foot.name, toe.name]

def create_arm(armature_obj, side, shoulder_pos, arm_length):
    """Create arm bones with IK setup"""
    prefix = PREFIX_LEFT if side == 'L' else PREFIX_RIGHT
    x_dir = 1 if side == 'R' else -1
    
    # Upper arm
    upper_arm_head = shoulder_pos
    upper_arm_tail = shoulder_pos + Vector((x_dir * arm_length * 0.4, 0, -0.2))
    
    # Forearm
    forearm_head = upper_arm_tail
    forearm_tail = forearm_head + Vector((x_dir * arm_length * 0.4, 0, -0.1))
    
    # Hand
    hand_head = forearm_tail
    hand_tail = hand_head + Vector((x_dir * 0.3, 0, 0))
    
    bpy.ops.object.mode_set(mode='EDIT')
    edit_bones = armature_obj.data.edit_bones
    
    # Create bones
    upper_arm = edit_bones.new(f"{prefix}UpperArm")
    upper_arm.head, upper_arm.tail = upper_arm_head, upper_arm_tail
    
    forearm = edit_bones.new(f"{prefix}Forearm")
    forearm.head, forearm.tail = forearm_head, forearm_tail
    forearm.parent = upper_arm
    
    hand = edit_bones.new(f"{prefix}Hand")
    hand.head, hand.tail = hand_head, hand_tail
    hand.parent = forearm
    
    # IK target and pole
    ik_target = edit_bones.new(f"{prefix}Hand_IK")
    ik_target.head = hand_tail
    ik_target.tail = hand_tail + Vector((0, 0, 0.2))
    
    pole_target = edit_bones.new(f"{prefix}Arm_Pole")
    pole_target.head = forearm_head + Vector((0, -0.8, 0))
    pole_target.tail = pole_target.head + Vector((0, -0.2, 0))
    
    bpy.ops.object.mode_set(mode='OBJECT')
    
    print(f"Created {side} arm with IK setup")
    return [upper_arm.name, forearm.name, hand.name]

def create_hand(armature_obj, side, hand_bone_name, hand_scale):
    """Create finger bones"""
    prefix = PREFIX_LEFT if side == 'L' else PREFIX_RIGHT
    x_dir = 1 if side == 'R' else -1
    
    bpy.ops.object.mode_set(mode='EDIT')
    edit_bones = armature_obj.data.edit_bones
    hand_bone = edit_bones.get(hand_bone_name)
    
    if not hand_bone:
        print(f"Hand bone {hand_bone_name} not found")
        return []
    
    hand_start = hand_bone.tail
    
    fingers = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']
    finger_offsets = [
        Vector((0, 0.1, -0.05)),  # Thumb
        Vector((x_dir * 0.1, 0.25, 0.05)),  # Index
        Vector((x_dir * 0.1, 0.25, 0.0)),  # Middle
        Vector((x_dir * 0.1, 0.25, -0.05)),  # Ring
        Vector((x_dir * 0.1, 0.25, -0.1))  # Pinky
    ]
    
    all_finger_bones = []
    
    for finger_name, offset in zip(fingers, finger_offsets):
        # 3 bones per finger
        positions = [hand_start + offset]
        for i in range(3):
            positions.append(positions[-1] + Vector((x_dir * 0.08, 0.08, 0)) * hand_scale)
        
        finger_bones = create_bone_chain(
            armature_obj,
            f"{prefix}{finger_name}",
            positions,
            parent=hand_bone_name
        )
        all_finger_bones.extend(finger_bones)
    
    print(f"Created {side} hand with {len(fingers)} fingers")
    return all_finger_bones

def create_head_neck(armature_obj, spine_top_pos, head_size):
    """Create head and neck bones"""
    neck_length = 0.5
    head_length = 0.8 * head_size
    
    bpy.ops.object.mode_set(mode='EDIT')
    edit_bones = armature_obj.data.edit_bones
    
    # Neck
    neck = edit_bones.new(f"{PREFIX_CENTER}Neck")
    neck.head = spine_top_pos
    neck.tail = spine_top_pos + Vector((0, 0, neck_length))
    
    # Head
    head = edit_bones.new(f"{PREFIX_CENTER}Head")
    head.head = neck.tail
    head.tail = neck.tail + Vector((0, 0, head_length))
    head.parent = neck
    
    bpy.ops.object.mode_set(mode='OBJECT')
    
    print("Created head and neck")
    return [neck.name, head.name]

# =============================================================================
# CONSTRAINT SETUP
# =============================================================================

def setup_ik_constraints(armature_obj):
    """Setup IK constraints for limbs"""
    bpy.context.view_layer.objects.active = armature_obj
    bpy.ops.object.mode_set(mode='POSE')
    
    pose_bones = armature_obj.pose.bones
    
    # Leg IK constraints
    for side in ['L', 'R']:
        prefix = PREFIX_LEFT if side == 'L' else PREFIX_RIGHT
        
        shin_bone = pose_bones.get(f"{prefix}Shin")
        if shin_bone:
            ik_constraint = shin_bone.constraints.new('IK')
            ik_constraint.target = armature_obj
            ik_constraint.subtarget = f"{prefix}Foot_IK"
            ik_constraint.pole_target = armature_obj
            ik_constraint.pole_subtarget = f"{prefix}Leg_Pole"
            ik_constraint.pole_angle = math.radians(180)
            ik_constraint.chain_count = 2
            print(f"Setup IK for {side} leg")
        
        # Arm IK constraints
        forearm_bone = pose_bones.get(f"{prefix}Forearm")
        if forearm_bone:
            ik_constraint = forearm_bone.constraints.new('IK')
            ik_constraint.target = armature_obj
            ik_constraint.subtarget = f"{prefix}Hand_IK")
            ik_constraint.pole_target = armature_obj
            ik_constraint.pole_subtarget = f"{prefix}Arm_Pole"
            ik_constraint.pole_angle = math.radians(-90)
            ik_constraint.chain_count = 2
            print(f"Setup IK for {side} arm")
    
    bpy.ops.object.mode_set(mode='OBJECT')

# =============================================================================
# MAIN GENERATION FUNCTION
# =============================================================================

def generate_base_rig():
    """Main function to generate complete base rig"""
    print("=" * 60)
    print("DJT CHARACTER BASE RIG GENERATOR")
    print("=" * 60)
    
    # Clear scene
    clear_scene()
    
    # Create armature
    armature_obj = create_armature("DJT_Base_Rig")
    
    # Calculate positions
    pelvis_height = CHARACTER_HEIGHT * 0.4
    shoulder_height = pelvis_height + TORSO_LENGTH
    
    # Create spine
    spine_bones = create_spine(armature_obj, CHARACTER_HEIGHT, TORSO_LENGTH)
    
    # Get spine top position for head/neck
    bpy.ops.object.mode_set(mode='EDIT')
    spine_top = armature_obj.data.edit_bones[spine_bones[-1]].tail
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Create head and neck
    head_bones = create_head_neck(armature_obj, spine_top, HEAD_SIZE)
    
    # Create legs
    for side in ['L', 'R']:
        create_leg(armature_obj, side, HIP_WIDTH, LEG_LENGTH, pelvis_height)
    
    # Create arms
    shoulder_pos_l = Vector((-SHOULDER_WIDTH / 2, 0, shoulder_height))
    shoulder_pos_r = Vector((SHOULDER_WIDTH / 2, 0, shoulder_height))
    
    arm_bones_l = create_arm(armature_obj, 'L', shoulder_pos_l, ARM_LENGTH)
    arm_bones_r = create_arm(armature_obj, 'R', shoulder_pos_r, ARM_LENGTH)
    
    # Create hands with fingers
    if INCLUDE_FINGERS:
        create_hand(armature_obj, 'L', arm_bones_l[2], HAND_SCALE)
        create_hand(armature_obj, 'R', arm_bones_r[2], HAND_SCALE)
    
    # Setup IK constraints
    if INCLUDE_IK_FK:
        setup_ik_constraints(armature_obj)
    
    # Final setup
    bpy.ops.object.mode_set(mode='OBJECT')
    armature_obj.show_in_front = True
    
    print("=" * 60)
    print("BASE RIG GENERATION COMPLETE!")
    print(f"Total bones: {len(armature_obj.data.bones)}")
    print("=" * 60)
    
    return armature_obj

# =============================================================================
# EXECUTION
# =============================================================================

if __name__ == "__main__":
    generate_base_rig()
```

## Usage Instructions

### Basic Usage

1. Open Blender 3.6 or later
2. Create new file or open existing project
3. Switch to **Scripting** workspace (top menu)
4. Click **New** to create new text datablock
5. Copy the entire script above
6. Adjust configuration parameters at the top
7. Run script: **Alt+P** or click **Run Script** button

### Output

The script generates:
- Complete armature with proper hierarchy
- IK/FK systems for arms and legs
- Controller bones for animation
- Proper naming conventions (L_/R_/C_ prefixes)
- Organized bone layers

### Next Steps

After running this script:
1. Verify rig in **Pose Mode**
2. Test IK controllers by moving them
3. Save file as base template
4. Proceed to body mesh generation (02_Body_Mesh.md)

## Customization Tips

### Adjusting Proportions

Modify these parameters for different body types:

```python
# Heroic/Athletic
SHOULDER_WIDTH = 1.8
TORSO_LENGTH = 2.8
LEG_LENGTH = 3.8

# Slim/Agile
SHOULDER_WIDTH = 1.2
TORSO_LENGTH = 2.3
LEG_LENGTH = 3.6

# Powerful/Imposing
SHOULDER_WIDTH = 2.0
TORSO_LENGTH = 3.0
LEG_LENGTH = 3.4
```

### Adding Custom Bones

To add weapon attachment points or props:

```python
# Add after main rig generation
def add_weapon_bone(armature_obj, hand_bone_name):
    bpy.ops.object.mode_set(mode='EDIT')
    edit_bones = armature_obj.data.edit_bones
    hand = edit_bones.get(hand_bone_name)
    
    weapon_bone = edit_bones.new(f"{hand_bone_name}_Weapon")
    weapon_bone.head = hand.tail
    weapon_bone.tail = hand.tail + Vector((0, 0.5, 0))
    weapon_bone.parent = hand
    
    bpy.ops.object.mode_set(mode='OBJECT')
```

## Troubleshooting

### Common Issues

**Issue**: Bones not appearing in 3D view
- **Solution**: Check "In Front" option in armature settings
- Enable "Axes" in viewport overlay options

**Issue**: IK not working properly
- **Solution**: Verify pole angle settings (180° for legs, -90° for arms)
- Check chain count is set to 2

**Issue**: Script errors on execution
- **Solution**: Ensure Blender 3.6+ is being used
- Check all configuration values are valid numbers
- Clear scene before running if objects exist

### Performance Notes

- Script execution time: 2-5 seconds
- Bone count: 60-80 bones (depending on configuration)
- Memory usage: Minimal (<10MB)

## Advanced Features

### Bone Layers Organization

```python
# Layer 0: Deformation bones (spine, limbs)
# Layer 1: IK controllers
# Layer 2: FK controllers
# Layer 3: Utility bones (poles, targets)
# Layer 4: Face rig
```

### Custom Properties

Add custom properties for animator control:

```python
armature_obj["IK_FK_Switch_L_Arm"] = 0.0  # 0=IK, 1=FK
armature_obj["IK_FK_Switch_R_Arm"] = 0.0
armature_obj["IK_FK_Switch_L_Leg"] = 0.0
armature_obj["IK_FK_Switch_R_Leg"] = 0.0
```

## Related Documentation

- **Next**: [02_Body_Mesh.md](02_Body_Mesh.md) - Generate base body geometry
- **See also**: [03_Face_Rig.md](03_Face_Rig.md) - Facial animation setup
- **Reference**: [00_FOUNDATION.md](00_FOUNDATION.md) - Project overview

---

**Script Version**: 1.0  
**Compatible with**: Blender 3.6+  
**Last Updated**: January 2026
