<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { works } from '../data/works.js'
import { openBrief } from '../stores/ui.js'

const emit = defineEmits(['close', 'open'])
const closing = ref(false)

function close() {
  if (closing.value) return
  closing.value = true
  setTimeout(() => emit('close'), 260)
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

function pick(w, event) {
  const r = event.currentTarget.querySelector('img').getBoundingClientRect()
  emit('open', {
    work: w,
    origin: { x: r.left, y: r.top, w: r.width, h: r.height, a: 0 }
  })
}
</script>

<template>
  <div class="cat" :class="{ 'cat--out': closing }" role="dialog" aria-modal="true">
    <header class="cat__bar">
      <div class="shell cat__barIn">
        <p class="cat__count">Kataloq · {{ works.length }} layihə</p>
        <button class="cat__x" aria-label="Bağla" @click="close"><i></i><i></i></button>
      </div>
    </header>

    <div class="cat__scroll">
      <div class="shell">
        <ul class="cat__grid">
          <li
            v-for="(w, i) in works"
            :key="w.id"
            :style="{ '--i': i }"
            @click="pick(w, $event)"
          >
            <span class="cat__frame">
              <img :src="w.cover" :alt="`${w.client} — ${w.title}`" loading="lazy" />
            </span>
            <span class="cat__meta">
              <strong>{{ w.client }}</strong>
              <em>{{ w.category }} · {{ w.year }}</em>
            </span>
          </li>
        </ul>

        <div class="cat__tail">
          <p>Axtardığınızı tapmadınız? Sıfırdan birlikdə qururuq.</p>
          <button class="btn btn--ink" @click="openBrief">
            <span class="btn__dot"></span><span>Brief göndər</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cat {
  position: fixed;
  inset: 0;
  z-index: 155;
  background: var(--bone);
  display: flex;
  flex-direction: column;
  animation: rise var(--t-slow) var(--ease-out);
}
.cat--out {
  animation: rise var(--t-mid) var(--ease-in) reverse;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(2%);
  }
}

.cat__bar {
  border-bottom: 1px solid rgba(22, 32, 26, 0.12);
  background: var(--bone);
}
.cat__barIn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
}
.cat__count {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  opacity: 0.5;
}
.cat__x {
  width: 36px;
  height: 36px;
  position: relative;
  display: grid;
  place-items: center;
  transition: transform var(--t-mid) var(--ease-out);
}
.cat__x:hover {
  transform: rotate(90deg);
}
.cat__x i {
  position: absolute;
  width: 15px;
  height: 1px;
  background: var(--forest-ink);
}
.cat__x i:first-child {
  transform: rotate(45deg);
}
.cat__x i:last-child {
  transform: rotate(-45deg);
}

.cat__scroll {
  overflow-y: auto;
  flex: 1;
  padding: clamp(30px, 5vw, 64px) 0 clamp(40px, 6vw, 80px);
}

.cat__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: clamp(18px, 2.4vw, 32px);
}
.cat__grid li {
  cursor: pointer;
  animation: pop var(--t-slow) var(--ease-out) backwards;
  animation-delay: calc(var(--i) * 55ms);
}
@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
.cat__frame {
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--bone-warm);
}
.cat__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--t-slow) var(--ease-out);
}
.cat__grid li:hover img {
  transform: scale(1.04);
}
.cat__meta {
  display: grid;
  gap: 3px;
  padding-top: 13px;
}
.cat__meta strong {
  font-family: var(--display);
  font-weight: 400;
  font-size: 21px;
}
.cat__meta em {
  font-style: normal;
  font-size: 10.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.45;
}

.cat__tail {
  margin-top: clamp(46px, 7vw, 86px);
  padding-top: clamp(30px, 4vw, 44px);
  border-top: 1px solid rgba(22, 32, 26, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.cat__tail p {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(22px, 2.6vw, 32px);
}
</style>
