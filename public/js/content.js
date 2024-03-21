console.log("Content script has loaded via Manifest V3.");

function sendMessageToBackground(message) {
    chrome.runtime.sendMessage(message, function(response) {
        console.log('Response from background:', response);
    });
}

sendMessageToBackground({greeting: 'hello'});


// const url = "https://www.chess.com/play/online"


// if (window.location.href != url) {
//     window.location.href = url
// } else {
//     console.log("We can create a game !")
// }

// const elements = document.getElementsByClassName('direct-menu-item-small-title')

// if (elements.length > 1) {
//     elements[0].click()
// }


//     setTimeout(function () {

//         console.log('third !')

//         const element3 = document.getElementsByName('play-friend-search-input')

//         if(element3.length > 0){
//             element3[0].value  = 'nomine948'
//         }

//         setTimeout(function () {

//             console.log('4')

//             const element4 = document.querySelectorAll('.user-username-component.user-username-theme-high.user-username-link.user-tagline-username')

//             if (element4.length > 0){
//                 element4[2].click()
//             }

//         }, 5000)
       

//     }, 5000);

