<script setup>
import { ref } from 'vue'

const partners = [
  { name: 'azParking', field: 'Mobilite', year: '2025', shot: '/works/azparking-closed.jpg' },
  { name: 'AzInTelecom', field: 'Telekom', year: '2025', shot: '/works/azintelecom-closed.jpg' },
  { name: 'Meqa Sığorta', field: 'Sığorta', year: '2026', shot: '/works/meqa-closed.jpg' },
  { name: 'Meqa Həyat', field: 'Sığorta', year: '2026', shot: '/works/meqa-open.jpg' },
  { name: 'Kapital Bank', field: 'Bank', year: '2025', shot: '/works/kapital-bags.jpg' }
]

const peek = ref(null)
const pos = ref({ x: 0, y: 0 })

function track(e) {
  pos.value = { x: e.clientX, y: e.clientY }
}
</script>

<template>
  <section id="partners" class="part section" @pointermove="track">
    <div class="shell">
      <div class="part__head">
        <p class="eyebrow" data-reveal>Partnyorlar</p>
        <h2 class="part__title" data-reveal style="--reveal-delay: 60ms">
          Bizə <em>etibar edənlər</em>
        </h2>
      </div>

      <ul class="part__list">
        <li
          v-for="(p, i) in partners"
          :key="p.name"
          data-reveal
          :style="{ '--reveal-delay': i * 60 + 'ms' }"
          @mouseenter="peek = p"
          @mouseleave="peek = null"
        >
          <span class="part__idx">0{{ i + 1 }}</span>
          <span class="part__name">{{ p.name }}</span>
          <span class="part__field">{{ p.field }}</span>
          <span class="part__year">{{ p.year }}</span>
        </li>
      </ul>

      <p class="part__note" data-reveal>
        Siyahıya qoşulmaq üçün — <a href="#contact">brief göndərin</a>.
      </p>
    </div>

    <div
      class="part__peek"
      :class="{ 'is-on': peek }"
      :style="{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }"
      aria-hidden="true"
    >
      <img v-if="peek" :src="peek.shot" alt="" />
    </div>
  </section>
</template>

<style scoped>
.part {
  background: var(--bone-warm);
  position: relative;
  overflow: hidden;
}
.part__title {
  font-size: clamp(34px, 5vw, 68px);
}
.part__title em {
  font-style: italic;
  opacity: 0.5;
}

.part__list {
  list-style: none;
  margin: clamp(46px, 6vw, 80px) 0 0;
  padding: 0;
  border-top: 1px solid rgba(22, 32, 26, 0.16);
}
.part__list li {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 160px 70px;
  align-items: baseline;
  gap: 20px;
  padding: clamp(18px, 2.4vw, 30px) 0;
  border-bottom: 1px solid rgba(22, 32, 26, 0.16);
  transition: padding-left 0.6s var(--ease-out);
  cursor: default;
}
.part__list li:hover {
  padding-left: 22px;
}

.part__idx,
.part__field,
.part__year {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.45;
}
.part__year {
  text-align: right;
}
.part__name {
  font-family: var(--display);
  font-size: clamp(26px, 3.6vw, 48px);
  line-height: 1;
}

.part__note {
  margin: 34px 0 0;
  font-size: 13px;
  letter-spacing: 0.14em;
  opacity: 0.55;
}
.part__note a {
  border-bottom: 1px solid currentColor;
}

.part__peek {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  width: 190px;
  height: 230px;
  margin: -115px 0 0 -95px;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.45s ease,
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 40px 70px -40px rgba(22, 32, 26, 0.7);
}
.part__peek.is-on {
  opacity: 1;
}
.part__peek img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: zoomIn 0.9s var(--ease-out);
}
@keyframes zoomIn {
  from {
    transform: scale(1.18);
  }
}

@media (max-width: 760px) {
  .part__list li {
    grid-template-columns: 40px 1fr auto;
  }
  .part__year {
    display: none;
  }
  .part__peek {
    display: none;
  }
}
</style>
