<script setup>
defineProps({
  size: { type: [Number, String], default: 44 },
  ring: { type: Boolean, default: false },
  estd: { type: Boolean, default: false }
})
</script>

<template>
  <svg
    class="mark"
    :width="size"
    :height="size"
    viewBox="0 0 120 120"
    fill="none"
    aria-hidden="true"
  >
    <circle
      v-if="ring"
      class="mark__ring"
      cx="60"
      cy="60"
      r="54"
      stroke="currentColor"
      stroke-width="1.2"
      opacity="0.55"
    />
    <path
      class="mark__arc"
      d="M 82.63 37.37 A 32 32 0 1 0 87.71 76"
      stroke="currentColor"
      stroke-width="10.5"
      stroke-linecap="butt"
    />
    <path
      class="mark__square"
      d="M 89.9 49.2 H 99.9 V 65.2 H 83.9 V 55.2 A 6 6 0 0 1 89.9 49.2 Z"
      fill="currentColor"
    />
    <g v-if="estd" class="mark__estd">
      <defs>
        <path id="estdArc" d="M 60 21 A 39 39 0 0 1 99 60" />
      </defs>
      <text fill="currentColor" font-size="8.4" letter-spacing="1.1">
        <textPath href="#estdArc" startOffset="6%">ESTD. 2017</textPath>
      </text>
    </g>
  </svg>
</template>

<style scoped>
.mark {
  display: block;
  overflow: visible;
}
.mark__estd text {
  font-family: var(--body);
}
</style>
