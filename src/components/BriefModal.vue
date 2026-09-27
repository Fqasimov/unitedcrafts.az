<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import BoxPreview from './BoxPreview.vue'
import LogoMark from './LogoMark.vue'
import { shapes, sizes, colors, finishes, items } from '../data/briefOptions.js'

const emit = defineEmits(['close'])

const STEPS = [
  { n: 1, label: 'İdeya' },
  { n: 2, label: 'Referans' },
  { n: 3, label: 'Konfiqurasiya' }
]

const step = ref(1)
const sent = ref(false)
const closing = ref(false)

const form = reactive({
  idea: '',
  name: '',
  contact: '',
  qty: '',
  deadline: '',
  refs: [],
  config: {
    shape: 'lid',
    size: 'm',
    color: 'forest',
    finish: 'gold',
    items: ['notebook', 'pen']
  }
})

const canAdvance = computed(() => {
  if (step.value === 1) return form.idea.trim().length > 8 && form.contact.trim().length > 3
  return true
})

const missing = computed(() => {
  if (step.value !== 1 || canAdvance.value) return ''
  if (form.idea.trim().length <= 8) return 'İdeyanı bir-iki cümlə ilə yazın'
  return 'Sizinlə necə əlaqə saxlayaq?'
})

/* --- step 2: reference images ------------------------------------------- */
const dropping = ref(false)
const MAX_REFS = 6

function addFiles(list) {
  for (const file of list) {
    if (form.refs.length >= MAX_REFS) break
    if (!file.type.startsWith('image/')) continue
    form.refs.push({ name: file.name, size: file.size, url: URL.createObjectURL(file), file })
  }
}

function onDrop(e) {
  dropping.value = false
  addFiles(e.dataTransfer.files)
}

function onPick(e) {
  addFiles(e.target.files)
  e.target.value = ''
}

function removeRef(i) {
  URL.revokeObjectURL(form.refs[i].url)
  form.refs.splice(i, 1)
}

/* --- step 3: configurator ----------------------------------------------- */
function toggleItem(id) {
  const at = form.config.items.indexOf(id)
  at === -1 ? form.config.items.push(id) : form.config.items.splice(at, 1)
}

const summary = computed(() => {
  const label = (list, id) => list.find((o) => o.id === id)?.label ?? '—'
  return [
    ['Qutu', label(shapes, form.config.shape)],
    ['Ölçü', label(sizes, form.config.size)],
    ['Rəng', label(colors, form.config.color)],
    ['Çap', label(finishes, form.config.finish)],
    [
      'İçindəkilər',
      form.config.items.map((i) => label(items, i)).join(', ') || 'Seçilməyib'
    ]
  ]
})

/* --- submit --------------------------------------------------------------
   No backend yet: the brief is handed to the studio's inbox and also offered
   as a file so nothing is lost. Swap `submit` for a POST when the endpoint
   exists — `payload()` is already the full brief. */
function payload() {
  return {
    sent_at: new Date().toISOString(),
    name: form.name,
    contact: form.contact,
    quantity: form.qty,
    deadline: form.deadline,
    idea: form.idea,
    references: form.refs.map((r) => r.name),
    configuration: Object.fromEntries(summary.value)
  }
}

const mailto = computed(() => {
  const p = payload()
  const body = [
    `Ad: ${p.name || '—'}`,
    `Əlaqə: ${p.contact}`,
    `Tiraj: ${p.quantity || '—'}`,
    `Tarix: ${p.deadline || '—'}`,
    '',
    'İdeya:',
    p.idea,
    '',
    'Konfiqurasiya:',
    ...summary.value.map(([k, v]) => `  ${k}: ${v}`),
    '',
    p.references.length
      ? `Referanslar (zəhmət olmasa əlavə edin): ${p.references.join(', ')}`
      : 'Referans əlavə edilməyib.'
  ].join('\n')
  return `mailto:salam@unitedcrafts.az?subject=${encodeURIComponent(
    'Brief — ' + (p.name || 'yeni sorğu')
  )}&body=${encodeURIComponent(body)}`
})

