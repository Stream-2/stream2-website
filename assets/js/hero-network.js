// Animated connection network behind the Home hero's ticket fan: packets
// travel from the hub outward along each line, leaf nodes ping on a
// staggered cycle, and the hub itself breathes gently. Confined to the
// right half so it never sits under the headline text. Falls back to the
// plain static lines/nodes (no rAF loop at all) under prefers-reduced-motion.
(function () {
  var canvas = document.querySelector(".hero-network");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var hero = canvas.closest(".hero");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var nodes = [
    { x: 0.74, y: 0.46, hub: true },
    { x: 0.54, y: 0.14, hub: false }, { x: 0.58, y: 0.80, hub: false },
    { x: 0.68, y: 0.06, hub: false }, { x: 0.66, y: 0.92, hub: false },
    { x: 0.84, y: 0.10, hub: false }, { x: 0.88, y: 0.86, hub: false },
    { x: 0.97, y: 0.30, hub: false }, { x: 0.98, y: 0.66, hub: false },
  ];
  var links = [];
  nodes.forEach(function (n, i) { if (!n.hub) links.push({ from: 0, to: i, phase: i * 0.31, speed: 0.00022 + (i % 3) * 0.00004 }); });
  [[1, 3], [4, 6], [7, 8]].forEach(function (pair, i) {
    links.push({ from: pair[0], to: pair[1], phase: 0.5 + i * 0.4, speed: 0.00016 });
  });

  var w = 0, h = 0;
  function resize() {
    var rect = hero.getBoundingClientRect();
    w = canvas.width = rect.width * devicePixelRatio;
    h = canvas.height = rect.height * devicePixelRatio;
  }
  resize();
  window.addEventListener("resize", resize);

  function drawBase() {
    links.forEach(function (l) {
      var a = nodes[l.from], b = nodes[l.to];
      ctx.strokeStyle = "rgba(11,61,92,0.12)";
      ctx.lineWidth = 1.1 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();
    });
    nodes.forEach(function (n) {
      var r = (n.hub ? 7 : 3.4) * devicePixelRatio;
      ctx.fillStyle = n.hub ? "rgba(11,61,92,0.85)" : "rgba(11,61,92,0.34)";
      ctx.beginPath();
      ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (reduceMotion) {
    drawBase();
    return;
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    drawBase();

    // packets travelling along each line, with a short fading tail
    links.forEach(function (l) {
      var a = nodes[l.from], b = nodes[l.to];
      var ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;
      var raw = (t * l.speed + l.phase) % 1;
      var p = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2; // ease-in-out
      for (var k = 0; k < 5; k++) {
        var pp = p - k * 0.018;
        if (pp < 0 || pp > 1) continue;
        var px = ax + (bx - ax) * pp, py = ay + (by - ay) * pp;
        var a2 = (1 - k / 5) * 0.85;
        ctx.fillStyle = "rgba(181,101,47," + a2 + ")";
        ctx.beginPath();
        ctx.arc(px, py, (2.6 - k * 0.35) * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // leaf nodes: a soft ring pings outward on a staggered cycle
    nodes.forEach(function (n, i) {
      if (n.hub) return;
      var cycle = 2600 + (i % 4) * 500;
      var local = ((t + i * 380) % cycle) / cycle;
      if (local > 0.55) return;
      var pulseP = local / 0.55;
      var r = ((n.hub ? 7 : 3.4) + pulseP * 16) * devicePixelRatio;
      ctx.strokeStyle = "rgba(11,61,92," + (0.32 * (1 - pulseP)) + ")";
      ctx.lineWidth = 1.4 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // hub: continuous slow breathing halo
    var hub = nodes[0];
    var breathe = 0.5 + 0.5 * Math.sin(t * 0.0012);
    ctx.strokeStyle = "rgba(11,61,92," + (0.14 + breathe * 0.14) + ")";
    ctx.lineWidth = 1.5 * devicePixelRatio;
    ctx.beginPath();
    ctx.arc(hub.x * w, hub.y * h, (9 + breathe * 5) * devicePixelRatio, 0, Math.PI * 2);
    ctx.stroke();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// Holographic hover on each booking ticket: tilts toward the cursor and
// tracks a glare highlight to the cursor position. Skipped under
// prefers-reduced-motion and on touch (no real hover there, and CSS
// :hover can stick after a tap).
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll(".hero-ticket").forEach(function (ticket) {
    var inner = ticket.querySelector(".ticket-inner");
    if (!inner) return;
    ticket.addEventListener("mousemove", function (e) {
      var r = inner.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      inner.style.setProperty("--hover-ry", `${(px - 0.5) * 22}deg`);
      inner.style.setProperty("--hover-rx", `${(py - 0.5) * -22}deg`);
      inner.style.setProperty("--glare-x", `${px * 100}%`);
      inner.style.setProperty("--glare-y", `${py * 100}%`);
    });
    ticket.addEventListener("mouseleave", function () {
      inner.style.setProperty("--hover-rx", "0deg");
      inner.style.setProperty("--hover-ry", "0deg");
    });
  });
})();
