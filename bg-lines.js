// 배경 선 그래픽 (서브 페이지용): 스크롤 진행에 따라 커졌다 줄고, 마우스 방향으로 살짝 기울어짐
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
    mx += (mxT - mx) * 0.05; my += (myT - my) * 0.05;
    var breathe = 0.5 + 0.5 * Math.sin(time * 0.6);
    var size = 0.78 + 0.42 * (0.5 + 0.5 * Math.sin(cur * Math.PI * 2.4)) + 0.06 * breathe;
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
