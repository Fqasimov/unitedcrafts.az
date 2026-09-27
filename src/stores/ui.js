import { ref, watch } from 'vue'

export const briefOpen = ref(false)
export const catalogueOpen = ref(false)

export function openBrief() {
  catalogueOpen.value = false
  briefOpen.value = true
}

export function openCatalogue() {
  catalogueOpen.value = true
}

let lenis = null
export function registerLenis(instance) {
  lenis = instance
}

watch([briefOpen, catalogueOpen], ([a, b]) => {
  const locked = a || b
  document.body.classList.toggle('is-locked', locked)
  locked ? lenis?.stop() : lenis?.start()
})
