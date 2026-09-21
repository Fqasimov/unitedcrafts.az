import { onMounted, onBeforeUnmount } from 'vue'

export function useReveal(rootRef) {
  let observer

  onMounted(() => {
    const root = rootRef?.value ?? document.body
    const targets = root.querySelectorAll('[data-reveal]')
    if (!targets.length) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    )

    targets.forEach((el) => observer.observe(el))
  })

  onBeforeUnmount(() => observer?.disconnect())
}
