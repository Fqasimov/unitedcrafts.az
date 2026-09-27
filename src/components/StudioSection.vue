<script setup>
const stats = [
  ['2017', 'Atelye açılıb'],
  ['140+', 'Tamamlanmış layihə'],
  ['38 000', 'Əl ilə yığılmış qutu']
]
</script>

<template>
  <section id="studio" class="studio section">
    <div class="shell studio__grid">
      <div class="studio__left">
        <p class="eyebrow" data-reveal>Studiya</p>
        <h2 class="studio__title" data-reveal style="--reveal-delay: 60ms">
          Kağız, ağac və<br /><em>səbir</em> ilə işləyirik.
        </h2>

        <div class="studio__copy">
          <p data-reveal style="--reveal-delay: 120ms">
            The United Crafts Bakıda kiçik bir emalatxanadır. Korporativ hədiyyə
            dəstlərini seriya kimi deyil, ayrı-ayrı obyektlər kimi qururuq: kəsimi
            özümüz çəkirik, ağacı özümüz frezləyirik, çərçivələri əl ilə boyayırıq.
          </p>
          <p data-reveal style="--reveal-delay: 180ms">
            Nəticə isə sadədir — qutu açılanda içindəki adam bir an dayanır. Bütün
            işimiz həmin bir anın üstündə qurulub.
          </p>
        </div>

        <div class="studio__stats">
          <div v-for="(s, i) in stats" :key="s[0]" data-reveal :style="{ '--reveal-delay': 220 + i * 80 + 'ms' }">
            <strong>{{ s[0] }}</strong>
            <span>{{ s[1] }}</span>
          </div>
        </div>
      </div>

      <div class="studio__right">
        <figure class="studio__shot studio__shot--big" data-reveal="mask">
          <img
            src="/works/azintelecom-detail.jpg"
            alt="Folqa ştamp detalı"
            loading="lazy"
          />
        </figure>
        <figure
          class="studio__shot studio__shot--small"
          data-reveal="mask"
          style="--reveal-delay: 160ms"
        >
          <img src="/works/meqa-frame.jpg" alt="Əl ilə boyanmış çərçivə" loading="lazy" />
        </figure>
        <span class="studio__tag" data-reveal>Atelye · Bakı</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.studio {
  background: var(--bone);
}
.studio__grid {
  display: grid;
  grid-template-columns: 1fr 0.92fr;
  gap: clamp(40px, 7vw, 110px);
  align-items: start;
}

.studio__title {
  font-size: clamp(34px, 5.4vw, 74px);
}
.studio__title em {
  font-style: italic;
  opacity: 0.5;
}

.studio__copy {
  margin-top: clamp(28px, 4vw, 46px);
  max-width: 46ch;
  display: grid;
  gap: 20px;
}
.studio__copy p {
  margin: 0;
  opacity: 0.78;
  font-size: 16px;
  line-height: 1.8;
}

.studio__stats {
  margin-top: clamp(40px, 6vw, 72px);
  display: flex;
  flex-wrap: wrap;
  gap: clamp(28px, 5vw, 64px);
  border-top: 1px solid rgba(22, 32, 26, 0.14);
  padding-top: 28px;
}
.studio__stats div {
  display: grid;
  gap: 4px;
}
.studio__stats strong {
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(30px, 3.4vw, 44px);
  line-height: 1;
}
.studio__stats span {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
}

.studio__right {
  position: relative;
  padding-bottom: 70px;
}
.studio__shot {
  margin: 0;
  overflow: hidden;
  background: var(--bone-warm);
}
.studio__shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.9s var(--ease-out);
}
.studio__shot:hover img {
  transform: scale(1.05);
}
.studio__shot--big {
  aspect-ratio: 4 / 5;
}
.studio__shot--small {
  position: absolute;
  right: -4%;
  bottom: 0;
  width: 52%;
  aspect-ratio: 1;
  box-shadow: 0 40px 70px -44px rgba(22, 32, 26, 0.7);
}
.studio__tag {
  position: absolute;
  left: 0;
  bottom: 18px;
  font-size: 11px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  opacity: 0.45;
  writing-mode: vertical-rl;
  bottom: 70px;
  left: -26px;
}

@media (max-width: 900px) {
  .studio__grid {
    grid-template-columns: 1fr;
  }
  .studio__tag {
    display: none;
  }
  .studio__shot--small {
    right: 0;
    width: 46%;
  }
}
</style>
