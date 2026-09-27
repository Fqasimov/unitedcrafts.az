<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { colors, finishes, items as itemDefs } from '../data/briefOptions.js'

const props = defineProps({ config: { type: Object, required: true } })

const host = ref(null)
const loading = ref(true)
const failed = ref(false)

let THREE, renderer, scene, camera, pivot, box, ground, ro, raf
let dragging = false
let lastX = 0
let lastY = 0
let spinV = 0
let yaw = -0.5
let pitch = 0.32
let disposables = []

const DIMS = {
  s: [2.3, 0.85, 1.7],
  m: [3.0, 1.05, 2.3],
  l: [3.7, 1.25, 2.9]
}
const WALL = 0.08

const hexOf = (list, id, fallback) =>
  list.find((o) => o.id === id)?.hex ?? fallback

function track(obj) {
  disposables.push(obj)
  return obj
}

function clearBox() {
  if (!box) return
  pivot.remove(box)
  box.traverse((o) => {
    o.geometry?.dispose?.()
    if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose())
    else o.material?.dispose?.()
  })
  box = null
}

function panelMat(hex) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    roughness: 0.88,
    metalness: 0.02
  })
}

function slab(w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

function buildItems(iw, id_, floorY) {
  const group = new THREE.Group()
  const chosen = props.config.items
  if (!chosen.length) return group

  const cols = Math.min(chosen.length, 3)
  const rows = Math.ceil(chosen.length / cols)
  const cellW = iw / cols
  const cellD = id_ / rows

  chosen.forEach((id, i) => {
    const def = itemDefs.find((d) => d.id === id)
    if (!def) return
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(def.hex),
      roughness: id === 'ornament' ? 0.25 : 0.8,
      metalness: id === 'ornament' ? 0.5 : 0.05
    })

    let mesh
    const s = Math.min(cellW, cellD)
    switch (id) {
      case 'pen':
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, s * 0.8, 16), mat)
        mesh.rotation.z = Math.PI / 2
        mesh.position.y = floorY + 0.045
        break
      case 'mug':
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.2, s * 0.18, 0.42, 24), mat)
        mesh.position.y = floorY + 0.21
        break
      case 'candle':
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.16, s * 0.16, 0.5, 20), mat)
        mesh.position.y = floorY + 0.25
        break
      case 'ornament':
        mesh = new THREE.Mesh(new THREE.SphereGeometry(s * 0.2, 24, 18), mat)
        mesh.position.y = floorY + s * 0.2
        break
      case 'notebook':
        mesh = new THREE.Mesh(new THREE.BoxGeometry(s * 0.66, 0.11, s * 0.82), mat)
        mesh.position.y = floorY + 0.055
        break
      case 'cookies':
        mesh = new THREE.Mesh(new THREE.BoxGeometry(s * 0.42, 0.3, s * 0.8), mat)
        mesh.position.y = floorY + 0.15
        break
      default:
        mesh = new THREE.Mesh(new THREE.BoxGeometry(s * 0.7, 0.1, s * 0.7), mat)
        mesh.position.y = floorY + 0.05
    }

    const r = Math.floor(i / cols)
    const c = i % cols
    mesh.position.x = -iw / 2 + cellW * (c + 0.5)
    mesh.position.z = -id_ / 2 + cellD * (r + 0.5)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  })

  return group
}

