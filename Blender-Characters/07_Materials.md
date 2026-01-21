# Material and Shader System - Python Script Documentation

## Overview

This script sets up PBR (Physically Based Rendering) materials for DJT characters with the signature dark cyberpunk aesthetic featuring neon accents. It creates procedural shader networks optimized for both real-time preview and high-quality renders.

## Features

- **PBR materials**: Base Color, Metallic, Roughness, Normal, Emission
- **Neon glow effects**: Procedural emission for cyberpunk aesthetic
- **Character-specific palettes**: Pre-configured color schemes
- **Texture baking**: Automated texture map generation
- **Multiple material slots**: Base, accessories, effects
- **Real-time friendly**: Optimized for Eevee and Cycles

## Python Script: `material_system.py`

### Configuration Parameters

```python
# Material System Configuration

# Character Selection
CHARACTER_NAME = "Protagonist"  # Options: Protagonist, Elara, Morgana, Vesper, Sable, Nyx, Jezebel

# Material Quality
TEXTURE_RESOLUTION = 2048  # Options: 1024, 2048, 4096
USE_PROCEDURAL_TEXTURES = True  # False = use image textures
ENABLE_EMISSION = True  # Neon glow effects
ENABLE_SUBSURFACE = True  # Skin subsurface scattering

# Render Engine Optimization
TARGET_ENGINE = "eevee"  # Options: eevee, cycles, both

# Baking Options
BAKE_TEXTURES = False  # Set to True to bake all maps
BAKE_SAMPLES = 128  # Higher = better quality, slower

# Color Palettes (RGB tuples)
CHARACTER_PALETTES = {
    "Protagonist": {
        "primary": (0.1, 0.2, 0.4),  # Dark blue
        "secondary": (0.5, 0.6, 0.7),  # Silver
        "accent": (0.2, 0.8, 1.0),  # Cyan
        "emission": (0.3, 0.9, 1.0)  # Bright cyan glow
    },
    "Elara": {
        "primary": (0.05, 0.05, 0.1),  # Near black
        "secondary": (0.3, 0.3, 0.35),  # Gray
        "accent": (0.2, 1.0, 0.3),  # Neon green
        "emission": (0.0, 1.0, 0.5)  # Green glow
    },
    "Morgana": {
        "primary": (0.15, 0.05, 0.2),  # Deep purple
        "secondary": (0.6, 0.5, 0.2),  # Gold
        "accent": (0.5, 0.1, 0.6),  # Purple
        "emission": (0.8, 0.3, 1.0)  # Purple glow
    },
    "Vesper": {
        "primary": (0.3, 0.05, 0.1),  # Burgundy
        "secondary": (0.7, 0.7, 0.75),  # Chrome
        "accent": (0.9, 0.3, 0.3),  # Red
        "emission": (1.0, 0.2, 0.3)  # Red glow
    },
    "Sable": {
        "primary": (0.05, 0.05, 0.05),  # Black
        "secondary": (0.6, 0.1, 0.15),  # Dark red
        "accent": (0.9, 0.2, 0.3),  # Bright red
        "emission": (1.0, 0.0, 0.3)  # Red-pink glow
    },
    "Nyx": {
        "primary": (0.8, 0.8, 0.8),  # White/light gray
        "secondary": (0.2, 0.15, 0.25),  # Dark purple
        "accent": (1.0, 0.5, 0.0),  # Orange (varies)
        "emission": (1.0, 0.3, 0.8)  # Rainbow effect
    },
    "Jezebel": {
        "primary": (0.1, 0.0, 0.15),  # Deep purple-black
        "secondary": (0.8, 0.6, 0.2),  # Gold
        "accent": (0.6, 0.2, 0.8),  # Royal purple
        "emission": (0.9, 0.4, 1.0)  # Bright purple glow
    }
}
```

### Main Script Code

