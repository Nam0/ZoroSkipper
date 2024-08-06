// injector.js

const injectScript = (file, node) => {
    const th = document.getElementsByTagName(node)[0];
    if (th) {
        const s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', browser.runtime.getURL(file));
        th.appendChild(s);
        console.log(`Injected script ${file} into ${node}.`);
    } else {
        console.log(`Failed to find ${node} element for script injection.`);
    }
};

const getConfig = async () => {
    const result = await browser.storage.sync.get(['mainpage', 'iframepage']);
    return {
        mainpage: result.mainpage || 'https://w2.zoro.se/anime-watch/*',
        iframepage: result.iframepage || 'https://embtaku.pro/*'
    };
};

const injectIfMatchingUrl = async () => {
    const {
        mainpage,
        iframepage
    } = await getConfig();
    const currentUrl = window.location.href;

    if (currentUrl.match(new RegExp(mainpage.replace('*', '.*'))) ||
        currentUrl.match(new RegExp(iframepage.replace('*', '.*')))) {
        injectScript('ZoroSkipper.js', 'body');
    } else {
        console.log('Current URL does not match configured URLs. No script injected.');
    }
};

injectIfMatchingUrl();