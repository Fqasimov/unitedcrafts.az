<script setup>
import { onMounted, ref } from 'vue'
import LogoMark from './LogoMark.vue'

const emit = defineEmits(['done'])

const stage = ref(0) // 0 draw · 1 wordmark · 2 curtain up
const count = ref(0)

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const span = reduced ? 300 : 2600

  const t0 = performance.now()
  const tick = setInterval(() => {
    const p = Math.min(1, (performance.now() - t0) / span)
    count.value = Math.min(100, Math.round(p * 100 + (1 - p) * Math.random() * 5))
    if (p >= 1) clearInterval(tick)
  }, 60)

  setTimeout(() => (stage.value = 1), span * 0.52)
  setTimeout(() => {
    count.value = 100
    stage.value = 2
  }, span)
  setTimeout(() => emit('done'), span + 900)
})
</script>

<template>
  <div class="loader" :class="`loader--s${stage}`">
    <div class="loader__panel loader__panel--a"></div>
    <div class="loader__panel loader__panel--b"></div>

    <div class="loader__core">
      <LogoMark class="loader__mark" :size="150" ring estd />
      <div class="loader__word">
        <span v-for="(ch, i) in 'the united crafts'" :key="i" :style="{ '--i': i }">
          {{ ch === ' ' ? ' ' : ch }}
        </span>
      </div>
    </div>

    <div class="loader__meter">
      <span class="loader__num">{{ String(count).padStart(3, '0') }}</span>
      <span class="loader__bar"><i :style="{ transform: `scaleX(${count / 100})` }"></i></span>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  color: var(--bone);
  pointer-events: none;
}

.loader__panel {
  position: absolute;
  inset: 0 0 auto 0;
  height: 50.5%;
  background: var(--forest-deep);
  transition: transform 0.95s var(--ease-out);
}
.loader__panel--b {
  inset: auto 0 0 0;
}
.loader--s2 .loader__panel--a {
  transform: translateY(-101%);
}
.loader--s2 .loader__panel--b {
  transform: translateY(101%);
}

.loader__core {
  position: relative;
  z-index: 2;
  display: grid;
  justify-items: center;
  gap: 30px;
  transition:
    opacity 0.5s ease,
    transform 0.8s var(--ease-out);
}
.loader--s2 .loader__core {
  opacity: 0;
  transform: translateY(-14px) scale(0.97);
  transition-duration: 0.45s;
}

/* mark draw-on */
.loader__mark :deep(.mark__arc) {
  stroke-dasharray: 160;
  stroke-dashoffset: 160;
  animation: draw 1.5s var(--ease-soft) 0.15s forwards;
}
.loader__mark :deep(.mark__ring) {
  stroke-dasharray: 340;
  stroke-dashoffset: 340;
  animation: draw 1.9s var(--ease-soft) forwards;
}
.loader__mark :deep(.mark__square) {
  opacity: 0;
  transform-origin: 91px 55px;
  animation: pop 0.7s var(--ease-out) 1.1s forwards;
}
.loader__mark :deep(.mark__estd) {
  opacity: 0;
  transform-origin: 60px 60px;
  animation: spin-in 2.4s var(--ease-out) 0.9s forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.2) rotate(-25deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}
@keyframes spin-in {
  from {
    opacity: 0;
    transform: rotate(-42deg);
  }
  to {
    opacity: 0.75;
    transform: rotate(0);
  }
}

.loader__word {
  font-family: var(--display);
  font-size: clamp(22px, 4vw, 34px);
  letter-spacing: 0.16em;
  display: flex;
  overflow: hidden;
  padding-bottom: 4px;
}
.loader__word span {
  display: inline-block;
  transform: translateY(110%);
  opacity: 0;
}
.loader--s1 .loader__word span,
.loader--s2 .loader__word span {
  animation: rise 0.85s var(--ease-out) forwards;
  animation-delay: calc(var(--i) * 32ms);
}
@keyframes rise {
  to {
    transform: none;
    opacity: 1;
  }
}

.loader__meter {
  position: absolute;
  z-index: 2;
  left: var(--gutter);
  right: var(--gutter);
  bottom: 42px;
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 11px;
  letter-spacing: 0.28em;
  transition: opacity 0.4s ease;
}
.loader--s2 .loader__meter {
  opacity: 0;
}
.loader__bar {
  flex: 1;
  height: 1px;
  background: rgba(242, 237, 227, 0.22);
  overflow: hidden;
}
.loader__bar i {
  display: block;
  height: 100%;
  background: var(--bone);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.4s var(--ease-out);
}
</style>
