<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { openBrief } from '../stores/ui.js'

/* durations are placeholders — replace with the studio's real lead times */
const steps = [
  {
    n: '01',
    t: 'Brief',
    time: '1 gün',
    d: 'Kimə gedir, hansı büdcə, hansı tarix. Bir səhifəlik cavabla başlayırıq.',
    icon: ['M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 12h6', 'M9 16h4']
  },
  {
    n: '02',
    t: 'Konsepsiya',
    time: '3–5 gün',
    d: 'Materiallar, kəsim sxemi və 3D maket. İki istiqamət təqdim edirik.',
    icon: ['M4 20l1-4L16 5l3 3L8 19z', 'M14 7l3 3', 'M4 20h16']
  },
  {
    n: '03',
    t: 'Nümunə',
    time: '2–3 gün',
    d: 'Bir ədəd real dəst yığılır. Rəngi, ağırlığı, açılma səsi — hamısı əldə yoxlanır.',
    icon: ['M3 8l9-5 9 5v8l-9 5-9-5z', 'M3 8l9 5 9-5', 'M12 13v8']
  },
  {
    n: '04',
    t: 'İstehsal',
    time: '7–14 gün',
    d: 'Çap, frez, əl boyaması və yığım. Hər qutu ayrıca nəzərdən keçirilir.',
    icon: ['M12 4l9 4.5-9 4.5-9-4.5z', 'M3 12.5l9 4.5 9-4.5', 'M3 16.5l9 4.5 9-4.5']
  },
  {
    n: '05',
    t: 'Çatdırılma',
    time: '1–2 gün',
    d: 'Ünvan siyahısı üzrə paylanma və ya tək nöqtəyə təhvil.',
    icon: ['M2 6h11v10H2z', 'M13 9h4.5L21 12.5V16h-8', 'M6.5 19.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z', 'M17 19.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z']
  }
]

/* The track fills with scroll and each node lights as the fill reaches it.
   Progress is eased on rAF so a wheel flick reads as a glide, not a jump;
   `reached` only changes at node boundaries, so Vue re-renders five times
   per pass rather than every frame. */
const list = ref(null)
const reached = ref(-1)
let raf = 0
let eased = 0

let trackLen = 0 // > 0 only when the steps are stacked

/* Side by side, the whole track is on screen at once, so fill over a fixed
   stretch of scroll. Stacked, the track is taller than the viewport — fill
   so its tip stays level with a fixed line on screen and each node lights
   as it scrolls past that line, not before it is visible. */
function measure() {
  const el = list.value
  if (!el) return 0
  const vh = window.innerHeight
  const top = el.getBoundingClientRect().top
  const p = trackLen ? (vh * 0.72 - top) / trackLen : (vh * 0.82 - top) / (vh * 0.55)
  return Math.max(0, Math.min(1, p))
}

function frame() {
  const target = measure()
  eased += (target - eased) * 0.09
  if (Math.abs(target - eased) < 0.0005) eased = target
  list.value?.style.setProperty('--p', eased.toFixed(4))

  const idx = Math.floor(eased * (steps.length - 1) + 0.02)
  const next = eased <= 0.001 ? -1 : idx
  if (next !== reached.value) reached.value = next

  raf = requestAnimationFrame(frame)
}

/* stacked layout: the track must stop at the last node, which sits at the
   top of the last step — not at the bottom of the list */
let ro
function span() {
  const el = list.value
  const last = el?.querySelector('li:last-of-type')
  if (!last) return
  el.style.setProperty('--span', last.offsetTop + 'px')
  trackLen = last.offsetTop > 40 ? last.offsetTop : 0
}

onMounted(() => {
  span()
  ro = new ResizeObserver(span)
  ro.observe(list.value)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    list.value?.style.setProperty('--p', '1')
    reached.value = steps.length - 1
    return
  }
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
})
</script>

