
function getProfile () {
  return {
    username: $('#sender-name').val(),
    channel: $('#channel').val()
  }
}

function attachEvent (socket, temp) {
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
  const socketUrl = 'ws://localhost:8000/'

  let profile = getProfile()
  let socket = new WebSocket(socketUrl + profile.channel)

  attachEvent(socket, temp)

  $('#send-form').submit(function (event) {
    event.preventDefault()

    const message = $('#message').val().trim()
    const data = {
      sender: profile.username,
      time: new Date().toUTCString(),
      message: message
    }

    if (message === '') return

    $('#message').val('')
    socket.send(JSON.stringify(data))
  })

  $('#sender-form').submit(function (event) {
    event.preventDefault()

    const oldProfile = profile
    profile = getProfile()

    if (oldProfile.channel !== profile.channel) {
      $('#messages').empty()
      socket.close()

      socket = new WebSocket(socketUrl + channel)
      attachEvent(socket, temp)
    }

    alert('Settings was saved!')
  })
})
