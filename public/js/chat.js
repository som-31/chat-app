const socket = io()

//elements
const $messageFormButton = document.querySelector('#submit')
const $messageFormInput = document.querySelector('#message')
const $sendLocationButton  = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true})

const autoscroll = () => {
    //new message element 
    const $newMessage = $messages.lastElementChild

    //height of the new message 
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const  visibleHeight = $messages.offsetHeight

    //Height of message container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
          $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('LocationMessage', (locationUrl) => {
    console.log(locationUrl)
    const html = Mustache.render(locationTemplate, {
        username : locationUrl.username,
        url : locationUrl.url,
        createdAt : moment(locationUrl.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
   })

socket.on('roomData', ({ room, users}) => {
     const html = Mustache.render(sidebarTemplate, {
         room,
         users
     })
     document.querySelector('#sidebar').innerHTML = html
})   

$messageFormButton.addEventListener('click', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    let message = document.querySelector('#message').value
    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
           return console.log(error)
        }

        console.log('Messae Delivered')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Your browser does not support geolocation')
    }

    //disable Button
    $sendLocationButton.setAttribute('disabled', 'disabled')

     navigator.geolocation.getCurrentPosition(position => {
         socket.emit('sendLocation', {
             latitude : position.coords.latitude,
             longitude : position.coords.longitude
         }, () => {
             $sendLocationButton.removeAttribute('disabled')
             console.log('Location Shared')
         })
     })   
})

socket.emit('join', { username, room}, error => {
    if(error){
        alert(error)
        location.href = '/'
    }
})