<template>
  <section id="process" class="proc">
    <div class="shell">
      <div class="proc__head">
        <div>
          <p class="eyebrow" data-reveal>Necə işləyirik</p>
          <h2 class="proc__title" data-reveal style="--reveal-delay: 60ms">
            Briefdən <em>qapıya</em><br />qədər beş addım
          </h2>
        </div>

        <div class="proc__aside" data-reveal style="--reveal-delay: 120ms">
          <p>
            Hər layihə eyni yoldan keçir. Addımlar sabitdir — dəyişən yalnız
            tirajdır və qutunun içinə nə qoyduğumuz.
          </p>
          <dl class="proc__stats">
            <div>
              <dt>Orta müddət</dt>
              <dd>2–4 həftə</dd>
            </div>
            <div>
              <dt>Minimum tiraj</dt>
              <dd>50 dəst</dd>
            </div>
          </dl>
          <button class="btn" @click="openBrief">
            <span class="btn__dot"></span><span>Birinci addımı at</span>
          </button>
        </div>
      </div>

      <ol ref="list" class="proc__list">
        <span class="proc__track" aria-hidden="true"><i></i></span>

        <li
          v-for="(s, i) in steps"
          :key="s.n"
          :class="{ 'is-on': i <= reached, 'is-now': i === reached }"
        >
          <span class="proc__node" aria-hidden="true"></span>

          <div class="proc__meta">
            <span class="proc__n">{{ s.n }}</span>
            <span class="proc__time">{{ s.time }}</span>
          </div>

          <svg class="proc__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              v-for="(d, k) in s.icon"
              :key="k"
              :d="d"
              pathLength="1"
              :style="{ '--k': k }"
            />
          </svg>

          <h3 class="proc__t">{{ s.t }}</h3>
          <p class="proc__d">{{ s.d }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.proc {
  position: relative;
  background: var(--forest-deep);
  color: var(--bone);
  padding: clamp(80px, 9vw, 130px) 0;
  overflow: hidden;
}

/* ---- header: title left, context right, so the band isn't half empty ---- */
.proc__head {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(30px, 6vw, 100px);
  align-items: end;
}
.proc__title {
  font-size: clamp(34px, 4.6vw, 64px);
}
.proc__title em {
  font-style: italic;
  opacity: 0.55;
}

.proc__aside p {
  margin: 0;
  max-width: 44ch;
  font-size: 15px;
  line-height: 1.75;
  opacity: 0.66;
}
.proc__stats {
  display: flex;
  gap: clamp(28px, 4vw, 52px);
  margin: 26px 0 28px;
  padding-top: 22px;
  border-top: 1px solid rgba(242, 237, 227, 0.14);
}
.proc__stats div {
  display: grid;
  gap: 4px;
}
.proc__stats dt {
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.45;
}
.proc__stats dd {
  margin: 0;
  font-family: var(--display);
  font-size: 28px;
  line-height: 1.1;
}

/* ---- timeline ---- */
.proc__list {
  --p: 0;
  --node: 11px;
  position: relative;
  list-style: none;
  margin: clamp(56px, 6vw, 84px) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

/* spans first node to last node: columns are 20% each and nodes sit at
   each column's left edge, so the last one is at 80% */
.proc__track {
  position: absolute;
  top: calc(var(--node) / 2);
  left: 0;
  width: 80%;
  height: 1px;
  background: rgba(242, 237, 227, 0.16);
}
.proc__track i {
  position: absolute;
  inset: 0;
  background: var(--brass);
  transform-origin: left;
  transform: scaleX(var(--p));
}

.proc__list li {
  position: relative;
  padding-right: clamp(18px, 2.4vw, 34px);
}

.proc__node {
  position: relative;
  display: block;
  width: var(--node);
  height: var(--node);
  border-radius: 50%;
  border: 1px solid rgba(242, 237, 227, 0.4);
  background: var(--forest-deep);
  transition:
    background-color var(--t-mid) ease,
    border-color var(--t-mid) ease,
    transform var(--t-mid) var(--ease-out);
}
.is-on .proc__node {
  background: var(--brass);
  border-color: var(--brass);
}
/* the node the fill is currently sitting on gets a soft halo */
.proc__node::after {
  content: '';
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 1px solid var(--brass);
  opacity: 0;
  transform: scale(0.6);
  transition:
    opacity var(--t-mid) ease,
    transform var(--t-slow) var(--ease-out);
}
.is-now .proc__node::after {
  opacity: 0.5;
  transform: none;
}

.proc__meta {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 26px 0 20px;
}
.proc__n {
  font-family: var(--display);
  font-size: 15px;
  opacity: 0.45;
  transition: opacity var(--t-mid) ease;
}
.proc__time {
  font-size: 10.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid rgba(242, 237, 227, 0.16);
  opacity: 0.55;
  transition:
    opacity var(--t-mid) ease,
    border-color var(--t-mid) ease;
}
.is-on .proc__n {
  opacity: 0.9;
}
.is-on .proc__time {
  opacity: 0.9;
  border-color: rgba(200, 168, 107, 0.5);
}

/* icons draw on as the step is reached; each stroke follows the previous */
.proc__icon {
  display: block;
  width: 30px;
  height: 30px;
  stroke: var(--bone);
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.3;
  transition: opacity var(--t-mid) ease;
}
.proc__icon path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.8s var(--ease-out);
  transition-delay: calc(var(--k) * 90ms);
}
.is-on .proc__icon {
  opacity: 0.9;
}
.is-on .proc__icon path {
  stroke-dashoffset: 0;
}

.proc__t {
  font-size: clamp(22px, 2vw, 27px);
  margin: 18px 0 10px;
  opacity: 0.5;
  transform: translateY(6px);
  transition:
    opacity var(--t-mid) ease,
    transform var(--t-slow) var(--ease-out);
}
.proc__d {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.32;
  transition: opacity var(--t-mid) ease;
}
.is-on .proc__t {
  opacity: 1;
  transform: none;
}
.is-on .proc__d {
  opacity: 0.66;
}

/* ---- narrow: the track turns vertical and runs down the left ---- */
@media (max-width: 900px) {
  .proc__head {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .proc__list {
    grid-template-columns: 1fr;
    gap: 34px;
    padding-left: 34px;
  }
  .proc__track {
    top: calc(var(--node) / 2);
    left: calc(var(--node) / 2);
    width: 1px;
    height: var(--span, 100%);
  }
  .proc__track i {
    transform-origin: top;
    transform: scaleY(var(--p));
  }
  .proc__node {
    position: absolute;
    left: -34px;
    top: 0;
  }
  .proc__meta {
    margin-top: 0;
  }
  .proc__list li {
    padding-right: 0;
  }
}
</style>
