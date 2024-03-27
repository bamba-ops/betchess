chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        switch(request.type){
            case 'hello':
                console.log(request.offscreen)
                break;
            default:
            break;
        }
    }
);