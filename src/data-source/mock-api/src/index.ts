import { Hono } from 'hono'
import { cors } from 'hono/cors'
import users from './data/source'
import { upgradeWebSocket } from 'hono/cloudflare-workers';
import { WebSocket as CFWebSocket } from '@cloudflare/workers-types';

function guid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function checkForDuplicatePlayerId(playerId: any) {
  for (const roomId in house) {
    if (house[roomId][playerId]) {
      return true; // Found a duplicate
    }
  }
  return false; // No duplicate found
}

function setUserisConnected(_house: any, _message: any) {
  for (const room in _house) {
    house[room][_message.payload.playerId].isConnected = _message.payload.isConnected
  }
}


const app = new Hono()
const house: any = {}

app.use(cors());
app.use('/users/:id/connect-request', async (c, next) => {
  try {
    let user: any
    let id: any
    let query: any

    if (c.req.query('balance') && c.req.param('id')) {
      id = parseInt(c.req.param('id'))
      query = c.req.query('balance')
      user = users.findUserById(id);
      console.log(query)
    }

    if (!user) {
      c.json({ isBalanceEnough: false, message: "Contact support. Error: 101" });
    }

    if (parseFloat(user.balance) >= query) {
      await next()
    } else {
      return c.json({ isBalanceEnough: false, message: "Insuffisent funds. Please top up your balance !" });
    }

  } catch (e) {
    console.log(e)
    return c.json({ isBalanceEnough: false, message: "Contact support. Error: 100" });
  }
})

app.get('/', (c) => {
  return c.text('Hi')
})

app.get('/websocket', (c) => {
  try {
    const upgradeHeader = c.req.header('Upgrade')
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return c.text('Expected websocket', 400)
    }
    
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    server.accept()


    server.addEventListener('message', (event: MessageEvent) => {
      const message = event.data
      try {
        console.log(message)
        server.send('I receive !')
      } catch (error) {
        console.log(error)
      }
    })

    server.addEventListener('close', (cls: CloseEvent) => {
        console.log('Connection close')
        server.close(cls.code, 'Client closing Websocket')
    })

    server.addEventListener('error', (error) => {
      // Check the connection stateEEE
      if (server.readyState === WebSocket.CLOSED) {
        console.log('Connection is already closed.');
      }
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    })
  } catch (e) {
    console.log(e)
    return new Response(`
    This Durable Object supports the following endpoints:
      /websocket
        - Creates a WebSocket connection. Any messages sent to it are echoed with a prefix.
      /getCurrentConnections
        - A regular HTTP GET endpoint that returns the number of currently connected WebSocket clients.
    `)
    
  }

})

app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.findUserById(id);
  return c.json(user)
})

app.get('/users/:id/connect-request', (c) => {
  return c.json({ isBalanceEnough: true });
})


export default app

/**
 * app.get('/ws', upgradeWebSocket(() => {
  return {
    onMessage(event, ws) {
      const message = JSON.parse(event.data)
      setUserisConnected(house, message)
      console.log(house)
      try {
        switch (message.type) {
          case 'request_room':
            if (!checkForDuplicatePlayerId(message.payload.playerId)) {
              const roomId = guid()
              house[roomId] = {
                'status': 'init' 
              }
              house[roomId][message.payload.playerId] = {
                'connection': ws,
                'username': message.payload.username,
                'isConnected': message.payload.isConnected
              }

              console.log(house)

              const response = {
                'type': message.type,
                'payload': {
                  'isValid': true,
                  'roomId': roomId,
                }

              }

              ws.send(JSON.stringify(response))
            }
            break;
          case `request_join`:
            const {playerId, roomId, price} = message.payload

            house[roomId].status = 'waiting'
            house[roomId].price = price

            for(const room in house){
              console.log(house[room])
              console.log(room)
            }

            setTimeout( () => {

              const isMatchFound = setInterval( () => {

                for(const room in house){
                  if(room != roomId){
                    if(house[room].waiting == 'waiting' && house[room].price == price){
                      console.log('Found a room !')
                      clearInterval(isMatchFound)
                    } else {
                      console.log('Not found !')
                    }
                  } else {
                    console.log('Am the only one !')
                  }
                }

              }, 5000)


            }, 10000)
            break;
          default:
            break;
        }
      } catch (e) {
        const response = {
          'type': message.type,
          'payload': {
            'isValid': false
          }
        }
        ws.send(JSON.stringify(response))
        console.log(e)
      }
    },
    onClose(evt, ws) {
      try{
        let cpt = 0
        setTimeout(() => {
          const isConnected = setInterval(() => {
            for(const room in house){
              for(const user in house[room]){
                if(house[room][user].connection){
                  if(house[room][user].connection == ws){
                    if(house[room][user].isConnected){
                      console.log('User Reconnected !')
                      clearInterval(isConnected)
                    } else {
                      console.log(`Compteur: ${cpt}`)
                      if(cpt == 10){
                        delete house[room][user]
                        console.log(`User Remove Successfully`)
                        clearInterval(isConnected)
                      }
                    }
                    
                  } 
                }
              }
            }
            cpt++
            if(cpt == 10){
              clearInterval(isConnected)
            }
            console.log('Connection will close')
          }, 1000);
        }, 5000)
        
        console.log('User remove from room after 10 seconds of disconnection')
      } catch(e) {
        console.log(e)
      }
    },
    onError() {
      try{ 
        console.log('Error')
      } catch(e) { 
        console.log(e)
      }
    },
  }
}))
 */