export default class View {

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

    showWarningFor2Seconds() {
        this.warning.classList.remove('show')
    }

}