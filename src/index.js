const express = require('express')
const path = require('path')
const http = require('http')
const Filter = require('bad-words')
const socketio= require('socket.io')
const {generatemessage} = require('./utils/messages')
const { adduser,getuser,inRoom,removeuser,recordsr} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port= process.env.PORT||3000
const pth = path.join(__dirname,'../public')

        io.on('connection',(socket)=>{
             console.log('new connection Added')

        
                  socket.on('join',({username,room},cb)=>{

                    const { error,user} = adduser({id:socket.id , username , room})
                    if(error){
                      return cb(error)
                    }
                    recordsr({id:socket.id , username, room})
                    if(user.username ==='admin' && user.room ==='admin'){
                      socket.emit('admin','welcome admin')
                    }
                    socket.join(user.room)
                    socket.emit('newmessage',generatemessage(`${user.username} Welcome to ${user.room}`))

                    socket.broadcast.to(user.room).emit('newmessage', generatemessage(`${user.username} has joined`))
                    io.to(user.room).emit('roomdata',{
                      room: user.room,
                      users:inRoom(user.room)
                                       })
                    cb()

                  })
                  socket.on('sendmessage',(message,cb)=>{
                    const user = getuser(socket.id)
                    const filter = new Filter()
                    if (filter.isProfane(message)){
                      return cb(generatemessage("profanity is not allowed"))
                    }

                   io.to(user.room).emit('newmessage', generatemessage(user.username,message))
                   cb()
                                                })
                   socket.on('disconnect', ()=>{
                     const user = removeuser(socket.id)
                     if(user){
                      io.to(user.room).emit('newmessage',generatemessage(`${user.username} has left the room`))
                      io.to(user.room).emit('roomdata',{
                        room: user.room,
                        users:inRoom(user.room)
                      })
                     }
  })  
})

app.use(express.static(pth))
server.listen(port,()=>{
    console.log(`the server is on port ${port} !!`)
})