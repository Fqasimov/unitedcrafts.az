<script setup>
import { computed, ref } from 'vue'
import { works } from '../data/works.js'
import { openCatalogue } from '../stores/ui.js'

const emit = defineEmits(['open'])

const hovered = ref(null)

const SPREAD = 26 // degrees between neighbouring tiles

const angled = computed(() =>
  works.map((w, i) => ({ ...w, a: (i - (works.length - 1) / 2) * SPREAD }))
)

const caption = computed(
  () => angled.value.find((w) => w.id === hovered.value) ?? angled.value[2]
)

function open(work, event) {
  const frame = event.currentTarget.querySelector('.tile__frame')
  const r = frame.getBoundingClientRect()
  emit('open', {
    work,
    origin: { x: r.left, y: r.top, w: r.width, h: r.height, a: work.a }
  })
}
</script>

<template>
  <section id="works" class="arc-sec section">
    <div class="shell arc-sec__head">
      <p class="eyebrow" data-reveal>Seçilmiş işlər</p>
      <h2 class="arc-sec__title" data-reveal style="--reveal-delay: 60ms">
        Beş layihə, <em>bir əl</em>
      </h2>
    </div>

    <div class="arc">
      <div class="arc__stage" data-reveal>
        <span class="arc__guide" aria-hidden="true"></span>

        <button
          v-for="(w, i) in angled"
          :key="w.id"
          class="tile"
          :class="{ 'is-dim': hovered && hovered !== w.id }"
          :style="{ '--a': w.a, '--i': i }"
          :aria-label="`${w.client} — ${w.title}`"
          @mouseenter="hovered = w.id"
          @mouseleave="hovered = null"
          @focus="hovered = w.id"
          @blur="hovered = null"
          @click="open(w, $event)"
        >
          <span class="tile__frame">
            <img :src="w.cover" :alt="`${w.client} — ${w.title}`" loading="lazy" />
            <span class="tile__veil"></span>
            <span class="tile__idx">0{{ i + 1 }}</span>
            <span class="tile__plus"><i></i><i></i></span>
          </span>
          <span class="tile__meta">
            <strong>{{ w.client }}</strong>
            <em>{{ w.category }}</em>
          </span>
        </button>
      </div>

      <div class="arc__caption" :key="caption.id">
        <strong>{{ caption.client }}</strong>
        <span>{{ caption.category }} · {{ caption.year }}</span>
      </div>
    </div>

    <div class="shell arc__more" data-reveal>
      <p>Bunlar seçmədir — atelyedən çıxan hər şey kataloqdadır.</p>
      <button class="arc__link" @click="openCatalogue">
        <span>Tam kataloqa bax</span>
        <svg width="30" height="8" viewBox="0 0 30 8" fill="none" aria-hidden="true">
          <path d="M0 4h28M25 1l3.5 3L25 7" stroke="currentColor" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.arc-sec {
  background: var(--bone);
  overflow: hidden;
  padding-block: clamp(84px, 10vw, 150px);
}
.arc-sec__head {
  text-align: center;
  display: grid;
  justify-items: center;
}
.arc-sec__head .eyebrow {
  justify-content: center;
}
.arc-sec__title {
  font-size: clamp(38px, 6.6vw, 88px);
}
.arc-sec__title em {
  font-style: italic;
  opacity: 0.5;
}

.arc {
  /* pivot sits --r below the middle of the centre tile */
  --r: clamp(330px, 33vw, 470px);
  --tile: clamp(124px, 12.4vw, 180px);
  position: relative;
  margin-top: clamp(44px, 5vw, 70px);
  /* half tile + arc drop at ±52° + rotated half-diagonal + caption */
  height: calc(var(--tile) * 1.21 + var(--r) * 0.385 + 104px);
}

.arc__stage {
  position: absolute;
  inset: 0;
}

.arc__guide {
  position: absolute;
  left: 50%;
  top: calc(var(--tile) / 2 + var(--r));
  width: calc((var(--r) - var(--tile) * 0.64) * 2);
  height: calc((var(--r) - var(--tile) * 0.64) * 2);
  margin-left: calc((var(--r) - var(--tile) * 0.64) * -1);
  margin-top: calc((var(--r) - var(--tile) * 0.64) * -1);
  border-radius: 50%;
  border: 1px dashed rgba(58, 90, 73, 0.25);
  /* keep only the crown of the circle, fading at both ends */
  clip-path: inset(0 0 72% 0);
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 20%,
    #000 80%,
    transparent
  );
}

