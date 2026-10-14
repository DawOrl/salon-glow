"""
Glow Studio: autorska martwa natura 3D "Grzebień i kosmyk".

Matowy grzebień z terakotowej ceramiki z mosiężną listwą, nad którym
przechodzi miękki, mosiężny "kosmyk" (spłaszczona wiązka cienkich pasm).
Wszystko generowane proceduralnie, bez zewnętrznych modeli.

Uruchomienie (z katalogu repo):
  blender --background --factory-startup --python-exit-code 1 \
    --python scripts/blender/grzebien-kosmyk.py -- --out public/art/grzebien-kosmyk.png [--preview]

--preview renderuje w połowie rozdzielczości i z mniejszą liczbą próbek.
Wynik: PNG z kanałem alfa (przezroczyste tło + miękki cień kontaktowy).
"""

import math
import random
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
OUT = "public/art/grzebien-kosmyk.png"
PREVIEW = "--preview" in argv
if "--out" in argv:
    OUT = argv[argv.index("--out") + 1]

random.seed(7)

# ------------------------------------------------------------------ scena
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = "GPU"
except Exception:  # brak Metal: zostaje CPU
    scene.cycles.device = "CPU"

scene.cycles.samples = 48 if PREVIEW else 128
scene.cycles.use_denoising = True
scene.render.film_transparent = True
scene.render.resolution_x = 2000
scene.render.resolution_y = 1250
scene.render.resolution_percentage = 50 if PREVIEW else 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium Low Contrast"

world = bpy.data.worlds.new("Swiat")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.62, 0.52, 0.42, 1)
bg.inputs["Strength"].default_value = 0.45


# ------------------------------------------------------------- materiały
def principled(name, color, rough, metallic=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metallic
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
    return m, b


terakota, cer_bsdf = principled("Terakota", (0.42, 0.17, 0.10), 0.68)
# delikatna faktura biskwitu: szum w szorstkości i lekkiej nierówności
nt = terakota.node_tree
noise = nt.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value = 180.0
bump = nt.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.06
nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
nt.links.new(bump.outputs["Normal"], cer_bsdf.inputs["Normal"])

mosiadz, mos_bsdf = principled("Mosiadz", (0.86, 0.62, 0.30), 0.26, metallic=1.0)


# --------------------------------------------------------------- grzebień
# Grzebień leży płasko na podłożu (płaszczyzna XY): grzbiet wzdłuż X,
# zęby skierowane w stronę kamery (-Y). Grubość w osi Z.
def add_box(name, size, loc, bevel=0.0, segments=4):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = o.modifiers.new("Faza", "BEVEL")
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = "NONE"
    return o


COMB_W = 2.6
THICK = 0.13
SPINE_D = 0.42
TEETH_N = 13
TOOTH_L = 1.05
comb_parts = []
spine = add_box("Grzbiet", (COMB_W, SPINE_D, THICK), (0, 0, THICK / 2), bevel=0.05, segments=6)
comb_parts.append(spine)
for i in range(TEETH_N):
    x = -COMB_W / 2 + 0.12 + i * (COMB_W - 0.24) / (TEETH_N - 1)
    # stożek: szeroki u nasady, węższy na końcu, spłaszczony w osi Z
    bpy.ops.mesh.primitive_cone_add(
        vertices=24,
        radius1=0.062,
        radius2=0.03,
        depth=TOOTH_L,
        location=(x, -SPINE_D / 2 - TOOTH_L / 2 + 0.05, THICK / 2),
        rotation=(math.radians(90), 0, 0),
    )
    tooth = bpy.context.active_object
    tooth.scale = (1.0, 0.82, 1.0)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.03, location=(x, -SPINE_D / 2 - TOOTH_L + 0.05, THICK / 2)
    )
    tip = bpy.context.active_object
    tip.scale = (1.0, 1.0, 0.82)
    bpy.ops.object.transform_apply(scale=True)
    comb_parts += [tooth, tip]

for o in comb_parts:
    o.data.materials.append(terakota)
    bpy.context.view_layer.objects.active = o
    for mod in list(o.modifiers):
        bpy.ops.object.modifier_apply(modifier=mod.name)

bpy.ops.object.select_all(action="DESELECT")
for o in comb_parts:
    o.select_set(True)
bpy.context.view_layer.objects.active = spine
bpy.ops.object.join()
comb = bpy.context.active_object
comb.name = "Grzebien"
bpy.ops.object.shade_smooth()

# mosiężna listwa wpuszczona w grzbiet
inlay = add_box("Listwa", (COMB_W * 0.94, 0.045, 0.02), (0, 0.06, THICK + 0.004), bevel=0.008, segments=3)
inlay.data.materials.append(mosiadz)
bpy.ops.object.shade_smooth()
bpy.ops.object.select_all(action="DESELECT")
inlay.select_set(True)
comb.select_set(True)
bpy.context.view_layer.objects.active = comb
bpy.ops.object.join()
comb.rotation_euler = (0, 0, math.radians(-16))
comb.location = (-0.35, 0.35, 0)

