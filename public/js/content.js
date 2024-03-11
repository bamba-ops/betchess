console.log("Content script has loaded via Manifest V3.");

function sendMessageToBackground(message) {
    chrome.runtime.sendMessage(message, function(response) {
        console.log('Response from background:', response);
    });
}

sendMessageToBackground({greeting: 'hello'});