```python
import bpy
import os
from mathutils import Vector, Color

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def get_body_object():
    """Get the body mesh object"""
    body = bpy.data.objects.get("Body_Complete")
    if not body:
        raise Exception("Body mesh 'Body_Complete' not found in scene")
    return body

def create_material(name):
    """Create new material with nodes"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    return mat

def get_palette(character_name):
    """Get color palette for character"""
    return CHARACTER_PALETTES.get(character_name, CHARACTER_PALETTES["Protagonist"])

# =============================================================================
# SHADER NODE CREATION
# =============================================================================

def create_base_pbr_material(name, palette):
    """Create base PBR material with character colors"""
    print(f"Creating base PBR material: {name}")
    
    mat = create_material(name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Output node
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (800, 0)
    
    # Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (400, 0)
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    # Base Color
    color_node = nodes.new('ShaderNodeRGB')
    color_node.location = (0, 200)
    color_node.outputs[0].default_value = (*palette["primary"], 1.0)
    links.new(color_node.outputs['Color'], bsdf.inputs['Base Color'])
    
    # Metallic
    bsdf.inputs['Metallic'].default_value = 0.1
    
    # Roughness
    roughness_node = nodes.new('ShaderNodeValue')
    roughness_node.location = (0, 0)
    roughness_node.outputs[0].default_value = 0.6
    links.new(roughness_node.outputs['Value'], bsdf.inputs['Roughness'])
    
    # Specular
    bsdf.inputs['Specular'].default_value = 0.5
    
    if ENABLE_SUBSURFACE:
        # Subsurface scattering for skin
        bsdf.inputs['Subsurface'].default_value = 0.05
        bsdf.inputs['Subsurface Radius'].default_value = (0.8, 0.4, 0.3)
        bsdf.inputs['Subsurface Color'].default_value = (*palette["primary"], 1.0)
    
    print(f"  Base PBR material created")
    return mat

def create_accent_material(name, palette):
    """Create accent material with metallic/emission"""
    print(f"Creating accent material: {name}")
    
    mat = create_material(name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Output
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (1000, 0)
    
    # Mix Shader (for emission blend)
    if ENABLE_EMISSION:
        mix_shader = nodes.new('ShaderNodeMixShader')
        mix_shader.location = (700, 0)
        mix_shader.inputs['Fac'].default_value = 0.3
        links.new(mix_shader.outputs['Shader'], output.inputs['Surface'])
    
    # Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (400, 100)
    
    if ENABLE_EMISSION:
        links.new(bsdf.outputs['BSDF'], mix_shader.inputs[1])
    else:
        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    # Accent Color
    color_node = nodes.new('ShaderNodeRGB')
    color_node.location = (0, 200)
    color_node.outputs[0].default_value = (*palette["accent"], 1.0)
    links.new(color_node.outputs['Color'], bsdf.inputs['Base Color'])
    
    # Metallic
    bsdf.inputs['Metallic'].default_value = 0.7
    bsdf.inputs['Roughness'].default_value = 0.3
    
    if ENABLE_EMISSION:
        # Emission Shader
        emission = nodes.new('ShaderNodeEmission')
        emission.location = (400, -100)
        links.new(emission.outputs['Emission'], mix_shader.inputs[2])
        
        # Emission Color
        emission_color = nodes.new('ShaderNodeRGB')
        emission_color.location = (0, -100)
        emission_color.outputs[0].default_value = (*palette["emission"], 1.0)
        links.new(emission_color.outputs['Color'], emission.inputs['Color'])
        
        # Emission Strength
        emission.inputs['Strength'].default_value = 2.0
    
    print(f"  Accent material created with emission")
    return mat

def create_neon_glow_material(name, palette):
    """Create pure emission material for neon effects"""
    print(f"Creating neon glow material: {name}")
    
    mat = create_material(name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Output
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (600, 0)
    
    # Emission Shader
    emission = nodes.new('ShaderNodeEmission')
    emission.location = (300, 0)
    links.new(emission.outputs['Emission'], output.inputs['Surface'])
    
    # Color Ramp for gradient effect
    color_ramp = nodes.new('ShaderNodeValToRGB')
    color_ramp.location = (0, 0)
    color_ramp.color_ramp.elements[0].color = (*palette["emission"], 1.0)
    color_ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)
    links.new(color_ramp.outputs['Color'], emission.inputs['Color'])
    
    # Fresnel for edge glow
    fresnel = nodes.new('ShaderNodeFresnel')
    fresnel.location = (-200, 0)
    fresnel.inputs['IOR'].default_value = 1.45
    links.new(fresnel.outputs['Fac'], color_ramp.inputs['Fac'])
    
    # Emission strength
    emission.inputs['Strength'].default_value = 5.0
    
    print(f"  Neon glow material created")
    return mat

def create_tech_panel_material(name, palette):
    """Create material for tech panels with animated elements"""
    print(f"Creating tech panel material: {name}")
    
    mat = create_material(name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Output
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (1200, 0)
    
    # Mix Shader
    mix_shader = nodes.new('ShaderNodeMixShader')
    mix_shader.location = (900, 0)
    links.new(mix_shader.outputs['Shader'], output.inputs['Surface'])
    
    # Base Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (600, 100)
    bsdf.inputs['Base Color'].default_value = (*palette["secondary"], 1.0)
    bsdf.inputs['Metallic'].default_value = 0.9
    bsdf.inputs['Roughness'].default_value = 0.2
    links.new(bsdf.outputs['BSDF'], mix_shader.inputs[1])
    
    # Emission for scan lines
    emission = nodes.new('ShaderNodeEmission')
    emission.location = (600, -100)
    emission.inputs['Strength'].default_value = 3.0
    links.new(emission.outputs['Emission'], mix_shader.inputs[2])
    
    # Wave Texture for scan lines
    wave = nodes.new('ShaderNodeTexWave')
    wave.location = (0, -100)
    wave.wave_type = 'BANDS'
    wave.inputs['Scale'].default_value = 20.0
    wave.inputs['Distortion'].default_value = 2.0
    
    # Texture Coordinate
    tex_coord = nodes.new('ShaderNodeTexCoord')
    tex_coord.location = (-400, -100)
    links.new(tex_coord.outputs['Object'], wave.inputs['Vector'])
    
    # Color Ramp
    color_ramp = nodes.new('ShaderNodeValToRGB')
    color_ramp.location = (300, -100)
    color_ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
    color_ramp.color_ramp.elements[1].color = (*palette["emission"], 1.0)
    links.new(wave.outputs['Color'], color_ramp.inputs['Fac'])
    links.new(color_ramp.outputs['Color'], emission.inputs['Color'])
    links.new(color_ramp.outputs['Color'], mix_shader.inputs['Fac'])
    
    print(f"  Tech panel material created")
    return mat

# =============================================================================
# MATERIAL ASSIGNMENT
# =============================================================================

def assign_materials_to_body(body_obj, materials):
    """Assign materials to different parts of body mesh"""
    print("Assigning materials to body...")
    
    # Clear existing materials
    body_obj.data.materials.clear()
    
    # Add materials
    for mat in materials.values():
        body_obj.data.materials.append(mat)
    
    # For now, assign base material to all faces
    # This can be refined with vertex groups or face selection
    if len(body_obj.data.materials) > 0:
        for poly in body_obj.data.polygons:
            poly.material_index = 0
    
    print(f"  Assigned {len(materials)} materials to body")

def create_vertex_groups_for_materials(body_obj):
    """Create vertex groups for material zones"""
    print("Creating material zones...")
    
    # This is a simplified version - would need more sophisticated logic
    # for actual face/vertex selection based on body regions
    
    zones = [
        "Material_Base",
        "Material_Accent",
        "Material_Glow",
        "Material_Tech"
    ]
    
    for zone in zones:
        if zone not in body_obj.vertex_groups:
            body_obj.vertex_groups.new(name=zone)
    
    print(f"  Created {len(zones)} material zones")

# =============================================================================
# TEXTURE BAKING
# =============================================================================

def setup_bake_images():
    """Create image textures for baking"""
    print("Setting up bake images...")
    
    images = {}
    map_types = ['BaseColor', 'Metallic', 'Roughness', 'Normal', 'Emission']
    
    for map_type in map_types:
        img_name = f"DJT_{CHARACTER_NAME}_{map_type}"
        
        # Remove existing
        if img_name in bpy.data.images:
            bpy.data.images.remove(bpy.data.images[img_name])
        
        # Create new
        img = bpy.data.images.new(
            name=img_name,
            width=TEXTURE_RESOLUTION,
            height=TEXTURE_RESOLUTION,
            alpha=True
        )
        images[map_type] = img
    
    print(f"  Created {len(images)} bake images")
    return images

def bake_material_maps(body_obj, images):
    """Bake all material maps to textures"""
    print("Baking material maps...")
    print("  This may take several minutes...")
    
    # Select body object
    bpy.ops.object.select_all(action='DESELECT')
    body_obj.select_set(True)
    bpy.context.view_layer.objects.active = body_obj
    
    # Setup render settings for baking
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.samples = BAKE_SAMPLES
    bpy.context.scene.cycles.bake_type = 'COMBINED'
    
    for map_type, img in images.items():
        print(f"  Baking {map_type}...")
        
        # Create temporary image texture node for baking target
        for mat in body_obj.data.materials:
            if mat.use_nodes:
                nodes = mat.node_tree.nodes
                img_node = nodes.new('ShaderNodeTexImage')
                img_node.image = img
                img_node.select = True
                nodes.active = img_node
        
        # Bake
        try:
            if map_type == 'Normal':
                bpy.context.scene.cycles.bake_type = 'NORMAL'
            elif map_type == 'Emission':
                bpy.context.scene.cycles.bake_type = 'EMIT'
            else:
                bpy.context.scene.cycles.bake_type = 'COMBINED'
            
            bpy.ops.object.bake(type=bpy.context.scene.cycles.bake_type)
            
            # Save image
            img.filepath_raw = f"//textures/DJT_{CHARACTER_NAME}_{map_type}.png"
            img.file_format = 'PNG'
            img.save()
            
            print(f"    {map_type} baked successfully")
        except Exception as e:
            print(f"    Error baking {map_type}: {e}")
        
        # Remove temp nodes
        for mat in body_obj.data.materials:
            if mat.use_nodes:
                nodes = mat.node_tree.nodes
                for node in nodes:
                    if node.type == 'TEX_IMAGE' and node.image == img:
                        nodes.remove(node)
    
    print("  All maps baked")

# =============================================================================
# RENDER SETTINGS
# =============================================================================

def setup_render_settings():
    """Configure render settings for character preview"""
    print("Configuring render settings...")
    
    scene = bpy.context.scene
    
    if TARGET_ENGINE == "eevee" or TARGET_ENGINE == "both":
        scene.eevee.use_ssr = True  # Screen space reflections
        scene.eevee.use_gtao = True  # Ambient occlusion
        scene.eevee.use_bloom = True  # Bloom for emission
        scene.eevee.bloom_intensity = 0.1
        scene.eevee.bloom_threshold = 0.8
        print("  Eevee settings configured")
    
    if TARGET_ENGINE == "cycles" or TARGET_ENGINE == "both":
        scene.cycles.samples = 128  # Preview samples
        scene.cycles.use_denoising = True
        print("  Cycles settings configured")

# =============================================================================
# MAIN GENERATION FUNCTION
# =============================================================================

def generate_materials():
    """Main function to generate all materials"""
    print("=" * 60)
    print("DJT CHARACTER MATERIAL SYSTEM")
    print("=" * 60)
    print(f"Character: {CHARACTER_NAME}")
    
    # Get body object
    try:
        body_obj = get_body_object()
    except Exception as e:
        print(f"ERROR: {e}")
        return
    
    # Get color palette
    palette = get_palette(CHARACTER_NAME)
    print(f"Using {CHARACTER_NAME} color palette")
    
    # Create materials
    materials = {}
    
    materials['Base'] = create_base_pbr_material(
        f"MAT_{CHARACTER_NAME}_Base",
        palette
    )
    
    materials['Accent'] = create_accent_material(
        f"MAT_{CHARACTER_NAME}_Accent",
        palette
    )
    
    if ENABLE_EMISSION:
        materials['Glow'] = create_neon_glow_material(
            f"MAT_{CHARACTER_NAME}_Glow",
            palette
        )
    
    materials['Tech'] = create_tech_panel_material(
        f"MAT_{CHARACTER_NAME}_Tech",
        palette
    )
    
    # Assign to body
    assign_materials_to_body(body_obj, materials)
    create_vertex_groups_for_materials(body_obj)
    
    # Setup render settings
    setup_render_settings()
    
    # Bake if requested
    if BAKE_TEXTURES:
        images = setup_bake_images()
        bake_material_maps(body_obj, images)
    
    print("=" * 60)
    print("MATERIAL SYSTEM SETUP COMPLETE!")
    print(f"Created {len(materials)} materials")
    print("=" * 60)
    
    return materials

# =============================================================================
# EXECUTION
# =============================================================================

if __name__ == "__main__":
    generate_materials()
```

