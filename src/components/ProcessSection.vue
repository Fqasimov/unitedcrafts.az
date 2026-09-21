<script setup>
const steps = [
  {
    n: '01',
    t: 'Brief',
    d: 'Kimə gedir, hansı büdcə, hansı tarix. Bir səhifəlik cavabla başlayırıq.'
  },
  {
    n: '02',
    t: 'Konsepsiya',
    d: 'Materiallar, kəsim sxemi və 3D maket. İki istiqamət təqdim edirik.'
  },
  {
    n: '03',
    t: 'Nümunə',
    d: 'Bir ədəd real dəst yığılır. Rəngi, ağırlığı, açılma səsi — hamısı əldə yoxlanır.'
  },
  {
    n: '04',
    t: 'İstehsal',
    d: 'Çap, frez, əl boyaması və yığım. Hər qutu ayrıca nəzərdən keçirilir.'
  },
  {
    n: '05',
    t: 'Çatdırılma',
    d: 'Ünvan siyahısı üzrə paylanma və ya tək nöqtəyə təhvil.'
  }
]
</script>

<template>
  <section id="process" class="proc section">
    <div class="shell">
      <div class="proc__head">
        <p class="eyebrow" data-reveal>Necə işləyirik</p>
        <h2 class="proc__title" data-reveal style="--reveal-delay: 60ms">
          Briefdən <em>qapıya</em> qədər beş addım
        </h2>
      </div>

      <ol class="proc__list">
        <li
          v-for="(s, i) in steps"
          :key="s.n"
          data-reveal
          :style="{ '--reveal-delay': i * 70 + 'ms' }"
        >
          <span class="proc__n">{{ s.n }}</span>
          <h3 class="proc__t">{{ s.t }}</h3>
          <p class="proc__d">{{ s.d }}</p>
          <span class="proc__rule"></span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.proc {
  background: var(--forest-deep);
  color: var(--bone);
}
.proc__head {
  display: grid;
  gap: 0;
  max-width: 16ch;
}
.proc__title {
  font-size: clamp(32px, 4.4vw, 62px);
}
.proc__title em {
  font-style: italic;
  opacity: 0.55;
}

.proc__list {
  list-style: none;
  margin: clamp(50px, 7vw, 90px) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
}
.proc__list li {
  position: relative;
  padding: 30px 26px 40px 0;
  border-top: 1px solid rgba(242, 237, 227, 0.16);
}
.proc__n {
  font-size: 11px;
  letter-spacing: 0.24em;
  opacity: 0.45;
}
.proc__t {
  font-size: 26px;
  margin: 14px 0 12px;
}
.proc__d {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.7;
  opacity: 0.6;
}
.proc__rule {
  position: absolute;
  top: -1px;
  left: 0;
  height: 1px;
  width: 100%;
  background: var(--brass);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.9s var(--ease-out);
}
.proc__list li.is-in .proc__rule {
  transform: scaleX(1);
  transition-delay: calc(var(--reveal-delay) + 200ms);
}

@media (max-width: 1000px) {
  .proc__list {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 34px;
  }
}
@media (max-width: 600px) {
  .proc__list {
    grid-template-columns: 1fr;
  }
}
</style>
