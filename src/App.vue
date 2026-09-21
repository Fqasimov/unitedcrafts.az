<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import Lenis from 'lenis'

import TheLoader from './components/TheLoader.vue'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import StudioSection from './components/StudioSection.vue'
import ArcGallery from './components/ArcGallery.vue'
import ProcessSection from './components/ProcessSection.vue'
import PartnersSection from './components/PartnersSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import WorkModal from './components/WorkModal.vue'
import { useReveal } from './composables/useReveal.js'

const loading = ref(true)
const ready = ref(false)
const opened = ref(null)
const main = ref(null)

let lenis

useReveal(main)

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  lenis = new Lenis({ duration: 1.15, smoothWheel: true })
  lenis.stop()

  const raf = (t) => {
    lenis.raf(t)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
})

onBeforeUnmount(() => lenis?.destroy())

function onLoaded() {
  loading.value = false
  lenis?.start()
  requestAnimationFrame(() => (ready.value = true))
}

watch(opened, async (v) => {
  if (v) lenis?.stop()
  else {
    lenis?.start()
    await nextTick()
  }
})
</script>

<template>
  <TheLoader v-if="loading" @done="onLoaded" />

  <SiteHeader />

  <main ref="main">
    <HeroSection :ready="ready" />
    <StudioSection />
    <ArcGallery @open="opened = $event" />
    <ProcessSection />
    <PartnersSection />
    <ContactSection />
  </main>

  <SiteFooter />

  <Teleport to="body">
    <WorkModal v-if="opened" :payload="opened" @close="opened = null" />
  </Teleport>
</template>
