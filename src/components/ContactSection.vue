<script setup>
import LogoMark from './LogoMark.vue'
import { contact, socials } from '../data/site.js'
import { openBrief } from '../stores/ui.js'
</script>

<template>
  <section id="contact" class="cta section">
    <div class="cta__glow" aria-hidden="true"></div>

    <div class="shell cta__in">
      <LogoMark class="cta__mark" :size="64" ring data-reveal />

      <h2 class="cta__title" data-reveal style="--reveal-delay: 60ms">
        Növbəti qutunu<br /><em>birlikdə açaq</em>
      </h2>

      <p class="cta__lede" data-reveal style="--reveal-delay: 110ms">
        Üç addımlıq brief — ideyanı yazın, referans əlavə edin, qutunu yığın.
        Beş dəqiqədən az çəkir.
      </p>

      <div class="cta__acts" data-reveal style="--reveal-delay: 160ms">
        <button class="btn btn--solid" @click="openBrief">
          <span class="btn__dot"></span><span>Brief göndər</span>
        </button>
        <a class="cta__mail" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
      </div>

      <div class="cta__rows" data-reveal style="--reveal-delay: 210ms">
        <div>
          <span>Telefon</span>
          <a :href="`tel:${contact.phoneHref}`">{{ contact.phone }}</a>
        </div>
        <div>
          <span>Atelye</span>
          <span class="cta__static">{{ contact.address }}</span>
        </div>
        <div>
          <span>İş saatları</span>
          <span class="cta__static">{{ contact.hours }}</span>
        </div>
      </div>

      <ul class="cta__social" data-reveal style="--reveal-delay: 260ms">
        <li v-for="s in socials" :key="s.id">
          <a :href="s.href" target="_blank" rel="noopener">{{ s.label }}</a>
        </li>
      </ul>
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
  /* footer carries its own top padding — don't stack two full gaps */
  padding-bottom: clamp(60px, 7vw, 96px);
}
.cta__glow {
  position: absolute;
  width: 80vw;
  height: 80vw;
  left: 50%;
  top: 46%;
  translate: -50% -50%;
  background: radial-gradient(circle, rgba(88, 130, 104, 0.26), transparent 62%);
}

.cta__in {
  position: relative;
  display: grid;
  justify-items: center;
}
.cta__mark {
  opacity: 0.8;
  margin-bottom: 30px;
}
.cta__title {
  font-size: clamp(38px, 6.6vw, 94px);
}
.cta__title em {
  font-style: italic;
  opacity: 0.55;
}
.cta__lede {
  margin: 24px 0 0;
  max-width: 44ch;
  font-size: 15.5px;
  line-height: 1.75;
  opacity: 0.6;
}

.cta__acts {
  margin-top: clamp(32px, 4vw, 46px);
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  justify-content: center;
}
.cta__mail {
  font-size: 15px;
  letter-spacing: 0.06em;
  opacity: 0.7;
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
  transition:
    opacity var(--t-fast) ease,
    border-color var(--t-fast) ease;
}
.cta__mail:hover {
  opacity: 1;
  border-color: currentColor;
}

.cta__rows {
  margin-top: clamp(50px, 7vw, 86px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(28px, 6vw, 80px);
  border-top: 1px solid rgba(242, 237, 227, 0.14);
  padding-top: 30px;
  width: min(100%, 860px);
}
.cta__rows div {
  display: grid;
  gap: 6px;
}
.cta__rows > div > span:first-child {
  font-size: 10.5px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  opacity: 0.42;
}
.cta__rows a,
.cta__static {
  font-size: 15px;
  border-bottom: 1px solid transparent;
  transition: border-color var(--t-fast) ease;
}
.cta__rows a:hover {
  border-color: currentColor;
}

.cta__social {
  list-style: none;
  margin: 30px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 24px;
}
.cta__social a {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.45;
  transition: opacity var(--t-fast) ease;
}
.cta__social a:hover {
  opacity: 1;
}
</style>
