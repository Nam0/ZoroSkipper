// background.js

// Function to get configuration from storage
const getConfig = async () => {
    const result = await browser.storage.sync.get(['fullScreen', 'autoPlay', 'secondsToWait', 'iframeId', 'videoPlayer', 'iframepage', 'mainpage', 'nextButton']);
    return {
        mainpage: result.mainpage || 'https://w2.zoro.se/anime-watch/*',
        fullScreen: result.fullScreen !== undefined ? result.fullScreen : true,
        autoPlay: result.autoPlay !== undefined ? result.autoPlay : true,
        secondsToWait: result.secondsToWait !== undefined ? result.secondsToWait : 3,
        iframeId: result.iframeId || 'iframe-embed',
        videoPlayer: result.videoPlayer || 'video.jw-video.jw-reset',
        iframepage: result.iframepage || 'https://embtaku.pro/*',
        nextButton: result.nextButton || '.btn-next'
    };
};

// Function to configure content script injection
const configureContentScript = async () => {
    const {
        mainpage,
        iframepage,
        videoPlayer
    } = await getConfig();

    browser.webNavigation.onCompleted.addListener(details => {
        browser.tabs.executeScript(details.tabId, {
            file: 'ZoroSkipper.js',
            allFrames: true
        });
    }, {
        url: [{
            urlMatches: mainpage
        }, {
            urlMatches: iframepage
        }]
    });
};

// Handle messages from content script to get configuration
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getConfig') {
        getConfig().then(config => sendResponse(config));
        return true;
    }
});

// Call the function to configure content script
configureContentScript();