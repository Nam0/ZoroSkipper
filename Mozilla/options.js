//Options.js

document.addEventListener('DOMContentLoaded', () => {
    const mainpageInput = document.getElementById('mainpage');
    const iframepageInput = document.getElementById('iframepage');
    const iframeidInput = document.getElementById('iframeid');
    const fullScreenInput = document.getElementById('fullScreen');
    const autoPlayInput = document.getElementById('autoPlay');
    const secondsToWaitInput = document.getElementById('secondsToWait');
    const videoPlayerInput = document.getElementById('videoPlayer');
    const nextButtonInput = document.getElementById('nextButton');
    const saveButton = document.getElementById('save');

    // Load saved options
    browser.storage.sync.get(['mainpage', 'iframepage', 'iframeid', 'fullScreen', 'autoPlay', 'secondsToWait', 'videoPlayer', 'nextButton']).then(result => {
        mainpageInput.value = result.mainpage || 'https://w2.zoro.se/anime-watch/*';
        iframepageInput.value = result.iframepage || 'https://embtaku.pro/*';
        iframeidInput.value = result.iframeid || 'iframe-embed';
        fullScreenInput.checked = result.fullScreen !== undefined ? result.fullScreen : true;
        autoPlayInput.checked = result.autoPlay !== undefined ? result.autoPlay : true;
        secondsToWaitInput.value = result.secondsToWait !== undefined ? result.secondsToWait : '3';
        videoPlayerInput.value = result.videoPlayer || 'video.jw-video.jw-reset';
        nextButtonInput.value = result.nextButton || '.btn-next';
    });

    // Save options
    saveButton.addEventListener('click', () => {
        browser.storage.sync.set({
            mainpage: mainpageInput.value,
            iframepage: iframepageInput.value,
            iframeid: iframeidInput.value,
            fullScreen: fullScreenInput.checked,
            autoPlay: autoPlayInput.checked,
            secondsToWait: parseInt(secondsToWaitInput.value, 10),
            videoPlayer: videoPlayerInput.value,
            nextButton: nextButtonInput.value
        }).then(() => {
            alert('Options saved.');
        });
    });
});