function downloadBrief() {
  const blob = new Blob([JSON.stringify(payload(), null, 2)], {
    type: 'application/json'
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'united-crafts-brief.json'
  a.click()
  URL.revokeObjectURL(a.href)
}

function submit() {
  sent.value = true
}

/* --- navigation ----------------------------------------------------------- */
const dir = ref(1) // which way the panes slide

function go(n) {
  if (n === step.value) return
  if (n > step.value && !canAdvance.value) return
  dir.value = n > step.value ? 1 : -1
  step.value = n
}

/* --- shell ---------------------------------------------------------------- */
function close() {
  if (closing.value) return
  closing.value = true
  setTimeout(() => emit('close'), 420)
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

const ideaField = ref(null)
const body = ref(null)

onMounted(async () => {
  window.addEventListener('keydown', onKey)
  await nextTick()
  // wait for the wipe to clear before pulling focus into the field
  setTimeout(() => ideaField.value?.focus({ preventScroll: true }), 520)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  form.refs.forEach((r) => URL.revokeObjectURL(r.url))
})

watch(step, () => body.value?.scrollTo({ top: 0 }))
</script>

<template>
  <div class="bw" :class="{ 'bw--out': closing }" role="dialog" aria-modal="true" aria-label="Brief">
    <!-- top bar -->
    <header class="bw__head">
      <div class="bw__brand">
        <LogoMark :size="28" />
        <span>Brief</span>
      </div>

      <nav class="bw__steps" aria-label="Addımlar">
        <button
          v-for="s in STEPS"
          :key="s.n"
          class="bw__step"
          :class="{ 'is-on': step === s.n && !sent, 'is-done': step > s.n || sent }"
          :disabled="sent || (s.n > step && !canAdvance) || s.n > step + 1"
          @click="go(s.n)"
        >
          <span class="bw__stepN">{{ String(s.n).padStart(2, '0') }}</span>
          <span class="bw__stepL">{{ s.label }}</span>
        </button>
      </nav>

      <button class="bw__x" aria-label="Bağla" @click="close">
        <span>Bağla</span><i></i><i></i>
      </button>

      <span class="bw__rail"><i :style="{ transform: `scaleX(${sent ? 1 : step / 3})` }"></i></span>
    </header>

    <!-- content -->
    <div ref="body" class="bw__body" data-lenis-prevent>
      <Transition :name="dir > 0 ? 'fwd' : 'back'" mode="out-in">
        <!-- sent -->
        <section v-if="sent" key="done" class="bw__done">
          <LogoMark class="bw__doneMark" :size="56" ring />
          <h2>Brief hazırdır</h2>
          <p>
            Sorğunuzu bizə göndərin — bir iş günü ərzində konsepsiya və qiymətlə
            qayıdırıq.
          </p>

          <dl class="bw__recap">
            <div v-for="[k, v] in summary" :key="k">
              <dt>{{ k }}</dt>
              <dd>{{ v }}</dd>
            </div>
          </dl>

          <div class="bw__doneActs">
            <a class="btn btn--ink" :href="mailto">
              <span class="btn__dot"></span><span>E-poçt ilə göndər</span>
            </a>
            <button class="bw__link" @click="downloadBrief">Brief-i yüklə (.json)</button>
          </div>
          <p class="bw__fine">Referans şəkilləri e-poçta əl ilə əlavə etməyi unutmayın.</p>
        </section>

        <!-- 1 · idea -->
        <section v-else-if="step === 1" key="s1" class="bw__pane">
          <aside class="bw__intro">
            <span class="bw__big">01</span>
            <h2 class="bw__title">İdeyanızı öz sözlərinizlə yazın</h2>
            <p class="bw__lede">
              Səliqəli olmasına ehtiyac yoxdur. Kimə gedir, hansı münasibət, nə hiss
              oyatmalıdır — bu qədəri bəsdir.
            </p>
            <ul class="bw__tips">
              <li>Kim alacaq — müştəri, komanda, tərəfdaş?</li>
              <li>Hansı münasibət — Yeni il, yubiley, tədbir?</li>
              <li>Bəyəndiyiniz rəng və ya material varmı?</li>
            </ul>
          </aside>

          <div class="bw__form">
            <label class="bw__field bw__field--area">
              <span>İdeya <b>*</b></span>
              <textarea
                ref="ideaField"
                v-model="form.idea"
                rows="7"
                placeholder="Məsələn: 200 korporativ müştəri üçün Yeni il dəsti. Yaşıl və qızıl. İçində şam, dəftər və şirniyyat olsun…"
              ></textarea>
            </label>

            <div class="bw__row">
              <label class="bw__field">
                <span>Ad / Şirkət</span>
                <input v-model="form.name" type="text" autocomplete="organization" placeholder="Ayan MMC" />
              </label>
              <label class="bw__field">
                <span>Əlaqə <b>*</b></span>
                <input v-model="form.contact" type="text" autocomplete="email" placeholder="E-poçt və ya telefon" />
              </label>
            </div>
            <div class="bw__row">
              <label class="bw__field">
                <span>Təxmini tiraj</span>
                <input v-model="form.qty" type="text" placeholder="200 dəst" />
              </label>
              <label class="bw__field">
                <span>Lazım olan tarix</span>
                <input v-model="form.deadline" type="text" placeholder="20 dekabr" />
              </label>
            </div>
          </div>
        </section>

        <!-- 2 · references -->
        <section v-else-if="step === 2" key="s2" class="bw__pane">
          <aside class="bw__intro">
            <span class="bw__big">02</span>
            <h2 class="bw__title">Referans şəkilləriniz varsa əlavə edin</h2>
            <p class="bw__lede">
              İstəyə bağlıdır. Bəyəndiyiniz qutu, rəng və ya üslub — nə olursa olsun
              kömək edir. Yoxdursa, bu addımı keçin.
            </p>
            <p class="bw__count">{{ form.refs.length }} / {{ MAX_REFS }} şəkil</p>
          </aside>

          <div class="bw__form">
            <label
              class="bw__drop"
              :class="{ 'is-over': dropping, 'is-compact': form.refs.length }"
              @dragover.prevent="dropping = true"
              @dragleave="dropping = false"
              @drop.prevent="onDrop"
            >
              <input type="file" accept="image/*" multiple hidden @change="onPick" />
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />
              </svg>
              <strong>Şəkilləri buraya atın</strong>
              <span>və ya seçmək üçün klikləyin</span>
            </label>

            <TransitionGroup v-if="form.refs.length" tag="ul" name="ref" class="bw__refs">
              <li v-for="(r, i) in form.refs" :key="r.url">
                <img :src="r.url" :alt="r.name" />
                <button aria-label="Sil" @click="removeRef(i)">×</button>
              </li>
            </TransitionGroup>
          </div>
        </section>

        <!-- 3 · configurator -->
        <section v-else key="s3" class="bw__pane bw__pane--cfg">
          <div class="bw__stage">
            <BoxPreview :config="form.config" />
          </div>

          <div class="bw__opts" data-lenis-prevent>
            <span class="bw__big">03</span>
            <h2 class="bw__title">Qutunu yığın</h2>
            <p class="bw__lede">
              Təxmini bir maket — istehsalda hər detalı birlikdə dəqiqləşdiririk.
            </p>

            <div class="bw__group">
              <p class="bw__gLabel">Konstruksiya</p>
              <div class="bw__chips">
                <button
                  v-for="s in shapes"
                  :key="s.id"
                  :class="{ 'is-on': form.config.shape === s.id }"
                  @click="form.config.shape = s.id"
                >
                  {{ s.label }}
                </button>
              </div>
            </div>

            <div class="bw__group">
              <p class="bw__gLabel">Ölçü</p>
              <div class="bw__chips">
                <button
                  v-for="s in sizes"
                  :key="s.id"
                  :class="{ 'is-on': form.config.size === s.id }"
                  @click="form.config.size = s.id"
                >
                  {{ s.label }} <em>{{ s.note }}</em>
                </button>
              </div>
            </div>

            <div class="bw__group">
              <p class="bw__gLabel">
                Rəng
                <em>{{ colors.find((c) => c.id === form.config.color)?.label }}</em>
              </p>
              <div class="bw__sw">
                <button
                  v-for="c in colors"
                  :key="c.id"
                  :class="{ 'is-on': form.config.color === c.id }"
                  :title="c.label"
                  :aria-label="c.label"
                  @click="form.config.color = c.id"
                >
                  <i :style="{ background: c.hex }"></i>
                </button>
              </div>
            </div>

            <div class="bw__group">
              <p class="bw__gLabel">Çap</p>
              <div class="bw__chips">
                <button
                  v-for="f in finishes"
                  :key="f.id"
                  :class="{ 'is-on': form.config.finish === f.id }"
                  @click="form.config.finish = f.id"
                >
                  {{ f.label }}
                </button>
              </div>
            </div>

            <div class="bw__group">
              <p class="bw__gLabel">
                İçindəkilər <em>{{ form.config.items.length }} seçilib</em>
              </p>
              <div class="bw__chips">
                <button
                  v-for="it in items"
                  :key="it.id"
                  :class="{ 'is-on': form.config.items.includes(it.id) }"
                  @click="toggleItem(it.id)"
                >
                  {{ it.label }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </Transition>
    </div>

    <!-- bottom bar -->
    <footer v-if="!sent" class="bw__foot">
      <button v-if="step > 1" class="bw__link" @click="go(step - 1)">← Geri</button>
      <span v-else class="bw__link bw__link--mute">Addım {{ step }} / 3</span>

      <div class="bw__footActs">
        <Transition name="fade">
          <span v-if="missing" class="bw__hint">{{ missing }}</span>
        </Transition>
        <button v-if="step === 2 && !form.refs.length" class="bw__link" @click="go(3)">Keç</button>
        <button v-if="step < 3" class="btn btn--ink" :disabled="!canAdvance" @click="go(step + 1)">
          <span class="btn__dot"></span><span>Davam et</span>
        </button>
        <button v-else class="btn btn--ink" @click="submit">
          <span class="btn__dot"></span><span>Brief-i tamamla</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ---- full-screen shell; enters as a wipe up from the bottom edge ---- */
.bw {
  position: fixed;
  inset: 0;
  z-index: 160;
  display: flex;
  flex-direction: column;
  background: var(--chalk);
  color: var(--forest-ink);
  animation: wipe-in 0.62s var(--ease-out) both;
}
.bw--out {
  animation: wipe-out 0.42s var(--ease-in) both;
}
@keyframes wipe-in {
  from {
    clip-path: inset(100% 0 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
@keyframes wipe-out {
  from {
    clip-path: inset(0 0 0 0);
  }
  to {
    clip-path: inset(0 0 100% 0);
  }
}
/* contents trail the wipe slightly so the panel lands first */
.bw__head,
.bw__body,
.bw__foot {
  animation: settle var(--t-slow) var(--ease-out) 0.18s both;
}
@keyframes settle {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

/* ---- head ---- */
.bw__head {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  padding: 18px var(--gutter);
  border-bottom: 1px solid rgba(22, 32, 26, 0.1);
}
.bw__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--forest);
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}
.bw__brand span {
  color: var(--forest-ink);
  opacity: 0.6;
}

.bw__steps {
  display: flex;
  gap: clamp(14px, 3vw, 44px);
}
.bw__step {
  display: flex;
  align-items: baseline;
  gap: 9px;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.3;
  white-space: nowrap;
  transition: opacity var(--t-mid) ease;
}
.bw__step:not(:disabled):hover {
  opacity: 0.75;
}
.bw__step.is-done {
  opacity: 0.55;
}
.bw__step.is-on {
  opacity: 1;
}
.bw__step:disabled {
  cursor: default;
}
.bw__stepN {
  font-family: var(--display);
  font-size: 16px;
  letter-spacing: 0;
}

.bw__x {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  height: 36px;
  padding-right: 30px;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.65;
  transition: opacity var(--t-fast) ease;
}
.bw__x:hover {
  opacity: 1;
}
.bw__x i {
  position: absolute;
  right: 4px;
  top: 50%;
  width: 16px;
  height: 1px;
  background: currentColor;
  transition: transform var(--t-mid) var(--ease-out);
}
.bw__x i:nth-of-type(1) {
  transform: rotate(45deg);
}
.bw__x i:nth-of-type(2) {
  transform: rotate(-45deg);
}
.bw__x:hover i:nth-of-type(1) {
  transform: rotate(135deg);
}
.bw__x:hover i:nth-of-type(2) {
  transform: rotate(45deg);
}

.bw__rail {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
}
.bw__rail i {
  display: block;
  height: 100%;
  background: var(--forest);
  transform-origin: left;
  transition: transform var(--t-slow) var(--ease-out);
}

/* ---- body ---- */
.bw__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* steps 1–2: context left, inputs right, both centred in a readable band */
.bw__pane {
  min-height: 100%;
  width: min(100% - var(--gutter) * 2, 1180px);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: clamp(40px, 7vw, 120px);
  align-items: center;
  padding-block: clamp(40px, 7vh, 90px);
}

.bw__big {
  display: block;
  font-family: var(--display);
  font-size: clamp(64px, 8vw, 120px);
  line-height: 0.9;
  color: var(--forest);
  opacity: 0.16;
  margin-bottom: 18px;
}
.bw__title {
  font-size: clamp(30px, 3.4vw, 48px);
}
.bw__lede {
  margin: 16px 0 0;
  max-width: 42ch;
  font-size: 15.5px;
  line-height: 1.75;
  opacity: 0.62;
}
.bw__tips {
  list-style: none;
  margin: 30px 0 0;
  padding: 22px 0 0;
  border-top: 1px solid rgba(22, 32, 26, 0.1);
  display: grid;
  gap: 12px;
}
.bw__tips li {
  position: relative;
  padding-left: 20px;
  font-size: 14px;
  opacity: 0.6;
}
.bw__tips li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.72em;
  width: 8px;
  height: 1px;
  background: currentColor;
}
.bw__count {
  margin: 28px 0 0;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.45;
}

/* ---- fields ---- */
.bw__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.bw__field {
  display: grid;
  gap: 9px;
  margin-bottom: 22px;
}
.bw__field span {
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.5;
}
.bw__field b {
  font-weight: 400;
  color: var(--forest);
}
.bw__field input,
.bw__field textarea {
  font: inherit;
  font-size: 16px;
  color: inherit;
  background: #fff;
  border: 1px solid rgba(22, 32, 26, 0.14);
  border-radius: 3px;
  padding: 15px 17px;
  width: 100%;
  resize: vertical;
  transition:
    border-color var(--t-fast) ease,
    box-shadow var(--t-mid) ease;
}
.bw__field input:focus,
.bw__field textarea:focus {
  outline: none;
  border-color: var(--forest);
  box-shadow: 0 0 0 4px rgba(58, 90, 73, 0.1);
}
.bw__field textarea::placeholder,
.bw__field input::placeholder {
  color: rgba(22, 32, 26, 0.3);
}

/* ---- references ---- */
.bw__drop {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 10px;
  min-height: 320px;
  padding: 40px;
  background: #fff;
  border: 1px dashed rgba(22, 32, 26, 0.24);
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition:
    border-color var(--t-mid) ease,
    background-color var(--t-mid) ease,
    min-height var(--t-slow) var(--ease-out);
}
.bw__drop.is-compact {
  min-height: 160px;
}
.bw__drop:hover,
.bw__drop.is-over {
  border-color: var(--forest);
  background: rgba(58, 90, 73, 0.04);
}
.bw__drop svg {
  width: 30px;
  height: 30px;
  stroke: var(--forest);
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  margin-bottom: 6px;
  transition: transform var(--t-mid) var(--ease-out);
}
.bw__drop:hover svg,
.bw__drop.is-over svg {
  transform: translateY(-4px);
}
.bw__drop strong {
  font-family: var(--display);
  font-weight: 400;
  font-size: 24px;
}
.bw__drop span {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.45;
}

.bw__refs {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.bw__refs li {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 3px;
}
.bw__refs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bw__refs button {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(251, 249, 245, 0.94);
  font-size: 16px;
  line-height: 1;
}
.ref-enter-active,
.ref-leave-active {
  transition:
    opacity var(--t-mid) ease,
    transform var(--t-mid) var(--ease-out);
}
.ref-enter-from,
.ref-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

/* ---- configurator: the model gets the room ---- */
.bw__pane--cfg {
  width: 100%;
  height: 100%;
  min-height: 0;
  grid-template-columns: 1.35fr 1fr;
  gap: 0;
  align-items: stretch;
  padding: 0;
}
.bw__stage {
  position: relative;
  min-height: 0;
  border-right: 1px solid rgba(22, 32, 26, 0.1);
}
.bw__opts {
  overflow-y: auto;
  padding: clamp(30px, 5vh, 56px) clamp(28px, 4vw, 64px);
}
.bw__opts .bw__big {
  font-size: clamp(52px, 5vw, 80px);
  margin-bottom: 10px;
}
.bw__opts .bw__lede {
  margin-bottom: 34px;
}

.bw__group {
  margin-bottom: 26px;
}
.bw__gLabel {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 12px;
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.5;
}
.bw__gLabel em {
  font-style: normal;
  letter-spacing: 0.08em;
  text-transform: none;
  font-size: 12px;
  opacity: 0.8;
}
.bw__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.bw__chips button {
  padding: 10px 16px;
  background: #fff;
  border: 1px solid rgba(22, 32, 26, 0.14);
  border-radius: 100px;
  font-size: 13.5px;
  transition:
    border-color var(--t-fast) ease,
    background-color var(--t-fast) ease,
    color var(--t-fast) ease;
}
.bw__chips button em {
  font-style: normal;
  font-size: 10.5px;
  opacity: 0.45;
  margin-left: 5px;
}
.bw__chips button:hover {
  border-color: var(--forest);
}
.bw__chips button.is-on {
  background: var(--forest-deep);
  border-color: var(--forest-deep);
  color: var(--bone);
}
.bw__chips button.is-on em {
  opacity: 0.6;
}

.bw__sw {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.bw__sw button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  transition: border-color var(--t-fast) ease;
}
.bw__sw button i {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(22, 32, 26, 0.14);
  transition: transform var(--t-fast) var(--ease-out);
}
.bw__sw button:hover i {
  transform: scale(1.1);
}
.bw__sw button.is-on {
  border-color: var(--forest-ink);
}

/* ---- done ---- */
.bw__done {
  min-height: 100%;
  display: grid;
  justify-items: center;
  align-content: center;
  text-align: center;
  padding: clamp(40px, 8vh, 90px) var(--gutter);
}
.bw__doneMark {
  color: var(--forest);
  margin-bottom: 26px;
}
.bw__done h2 {
  font-size: clamp(38px, 5vw, 64px);
}
.bw__done > p {
  margin: 14px auto 0;
  max-width: 44ch;
  opacity: 0.62;
}
.bw__recap {
  margin: 36px 0 0;
  width: min(100%, 520px);
  border-top: 1px solid rgba(22, 32, 26, 0.12);
  text-align: left;
}
.bw__recap div {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(22, 32, 26, 0.12);
}
.bw__recap dt {
  font-size: 10.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.45;
  padding-top: 3px;
}
.bw__recap dd {
  margin: 0;
  font-size: 14.5px;
}
.bw__doneActs {
  margin-top: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.bw__fine {
  margin: 20px 0 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.35;
}

/* ---- foot ---- */
.bw__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px var(--gutter);
  border-top: 1px solid rgba(22, 32, 26, 0.1);
  background: var(--chalk);
}
.bw__footActs {
  display: flex;
  align-items: center;
  gap: 22px;
}
.bw__hint {
  font-size: 12px;
  opacity: 0.5;
}
.bw__link {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.55;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
  transition:
    opacity var(--t-fast) ease,
    border-color var(--t-fast) ease;
}
.bw__link:hover {
  opacity: 1;
  border-color: currentColor;
}
.bw__link--mute {
  cursor: default;
  opacity: 0.3;
}
.bw__foot .btn:disabled {
  opacity: 0.3;
  pointer-events: none;
}

/* ---- pane transitions: slide in the direction of travel ---- */
.fwd-enter-active,
.fwd-leave-active,
.back-enter-active,
.back-leave-active {
  transition:
    opacity var(--t-mid) ease,
    transform var(--t-mid) var(--ease-out);
}
.fwd-enter-from,
.back-leave-to {
  opacity: 0;
  transform: translateX(28px);
}
.fwd-leave-to,
.back-enter-from {
  opacity: 0;
  transform: translateX(-28px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--t-mid) ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---- narrow ---- */
@media (max-width: 900px) {
  .bw__head {
    grid-template-columns: auto 1fr auto;
    padding-block: 14px;
  }
  .bw__brand span,
  .bw__stepL,
  .bw__x span {
    display: none;
  }
  .bw__steps {
    justify-content: center;
  }
  .bw__pane {
    grid-template-columns: 1fr;
    align-items: start;
    gap: 28px;
    padding-block: 30px 40px;
  }
  .bw__big {
    font-size: 54px;
  }
  .bw__tips {
    display: none;
  }
  .bw__row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .bw__drop {
    min-height: 200px;
  }
  .bw__pane--cfg {
    height: auto;
    width: 100%;
    gap: 0;
    padding: 0;
  }
  .bw__stage {
    height: 44vh;
    border-right: 0;
    border-bottom: 1px solid rgba(22, 32, 26, 0.1);
  }
  .bw__opts {
    overflow: visible;
    padding: 28px var(--gutter) 36px;
  }
  .bw__hint {
    display: none;
  }
}
</style>
