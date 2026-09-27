<script setup>
import LogoMark from './LogoMark.vue'
import { contact, socials, services } from '../data/site.js'
import { openBrief, openCatalogue } from '../stores/ui.js'

const nav = [
  { label: 'Studiya', href: '#studio' },
  { label: 'İşlər', href: '#works' },
  { label: 'Proses', href: '#process' },
  { label: 'Partnyorlar', href: '#partners' }
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="ftr">
    <div class="shell">
      <div class="ftr__grid">
        <div class="ftr__brand">
          <LogoMark :size="46" ring />
          <p class="ftr__word">the united crafts</p>
          <p class="ftr__blurb">
            Bakıda kiçik bir atelye. 2017-ci ildən korporativ hədiyyə dəstləri,
            qablaşdırma və əl işi taxta məmulatlar hazırlayırıq.
          </p>
          <button class="btn" @click="openBrief">
            <span class="btn__dot"></span><span>Brief göndər</span>
          </button>
        </div>

        <nav class="ftr__col" aria-label="Səhifə">
          <h3>Səhifə</h3>
          <ul>
            <li v-for="l in nav" :key="l.href"><a :href="l.href">{{ l.label }}</a></li>
            <li><button @click="openCatalogue">Tam kataloq</button></li>
          </ul>
        </nav>

        <div class="ftr__col">
          <h3>Xidmətlər</h3>
          <ul>
            <li v-for="s in services" :key="s"><span>{{ s }}</span></li>
          </ul>
        </div>

        <div class="ftr__col">
          <h3>Sosial</h3>
          <ul>
            <li v-for="s in socials" :key="s.id">
              <a :href="s.href" target="_blank" rel="noopener">
                {{ s.label }} <em>{{ s.handle }}</em>
              </a>
            </li>
          </ul>
        </div>

        <div class="ftr__col ftr__col--contact">
          <h3>Əlaqə</h3>
          <ul>
            <li><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></li>
            <li><a :href="`tel:${contact.phoneHref}`">{{ contact.phone }}</a></li>
            <li><span>{{ contact.address }}</span></li>
            <li><span>{{ contact.hours }}</span></li>
          </ul>
        </div>
      </div>

      <div class="ftr__base">
        <span>© {{ year }} The United Crafts · ESTD. 2017</span>
        <span class="ftr__mid">Bütün hüquqlar qorunur</span>
        <a href="#top">Yuxarı ↑</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ftr {
  background: var(--forest-ink);
  color: var(--bone);
  padding-top: clamp(56px, 7vw, 92px);
}

.ftr__grid {
  display: grid;
  grid-template-columns: 1.6fr repeat(4, 1fr);
  gap: clamp(28px, 4vw, 54px);
  padding-bottom: clamp(44px, 6vw, 72px);
}

.ftr__brand {
  max-width: 34ch;
}
.ftr__word {
  font-family: var(--display);
  font-size: 22px;
  letter-spacing: 0.12em;
  margin: 18px 0 14px;
}
.ftr__blurb {
  margin: 0 0 26px;
  font-size: 14px;
  line-height: 1.75;
  opacity: 0.55;
}

.ftr__col h3 {
  font-family: var(--body);
  font-size: 10.5px;
  font-weight: 400;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.4;
  margin: 0 0 18px;
}
.ftr__col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 11px;
}
.ftr__col a,
.ftr__col span,
.ftr__col button {
  display: block;
  padding: 0;
  font-size: 14px;
  line-height: inherit;
  opacity: 0.72;
  transition: opacity var(--t-fast) ease;
  text-align: left;
}
.ftr__col a:hover,
.ftr__col button:hover {
  opacity: 1;
}
.ftr__col em {
  display: block;
  font-style: normal;
  font-size: 11px;
  letter-spacing: 0.14em;
  opacity: 0.45;
  margin-top: 2px;
}

.ftr__base {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 22px 0;
  border-top: 1px solid rgba(242, 237, 227, 0.12);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.45;
}
.ftr__base a:hover {
  opacity: 1;
}

@media (max-width: 1080px) {
  .ftr__grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .ftr__brand {
    grid-column: 1 / -1;
    max-width: 46ch;
  }
}
@media (max-width: 640px) {
  .ftr__grid {
    grid-template-columns: 1fr 1fr;
  }
  .ftr__mid {
    display: none;
  }
}
</style>
