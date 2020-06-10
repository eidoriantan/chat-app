
function getProfile () {
  return {
    username: $('#sender-name').val(),
    channel: $('#channel').val()
  }
}

function attachEvents (socket, temp) {
  socket.onerror = function (event) {
    console.error(event)
    alert('Cannot connect to server!')
  }

  socket.addEventListener('message', function (event) {
    const messages = $('#messages')
    const message = $(temp).clone(true, true)
    const data = JSON.parse(event.data)

    $(message).find('[data-temp="sender"]').text(data.sender)
    $(message).find('[data-temp="time"]').text(data.time)
    $(message).find('[data-temp="message"]').text(data.message)
    messages.append(message)

    messages[0].scrollTo({
      top: messages.prop('scrollHeight'),
      behavior: 'smooth'
    })
  })
}

$(document).ready(function () {
  const temp = $('#message-template').prop('content')
  const hostname = window.location.hostname
  const port = '8000'
  const socketUrl = 'ws://' + hostname + ':' + port

  let profile = getProfile()
  let socket = new WebSocket(socketUrl + '/' + profile.channel)
  attachEvents(socket, temp)

  $('#send-form').submit(function (event) {
    event.preventDefault()

    if (socket.readyState !== WebSocket.OPEN) {
      alert('Cannot connect to server')
      throw new Error('Cannot connect to server')
    }

    const message = $('#message').val().trim()
    const data = {
      sender: profile.username,
      time: new Date().toUTCString(),
      message: message
    }

    $('#message').val('')
    if (message !== '') socket.send(JSON.stringify(data))
  })

  $('#sender-form').submit(function (event) {
    event.preventDefault()

    if (socket.readyState !== WebSocket.OPEN) {
      alert('Cannot connect to server')
      throw new Error('Cannot connect to server')
    }

    const oldProfile = profile
    profile = getProfile()

    if (oldProfile.channel !== profile.channel) {
      $('#messages').empty()
      socket.close()

      socket = new WebSocket(socketUrl + channel)
      attachEvents(socket, temp)
    }

    alert('Settings was saved!')
  })
})