# ---------------------------------------------------------------- kosmyk
# Spłaszczona wiązka cienkich pasm (jak pukiel włosów): przychodzi z tyłu,
# przechodzi łukiem nad grzbietem grzebienia, opada przed zębami
# i kończy się miękkim zawinięciem na podłożu.
CTRL = [
    Vector((-3.4, 2.4, 0.02)),
    Vector((-2.2, 1.6, 0.03)),
    Vector((-1.0, 0.95, 0.30)),
    Vector((0.0, 0.25, 0.36)),
    Vector((0.8, -0.75, 0.16)),
    Vector((1.35, -1.4, 0.03)),
    Vector((2.0, -1.62, 0.03)),
]


def catmull(points, t):
    n = len(points) - 1
    f = min(t * n, n - 1e-6)
    i = int(f)
    u = f - i
    p0 = points[max(i - 1, 0)]
    p1 = points[i]
    p2 = points[min(i + 1, n)]
    p3 = points[min(i + 2, n)]
    return 0.5 * (
        2 * p1
        + (-p0 + p2) * u
        + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u
        + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u
    )


CURL_C = Vector((2.0, -1.12, 0.03))


def lock_path(t):
    # 0..0.8: spline, 0.8..1: zawinięcie (spirala o malejącym promieniu)
    if t <= 0.8:
        return catmull(CTRL, t / 0.8)
    u = (t - 0.8) / 0.2
    r = 0.5 * (1 - 0.55 * u)
    a = -math.pi / 2 + u * math.pi * 1.25
    return CURL_C + Vector((math.cos(a) * r, math.sin(a) * r, 0.0))


def frame_at(t, eps=1e-3):
    p0 = lock_path(max(0, t - eps))
    p1 = lock_path(min(1, t + eps))
    tan = (p1 - p0).normalized()
    side = tan.cross(Vector((0, 0, 1)))
    if side.length < 1e-4:
        side = Vector((1, 0, 0))
    side.normalize()
    up = side.cross(tan).normalized()
    return side, up


STRANDS = 90
PTS = 140
curve = bpy.data.curves.new("Kosmyk", "CURVE")
curve.dimensions = "3D"
curve.bevel_depth = 0.0075
curve.bevel_resolution = 2
curve.use_fill_caps = True
for s in range(STRANDS):
    w = random.uniform(-1, 1)
    h = random.uniform(0, 1) ** 1.6
    wobble = random.uniform(0, 2 * math.pi)
    spl = curve.splines.new("NURBS")
    spl.points.add(PTS - 1)
    for k in range(PTS):
        t = k / (PTS - 1)
        side, up = frame_at(t)
        # szerokość wstęgi: węższa w środku, rozluźniona na końcach
        width = 0.16 + 0.12 * math.sin(math.pi * t) ** 0.5 * (1 - t) + 0.10 * (t ** 3)
        lift = 0.035 * h + 0.004 * math.sin(wobble + t * 18)
        off = side * (w * width + 0.006 * math.sin(wobble + t * 11)) + up * lift
        p = lock_path(t) + off
        p.z = max(p.z, 0.008)
        spl.points[k].co = (p.x, p.y, p.z, 1)
    spl.order_u = 4
    spl.use_endpoint_u = True
lock = bpy.data.objects.new("Kosmyk", curve)
scene.collection.objects.link(lock)
lock.data.materials.append(mosiadz)

# --------------------------------------------------- podłoże (łapacz cienia)
bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0))
ground = bpy.context.active_object
ground.is_shadow_catcher = True

# ---------------------------------------------------------------- światła
def area(name, loc, rot, size, energy, color):
    light = bpy.data.lights.new(name, "AREA")
    light.size = size
    light.energy = energy
    light.color = color
    o = bpy.data.objects.new(name, light)
    o.location = loc
    o.rotation_euler = [math.radians(a) for a in rot]
    scene.collection.objects.link(o)
    return o


# "okno" z lewej: duże, miękkie, ciepłe
area("Okno", (-6.5, -3.0, 5.0), (52, 0, -62), 6.0, 2600, (1.0, 0.93, 0.84))
# delikatne wypełnienie z prawej
area("Wypelnienie", (5.5, -4.0, 2.5), (70, 0, 52), 5.0, 420, (0.98, 0.95, 0.92))
# kontra z tyłu: rysuje krawędź mosiądzu
area("Kontra", (1.0, 6.0, 4.5), (-50, 0, 180), 3.0, 700, (1.0, 0.9, 0.78))

# ----------------------------------------------------------------- kamera
cam_data = bpy.data.cameras.new("Kamera")
cam_data.lens = 44
cam = bpy.data.objects.new("Kamera", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam.location = (-0.1, -8.4, 4.6)
target = Vector((-0.45, -0.25, 0.1))
direction = target - cam.location
cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
cam_data.dof.use_dof = True
cam_data.dof.focus_distance = direction.length
cam_data.dof.aperture_fstop = 8

scene.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("Zapisano:", OUT)
