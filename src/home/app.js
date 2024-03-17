class Model {

    async getBalanceUser() {
        return { id: '1', balance: '5.00' }
        // return fetch('https://65ee680408706c584d9b5644.mockapi.io/api/v1/User/1')
        //     .then(response => response.json())
        //     .then(data => {
        //         this.userData = data;
        //         return data;
        //     });
    }

}

class Presenter {
    constructor(model, view) {
        this.model = new Model()
        this.view = new View()
    }

    async handleBalance() {
        const data = await this.handleGetBalanceUser()
        this.view.hideSpinner()
        this.view.changeBalance(data)
    }

    async handleBtnChoice(choice) {
        try {
            const data = await this.handleGetBalanceUser()
            if (choice == 5.00 && parseFloat(data.balance) >= 5.00) {
                this.view.showModalWaiting()
            } else if (choice == 10.00 && parseFloat(data.balance) >= 10.00) {
                this.view.showModalWaiting()
            } else if (choice == 20 && parseFloat(data.balance) >= 20.00) {
                this.view.showModalWaiting()
            } else { 
                this.view.hideModalWaiting()
                this.handleWarningInsuffisantFunds()
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleWarningInsuffisantFunds(){
        this.view.showWarning({message: "Insuffisent funds. Please top up your balance !"})
    }

    async handleGetBalanceUser() {
        return await this.model.getBalanceUser()
    }

}

class View {

    constructor() {
        this.balanceLabel = document.getElementById('balance');
        this.spinner = document.getElementById('spinner');
        this.btn5 = document.getElementById('btn5');
        this.btn10 = document.getElementById('btn10');
        this.btn20 = document.getElementById('btn20');
        this.warning = document.getElementById('warning');
        this.warningMessage = document.getElementById('warningMessage');
        this.waiting = document.getElementById('waiting');
        this.modalWaiting = new bootstrap.Modal('#waiting');
    }

    hideSpinner() {
        this.spinner.style.display = 'none'
    }

    async changeBalance(data) {
        this.balanceLabel.textContent = await data.balance
    }

    async showWarning(data) {
        this.warningMessage.textContent = await data.message
        this.warning.classList.add('show')
        setTimeout(this.showWarningFor2Seconds, 2000)
    }

    hideModalWaiting() {
        this.modalWaiting.hide();
    }

    showModalWaiting() {
        this.modalWaiting.show()
    }

    showWarningFor2Seconds(){
        this.warning.classList.remove('show')
    }

}


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

    // app.view.waiting.addEventListener('show.bs.modal', async (event) => {
    //     const button = event.relatedTarget
    //     const balance = button.getAttribute('data-bs-balance')
    //     console.log(balance)
    //     const res = await app.handleBtnChoice(balance)
    //     if(!res){
    //         event.preventDefault();
    //         app.handleWarningInsuffisantFunds()
    //     }
    // })

    
});