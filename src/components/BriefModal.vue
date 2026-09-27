<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import BoxPreview from './BoxPreview.vue'
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
   as a file so nothing is lost. Replace `deliver` with a POST when the
   endpoint exists — the payload below is already the full brief. */
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

/* --- shell ---------------------------------------------------------------- */
function close() {
  if (closing.value) return
  closing.value = true
  setTimeout(() => emit('close'), 260)
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  form.refs.forEach((r) => URL.revokeObjectURL(r.url))
})

const panel = ref(null)
watch(step, () => panel.value?.scrollTo({ top: 0, behavior: 'smooth' }))
</script>

<template>
  <div class="bw" :class="{ 'bw--out': closing }" role="dialog" aria-modal="true">
    <div class="bw__scrim" @click="close"></div>

    <div class="bw__panel">
      <header class="bw__head">
        <div class="bw__steps">
          <button
            v-for="s in STEPS"
            :key="s.n"
            class="bw__step"
            :class="{ 'is-on': step === s.n, 'is-done': step > s.n }"
            :disabled="s.n > step"
            @click="step = s.n"
          >
            <span class="bw__stepN">{{ String(s.n).padStart(2, '0') }}</span>
            <span class="bw__stepL">{{ s.label }}</span>
          </button>
        </div>
        <button class="bw__x" aria-label="Bağla" @click="close"><i></i><i></i></button>
        <span class="bw__rail"><i :style="{ transform: `scaleX(${step / 3})` }"></i></span>
      </header>

      <div ref="panel" class="bw__body">
        <!-- sent -->
        <div v-if="sent" class="bw__done">
          <h3>Brief hazırdır</h3>
          <p>
            Sorğunuzu bizə göndərin — bir iş günü ərzində konsepsiya və qiymətlə
            qayıdırıq.
          </p>
          <div class="bw__doneActs">
            <a class="btn btn--ink" :href="mailto">
              <span class="btn__dot"></span><span>E-poçt ilə göndər</span>
            </a>
            <button class="bw__link" @click="downloadBrief">Brief-i yüklə (.json)</button>
          </div>
          <p class="bw__fine">
            Referans şəkilləri e-poçta əl ilə əlavə etməyi unutmayın.
          </p>
        </div>

        <!-- 1 · idea -->
        <section v-else-if="step === 1" class="bw__pane">
          <h3 class="bw__title">İdeyanızı öz sözlərinizlə yazın</h3>
          <p class="bw__lede">
            Səliqəli olmasına ehtiyac yoxdur. Kimə gedir, hansı münasibət, nə hiss
            oyatmalıdır — bu qədəri bəsdir.
          </p>

          <label class="bw__field bw__field--area">
            <span>İdeya</span>
            <textarea
              v-model="form.idea"
              rows="6"
              placeholder="Məsələn: 200 korporativ müştəri üçün Yeni il dəsti. Yaşıl və qızıl. İçində şam, dəftər və şirniyyat olsun…"
            ></textarea>
          </label>

          <div class="bw__row">
            <label class="bw__field">
              <span>Ad / Şirkət</span>
              <input v-model="form.name" type="text" placeholder="Ayan MMC" />
            </label>
            <label class="bw__field">
              <span>Əlaqə (e-poçt və ya telefon)</span>
              <input v-model="form.contact" type="text" placeholder="ayan@sirket.az" />
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
        </section>

        <!-- 2 · references -->
        <section v-else-if="step === 2" class="bw__pane">
          <h3 class="bw__title">Referans şəkilləriniz varsa əlavə edin</h3>
          <p class="bw__lede">
            İstəyə bağlıdır. Bəyəndiyiniz qutu, rəng və ya üslub — nə olursa olsun
            kömək edir.
          </p>

          <label
            class="bw__drop"
            :class="{ 'is-over': dropping }"
            @dragover.prevent="dropping = true"
            @dragleave="dropping = false"
            @drop.prevent="onDrop"
          >
            <input type="file" accept="image/*" multiple hidden @change="onPick" />
            <strong>Şəkilləri buraya atın</strong>
            <span>və ya seçmək üçün klikləyin · maksimum {{ MAX_REFS }} şəkil</span>
          </label>

          <ul v-if="form.refs.length" class="bw__refs">
            <li v-for="(r, i) in form.refs" :key="r.url">
              <img :src="r.url" :alt="r.name" />
              <button aria-label="Sil" @click="removeRef(i)">×</button>
            </li>
          </ul>

          <p v-else class="bw__skip">Referansınız yoxdursa, birbaşa növbəti addıma keçin.</p>
        </section>

        <!-- 3 · configurator -->
        <section v-else class="bw__pane bw__pane--cfg">
          <div class="bw__cfgView">
            <BoxPreview :config="form.config" />
          </div>

          <div class="bw__cfgOpts">
            <h3 class="bw__title bw__title--sm">Qutunu yığın</h3>
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
              <p class="bw__gLabel">Rəng</p>
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
              <p class="bw__gLabel">İçindəkilər</p>
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
      </div>

      <footer v-if="!sent" class="bw__foot">
        <button v-if="step > 1" class="bw__link" @click="step--">Geri</button>
        <span v-else class="bw__link bw__link--mute">Addım {{ step }} / 3</span>

        <div class="bw__footActs">
          <button v-if="step === 2" class="bw__link" @click="step = 3">Keç</button>
          <button
            v-if="step < 3"
            class="btn btn--ink"
            :disabled="!canAdvance"
            @click="step++"
          >
            <span class="btn__dot"></span><span>Davam et</span>
          </button>
          <button v-else class="btn btn--ink" @click="submit">
            <span class="btn__dot"></span><span>Brief-i tamamla</span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.bw {
  position: fixed;
  inset: 0;
  z-index: 160;
  display: grid;
  place-items: center;
  padding: clamp(0px, 3vw, 40px);
}
.bw__scrim {
  position: absolute;
  inset: 0;
  background: rgba(16, 24, 19, 0.84);
  animation: fade var(--t-mid) ease forwards;
}
.bw--out .bw__scrim {
  animation: fade var(--t-fast) ease reverse forwards;
}
@keyframes fade {
  from {
    opacity: 0;
  }
}

