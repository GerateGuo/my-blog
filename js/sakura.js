// ============================================
// 樱花飘落特效
// ============================================

(function() {
  const petalCount = 35;
  const container = document.createElement('div');
  container.className = 'sakura-container';
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'sakura-petal';
    
    const size = Math.random() * 12 + 8;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 8 + 8;
    const delay = Math.random() * 5;
    const sway = Math.random() * 100 + 50;
    const rotate = Math.random() * 360;
    const opacity = Math.random() * 0.5 + 0.3;
    
    petal.style.cssText = `
      position: absolute;
      top: -20px;
      left: ${startX}px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(ellipse at center, #ffb7c5 0%, #ff8fab 50%, #ff6b8a 100%);
      border-radius: 50% 0 50% 0;
      opacity: ${opacity};
      animation: sakuraFall ${duration}s linear ${delay}s infinite;
      --sway: ${sway}px;
      --rotate: ${rotate}deg;
      transform: rotate(${rotate}deg);
      filter: blur(0.5px);
      box-shadow: 0 0 6px rgba(255, 183, 197, 0.4);
    `;
    
    container.appendChild(petal);
    return petal;
  }

  // 添加关键帧动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sakuraFall {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) translateX(var(--sway)) rotate(720deg) scale(0.5);
        opacity: 0;
      }
    }
    
    .sakura-petal:nth-child(odd) {
      animation-name: sakuraFallAlt !important;
    }
    
    @keyframes sakuraFallAlt {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) translateX(calc(var(--sway) * -1)) rotate(-720deg) scale(0.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // 创建樱花花瓣
  for (let i = 0; i < petalCount; i++) {
    createPetal();
  }

  // 点击时产生额外花瓣
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
      const petal = createPetal();
      petal.style.left = e.clientX + 'px';
      petal.style.top = e.clientY + 'px';
      petal.style.animationDuration = '3s';
      petal.style.animationDelay = '0s';
      setTimeout(() => petal.remove(), 3000);
    }
  });
})();