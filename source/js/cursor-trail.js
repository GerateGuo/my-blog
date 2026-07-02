// ============================================
// 星光光标轨迹特效
// ============================================

(function() {
  const particlePool = [];
  const particleCount = 20;
  let mouseX = 0, mouseY = 0;
  let prevX = 0, prevY = 0;
  let lastSpawn = 0;

  // 创建粒子池
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 999999;
      opacity: 0;
      will-change: transform, opacity;
    `;
    document.body.appendChild(particle);
    particlePool.push({
      el: particle,
      x: 0, y: 0,
      vx: 0, vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      active: false
    });
  }

  function spawnParticle(x, y) {
    const p = particlePool.find(p => !p.active);
    if (!p) return;

    const size = Math.random() * 4 + 2;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 0.5;
    const life = Math.random() * 25 + 15;

    p.x = x + (Math.random() - 0.5) * 8;
    p.y = y + (Math.random() - 0.5) * 8;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.life = life;
    p.maxLife = life;
    p.size = size;
    p.active = true;

    // 随机颜色：白/蓝/金
    const colors = [
      'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)',
      'radial-gradient(circle, rgba(200,220,255,1) 0%, rgba(200,220,255,0) 70%)',
      'radial-gradient(circle, rgba(255,240,200,1) 0%, rgba(255,240,200,0) 70%)',
    ];

    p.el.style.width = size + 'px';
    p.el.style.height = size + 'px';
    p.el.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.el.style.borderRadius = '50%';
    p.el.style.boxShadow = `0 0 ${size * 2}px ${size}px rgba(255, 255, 255, 0.3)`;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = Date.now();
    const dx = mouseX - prevX;
    const dy = mouseY - prevY;
    const speed = Math.sqrt(dx * dx + dy * dy);

    if (now - lastSpawn > 30 && speed > 2) {
      const count = Math.min(Math.floor(speed / 10) + 1, 4);
      for (let i = 0; i < count; i++) {
        spawnParticle(mouseX, mouseY);
      }
      lastSpawn = now;
    }

    prevX = mouseX;
    prevY = mouseY;
  });

  function animate() {
    particlePool.forEach(p => {
      if (!p.active) return;

      p.life -= 1;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;

      const progress = 1 - p.life / p.maxLife;
      const fadeIn = Math.min(progress * 8, 1);
      const fadeOut = p.life < 10 ? p.life / 10 : 1;
      const opacity = fadeIn * fadeOut * 0.9;
      const scale = 0.5 + (1 - progress) * 0.5;

      if (p.life <= 0) {
        p.active = false;
        p.el.style.opacity = '0';
        return;
      }

      p.el.style.left = p.x + 'px';
      p.el.style.top = p.y + 'px';
      p.el.style.opacity = opacity;
      p.el.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });

    requestAnimationFrame(animate);
  }

  animate();
})();