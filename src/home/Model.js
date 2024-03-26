export default class Model {
    
    api_url = 'http://localhost:39361'

    async getBalanceUser() {
        // return { id: '1', balance: '5.00' }
        return fetch(`${this.api_url}/users/1`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    async getIsBalanceEnough(choice) {
        return fetch(`${this.api_url}/users/1/connect-request?balance=${choice}`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

}

