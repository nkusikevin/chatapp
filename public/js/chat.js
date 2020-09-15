const socket = io()
// elements
const $msgform = document.querySelector('#message-form')
const $input = document.querySelector('input')
const send =  document.querySelector('button')
const $messages = document.querySelector('#mg')
//grab the templet also 
const msgtemp = document.querySelector('#msg-temp').innerHTML
const sidebar = document.querySelector('#sidebar-template').innerHTML
//options
const{username,room }=Qs.parse(location.search,{ignoreQueryPrefix:true})

 const autoscoll = () => {
     const $newMsg = $messages.lastElementChild
     const msgstyle = getComputedStyle($newMsg)
     const buttonmergin = parseInt(msgstyle.marginBottom)   
     const msgheight = $newMsg.offsetHeight + buttonmergin
    const visibleheight = $messages.offsetHeight
    const contentheight = $messages.scrollHeight
    const scrolloffset = $messages.scrollTop + visibleheight
    if(contentheight - msgheight <=  scrolloffset ){
        $messages.scrollTop = $messages.scrollHeight
    }

 }


socket.on('newmessage',(message)=>{
    console.log(message)
const html = Mustache.render(msgtemp,{
    username:message.username,
    usermessage: message.text,
    createdAt: moment(message.createdAt).format('h:mm A')
})
$messages.insertAdjacentHTML('beforeend', html)
autoscoll()
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
//disable the form
     e.preventDefault()

     send.setAttribute('disabled','disabled')
    const message = e.target.elements.msg.value
    socket.emit('sendmessage', message,(error)=>{
        send.removeAttribute('disabled')
        $input.value=''
        $input.focus()
        if(error){
            console.log(error)
        }
        console.log('the message was sent')
    })
})
 
socket.emit('join',{username,room},(error)=>{
    if(error){
window.alert(error)
location.href = '/'
    }
})
socket.on('admin',()=>{
    location.href='admin.html'
})
socket.on('roomdata',({room,users})=>{
  const html = Mustache.render(sidebar,{
      room,
      users
  })
document.querySelector('#sidebar').innerHTML= html
})