// ZoroSkipper.js (inside the iframe)
console.log('ZoroSkipper.js loaded');

const fullScreen = true;
const autoPlay = true;
const secondsToWait = 3;

const start = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000 * secondsToWait));

  const element = (selector, context = document) => {
    return new Promise(resolve => {
      const ele = context.querySelector(selector);
      if (ele) {
        resolve(ele);
        return;
      }
      new MutationObserver((_, observer) => {
        const ele = context.querySelector(selector);
        if (ele) {
          resolve(ele);
          observer.disconnect();
        }
      }).observe(context, {
        childList: true,
        subtree: true
      });
    });
  };

  const simulateKeyPress = (key, element) => {
    const event = new KeyboardEvent('keydown', {
      key: key,
      keyCode: key.charCodeAt(0),
      code: `Key${key.toUpperCase()}`,
      which: key.charCodeAt(0),
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
    console.log(`Simulated key press '${key}'`);
  };

  try {
    const videoPlayer = await element('.jw-video');
    console.log('Found video player:', videoPlayer);

    if (autoPlay) {
      videoPlayer.focus();
      simulateKeyPress(' ', videoPlayer);
      console.log('Auto-play triggered.');
    }

    if (fullScreen) {
      try {
        await videoPlayer.requestFullscreen();
        console.log('Full-screen triggered.');
      } catch (err) {
        console.error('Fullscreen request failed:', err);
      }
    }

    if (videoPlayer) {
      videoPlayer.addEventListener('ended', () => {
        // Notify the parent window
        window.parent.postMessage({ type: 'VIDEO_ENDED' }, '*');
        console.log('Video ended, message sent to parent.');
      });
    }

  } catch (error) {
    console.error('Script error:', error);
  }
};

window.addEventListener('message', async (event) => {
  if (event.origin !== 'https://embtaku.pro') {
    return;
  }

  if (event.data.type === 'VIDEO_ENDED') {
    try {
      const nextBtn = document.querySelector('.btn-next');
      if (nextBtn) {
        nextBtn.click();
        console.log('Clicked next button.');
      } else {
        console.log('Next button not found.');
      }
    } catch (err) {
      console.error('Error during skip to next:', err);
    }
  }
});

start();
