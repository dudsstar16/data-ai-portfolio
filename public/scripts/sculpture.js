export function mountSculpture(canvas) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 769px) and (pointer: fine)");
  const context = canvas.getContext("2d");
  if (!context) return;
  const frame = canvas.parentElement;
  const hero = canvas.closest("header");
  const colors = ["#ae4b24", "#638075", "#a06653"];
  const heights = [2, 4, 3, 6, 5, 8, 7];
  const points = heights.flatMap((height, column) => Array.from({ length: height * 5 }, (_, index) => {
    const n = column * 53 + index + 1;
    return {
      from: [Math.sin(n * 12.3) * 0.98, Math.cos(n * 8.4) * 0.91, Math.sin(n * 3.7) * 0.92],
      to: [(column - 3) * 0.28 + (index % 5 - 2) * 0.039, 0.71 - Math.floor(index / 5) * 0.19, (index % 5 - 2) * 0.055],
      color: colors[column % colors.length]
    };
  }));
  let pointerX = 0;
  let pointerY = 0;
  let within = false;
  let animation = 0;

  function render() {
    animation = 0;
    if (!within || reducedMotion.matches || !desktop.matches) {
      canvas.hidden = true;
      return;
    }
    const { width, height } = frame.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const pixels = [Math.round(width * ratio), Math.round(height * ratio)];
    if (canvas.width !== pixels[0] || canvas.height !== pixels[1]) [canvas.width, canvas.height] = pixels;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const scrollProgress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / 220));
    const progress = Math.min(1, 0.34 + scrollProgress * 0.66 + Math.abs(pointerX) * 0.66);
    const angle = -0.24 + pointerX * 0.52;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const size = Math.min(width, height) * 0.39;
    const projected = points.map(({ from, to, color }) => {
      const [x, y, z] = from.map((value, index) => value + (to[index] - value) * progress);
      const depth = x * sine + z * cosine;
      const scale = 2.8 / (2.8 + depth);
      return { x: (x * cosine - z * sine) * scale, y: (y + depth * pointerY * 0.3) * scale, depth, scale, color };
    }).sort((a, b) => b.depth - a.depth);
    for (const point of projected) {
      context.beginPath();
      context.fillStyle = point.color;
      context.globalAlpha = Math.min(1, 0.65 * point.scale);
      context.arc(width / 2 + point.x * size, height / 2 + point.y * size, Math.max(2, size * 0.032) * point.scale, 0, Math.PI * 2);
      context.fill();
    }
    canvas.hidden = false;
  }

  function schedule() {
    if (!animation) animation = requestAnimationFrame(render);
  }
  frame.addEventListener("pointermove", event => {
    const bounds = frame.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    schedule();
  });
  frame.addEventListener("pointerleave", () => { pointerX = pointerY = 0; schedule(); });
  window.addEventListener("scroll", () => { if (within) schedule(); }, { passive: true });
  reducedMotion.addEventListener("change", schedule);
  desktop.addEventListener("change", schedule);
  new ResizeObserver(schedule).observe(frame);
  new IntersectionObserver(([entry]) => { within = entry.isIntersecting; schedule(); }).observe(frame);
}
