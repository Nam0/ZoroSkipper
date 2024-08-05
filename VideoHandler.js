// VideoHandler.js (Iframe)

console.log('VideoHandler.js loaded');

const fullScreen = true;
const autoPlay = true;
const secondsToWait = 3;

// Helper function to wait for an element to appear
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

// Simulate key press
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

// Simulate click
const simulateClick = (element) => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  element.dispatchEvent(event);
  console.log('Simulated click');
};

// Start the script
const start = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000 * secondsToWait));

  try {
    // Update selector to find the video element
    const videoPlayer = await element('video.jw-video.jw-reset');
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

    videoPlayer.addEventListener('ended', () => {
      // Notify the parent window
      window.parent.postMessage({ type: 'VIDEO_ENDED' }, '*');
      console.log('Video ended, message sent to parent.');
    });

  } catch (error) {
    console.error('Script error:', error);
  }
};

start();
