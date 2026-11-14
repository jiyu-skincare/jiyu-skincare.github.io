/* 肌·癒官網共用動態　最後更新 2026-11-15
   1) 區塊進場：瀏覽器不支援 CSS 捲動動畫時（Safari 18 以前、舊版 iOS），改用這裡補上
   2) 導覽列：首頁最上方透明，往下捲才出現深色底
   3) 門口開場：依捲動進度開門、推進（所有瀏覽器都走這裡）
   使用者設定「減少動態效果」時，全部不啟用，內容照常顯示。 */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nativeTimeline = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
  var root = document.documentElement;
  var scene = document.querySelector('.door-scene');
  var nav = document.querySelector('nav.nav-fade');

  if (!reduce && !nativeTimeline && 'IntersectionObserver' in window) {
    root.classList.add('js-rv');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  }

  var useDoor = scene && !reduce;
  var useNav = nav && (useDoor || !nativeTimeline);
  if (!useDoor && !useNav) return;
  if (useNav) root.classList.add('js-nav');
  if (useDoor) scene.classList.add('door-on');

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(p, a, b) { return clamp((p - a) / (b - a)); }
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset, vh = window.innerHeight;
    if (useDoor) {
      var span = scene.offsetHeight - vh;
      var p = span > 0 ? clamp((y - scene.offsetTop) / span) : 0;
      var push = seg(p, 0.36, 0.86);
      var s = scene.style;
      s.setProperty('--p', p.toFixed(4));
      s.setProperty('--open', seg(p, 0.05, 0.46).toFixed(4));
      s.setProperty('--push', (push * push).toFixed(4));
      s.setProperty('--light', seg(p, 0.08, 0.84).toFixed(4));
      s.setProperty('--copy', seg(p, 0.02, 0.22).toFixed(4));
      s.setProperty('--end', seg(p, 0.84, 0.97).toFixed(4));
      if (nav) nav.classList.toggle('solid', p > 0.93);
    } else if (useNav) {
      nav.classList.toggle('solid', y > vh * 0.7);
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
