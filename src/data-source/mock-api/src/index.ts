import { Hono } from 'hono'
import { cors } from 'hono/cors'
import users from './data/source'

const app = new Hono()

app.use(cors());

app.get('/', (c) => {
  return c.text('Hi')
})

app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.findUserById(id);
  return c.json(user)
})

app.get('/users/:id/isBalanceEnough', (c) => {
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

    if(!user){
      c.json('No user found', 404);
    }

    if(parseFloat(user.balance) >= query){
      return c.json({isBalanceEnough: true});
    } else {
      return c.json({isBalanceEnough: false, message: "Insuffisent funds. Please top up your balance !"});
    }

  } catch (e) {
    return c.json({error: e});
  }
})


export default app