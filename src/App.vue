<script setup>
import { defineAsyncComponent, onMounted, onBeforeUnmount, ref, watch } from 'vue'
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
import { briefOpen, catalogueOpen, registerLenis } from './stores/ui.js'

/* the wizard pulls in three.js — keep it out of the first paint */
const BriefModal = defineAsyncComponent(() => import('./components/BriefModal.vue'))
const CatalogueOverlay = defineAsyncComponent(() =>
  import('./components/CatalogueOverlay.vue')
)

const loading = ref(true)
const ready = ref(false)
const opened = ref(null)
const main = ref(null)

let lenis

useReveal(main)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  lenis = new Lenis({ duration: 1.05, smoothWheel: true })
  lenis.stop()
  registerLenis(lenis)

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

watch(opened, (v) => {
  document.body.classList.toggle('is-locked', !!v)
  v ? lenis?.stop() : lenis?.start()
})

function fromCatalogue(payload) {
  catalogueOpen.value = false
  opened.value = payload
}
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
    <CatalogueOverlay
      v-if="catalogueOpen"
      @close="catalogueOpen = false"
      @open="fromCatalogue"
    />
    <BriefModal v-if="briefOpen" @close="briefOpen = false" />
  </Teleport>
</template>
