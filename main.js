// 상단 영상: 끝의 흰 로고 화면(8.5초 이후)을 건너뛰고 앞부분만 반복
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('video[data-loop-end]'), function (v) {
    var loopEnd = parseFloat(v.getAttribute('data-loop-end')) || 0;
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    if (loopEnd > 0) {
      v.addEventListener('timeupdate', function () {
        if (v.currentTime >= loopEnd) { v.currentTime = 0; v.play().catch(function () {}); }
      });
    }
  });
})();

// 진입부: 01(영상) / 02(스틸) 전환
(function () {
  var entry = document.getElementById('entry');
  if (!entry) return;
  var dots = entry.querySelectorAll('.entry-index span');
  var cur = 1;
  function go(n) {
    cur = n < 1 ? 2 : n > 2 ? 1 : n;
    entry.classList.toggle('is-2', cur === 2);
    Array.prototype.forEach.call(dots, function (d) { d.classList.toggle('on', +d.getAttribute('data-i') === cur); });
  }
  Array.prototype.forEach.call(entry.querySelectorAll('.entry-arrow'), function (b) {
    b.addEventListener('click', function () { go(cur + (+b.getAttribute('data-dir'))); });
  });
  Array.prototype.forEach.call(dots, function (d) {
    d.addEventListener('click', function () { go(+d.getAttribute('data-i')); });
  });
})();

// 문의 폼: 서버 연결 전이라 전송하지 않고 입력 확인만 함
(function () {
  var f = document.getElementById('contactForm');
  var s = document.getElementById('formStatus');
  if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!f.checkValidity()) { s.textContent = '이름, 이메일, 문의 내용, 동의 항목을 확인해 주세요.'; return; }
    s.textContent = '시안 단계라 실제 전송은 연결되어 있지 않습니다.';
  });
})();

// OUR SERVICE 캐러셀: 계속 흐르고, 화살표로 한 칸씩, 호버 시 멈춤
(function () {
  var track = document.querySelector('.svc-track');
  if (!track) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x = 0, target = 0, paused = false, last = null, speed = 28; // px/s
  function setWidth() { return track.scrollWidth / 2 + 12; } // 1세트 폭 + gap 절반
  function step(ts) {
    if (last === null) last = ts;
    var dt = (ts - last) / 1000; last = ts;
    if (!paused && !reduce) target -= speed * dt;
    x += (target - x) * 0.12;
    var w = setWidth();
    if (x <= -w) { x += w; target += w; }
    if (x > 0) { x -= w; target -= w; }
    track.style.transform = 'translateX(' + x + 'px)';
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  track.addEventListener('mouseenter', function () { paused = true; });
  track.addEventListener('mouseleave', function () { paused = false; });
  Array.prototype.forEach.call(document.querySelectorAll('.sec-arrows button'), function (b) {
    b.addEventListener('click', function () {
      var card = track.firstElementChild.getBoundingClientRect().width + 24;
      target -= (+b.getAttribute('data-dir')) * card;
    });
  });
})();


// 스크롤 연동 배경 선 그래픽: 스크롤에 따라 커졌다 줄었다 (보간 + 잔잔한 호흡)
(function () {
  var cv = document.getElementById('bg-lines');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var N = 16, target = 0, cur = 0, time = 0;
  var mxT = 0, myT = 0, mx = 0, my = 0;
  window.addEventListener('pointermove', function (e) {
    mxT = (e.clientX / window.innerWidth) * 2 - 1;
    myT = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var breathe = 0.5 + 0.5 * Math.sin(time * 0.6);
    var size = 0.78 + 0.42 * (0.5 + 0.5 * Math.sin(cur * Math.PI * 2.4)) + 0.06 * breathe;
    mx += (mxT - mx) * 0.05; my += (myT - my) * 0.05;
    var cx = W * 0.5 + mx * W * 0.06, cy = H * 0.46 + my * H * 0.05;
    var base = Math.min(W, H) * 0.42 * size;
    for (var i = 0; i < N; i++) {
      var t = i / N;
      var rot = cur * Math.PI * 1.6 + t * Math.PI + time * 0.04 + mx * 0.18 * (0.5 + t);
      var rx = base * (0.55 + 0.55 * t) * (1 + 0.22 * Math.sin(cur * Math.PI * 2 + i));
      var ry = base * (0.18 + 0.12 * Math.cos(cur * Math.PI * 3 + i * 0.5 + time * 0.2));
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i % 5 === 0 ? 'rgba(47,217,255,' + (0.22 + 0.08 * breathe).toFixed(3) + ')' : 'rgba(255,255,255,' + (0.05 + 0.07 * (1 - t) + 0.02 * breathe).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }
  function loop() {
    target = progress();
    cur += (target - cur) * 0.06;
    time += reduce ? 0 : 0.012;
    draw();
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
})();


// 진입부 02: 세로 4칸. 올린 칸이 제자리에서 전체로 펼쳐지고, 영역을 벗어나면 4칸으로 복귀
(function () {
  var quads = document.querySelector('.quads');
  if (!quads) return;
  var cells = Array.prototype.filter.call(quads.children, function (c) { return c.classList.contains('quad'); });
  if (cells.length !== 4) return;
  function box(el, l, w) { el.style.left = l + '%'; el.style.top = '0%'; el.style.width = w + '%'; el.style.height = '100%'; }
  function rest() {
    cells.forEach(function (c, i) { c.classList.remove('is-on', 'is-band', 'is-top', 'is-bottom'); box(c, 25 * i, 25); c.style.zIndex = ''; });
    quads.classList.remove('is-open');
  }
  function open(i) {
    quads.classList.add('is-open');
    cells.forEach(function (c, k) {
      c.classList.toggle('is-on', k === i);
      c.classList.remove('is-band', 'is-top', 'is-bottom');
      if (k === i) { box(c, 0, 100); c.style.zIndex = '3'; }
      else { box(c, 25 * k, 25); c.style.zIndex = '1'; }
    });
  }
  cells.forEach(function (c, i) {
    c.addEventListener('pointerenter', function () { if (!c.classList.contains('is-on')) open(i); });
  });
  quads.addEventListener('pointerleave', rest);
  rest();
})();
