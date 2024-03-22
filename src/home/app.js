import Model from './Model.js';
import Presenter from './Presenter.js';
import View from './View.js';

document.addEventListener("DOMContentLoaded", async () => {

    const socket = new WebSocket('ws://localhost:42085/ws');
    const app = new Presenter(new Model(), new View())

    await app.handleBalance()

    socket.addEventListener('open', function (event) {
        const data = {
            'type': 'request_room',
            'payload': {
              'playerId' : 1,
              'username' : 'triangulumbraveheart'
            }
        }
        socket.send(JSON.stringify(data))

    });

    socket.onmessage = message => {
        console.log(JSON.parse(message.data))
        
    }

    socket.onerror = message => {
        console.log(JSON.parse(message.data))
       
    }

    app.view.btn5.addEventListener('click', async () => {
        await app.handleBtnChoice(5.00)
    })

    app.view.btn10.addEventListener('click', async () => {
        await app.handleBtnChoice(10.00)
    })

    app.view.btn20.addEventListener('click', async () => {
        await app.handleBtnChoice(20.00)
    })


});