function buildBox() {
  clearBox()
  box = new THREE.Group()

  const [w, h, d] = DIMS[props.config.size] ?? DIMS.m
  const shell = hexOf(colors, props.config.color, '#3a5a49')
  const mat = panelMat(shell)
  const inner = panelMat('#cfc7b7')

  // open tray: floor + four walls, so the contents stay visible
  const floor = slab(w, WALL, d, inner)
  floor.position.y = WALL / 2
  box.add(floor)

  const wallN = slab(w, h, WALL, mat)
  wallN.position.set(0, h / 2, -d / 2 + WALL / 2)
  const wallS = wallN.clone()
  wallS.position.z = d / 2 - WALL / 2
  const wallW = slab(WALL, h, d - WALL * 2, mat)
  wallW.position.set(-w / 2 + WALL / 2, h / 2, 0)
  const wallE = wallW.clone()
  wallE.position.x = w / 2 - WALL / 2
  box.add(wallN, wallS, wallW, wallE)

  box.add(buildItems(w - WALL * 3, d - WALL * 3, WALL))

  // lid, posed by construction type
  const lidH = WALL * 1.6
  const shape = props.config.shape
  const foil = hexOf(finishes, props.config.finish, null)

  const blind = props.config.finish === 'blind'
  /* a touch of emissive keeps foil legible as foil at every angle — a pure
     metal only shows what it happens to be reflecting */
  const foilMat = () =>
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(foil),
      roughness: blind ? 0.85 : 0.34,
      metalness: blind ? 0.05 : 0.85,
      emissive: new THREE.Color(foil),
      emissiveIntensity: blind ? 0 : 0.22
    })

  const stampOn = (parent, lw, ld, y) => {
    if (!foil) return
    const stamp = new THREE.Mesh(new THREE.PlaneGeometry(lw * 0.34, ld * 0.16), foilMat())
    stamp.rotation.x = -Math.PI / 2
    stamp.position.set(0, y + 0.002, 0)
    parent.add(stamp)
  }

  // the lid can be hinged away from the camera, so mark the front wall too —
  // the chosen finish should be readable from the default angle
  if (foil) {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.3, h * 0.34), foilMat())
    face.position.set(0, h * 0.5, d / 2 + 0.003)
    box.add(face)
  }

  if (shape === 'wing') {
    const halfW = w / 2
    for (const sign of [-1, 1]) {
      const wing = slab(halfW, lidH, d, mat)
      const hinge = new THREE.Group()
      hinge.position.set(sign * (w / 2), h, 0)
      wing.position.x = (-sign * halfW) / 2
      hinge.add(wing)
      // the wing reaches inward from its hinge, so it lifts on a negative turn
      hinge.rotation.z = -sign * 0.62
      box.add(hinge)
    }
  } else if (shape === 'drawer') {
    const lid = slab(w, lidH, d, mat)
    lid.position.set(0, h + lidH / 2, 0)
    stampOn(lid, w, d, lidH / 2)
    box.add(lid)
    const tray = slab(w * 0.92, h * 0.5, d * 0.9, mat)
    tray.position.set(w * 0.72, h * 0.25, 0)
    box.add(tray)
  } else {
    const lid = slab(w * 1.03, lidH, d * 1.03, mat)
    stampOn(lid, w, d, lidH / 2)
    const hinge = new THREE.Group()
    hinge.position.set(0, h, -d / 2)
    lid.position.set(0, lidH / 2, (d * 1.03) / 2)
    hinge.add(lid)
    hinge.rotation.x = -1.05
    box.add(hinge)
  }

  box.position.y = -h / 2
  // measured before parenting, so the pivot's current yaw can't skew the fit
  box.updateMatrixWorld(true)
  const sphere = new THREE.Box3().setFromObject(box).getBoundingSphere(new THREE.Sphere())
  // the group spins, so centre it on its own axis and fit the swept radius
  box.position.x -= sphere.center.x
  box.position.z -= sphere.center.z
  fit.r = sphere.radius
  fit.y = sphere.center.y
  ground.position.y = -h / 2 - 0.02
  pivot.add(box)
  frame()
}

const fit = { r: 3, y: 0 }

/* Distance comes from the bounding sphere and whichever field of view is
   narrower — in a tall panel that is the horizontal one, so fov alone
   under-estimates it and the box gets clipped. */
function frame() {
  if (!camera) return
  const vFov = (camera.fov * Math.PI) / 180
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
  const dist = (fit.r * 1.12) / Math.sin(Math.min(vFov, hFov) / 2)
  camera.position.set(0, fit.y + dist * 0.34, dist * 0.94)
  camera.lookAt(0, fit.y, 0)
}

function studioEnv() {
  const c = document.createElement('canvas')
  c.width = 32
  c.height = 128
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 128)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.45, '#f0ece2')
  grad.addColorStop(0.62, '#c8c6bf')
  grad.addColorStop(1, '#7c7d79')
  g.fillStyle = grad
  g.fillRect(0, 0, 32, 128)

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace

  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromEquirectangular(tex).texture
  pmrem.dispose()
  tex.dispose()
  return env
}

