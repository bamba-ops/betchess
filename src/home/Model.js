export default class Model {
    
    api_url = 'http://localhost:57789'

    async getBalanceUser() {
        //return { id: '1', balance: '5.00' }
        return fetch(`${this.api_url}/users/1`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    async getIsBalanceEnough(choice) {
        //return choice <= 5.00 ? { isBalanceEnough: true } : { isBalanceEnough: false, message: "Insuffisent funds. Please top up your balance !" }
        return fetch(`${this.api_url}/users/1/connect-request?balance=${choice}`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    /*
    async getUserData(){
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({type: 'get-user-data'}, (response) => {
              if (chrome.runtime.lastError) {
                // Handle expected errors
                reject(chrome.runtime.lastError);
              }
              resolve(response);
            });
          });
        return await response
    }
    */

}

