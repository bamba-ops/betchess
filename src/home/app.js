import Model  from './Model.js';
import Presenter  from './Presenter.js';
import View  from './View.js';

document.addEventListener("DOMContentLoaded", async () => {

    const app = new Presenter(new Model(), new View())

    await app.handleBalance()

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