function resize() {
  if (!renderer || !host.value) return
  const { clientWidth: w, clientHeight: hgt } = host.value
  if (!w || !hgt) return
  renderer.setSize(w, hgt, false)
  camera.aspect = w / hgt
  camera.updateProjectionMatrix()
  frame()
}

function onDown(e) {
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
  host.value.setPointerCapture?.(e.pointerId)
}
function onMove(e) {
  if (!dragging) return
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  lastX = e.clientX
  lastY = e.clientY
  yaw += dx * 0.008
  pitch = Math.max(-0.15, Math.min(0.95, pitch + dy * 0.005))
  spinV = dx * 0.008
}
function onUp(e) {
  dragging = false
  host.value?.releasePointerCapture?.(e.pointerId)
}

function loop() {
  raf = requestAnimationFrame(loop)
  if (!dragging) {
    spinV += (0.0022 - spinV) * 0.03
    yaw += spinV
  }
  pivot.rotation.y += (yaw - pivot.rotation.y) * 0.12
  pivot.rotation.x += (pitch - pivot.rotation.x) * 0.12
  renderer.render(scene, camera)
}

onMounted(async () => {
  try {
    THREE = await import('three')
  } catch {
    failed.value = true
    loading.value = false
    return
  }

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  host.value.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(0, 3.4, 8.2)
  camera.lookAt(0, 0, 0)

  const key = new THREE.DirectionalLight(0xffffff, 2.4)
  key.position.set(4, 7, 5)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.near = 1
  key.shadow.camera.far = 22
  key.shadow.camera.left = -6
  key.shadow.camera.right = 6
  key.shadow.camera.top = 6
  key.shadow.camera.bottom = -6
  key.shadow.radius = 3
  key.shadow.bias = -0.0012
  scene.add(key)

  const fill = new THREE.DirectionalLight(0xffffff, 0.5)
  fill.position.set(-5, 2, -3)
  scene.add(fill)
  scene.add(new THREE.HemisphereLight(0xdfe8e0, 0x6d6152, 1.1))

  /* Metals show their surroundings, so foil renders black against an empty
     scene however bright the lights are. A gradient environment is enough. */
  scene.environment = studioEnv()

  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShadowMaterial({ opacity: 0.22 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -1.05
  ground.receiveShadow = true
  scene.add(track(ground))

  pivot = new THREE.Group()
  scene.add(pivot)
  buildBox()

  resize()
  ro = new ResizeObserver(resize)
  ro.observe(host.value)
  loading.value = false
  loop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  clearBox()
  disposables.forEach((o) => {
    o.geometry?.dispose?.()
    o.material?.dispose?.()
  })
  disposables = []
  scene?.environment?.dispose?.()
  renderer?.dispose()
  renderer?.domElement?.remove()
})

watch(
  () => JSON.stringify(props.config),
  () => {
    if (THREE && pivot) buildBox()
  }
)
</script>

<template>
  <div class="prev">
    <div
      ref="host"
      class="prev__canvas"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
    ></div>
    <p v-if="loading" class="prev__note">3D önizləmə yüklənir…</p>
    <p v-else-if="failed" class="prev__note">
      3D önizləmə bu brauzerdə açılmadı — seçimləriniz yenə də qeyd olunur.
    </p>
    <p v-else class="prev__hint">Fırlatmaq üçün sürüşdürün</p>
  </div>
</template>

<style scoped>
.prev {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 260px;
  background:
    radial-gradient(70% 60% at 50% 32%, rgba(255, 255, 255, 0.5), transparent 70%),
    var(--bone-warm);
  overflow: hidden;
}
.prev__canvas {
  position: absolute;
  inset: 0;
  cursor: grab;
  touch-action: none;
}
.prev__canvas:active {
  cursor: grabbing;
}
.prev__canvas :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
.prev__note,
.prev__hint {
  position: absolute;
  left: 50%;
  bottom: 12px;
  translate: -50% 0;
  margin: 0;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  pointer-events: none;
}
/* sits over the render, so it needs its own ground */
.prev__hint {
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(251, 249, 245, 0.82);
  color: var(--forest-ink);
  opacity: 0.75;
}
.prev__note {
  top: 50%;
  bottom: auto;
  width: 100%;
  padding: 0 24px;
  opacity: 0.45;
}
</style>