.bw__panel {
  position: relative;
  width: min(100%, 1060px);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--chalk);
  overflow: hidden;
  box-shadow: 0 50px 100px -48px rgba(0, 0, 0, 0.75);
  animation: lift var(--t-slow) var(--ease-out);
}
.bw--out .bw__panel {
  animation: lift var(--t-fast) var(--ease-in) reverse;
}
@keyframes lift {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.99);
  }
}

/* head */
.bw__head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px clamp(20px, 3vw, 34px);
  border-bottom: 1px solid rgba(22, 32, 26, 0.1);
}
.bw__steps {
  display: flex;
  gap: clamp(12px, 3vw, 34px);
  margin-right: auto;
  overflow: hidden;
}
.bw__step {
  display: flex;
  align-items: baseline;
  gap: 9px;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.32;
  transition: opacity var(--t-mid) ease;
  white-space: nowrap;
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
  font-size: 15px;
  letter-spacing: 0;
}
.bw__rail {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: transparent;
}
.bw__rail i {
  display: block;
  height: 100%;
  background: var(--forest);
  transform-origin: left;
  transition: transform var(--t-slow) var(--ease-out);
}

.bw__x {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  transition: transform var(--t-mid) var(--ease-out);
  flex-shrink: 0;
}
.bw__x:hover {
  transform: rotate(90deg);
}
.bw__x i {
  position: absolute;
  width: 13px;
  height: 1px;
  background: var(--forest-ink);
}
.bw__x i:first-child {
  transform: rotate(45deg);
}
.bw__x i:last-child {
  transform: rotate(-45deg);
}

