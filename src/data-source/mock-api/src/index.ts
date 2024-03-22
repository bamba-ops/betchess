import { Hono } from 'hono'
import { cors } from 'hono/cors'
import users from './data/source'
import { upgradeWebSocket } from 'hono/cloudflare-workers';

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

app.get('/ws', upgradeWebSocket(() => {
  return {
    onMessage(event, ws) {
      const message = JSON.parse(event.data)
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
                'type': message.type,
                'username': message.payload.username,
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
    onClose() {
      try{
        console.log('Connection close')
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

app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.findUserById(id);
  return c.json(user)
})

app.get('/users/:id/connect-request', (c) => {
  return c.json({ isBalanceEnough: true });
})


export default app