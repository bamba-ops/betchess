// This function listens for messages from content scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.greeting === "hello"){
            console.log("Greeting received in background script.");
            sendResponse({farewell: "goodbye"});
        }
        // Note: sendResponse will be invalid if you return true here because the message
        // channel will be closed.
        return false; // remove this line to use sendResponse asynchronously
    }
);
