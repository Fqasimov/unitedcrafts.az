<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({ payload: { type: Object, required: true } })
const emit = defineEmits(['close'])

const hero = ref(null)
const shot = ref(0)
const closing = ref(false)

const active = () => props.payload.work.gallery[shot.value]

function flipIn() {
  const el = hero.value
  const o = props.payload.origin
  if (!el || !o) return
  const r = el.getBoundingClientRect()
  const sx = o.w / r.width
  const sy = o.h / r.height
  const dx = o.x + o.w / 2 - (r.left + r.width / 2)
  const dy = o.y + o.h / 2 - (r.top + r.height / 2)

  el.style.transition = 'none'
  el.style.transformOrigin = 'center'
  el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy}) rotate(${o.a || 0}deg)`
  el.getBoundingClientRect() // flush
  el.style.transition = 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1)'
  el.style.transform = 'none'
}

function close() {
  if (closing.value) return
  closing.value = true

  const el = hero.value
  const o = props.payload.origin
  if (el && o) {
    const r = el.getBoundingClientRect()
    const dx = o.x + o.w / 2 - (r.left + r.width / 2)
    const dy = o.y + o.h / 2 - (r.top + r.height / 2)
    el.style.transition = 'transform 0.6s cubic-bezier(0.7, 0, 0.84, 0)'
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${o.w / r.width}, ${
      o.h / r.height
    }) rotate(${o.a || 0}deg)`
  }
  setTimeout(() => emit('close'), 480)
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

onMounted(async () => {
  document.body.classList.add('is-locked')
  window.addEventListener('keydown', onKey)
  await nextTick()
  requestAnimationFrame(flipIn)
})

onBeforeUnmount(() => {
  document.body.classList.remove('is-locked')
  window.removeEventListener('keydown', onKey)
})

watch(shot, () => {
  const el = hero.value
  if (!el) return
  el.style.transition = 'none'
  el.style.transform = 'none'
})
</script>

<template>
  <div class="mw" :class="{ 'mw--out': closing }" role="dialog" aria-modal="true">
    <div class="mw__scrim" @click="close"></div>

    <div class="mw__panel">
      <button class="mw__close" @click="close" aria-label="Bağla">
        <i></i><i></i>
      </button>

      <div class="mw__media">
        <div ref="hero" class="mw__hero">
          <img :key="active()" :src="active()" :alt="payload.work.title" />
        </div>
        <div v-if="payload.work.gallery.length > 1" class="mw__thumbs">
          <button
            v-for="(g, i) in payload.work.gallery"
            :key="g"
            :class="{ 'is-on': i === shot }"
            @click="shot = i"
          >
            <img :src="g" alt="" />
          </button>
        </div>
      </div>

      <div class="mw__body">
        <p class="mw__client" style="--d: 0ms">
          {{ payload.work.client }} <span>· {{ payload.work.year }}</span>
        </p>
        <h3 class="mw__title" style="--d: 70ms">{{ payload.work.title }}</h3>
        <p class="mw__cat" style="--d: 130ms">{{ payload.work.category }}</p>
        <p class="mw__sum" style="--d: 190ms">{{ payload.work.summary }}</p>

        <dl class="mw__specs">
          <div
            v-for="(row, i) in payload.work.details"
            :key="row[0]"
            :style="{ '--d': 250 + i * 60 + 'ms' }"
          >
            <dt>{{ row[0] }}</dt>
            <dd>{{ row[1] }}</dd>
          </div>
        </dl>

        <a class="mw__link" href="#contact" :style="{ '--d': '460ms' }" @click="close">
          Oxşar dəst sifariş et
          <svg width="26" height="8" viewBox="0 0 26 8" fill="none">
            <path d="M0 4h24M21 1l3.5 3L21 7" stroke="currentColor" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mw {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: grid;
  place-items: center;
  padding: clamp(16px, 4vw, 48px);
}

.mw__scrim {
  position: absolute;
  inset: 0;
  background: rgba(16, 24, 19, 0.82);
  backdrop-filter: blur(6px);
  animation: fade 0.6s ease forwards;
}
.mw--out .mw__scrim {
  animation: fade 0.45s ease reverse forwards;
}
@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mw__panel {
  position: relative;
  width: min(100%, 1120px);
  max-height: 100%;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  background: var(--chalk);
  overflow: hidden;
  box-shadow: 0 60px 120px -50px rgba(0, 0, 0, 0.8);
}

.mw__close {
  position: absolute;
  z-index: 3;
  top: 18px;
  right: 18px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(251, 249, 245, 0.9);
  display: grid;
  place-items: center;
  transition: transform 0.5s var(--ease-out);
}
.mw__close:hover {
  transform: rotate(90deg);
}
.mw__close i {
  position: absolute;
  width: 14px;
  height: 1px;
  background: var(--forest-ink);
}
.mw__close i:first-child {
  transform: rotate(45deg);
}
.mw__close i:last-child {
  transform: rotate(-45deg);
}

.mw__media {
  position: relative;
  background: var(--forest-deep);
  min-height: clamp(280px, 52vh, 620px);
}
.mw__hero {
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: transform;
}
.mw__hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: soft 1.2s var(--ease-out);
}
@keyframes soft {
  from {
    opacity: 0.2;
    transform: scale(1.06);
  }
}

.mw__thumbs {
  position: absolute;
  z-index: 2;
  left: 18px;
  bottom: 18px;
  display: flex;
  gap: 8px;
}
.mw__thumbs button {
  width: 54px;
  height: 54px;
  overflow: hidden;
  opacity: 0.55;
  outline: 1px solid rgba(251, 249, 245, 0.6);
  outline-offset: -1px;
  transition:
    opacity 0.4s ease,
    transform 0.4s var(--ease-out);
  animation: rise-up 0.7s var(--ease-out) 0.5s backwards;
}
.mw__thumbs button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mw__thumbs button.is-on,
.mw__thumbs button:hover {
  opacity: 1;
  transform: translateY(-4px);
}

.mw__body {
  padding: clamp(30px, 4vw, 62px);
  overflow-y: auto;
}
.mw__body > *,
.mw__specs > div {
  animation: rise-up 0.9s var(--ease-out) backwards;
  animation-delay: calc(var(--d, 0ms) + 250ms);
}
@keyframes rise-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}

.mw__client {
  margin: 0 0 14px;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}
.mw__client span {
  opacity: 0.45;
}
.mw__title {
  font-size: clamp(34px, 4.4vw, 58px);
}
.mw__cat {
  margin: 10px 0 0;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.45;
}
.mw__sum {
  margin: 26px 0 0;
  font-size: 16px;
  line-height: 1.75;
  opacity: 0.82;
}

.mw__specs {
  margin: 34px 0 0;
  border-top: 1px solid rgba(22, 32, 26, 0.12);
}
.mw__specs > div {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(22, 32, 26, 0.12);
}
.mw__specs dt {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.45;
  padding-top: 3px;
}
.mw__specs dd {
  margin: 0;
  font-size: 15px;
}

.mw__link {
  margin-top: 34px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  border-bottom: 1px solid currentColor;
  padding-bottom: 7px;
}
.mw__link svg {
  transition: transform 0.5s var(--ease-out);
}
.mw__link:hover svg {
  transform: translateX(7px);
}

@media (max-width: 860px) {
  .mw {
    padding: 0;
  }
  .mw__panel {
    grid-template-columns: 1fr;
    height: 100%;
    overflow-y: auto;
  }
  .mw__media {
    position: relative;
    height: 44vh;
    min-height: 0;
  }
  .mw__body {
    overflow: visible;
  }
}
</style>
