class Model {

    async getBalanceUser() {
        return fetch('https://65ee680408706c584d9b5644.mockapi.io/api/v1/User/1')
            .then(response => response.json())
            .then(data => {
                this.userData = data;
                return data;
            });
    }
}

class Presenter {
    constructor(model, view) {
        this.model = new Model()
        this.view = new View()
    }

    async handleBalance() {
        const balance = await this.model.getBalanceUser()
        this.view.hideSpinner()
        this.view.changeBalance(balance)
    }
}

class View {
    constructor() {
        this.balanceLabel = document.getElementById('balance');
        this.spinner = document.getElementById('spinner');
    }

    hideSpinner() {
        this.spinner.style.display = 'none'
    }

    async changeBalance(data) {
        this.balanceLabel.textContent = data.balance
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    
    const app = new Presenter(new Model(), new View())
    await app.handleBalance()

}); 