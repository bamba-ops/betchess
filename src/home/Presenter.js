import Model from "./Model.js"
import View from "./View.js"

export default class Presenter {
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
        const data = await this.handleIsBalanceEnough(choice)
        if (data.isBalanceEnough) {
            this.view.showModalWaiting()
        } else {
            this.view.hideModalWaiting()
            this.handleWarningInsuffisantFunds(data)
        }

    }


    handleWarningInsuffisantFunds(data) {
        this.view.showWarning(data)
    }

    async handleGetBalanceUser() {
        return await this.model.getBalanceUser()
    }

    async handleIsBalanceEnough(choice) {
        return await this.model.getIsBalanceEnough(choice)
    }

}