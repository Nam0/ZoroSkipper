//ZoroSkipper.js
console.log('ZoroSkipper.js loaded');
console.log('Current URL:', window.location.href);

// Retrieve configuration values
const getConfigMsg = () => {
    return new Promise((resolve) => {
        browser.runtime.sendMessage({
            type: 'getConfig'
        }, response => {
            resolve(response);
        });
    });
};

// Helper function to wait for an element to appear
const waitForElement = (selector, context = document) => {
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

// Simulate Click
const simulateClick = (element) => {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(event);
    console.log('Simulated click');
};

// Resize the iframe for fake fullscreen
const resizeIframe = (iframeId) => {
    const header = document.getElementById('header');
    if (header) {
        header.style.position = 'static';
        header.style.zIndex = 'auto';
        console.log('Header positioning reset.');
    }
    const Mobmenu = document.getElementById('mobile_menu');
    if (Mobmenu) {
        Mobmenu.style.zIndex = 0;
    }
    const iframe = document.getElementById(iframeId);
    if (iframe) {
        iframe.style.position = 'fixed';
        iframe.style.zIndex = '999';
        console.log('Iframe resized to pseudo-fullscreen.');
    } else {
        console.log(`No iframe with ID "${iframeId}" found.`);
    }
};

// Start the script
const start = async () => {
    const {
        fullScreen,
        autoPlay,
        secondsToWait,
        iframeId,
        videoPlayer
    } = await getConfigMsg();

    await new Promise(resolve => setTimeout(resolve, 1000 * secondsToWait));

    if (fullScreen) {
        if (window.frameElement === null) {
            resizeIframe(iframeId);
        }
    }

    try {
        const videoPlayerElement = await waitForElement(videoPlayer);
        console.log(videoPlayerElement);
        console.log('Found video player:', videoPlayerElement);

        if (autoPlay) {
            videoPlayerElement.focus();
            simulateKeyPress(' ', videoPlayerElement);
            console.log('Auto-play triggered.');
        }

        videoPlayerElement.addEventListener('ended', () => {
            window.parent.postMessage({
                type: 'VIDEO_ENDED'
            }, '*');
            console.log('Video ended, message sent to parent.');
        });

    } catch (error) {
        console.error('Script error:', error);
    }
};

window.addEventListener('message', async (event) => {
    const {
        iframepage,
        nextButton
    } = await getConfigMsg();
    if (event.origin !== new URL(iframepage).origin) {
        return;
    }

    if (event.data.type === 'VIDEO_ENDED') {
        try {
            const nextBtn = document.querySelector(nextButton);
            if (nextBtn) {
                simulateClick(nextBtn);
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