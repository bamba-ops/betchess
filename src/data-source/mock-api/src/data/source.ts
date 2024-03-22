//let getBalanceUser = {id: 1, balance: 5.00}

let users = [
    {id: 1, balance: '5.00', username: 'triangulumbraveheart'},
    {id: 2, balance: '10.00', username: 'prisonerssweetpickle'},
    {id: 3, balance: '20.00', username: 'ryebreadthegodfather'},
    {id: 4, balance: '5.00', username: 'starshiptrumpetdonut'},
    {id: 5, balance: '5.00', username: 'redwoodcattaxidriver'},
    {id: 6, balance: '10.00', username: 'kumquatleafnectarine'},
]

const findUserById = (id: any) => {return users.find((user) => user.id == id)}


export default {
    users, findUserById
}