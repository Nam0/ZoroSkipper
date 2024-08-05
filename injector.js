// injector.js

const injectScript = (file, node) => {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', browser.runtime.getURL(file));
  th.appendChild(s);
};

injectScript('ZoroSkipper.js', 'body');
