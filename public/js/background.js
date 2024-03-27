// This function listens for messages from content and offscreen scripts
const socket = new WebSocket('ws://localhost:8787/websocket');
var isMatchFoundInterval = null
var ctp_request_join = 0

socket.onopen = () => {
  const data = {
    type: 'register',
    payload: {
      userId: 1,
      username: 'many1',
      isConnected: true
    }
  }
  socket.send(JSON.stringify(data))
}

socket.onmessage = message => {
  const msg = JSON.parse(message.data)
  switch(msg.type){
      case 'register':
          if(msg.payload.isValid){
              console.log('User as been registered !')
          } else {
              console.log('User has not been registered, error occured !')
          }
          break;
      case 'create':
          if(msg.payload.isValid){
              console.log('create successfully, waiting for player to match')
              console.log(msg.payload)
              isMatchFoundInterval = setInterval(() => {
                  if(ctp_request_join >= 5){
                      ctp_request_join = 0
                      clearInterval(isMatchFoundInterval)
                  } else {
                      const data = {
                          type: 'join',
                          payload: {
                              userId: 1,
                              username: 'prisonerssweetpickle',
                              isConnected: true,
                              gameId: msg.payload.gameId
                          }
                      }
                      socket.send(JSON.stringify(data))
                      ctp_request_join++
                  }
              }, 5000)
          } else {
              console.log('An error has occured')
          }
          break;
      case 'join':
          if(msg.payload.isValid){
              clearInterval(isMatchFoundInterval)
              console.log('Join successfully')
              console.log(msg.payload)
          } else {
              console.log('An error has occured')
          }
          break;
      default:
          break;
  }
}

const user = {
  username: 'nathalie'
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(request)
    switch (request.type) {
      case 'hello':
        console.log("Greeting received in background script.");
        sendResponse({ farewell: "goodbye" });
        break;
      case 'get-user-data':
        sendResponse(user)
        break;
      default:
        break;
    }
    return true;
  }
);