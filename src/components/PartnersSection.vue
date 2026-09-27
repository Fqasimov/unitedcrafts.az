<script setup>
import { computed, ref } from 'vue'

const partners = [
  { name: 'azParking', field: 'Mobilite', year: '2025', shot: '/works/azparking-closed.jpg' },
  { name: 'AzInTelecom', field: 'Telekom', year: '2025', shot: '/works/azintelecom-closed.jpg' },
  { name: 'Meqa Sığorta', field: 'Sığorta', year: '2026', shot: '/works/meqa-closed.jpg' },
  { name: 'Meqa Həyat', field: 'Sığorta', year: '2026', shot: '/works/meqa-open.jpg' },
  { name: 'Kapital Bank', field: 'Bank', year: '2025', shot: '/works/kapital-bags.jpg' }
]

const active = ref(0)
const shown = computed(() => partners[active.value])
</script>

<template>
  <section id="partners" class="part section">
    <div class="shell">
      <div class="part__head">
        <p class="eyebrow" data-reveal>Partnyorlar</p>
        <h2 class="part__title" data-reveal style="--reveal-delay: 60ms">
          Bizə <em>etibar edənlər</em>
        </h2>
      </div>

      <div class="part__body">
        <ul class="part__list" @mouseleave="active = 0">
          <li
            v-for="(p, i) in partners"
            :key="p.name"
            :class="{ 'is-on': active === i }"
            data-reveal
            :style="{ '--reveal-delay': i * 55 + 'ms' }"
            @mouseenter="active = i"
          >
            <span class="part__idx">0{{ i + 1 }}</span>
            <span class="part__name">{{ p.name }}</span>
            <span class="part__field">{{ p.field }}</span>
            <span class="part__year">{{ p.year }}</span>
          </li>
        </ul>

        <figure class="part__view" data-reveal="mask" aria-hidden="true">
          <img v-for="(p, i) in partners" :key="p.name" :src="p.shot" alt="" :class="{ 'is-on': active === i }" />
        </figure>
      </div>

      <p class="part__note" data-reveal>
        Siyahıya qoşulmaq üçün — <a href="#contact">brief göndərin</a>.
      </p>
    </div>
  </section>
</template>

<style scoped>
.part {
  background: var(--bone-warm);
}
.part__title {
  font-size: clamp(34px, 5vw, 68px);
}
.part__title em {
  font-style: italic;
  opacity: 0.5;
}

.part__body {
  margin-top: clamp(42px, 5vw, 70px);
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: clamp(30px, 4vw, 60px);
  align-items: start;
}

.part__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid rgba(22, 32, 26, 0.16);
}
.part__list li {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 130px 60px;
  align-items: baseline;
  gap: 16px;
  padding: clamp(16px, 2vw, 26px) 0;
  border-bottom: 1px solid rgba(22, 32, 26, 0.16);
  transition:
    padding-left var(--t-mid) var(--ease-out),
    opacity var(--t-mid) ease;
  cursor: default;
}
.part__list:hover li {
  opacity: 0.45;
}
/* only shift once a row is actually being pointed at, so the default
   state reads as a flat list rather than one row nudged out of line */
.part__list:hover li.is-on {
  opacity: 1;
  padding-left: 16px;
}

.part__idx,
.part__field,
.part__year {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.45;
}
.part__year {
  text-align: right;
}
.part__name {
  font-family: var(--display);
  font-size: clamp(24px, 3.2vw, 44px);
  line-height: 1;
}

.part__view {
  position: relative;
  margin: 0;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--bone);
}
.part__view img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity var(--t-mid) ease;
}
.part__view img.is-on {
  opacity: 1;
}

.part__note {
  margin: clamp(30px, 4vw, 44px) 0 0;
  font-size: 13px;
  letter-spacing: 0.1em;
  opacity: 0.55;
}
.part__note a {
  border-bottom: 1px solid currentColor;
}

@media (max-width: 900px) {
  .part__body {
    grid-template-columns: 1fr;
  }
  .part__view {
    display: none;
  }
  .part__list:hover li {
    opacity: 1;
  }
  .part__list li {
    grid-template-columns: 40px minmax(0, 1fr) auto;
  }
  .part__year {
    display: none;
  }
}
</style>