## Usage Instructions

### Prerequisites

1. Body mesh must exist (from `02_Body_Mesh.py`)
2. Object must be named "Body_Complete"

### Basic Usage

1. Select character from CHARACTER_NAME parameter
2. Adjust render engine target (eevee/cycles)
3. Run script: **Alt+P**

### Customizing Colors

Edit the CHARACTER_PALETTES dictionary to modify colors:

```python
"CustomCharacter": {
    "primary": (R, G, B),     # Main body color (0-1 range)
    "secondary": (R, G, B),   # Secondary/metallic parts
    "accent": (R, G, B),      # Accent details
    "emission": (R, G, B)     # Neon glow color
}
```

## Material Slots

- **Slot 0 (Base)**: Main body material with subsurface
- **Slot 1 (Accent)**: Metallic details with emission
- **Slot 2 (Glow)**: Pure emission for neon effects
- **Slot 3 (Tech)**: Animated tech panels

## Next Steps

1. **Vertex paint** material zones for precise control
2. **Texture paint** additional details
3. **Add accessories** with separate materials
4. **Setup lighting** to showcase neon effects

## Baking Workflow

Enable texture baking:

```python
BAKE_TEXTURES = True
BAKE_SAMPLES = 256  # Higher for final quality
```

Baked textures saved to `textures/` folder in blend file directory.

## Related Documentation

- **Previous**: [02_Body_Mesh.md](02_Body_Mesh.md)
- **See also**: [Character_Protagonist.md](Character_Protagonist.md)
- **Reference**: [00_FOUNDATION.md](00_FOUNDATION.md)

---

**Script Version**: 1.0  
**Compatible with**: Blender 3.6+  
**Last Updated**: January 2026
