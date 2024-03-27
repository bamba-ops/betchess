import { Hono } from 'hono'
import { cors } from 'hono/cors'
import users from './data/source'


const app = new Hono()

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

app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const user = users.findUserById(id);
  return c.json(user)
})

app.get('/users/:id/connect-request', (c) => {
  return c.json({ isBalanceEnough: true });
})


export default app