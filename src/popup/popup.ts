

const FrogImg = require('frog.jpg');
const hidePage: string = `body > :not(.beastify-image) {
    display: none;
  }`;

/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function beastNameToURL(beastName: string) {
    switch (beastName) {
        case "Frog":
            return browser.runtime.getURL(FrogImg);
        case "Snake":
            return browser.runtime.getURL(FrogImg);
        case "Turtle":
            return browser.runtime.getURL(FrogImg);
        default:
            return browser.runtime.getURL(FrogImg);
    }
}
/**
* Insert the page-hiding CSS into the active tab,
* then get the beast URL and
* send a "beastify" message to the content script in the active tab.
*/
function beastify(tabs: any, e: MouseEvent): Promise<any> {
    browser.tabs.insertCSS({ code: hidePage }).then(() => {
        let text: string | null = (e.target as HTMLElement).textContent;
        let url = beastNameToURL(text != null ? text : "");
        browser.tabs.sendMessage(tabs[0].id, {
            command: "beastify",
            beastURL: url
        });
    });
    return Promise.resolve();
}
/**
* Remove the page-hiding CSS from the active tab,
* send a "reset" message to the content script in the active tab.
*/
function reset(tabs: any) {
    browser.tabs.removeCSS({ code: hidePage }).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
            command: "reset",
        });
    });
}
/**
* Just log the error to the console.
*/
function reportError(error: any) {
    console.error(`Could not beastify: ${error}`);
}

function listenForClicks() {
    document.addEventListener("click", (e) => {
        if ((e.target as HTMLButtonElement).type === "reset") {
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then(reset)
                .catch(reportError);
        } else {
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then((tabs) => beastify(tabs, e))
                .catch(reportError);
        }
    });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error: any) {
    document.querySelector("#popup-content")?.classList.add("hidden");
    document.querySelector("#error-content")?.classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

export function inject() {
    browser.tabs
    .executeScript({ file: "/index.ts" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
}

inject();