.tile {
  position: absolute;
  left: 50%;
  top: 0;
  width: var(--tile);
  height: var(--tile);
  margin-left: calc(var(--tile) / -2);
  transform-origin: 50% calc(var(--r) + var(--tile) / 2);
  transform: rotate(calc(var(--a) * 1deg));
  transition:
    transform var(--t-mid) var(--ease-out),
    opacity var(--t-mid) ease;
}

/* fan out from a closed stack when the arc scrolls in */
.arc__stage[data-reveal] .tile {
  opacity: 0;
  transform: rotate(0deg) translateY(40px);
  transition:
    transform 0.9s var(--ease-out),
    opacity var(--t-slow) ease;
  transition-delay: calc(var(--i) * 70ms);
}
.arc__stage[data-reveal].is-in .tile {
  opacity: 1;
  transform: rotate(calc(var(--a) * 1deg));
}
.arc__stage[data-reveal].is-in .tile.is-dim {
  opacity: 0.4;
}
.arc__stage[data-reveal].is-in .tile:hover,
.arc__stage[data-reveal].is-in .tile:focus-visible {
  opacity: 1;
  transform: rotate(calc(var(--a) * 1deg)) translateY(-20px);
}

.tile__frame {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--forest-deep);
  box-shadow: 0 28px 55px -32px rgba(22, 32, 26, 0.65);
}
.tile__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition:
    transform 1.2s var(--ease-out),
    filter 0.7s ease;
  filter: saturate(0.86) contrast(1.02);
}
.tile:hover .tile__frame img {
  transform: scale(1.15);
  filter: saturate(1);
}

.tile__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(22, 32, 26, 0.42), transparent 58%);
}

.tile__idx {
  position: absolute;
  top: 11px;
  left: 13px;
  color: var(--bone);
  font-size: 10.5px;
  letter-spacing: 0.24em;
  opacity: 0.8;
}

.tile__plus {
  position: absolute;
  right: 11px;
  bottom: 11px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(242, 237, 227, 0.94);
  display: grid;
  place-items: center;
  transform: scale(0.6);
  opacity: 0;
  transition:
    transform var(--t-mid) var(--ease-out),
    opacity var(--t-mid) ease;
}
.tile__plus i {
  position: absolute;
  background: var(--forest-deep);
}
.tile__plus i:first-child {
  width: 10px;
  height: 1px;
}
.tile__plus i:last-child {
  width: 1px;
  height: 10px;
}
.tile:hover .tile__plus {
  transform: none;
  opacity: 1;
}

.tile__meta {
  display: none;
}

.arc__caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  justify-items: center;
  gap: 7px;
  text-align: center;
  animation: capIn var(--t-mid) var(--ease-out);
}
@keyframes capIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}
.arc__caption strong {
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(24px, 2.6vw, 34px);
  line-height: 1;
}
.arc__caption span {
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.5;
}
.arc__more {
  margin-top: clamp(40px, 5vw, 64px);
  padding-top: clamp(24px, 3vw, 34px);
  border-top: 1px solid rgba(22, 32, 26, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.arc__more p {
  margin: 0;
  font-size: 14.5px;
  opacity: 0.6;
}
.arc__link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding-bottom: 6px;
  border-bottom: 1px solid currentColor;
}
.arc__link svg {
  transition: transform var(--t-mid) var(--ease-out);
}
.arc__link:hover svg {
  transform: translateX(6px);
}

@media (max-width: 820px) {
  .arc {
    height: auto;
  }
  .arc__stage {
    position: static;
    transform: none;
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 0 var(--gutter) 12px;
  }
  .arc__guide {
    display: none;
  }
  .tile,
  .arc__stage[data-reveal] .tile,
  .arc__stage[data-reveal].is-in .tile,
  .arc__stage[data-reveal].is-in .tile:hover {
    position: static;
    margin: 0;
    transform: none;
    opacity: 1;
    width: 66vw;
    height: auto;
    flex: 0 0 auto;
    scroll-snap-align: center;
  }
  .tile__frame {
    height: 66vw;
  }
  .tile__meta {
    display: grid;
    gap: 3px;
    padding-top: 13px;
    text-align: left;
  }
  .tile__meta strong {
    font-family: var(--display);
    font-weight: 400;
    font-size: 19px;
  }
  .tile__meta em {
    font-style: normal;
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.5;
  }
  .arc__caption {
    display: none;
  }
}
</style>
