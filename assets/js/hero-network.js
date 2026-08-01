// Static connection-dot network drawn behind the Home hero's ticket fan.
// Confined to the right half so it never sits under the headline text, and
// deliberately not animated (a moving element there read as noisy).
(function () {
  var canvas = document.querySelector(".hero-network");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var hero = canvas.closest(".hero");

  var nodes = [
    { x: 0.74, y: 0.46, hub: true },
    { x: 0.54, y: 0.14, hub: false }, { x: 0.58, y: 0.80, hub: false },
    { x: 0.68, y: 0.06, hub: false }, { x: 0.66, y: 0.92, hub: false },
    { x: 0.84, y: 0.10, hub: false }, { x: 0.88, y: 0.86, hub: false },
    { x: 0.97, y: 0.30, hub: false }, { x: 0.98, y: 0.66, hub: false },
  ];
  var links = [];
  nodes.forEach(function (n, i) { if (!n.hub) links.push([0, i]); });
  links.push([1, 3], [4, 6], [7, 8]);

  function draw() {
    var rect = hero.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    links.forEach(function (l) {
      var a = nodes[l[0]], b = nodes[l[1]];
      ctx.strokeStyle = "rgba(11,61,92,0.13)";
      ctx.lineWidth = 1.2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();
    });

    nodes.forEach(function (n) {
      var r = (n.hub ? 7 : 3.4) * devicePixelRatio;
      ctx.fillStyle = n.hub ? "rgba(11,61,92,0.85)" : "rgba(11,61,92,0.32)";
      ctx.beginPath();
      ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
      ctx.fill();
      if (n.hub) {
        ctx.strokeStyle = "rgba(11,61,92,0.25)";
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, r + 6 * devicePixelRatio, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  draw();
  window.addEventListener("resize", draw);
})();
