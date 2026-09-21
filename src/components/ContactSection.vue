<script setup>
import LogoMark from './LogoMark.vue'
</script>

<template>
  <section id="contact" class="cta section">
    <div class="cta__glow" aria-hidden="true"></div>

    <div class="shell cta__in">
      <LogoMark
        class="cta__mark drift"
        style="--drift-y: -16px; --drift-r: 6deg; --drift-time: 9s"
        :size="72"
        ring
        data-reveal
      />

      <h2 class="cta__title" data-reveal style="--reveal-delay: 80ms">
        Növbəti qutunu<br /><em>birlikdə açaq</em>
      </h2>

      <a class="cta__mail" href="mailto:salam@unitedcrafts.az" data-reveal style="--reveal-delay: 160ms">
        <span>salam@unitedcrafts.az</span>
      </a>

      <div class="cta__rows" data-reveal style="--reveal-delay: 220ms">
        <div>
          <span>Telefon</span>
          <a href="tel:+994000000000">+994 __ ___ __ __</a>
        </div>
        <div>
          <span>Instagram</span>
          <a href="https://instagram.com/theunitedcrafts" target="_blank" rel="noopener"
            >@theunitedcrafts</a
          >
        </div>
        <div>
          <span>Atelye</span>
          <a href="#">Bakı, Azərbaycan</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  background: var(--forest-ink);
  color: var(--bone);
  overflow: hidden;
  text-align: center;
}
.cta__glow {
  position: absolute;
  width: 78vw;
  height: 78vw;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  background: radial-gradient(circle, rgba(88, 130, 104, 0.3), transparent 62%);
  animation: pulse 12s ease-in-out infinite alternate;
}
@keyframes pulse {
  to {
    transform: scale(1.22);
    opacity: 0.6;
  }
}

.cta__in {
  position: relative;
  display: grid;
  justify-items: center;
}
.cta__mark {
  opacity: 0.85;
  margin-bottom: 34px;
}
.cta__title {
  font-size: clamp(40px, 7.4vw, 104px);
}
.cta__title em {
  font-style: italic;
  opacity: 0.55;
}

.cta__mail {
  margin-top: clamp(34px, 5vw, 56px);
  font-size: clamp(16px, 2vw, 22px);
  letter-spacing: 0.08em;
  position: relative;
  overflow: hidden;
  display: inline-block;
  padding-bottom: 8px;
}
.cta__mail::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0.999);
  transform-origin: right;
  transition: transform 0.6s var(--ease-out);
}
.cta__mail:hover::after {
  transform: scaleX(0);
}

.cta__rows {
  margin-top: clamp(56px, 8vw, 96px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(28px, 6vw, 86px);
  border-top: 1px solid rgba(242, 237, 227, 0.14);
  padding-top: 32px;
  width: min(100%, 900px);
}
.cta__rows div {
  display: grid;
  gap: 6px;
}
.cta__rows span {
  font-size: 10.5px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  opacity: 0.45;
}
.cta__rows a {
  font-size: 15px;
  border-bottom: 1px solid transparent;
  transition: border-color 0.4s ease;
}
.cta__rows a:hover {
  border-color: currentColor;
}
</style>
