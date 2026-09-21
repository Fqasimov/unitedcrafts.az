<template>
  <footer class="ftr">
    <div class="shell ftr__in">
      <span>© {{ new Date().getFullYear() }} The United Crafts · ESTD. 2017</span>
      <span class="ftr__mid">Bakı, Azərbaycan</span>
      <a href="#top">Yuxarı ↑</a>
    </div>
  </footer>
</template>

<style scoped>
.ftr {
  background: var(--forest-ink);
  color: var(--bone);
  border-top: 1px solid rgba(242, 237, 227, 0.12);
}
.ftr__in {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 28px 0;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.55;
}
.ftr__in a:hover {
  opacity: 1;
}
@media (max-width: 640px) {
  .ftr__mid {
    display: none;
  }
}
</style>
