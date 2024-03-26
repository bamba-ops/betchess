import Model from './Model.js';
import Presenter from './Presenter.js';
import View from './View.js';

document.addEventListener("DOMContentLoaded", async () => {

    const socket = new WebSocket('ws://localhost:39361/ws');
    const app = new Presenter(new Model(), new View())
    const roomId = document.createElement('span')

    await app.handleBalance()

    socket.addEventListener('open', function (event) {
        const data = {
            'type': 'request_room',
            'payload': {
              'playerId' : 1,
              'username' : 'triangulumbraveheart',
              'isConnected' : true
            }
        }
        socket.send(JSON.stringify(data))
    });

    socket.onmessage = message => {
        console.log(JSON.parse(message.data))
        const data = JSON.parse(message.data)
        console.log(data.payload.roomId)
        roomId.setAttribute('roomId', `${data.payload.roomId}`)
    }

    app.view.btn5.addEventListener('click', async () => {
        await app.handleBtnChoice(5.00)
        const getRoomId = roomId.getAttribute('roomId')
        const data = {
            type: 'request_join',
            payload: { 
                'playerId' : 1,
                'roomId' : getRoomId,
                'price' : 5
            }
        }
        socket.send(JSON.stringify(data))
    })

    app.view.btn10.addEventListener('click', async () => {
        await app.handleBtnChoice(10.00)
    })

    app.view.btn20.addEventListener('click', async () => {
        await app.handleBtnChoice(20.00)
    })


});