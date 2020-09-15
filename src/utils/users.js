const users = []
//adduser
const adduser = ({id,username,room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //validate the data
    if(!username ||!room){
        return {
            error:'username and room are required'
        }
    }
 //check for existing user
const existinguser = users.find((user)=>{
    return user.room === room && user.username === username
})
// validate username
if(existinguser){
    return {
        error: 'username is in use'
    }
}
//store user
const user = {id,username,room}
users.push(user)
return{user}
}

//remove user
 const removeuser = (id)=>{
const index = users.findIndex((user)=>{
    return user.id ===id
})
if (index !== -1){
    return users.splice(index,1)[0]


}
 }

//get user
const getuser = (id)=>{
return users.find((user)=> user.id === id)
}
//get users in the room
const inRoom = (room)=>{
    return users.filter((user)=> user.room === room)
}
const recordsr = ({id,username,room})=>{
    var usr = []
    var add = []
    const enter ={ id,username,room}
    usr.push(enter)
    console.log(usr)
}
module.exports={
    adduser,
    getuser,
    inRoom,
    removeuser,
    recordsr
}