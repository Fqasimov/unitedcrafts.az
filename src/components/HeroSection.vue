<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { openBrief } from '../stores/ui.js'

const props = defineProps({ ready: Boolean })

const plateA = ref(null)
const plateB = ref(null)

/* Pointer parallax is lerped on rAF rather than transitioned on every
   pointermove — a transition restarts on each event and rubber-bands. */
let raf = 0
const target = { x: 0, y: 0 }
const eased = { x: 0, y: 0 }
let scrollY = 0

function onMove(e) {
  target.x = (e.clientX / window.innerWidth - 0.5) * 2
  target.y = (e.clientY / window.innerHeight - 0.5) * 2
}

function onScroll() {
  scrollY = window.scrollY
}

function frame() {
  eased.x += (target.x - eased.x) * 0.06
  eased.y += (target.y - eased.y) * 0.06

  const depth = Math.min(scrollY, window.innerHeight)
  if (plateA.value) {
    plateA.value.style.transform = `translate3d(${eased.x * -14}px, ${
      eased.y * -10 + depth * 0.1
    }px, 0)`
  }
  if (plateB.value) {
    plateB.value.style.transform = `translate3d(${eased.x * 18}px, ${
      eased.y * 13 - depth * 0.06
    }px, 0)`
  }
  raf = requestAnimationFrame(frame)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('scroll', onScroll)
})

const lines = ['Hədiyyə deyil —', 'açılan bir', 'təəssürat.']
</script>

<template>
  <section id="top" class="hero" :class="{ 'hero--live': props.ready }">
    <div class="hero__wash" aria-hidden="true"></div>

    <div class="hero__plate hero__plate--a">
      <div ref="plateA" class="hero__shift">
        <img src="/works/azparking-open.jpg" alt="azParking hədiyyə qutusu" />
      </div>
    </div>

    <div class="hero__plate hero__plate--b">
      <div ref="plateB" class="hero__shift">
        <img src="/works/meqa-closed.jpg" alt="Meqa Sığorta hədiyyə qutusu" />
      </div>
    </div>

    <div class="hero__in shell">
      <p class="hero__eyebrow">Bakı · ESTD. 2017 · Əl işi atelye</p>

      <h1 class="hero__title">
        <span v-for="(l, i) in lines" :key="i" class="hero__line" :style="{ '--i': i }">
          <span>{{ l }}</span>
        </span>
      </h1>

      <div class="hero__foot">
        <p class="hero__lede">
          Korporativ hədiyyə dəstləri, taxta məmulatlar və brend qablaşdırması —
          konsepsiyadan son qutunun bağlanmasına qədər bir atelyedə.
        </p>

        <div class="hero__acts">
          <button class="btn btn--solid" @click="openBrief">
            <span class="btn__dot"></span>
            <span>Brief göndər</span>
          </button>
          <a class="hero__ghost" href="#works">İşlərə bax</a>
        </div>
      </div>
    </div>

    <div class="hero__ticker" aria-hidden="true">
      <div class="hero__tickerTrack">
        <span v-for="n in 2" :key="n">
          Korporativ hədiyyə · Qablaşdırma dizaynı · Taxta məmulat · Folqa ştamp · Əl
          boyaması · Limitli tiraj ·
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  background: var(--forest-deep);
  color: var(--bone);
  overflow: hidden;
  isolation: isolate;
}

.hero__wash {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(52% 46% at 18% 12%, rgba(88, 130, 104, 0.34), transparent 70%),
    radial-gradient(44% 40% at 86% 82%, rgba(200, 168, 107, 0.14), transparent 70%);
}

.hero__plate {
  position: absolute;
  z-index: -1;
  overflow: hidden;
  box-shadow: 0 40px 80px -44px rgba(0, 0, 0, 0.7);
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 1s var(--ease-out) 0.3s,
    transform 1s var(--ease-out) 0.3s;
}
.hero--live .hero__plate {
  opacity: 1;
  transform: none;
}
.hero__shift {
  width: 100%;
  height: 100%;
}
.hero__plate img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9);
}
.hero__plate--a {
  right: 4vw;
  top: 15vh;
  width: clamp(180px, 20vw, 300px);
  aspect-ratio: 4 / 3;
}
.hero__plate--b {
  right: 15vw;
  bottom: 21vh;
  width: clamp(140px, 13vw, 195px);
  aspect-ratio: 3 / 4;
}

.hero__in {
  position: relative;
  padding-block: 15vh 11vh;
}

.hero__eyebrow {
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  margin: 0 0 clamp(22px, 4vw, 40px);
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity var(--t-slow) var(--ease-out) 0.15s,
    transform var(--t-slow) var(--ease-out) 0.15s;
}
.hero--live .hero__eyebrow {
  opacity: 0.62;
  transform: none;
}

.hero__title {
  font-size: clamp(34px, 8vw, 116px);
  letter-spacing: -0.005em;
}
.hero__line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
  white-space: nowrap;
}
.hero__line > span {
  display: block;
  transform: translateY(105%);
  transition: transform 0.95s var(--ease-out);
  transition-delay: calc(var(--i) * 90ms + 100ms);
}
.hero--live .hero__line > span {
  transform: none;
}
.hero__line:nth-child(2) {
  padding-left: clamp(0px, 8vw, 150px);
}
.hero__line:nth-child(3) {
  padding-left: clamp(0px, 3vw, 60px);
  font-style: italic;
}

.hero__foot {
  margin-top: clamp(38px, 6vw, 68px);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity var(--t-slow) var(--ease-out) 0.55s,
    transform var(--t-slow) var(--ease-out) 0.55s;
}
.hero--live .hero__foot {
  opacity: 1;
  transform: none;
}
.hero__lede {
  max-width: 38ch;
  margin: 0;
  font-size: 15.5px;
  line-height: 1.75;
  opacity: 0.74;
}

.hero__acts {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}
.hero__ghost {
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.6;
  padding-bottom: 3px;
  border-bottom: 1px solid transparent;
  transition:
    opacity var(--t-mid) ease,
    border-color var(--t-mid) ease;
}
.hero__ghost:hover {
  opacity: 1;
  border-color: currentColor;
}

.hero__ticker {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 15px 0;
  border-top: 1px solid rgba(242, 237, 227, 0.12);
  overflow: hidden;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  opacity: 0.42;
}
.hero__tickerTrack {
  display: flex;
  width: max-content;
  animation: marquee 60s linear infinite;
}
.hero__tickerTrack span {
  padding-right: 24px;
  white-space: nowrap;
}
@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 900px) {
  .hero__in {
    padding-block: 13vh 10vh;
  }
  /* type carries the mobile hero; the work shows up in the next section */
  .hero__plate {
    display: none;
  }
  .hero__foot {
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
  }
  .hero__line:nth-child(2) {
    padding-left: 0;
  }
}
</style>
