/* global hexo */

hexo.extend.filter.register('after_render:html', function(data) {
  // 注入自定义 CSS
  const cssTag = '<link rel="stylesheet" href="/css/liquid-glass.css">';
  if (!data.includes('liquid-glass.css')) {
    data = data.replace('</head>', cssTag + '\n</head>');
  }

  // 注入自定义 JS
  const jsTag = '<script src="/js/cursor-trail.js"></script>';
  if (!data.includes('cursor-trail.js')) {
    data = data.replace('</body>', jsTag + '\n</body>');
  }

  return data;
}, 1);