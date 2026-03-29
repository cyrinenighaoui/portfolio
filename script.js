// ================================================
// CYRINE NIGHAOUI — PORTFOLIO SCRIPT
// ================================================

// --- Custom Cursor ---
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  rx += (mx - rx) * 0.12;     ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// --- Mobile Menu ---
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.querySelector('.hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

// --- Typewriter ---
const words = ['AI Engineer', 'CS Student', 'ML Enthusiast', 'Full-Stack Developer', 'Future Innovator'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  if (!tw) return;
  const word = words[wi];
  if (!deleting) {
    tw.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 2000); return; }
    setTimeout(type, 80);
  } else {
    tw.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 400); return; }
    setTimeout(type, 40);
  }
}
type();

// --- Scroll Reveal ---
const revealEls = document.querySelectorAll(
  '.sec-header, .about-text, .about-cards, .info-card, .skill-block, .proj-item, .contact-left, .contact-right, .contact-item, .stat-card'
);
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => io.observe(el));

// --- Active nav link on scroll ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--text)' : '';
  });
});


// ================================================
// NEURAL NETWORK ANIMATION
// ================================================
const canvas = document.getElementById('nn-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const COLORS = ['#c9a84c', '#36d1dc', '#e8c97a', '#5ce1e6', '#a89fff'];
  const LAYERS = [3, 5, 6, 5, 3];
  let nodes = [], edges = [], activePulses = [], t = 0, lastPulse = 0;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    build();
  }

  function build() {
    nodes = []; edges = [];
    const W = canvas.width, H = canvas.height;
    const xs = LAYERS.map((_, i) => W * 0.1 + W * 0.8 * (i / (LAYERS.length - 1)));

    LAYERS.forEach((cnt, li) => {
      for (let ni = 0; ni < cnt; ni++) {
        nodes.push({
          x: xs[li],
          y: H / 2 + (ni - (cnt - 1) / 2) * (H / (cnt + 2.5)),
          r: li === 0 || li === LAYERS.length - 1 ? 5 : 4,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.5,
          color: COLORS[li % COLORS.length],
          fade: 0
        });
      }
    });

    let start = 0;
    for (let li = 0; li < LAYERS.length - 1; li++) {
      const next = start + LAYERS[li];
      for (let a = start; a < start + LAYERS[li]; a++)
        for (let b = next; b < next + LAYERS[li + 1]; b++)
          edges.push({ from: a, to: b, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.4 });
      start = next;
    }
  }

  function pulse() {
    const from = Math.floor(Math.random() * LAYERS[0]);
    const path = [from]; let cur = from;
    for (let li = 0; li < LAYERS.length - 1; li++) {
      const cands = edges.filter(e => e.from === cur);
      if (!cands.length) break;
      const e = cands[Math.floor(Math.random() * cands.length)];
      path.push(e.to); cur = e.to;
    }
    activePulses.push({ path, step: 0, prog: 0, spd: 0.02 + Math.random() * 0.015, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
  }

  function draw(ts) {
    if (ts - lastPulse > 800) { pulse(); lastPulse = ts; }
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Edges
    edges.forEach(e => {
      const a = nodes[e.from], b = nodes[e.to];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(201,168,76,${0.06 + 0.03 * Math.sin(t * e.speed + e.phase)})`;
      ctx.lineWidth = 0.6; ctx.stroke();
    });

    // Pulses
    activePulses = activePulses.filter(p => {
      p.prog += p.spd;
      if (p.prog >= 1) {
        if (p.step < p.path.length - 2) { p.step++; p.prog = 0; }
        else { nodes[p.path[p.path.length - 1]].fade = 1; return false; }
      }
      const A = nodes[p.path[p.step]], B = nodes[p.path[p.step + 1]];
      const px = A.x + (B.x - A.x) * p.prog, py = A.y + (B.y - A.y) * p.prog;

      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(px, py);
      ctx.strokeStyle = p.color + 'bb'; ctx.lineWidth = 1.2; ctx.stroke();

      const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
      g.addColorStop(0, p.color + '66'); g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
      return true;
    });

    // Nodes
    nodes.forEach(n => {
      const p = 0.5 + 0.5 * Math.sin(t * n.speed + n.phase);
      const r = n.r + p * 1.2;

      if (n.fade > 0) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
        g.addColorStop(0, n.color + Math.round(n.fade * 100).toString(16).padStart(2,'0'));
        g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        n.fade = Math.max(0, n.fade - 0.018);
      }

      const g2 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.5);
      g2.addColorStop(0, n.color + '33'); g2.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2); ctx.fillStyle = g2; ctx.fill();

      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      const g3 = ctx.createRadialGradient(n.x - r * 0.3, n.y - r * 0.3, 0, n.x, n.y, r);
      g3.addColorStop(0, '#ffffff88'); g3.addColorStop(1, n.color);
      ctx.fillStyle = g3; ctx.fill();

      ctx.beginPath(); ctx.arc(n.x, n.y, r + 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = n.color + '44'; ctx.lineWidth = 0.8; ctx.stroke();
    });

    t += 0.014;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}
