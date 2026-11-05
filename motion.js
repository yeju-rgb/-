// 서브 페이지 공통 모션: 상단 진행바, 섹션 리빌(살짝 올라오며 등장), 히어로 이미지 완만한 패럴랙스
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);

  var sel = ['.pg-h1', '.pg-lead', '.c-head', '.c-text', '.value', '.cult', '.benefit', '.office-grid img',
    '.scope', '.case-grid', '.feat-head', '.feat-cards', '.mdm-stats', '.mdm-tagline', '.mdm-meta', '.dl', '.phone-row',
    '.steps li', '.partner', '.process .label', '.benefit-list', '.cult-grid'];
  var els = Array.prototype.slice.call(document.querySelectorAll(sel.join(',')));
  var seen = [];
  els.forEach(function (el) {
    if (seen.indexOf(el) !== -1) return;
    seen.push(el);
    el.classList.add('rv');
    var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('rv') || sel.some(function (q) { return c.matches(q); }); }) : [el];
    var idx = sibs.indexOf(el);
    el.style.transitionDelay = Math.min(idx < 0 ? 0 : idx, 4) * 0.2 + 's';
  });

  if (reduce || !('IntersectionObserver' in window)) {
    seen.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    seen.forEach(function (el) { io.observe(el); });
  }

  var hero = document.querySelector('.pg-hero-img, .mdm-hero video');
  var ticking = false;
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.width = (p * 100).toFixed(2) + '%';
    if (hero && !reduce) {
      var y = Math.min(window.scrollY, window.innerHeight * 1.2);
      hero.style.transform = 'translate3d(0,' + (y * 0.05).toFixed(1) + 'px,0) scale(1.04)';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
})();
