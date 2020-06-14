
let hostname, port
$.getJSON('/assets/js/config.json', function (data) {
  hostname = data.websocket.hostname || window.location.hostname
  port = data.websocket.port || '80'
})

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

    switch (data.name) {
      case 'message': {
        const messageTemp = $('#message-template').prop('content')
        const message = $(messageTemp).clone(true, true)
        const date = new Date(data.timestamp * 1000).toLocaleString()

        $(message).find('[data-temp="sender"]').text(data.content.sender)
        $(message).find('[data-temp="sender-id"]').text('#' + data.from)
        $(message).find('[data-temp="date"]').text(date)
        $(message).find('[data-temp="message"]').text(data.content.message)

        $(container).append(message)
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
        break
      }

      case 'join': {
        const joinTemp = $('#join-template').prop('content')
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
        const leaveTemp = $('#leave-template').prop('content')
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
