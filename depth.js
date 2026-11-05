// 서브 페이지 뎁스 연출: 섹션 고스트 번호, 스크롤 패럴랙스 층, 카드 3D 틸트 (데스크톱·움직임 허용 시에만)
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  // 1) 섹션마다 큰 고스트 번호 (배경 깊이 레이어)
  var secs = document.querySelectorAll('main > section, .pg-sec, .feat');
  var n = 0, seen = [];
  Array.prototype.forEach.call(secs, function (s) {
    if (seen.indexOf(s) !== -1 || s.classList.contains('marquee-wrap')) return;
    seen.push(s);
    n++;
    s.classList.add('depth-sec');
    var g = document.createElement('span');
    g.className = 'ghost-no';
    g.setAttribute('aria-hidden', 'true');
    g.setAttribute('data-depth', '0.12');
    g.textContent = (n < 10 ? '0' : '') + n;
    s.insertBefore(g, s.firstChild);
  });

  // 2) 패럴랙스 층: 히어로 제목은 느리게, 이미지는 조금 빠르게
  var layers = [];
  Array.prototype.forEach.call(document.querySelectorAll('.pg-h1, .mdm-tagline h1, .pg-lead'), function (el) { el.setAttribute('data-depth', '-0.08'); layers.push(el); });
  Array.prototype.forEach.call(document.querySelectorAll('.pg-hero-img, .mdm-hero video'), function (el) { el.setAttribute('data-depth', '0.05'); });
  layers = layers.concat(Array.prototype.slice.call(document.querySelectorAll('[data-depth]')));

  function parallax() {
    if (reduce) return;
    var y = window.scrollY;
    Array.prototype.forEach.call(document.querySelectorAll('[data-depth]'), function (el) {
      var d = parseFloat(el.getAttribute('data-depth')) || 0;
      if (el.classList.contains('ghost-no')) {
        var top = el.parentElement.getBoundingClientRect().top + window.scrollY;
        el.style.transform = 'translate3d(0,' + ((y - top) * d).toFixed(1) + 'px,0)';
      } else if (el.matches('.pg-hero-img,.mdm-hero video')) {
        // 히어로 배경은 motion.js가 담당
      } else {
        el.style.transform = 'translate3d(0,' + (y * d).toFixed(1) + 'px,0)';
      }
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { parallax(); ticking = false; }); }
  }, { passive: true });
  parallax();

  // 3) 카드 3D 틸트 (마우스 위치 기준, 데스크톱)
  if (!reduce && fine) {
    var sel = '.cult,.benefit,.value,.scope,.case,.fcard,.feat-cards > *,.office-grid img,.phone';
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' + (-py * 7).toFixed(2) + 'deg) translateZ(0)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }
})();
