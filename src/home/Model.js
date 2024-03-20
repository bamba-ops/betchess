export default class Model {

    async getBalanceUser() {
        // return { id: '1', balance: '5.00' }
        return fetch('http://localhost:8787/users/1')
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    async getIsBalanceEnough(choice) {
        return fetch(`http://localhost:8787/users/1/isBalanceEnough?balance=${choice}`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

}

