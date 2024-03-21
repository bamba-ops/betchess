//let getBalanceUser = {id: 1, balance: 5.00}

let users = [
    {id: 1, balance: '5.00'},
    {id: 2, balance: '10.00'},
    {id: 3, balance: '20.00'},
    {id: 4, balance: '5.00'},
    {id: 5, balance: '5.00'},
    {id: 6, balance: '10.00'},
]

const findUserById = (id: any) => {return users.find((user) => user.id == id)}

export default {
    users, findUserById
}