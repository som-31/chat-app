const users = []

const addUser = ({ id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if( !username || !room){
        return {
            erroor : 'Username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username
    })

    //Validate user
    if(existingUser){
       return {
           error : 'Username already exists'
       }
    }

    //store user
    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex( user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find( user => user.id === id)
}

const getUsersInRoom = room => {
    return users.filter( user => user.room === room.toLowerCase())
}

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}