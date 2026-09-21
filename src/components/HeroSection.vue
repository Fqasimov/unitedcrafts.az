<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps({ ready: Boolean })

const root = ref(null)
const px = ref(0)
const py = ref(0)
const scrolled = ref(0)

function onMove(e) {
  const w = window.innerWidth
  const h = window.innerHeight
  px.value = (e.clientX / w - 0.5) * 2
  py.value = (e.clientY / h - 0.5) * 2
}

function onScroll() {
  scrolled.value = Math.min(1, window.scrollY / (window.innerHeight || 1))
}

onMounted(() => {
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('scroll', onScroll)
})

const lines = ['Hədiyyə deyil —', 'açılan bir', 'təəssürat.']
</script>

<template>
  <section id="top" ref="root" class="hero" :class="{ 'hero--live': props.ready }">
    <div class="hero__wash"></div>

    <div
      class="hero__plate hero__plate--l drift"
      style="--drift-x: -10px; --drift-y: -26px; --drift-r: -2deg; --drift-time: 15s"
      :style="{
        '--mx': px * -18 + 'px',
        '--my': py * -14 + 'px',
        '--sy': scrolled * 120 + 'px'
      }"
    >
      <img src="/works/azparking-open.jpg" alt="azParking hədiyyə qutusu" loading="eager" />
    </div>

    <div
      class="hero__plate hero__plate--r drift"
      style="--drift-x: 16px; --drift-y: 20px; --drift-r: 2.5deg; --drift-time: 11s; --drift-delay: -3s"
      :style="{
        '--mx': px * 24 + 'px',
        '--my': py * 18 + 'px',
        '--sy': scrolled * -90 + 'px'
      }"
    >
      <img src="/works/meqa-closed.jpg" alt="Meqa Sığorta hədiyyə qutusu" loading="eager" />
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
        <a class="hero__scroll" href="#studio">
          <span class="hero__scrollLine"><i></i></span>
          Aşağı
        </a>
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
  inset: -20%;
  background:
    radial-gradient(48% 42% at 22% 18%, rgba(88, 130, 104, 0.4), transparent 70%),
    radial-gradient(40% 38% at 82% 76%, rgba(200, 168, 107, 0.18), transparent 70%);
  animation: wash 22s ease-in-out infinite alternate;
  z-index: -2;
}
@keyframes wash {
  to {
    transform: translate3d(3%, -4%, 0) scale(1.12);
  }
}

.hero__plate {
  position: absolute;
  z-index: -1;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 50px 90px -40px rgba(0, 0, 0, 0.75);
  opacity: 0;
  transition:
    opacity 1.4s var(--ease-out) 0.35s,
    filter 0.8s ease;
  filter: saturate(0.85);
}
.hero--live .hero__plate {
  opacity: 1;
}
.hero__plate img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate3d(var(--mx, 0), calc(var(--my, 0px) + var(--sy, 0px)), 0);
  transition: transform 0.9s var(--ease-out);
}
.hero__plate--l {
  right: 4vw;
  top: 15vh;
  width: clamp(180px, 20vw, 310px);
  aspect-ratio: 4 / 3;
}
.hero__plate--r {
  right: 15vw;
  bottom: 21vh;
  width: clamp(140px, 13vw, 200px);
  aspect-ratio: 3 / 4;
}

.hero__in {
  position: relative;
  padding-block: 15vh 11vh;
  width: min(100% - var(--gutter) * 2, var(--shell));
}

.hero__eyebrow {
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  opacity: 0;
  margin: 0 0 clamp(22px, 4vw, 40px);
  transform: translateY(12px);
  transition:
    opacity 1s ease 0.2s,
    transform 1s var(--ease-out) 0.2s;
}
.hero--live .hero__eyebrow {
  opacity: 0.66;
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
  transition: transform 1.25s var(--ease-out);
  transition-delay: calc(var(--i) * 110ms + 120ms);
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
  margin-top: clamp(38px, 6vw, 72px);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 1.1s ease 0.75s,
    transform 1.1s var(--ease-out) 0.75s;
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

.hero__scroll {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.7;
  white-space: nowrap;
}
.hero__scrollLine {
  display: block;
  width: 64px;
  height: 1px;
  background: rgba(242, 237, 227, 0.26);
  overflow: hidden;
}
.hero__scrollLine i {
  display: block;
  width: 34%;
  height: 100%;
  background: var(--bone);
  animation: sweep 2.4s var(--ease-soft) infinite;
}
@keyframes sweep {
  0% {
    transform: translateX(-100%);
  }
  60%,
  100% {
    transform: translateX(300%);
  }
}

.hero__ticker {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 0;
  border-top: 1px solid rgba(242, 237, 227, 0.12);
  overflow: hidden;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  opacity: 0.5;
}
.hero__tickerTrack {
  display: flex;
  width: max-content;
  animation: marquee 46s linear infinite;
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
  }
  .hero__line:nth-child(2) {
    padding-left: 0;
  }
}
</style>
