
const hostname = window.location.hostname
const port = '8000'

function connect (channel) {
  const url = 'ws://' + hostname + ':' + port + '/' + channel
  const socket = new WebSocket(url)

  socket.onerror = function (event) {
    console.error(event)
    alert('Cannot connect to server!')
  }

  socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data)
    const container = $('#messages')[0]
    const messageTemp = $('#message-template').prop('content')
    const joinTemp = $('#join-template').prop('content')
    const leaveTemp = $('#leave-template').prop('content')

    switch (data.name) {
      case 'message': {
        const message = $(messageTemp).clone(true, true)

        $(message).find('[data-temp="sender"]').text(data.content.sender)
        $(message).find('[data-temp="sender-id"]').text('#' + data.from)
        $(message).find('[data-temp="time"]').text(data.content.time)
        $(message).find('[data-temp="message"]').text(data.content.message)

        $(container).append(message)
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
        break
      }

      case 'join': {
        const join = $(joinTemp).clone(true, true)
        $(join).find('[data-temp="user-id"]').text('#' + data.id)

        $(container).append(join)
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
        break
      }

      case 'leave': {
        const leave = $(leaveTemp).clone(true, true)
        $(leave).find('[data-temp="user-id"]').text('#' + data.id)

        $(container).append(leave)
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
        break
      }
    }
  })

  return socket
}

function getProfile () {
  return {
    username: $('#sender-name').val(),
    channel: $('#channel').val()
  }
}

$(document).ready(function () {
  let profile = getProfile()
  let socket = connect(profile.channel)

  $('#send-form').submit(function (event) {
    event.preventDefault()

    if (socket.readyState !== WebSocket.OPEN) {
      alert('Cannot connect to server')
      throw new Error('Cannot connect to server')
    }

    const message = $('#message').val().trim()
    const data = {
      name: 'message',
      content: {
        sender: profile.username,
        time: new Date().toUTCString(),
        message: message
      }
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
      socket = connect(profile.channel)
    }

    alert('Settings was saved!')
  })
})
