<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import LogoMark from './LogoMark.vue'

const links = [
  { label: 'Studiya', href: '#studio' },
  { label: 'İşlər', href: '#works' },
  { label: 'Proses', href: '#process' },
  { label: 'Partnyorlar', href: '#partners' }
]

const tucked = ref(false)
const solid = ref(false)
const open = ref(false)
let last = 0

function onScroll() {
  const y = window.scrollY
  tucked.value = y > 120 && y > last
  solid.value = y > window.innerHeight * 0.75
  last = y
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function go(href) {
  open.value = false
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header
    class="hdr"
    :class="{ 'hdr--tucked': tucked, 'hdr--open': open, 'hdr--solid': solid }"
  >
    <div class="hdr__in shell">
      <a class="hdr__brand" href="#top" @click.prevent="go('#top')">
        <LogoMark :size="34" />
        <span>the united crafts</span>
      </a>

      <nav class="hdr__nav">
        <a v-for="l in links" :key="l.href" :href="l.href" @click.prevent="go(l.href)">
          <span>{{ l.label }}</span>
        </a>
      </nav>

      <a class="hdr__cta" href="#contact" @click.prevent="go('#contact')">
        <span>Brief göndər</span>
      </a>

      <button
        class="hdr__burger"
        :aria-expanded="open"
        aria-label="Menyu"
        @click="open = !open"
      >
        <i></i><i></i>
      </button>
    </div>

    <div class="hdr__sheet">
      <a v-for="l in links" :key="l.href" :href="l.href" @click.prevent="go(l.href)">{{
        l.label
      }}</a>
      <a href="#contact" @click.prevent="go('#contact')">Brief göndər</a>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  color: var(--bone);
  transition:
    transform 0.6s var(--ease-out),
    background-color 0.6s ease;
}
.hdr--tucked {
  transform: translateY(-104%);
}
.hdr--open {
  transform: none;
}
.hdr--solid {
  background: rgba(22, 32, 26, 0.92);
  backdrop-filter: blur(10px);
}

.hdr__in {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 26px 0;
  transition: padding 0.6s var(--ease-out);
}
.hdr--solid .hdr__in {
  padding: 16px 0;
}

.hdr__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--display);
  font-size: 17px;
  letter-spacing: 0.13em;
  margin-right: auto;
}

.hdr__nav {
  display: flex;
  gap: 34px;
  font-size: 12.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.hdr__nav a span {
  position: relative;
  display: inline-block;
  padding-bottom: 3px;
}
.hdr__nav a span::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.55s var(--ease-out);
}
.hdr__nav a:hover span::after {
  transform: scaleX(1);
  transform-origin: left;
}

.hdr__cta {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border: 1px solid currentColor;
  border-radius: 100px;
  padding: 11px 22px;
  overflow: hidden;
  position: relative;
  transition: color 0.45s var(--ease-out);
}
.hdr__cta span {
  position: relative;
  z-index: 1;
}
.hdr__cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  transform: translateY(101%);
  transition: transform 0.5s var(--ease-out);
}
.hdr__cta:hover::before {
  transform: none;
}
.hdr__cta:hover {
  color: var(--forest-deep);
}

.hdr__burger {
  display: none;
  width: 34px;
  height: 20px;
  position: relative;
}
.hdr__burger i {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: currentColor;
  transition: transform 0.45s var(--ease-out);
}
.hdr__burger i:first-child {
  top: 6px;
}
.hdr__burger i:last-child {
  top: 13px;
}
.hdr--open .hdr__burger i:first-child {
  transform: translateY(3.5px) rotate(45deg);
}
.hdr--open .hdr__burger i:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

.hdr__sheet {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: var(--forest-deep);
  padding: 8px var(--gutter) 34px;
  font-family: var(--display);
  font-size: 30px;
}

@media (max-width: 900px) {
  .hdr {
    background: transparent;
  }
  .hdr--open {
    background: var(--forest-deep);
  }
  .hdr__nav,
  .hdr__cta {
    display: none;
  }
  .hdr__burger {
    display: block;
  }
  .hdr__sheet {
    display: flex;
    max-height: 0;
    overflow: hidden;
    padding-block: 0;
    transition:
      max-height 0.6s var(--ease-out),
      padding 0.6s var(--ease-out);
  }
  .hdr--open .hdr__sheet {
    max-height: 60vh;
    padding-block: 8px 34px;
  }
}
</style>