/* body */
.bw__body {
  overflow-y: auto;
  flex: 1;
}
.bw__pane {
  padding: clamp(26px, 4vw, 46px);
  animation: pane var(--t-mid) var(--ease-out);
}
@keyframes pane {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
.bw__title {
  font-size: clamp(26px, 3.4vw, 40px);
}
.bw__title--sm {
  font-size: clamp(22px, 2.6vw, 30px);
}
.bw__lede {
  margin: 12px 0 30px;
  max-width: 52ch;
  font-size: 15px;
  line-height: 1.7;
  opacity: 0.6;
}

/* fields */
.bw__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.bw__field {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}
.bw__field span {
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.5;
}
.bw__field input,
.bw__field textarea {
  font: inherit;
  font-size: 15px;
  color: inherit;
  background: transparent;
  border: 1px solid rgba(22, 32, 26, 0.18);
  border-radius: 2px;
  padding: 13px 15px;
  width: 100%;
  resize: vertical;
  transition: border-color var(--t-mid) ease;
}
.bw__field input:focus,
.bw__field textarea:focus {
  outline: none;
  border-color: var(--forest);
}
.bw__field textarea::placeholder,
.bw__field input::placeholder {
  color: rgba(22, 32, 26, 0.32);
}

/* references */
.bw__drop {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: clamp(34px, 6vw, 60px);
  border: 1px dashed rgba(22, 32, 26, 0.28);
  border-radius: 3px;
  cursor: pointer;
  text-align: center;
  transition:
    border-color var(--t-mid) ease,
    background-color var(--t-mid) ease;
}
.bw__drop:hover,
.bw__drop.is-over {
  border-color: var(--forest);
  background: rgba(58, 90, 73, 0.05);
}
.bw__drop strong {
  font-family: var(--display);
  font-weight: 400;
  font-size: 22px;
}
.bw__drop span {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.45;
}

.bw__refs {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 12px;
}
.bw__refs li {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  animation: pane var(--t-mid) var(--ease-out);
}
.bw__refs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bw__refs button {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(251, 249, 245, 0.92);
  font-size: 15px;
  line-height: 1;
}
.bw__skip {
  margin: 22px 0 0;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
}

/* configurator */
.bw__pane--cfg {
  display: grid;
  grid-template-columns: 1.02fr 1fr;
  gap: clamp(24px, 3vw, 44px);
  padding: 0;
}
.bw__cfgView {
  min-height: 340px;
  border-right: 1px solid rgba(22, 32, 26, 0.1);
}
.bw__cfgOpts {
  padding: clamp(26px, 3vw, 40px) clamp(26px, 3vw, 40px) clamp(26px, 3vw, 40px) 0;
}
.bw__cfgOpts .bw__lede {
  margin-bottom: 26px;
}

.bw__group {
  margin-bottom: 22px;
}
.bw__gLabel {
  margin: 0 0 10px;
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.45;
}
.bw__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.bw__chips button {
  padding: 9px 15px;
  border: 1px solid rgba(22, 32, 26, 0.18);
  border-radius: 100px;
  font-size: 13px;
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
  gap: 10px;
}
.bw__sw button {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  transition: border-color var(--t-fast) ease;
}
.bw__sw button i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(22, 32, 26, 0.14);
  transition: transform var(--t-fast) var(--ease-out);
}
.bw__sw button:hover i {
  transform: scale(1.12);
}
.bw__sw button.is-on {
  border-color: var(--forest-ink);
}

/* done */
.bw__done {
  padding: clamp(40px, 7vw, 82px) clamp(26px, 4vw, 46px);
  text-align: center;
  animation: pane var(--t-slow) var(--ease-out);
}
.bw__done h3 {
  font-size: clamp(30px, 4vw, 46px);
}
.bw__done p {
  margin: 14px auto 0;
  max-width: 44ch;
  opacity: 0.65;
}
.bw__doneActs {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}
.bw__fine {
  margin-top: 22px !important;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.35 !important;
}

/* foot */
.bw__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px clamp(20px, 3vw, 34px);
  border-top: 1px solid rgba(22, 32, 26, 0.1);
  background: var(--chalk);
}
.bw__footActs {
  display: flex;
  align-items: center;
  gap: 20px;
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
  opacity: 0.32;
  pointer-events: none;
}

@media (max-width: 860px) {
  .bw {
    padding: 0;
  }
  .bw__panel {
    height: 100%;
    max-height: none;
  }
  .bw__row,
  .bw__pane--cfg {
    grid-template-columns: 1fr;
  }
  .bw__cfgView {
    min-height: 280px;
    border-right: 0;
    border-bottom: 1px solid rgba(22, 32, 26, 0.1);
  }
  .bw__cfgOpts {
    padding: 26px;
  }
  .bw__stepL {
    display: none;
  }
}
</style>
