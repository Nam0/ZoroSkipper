// background.js

browser.webNavigation.onCompleted.addListener(details => {
  browser.tabs.executeScript(details.tabId, {
    file: 'ZoroSkipper.js',
    allFrames: true
  });
}, {
  url: [
    { urlMatches: 'https://w2.zoro.se/anime-watch/*' },
    { urlMatches: 'https://embtaku.pro/*' }
  ]
});
