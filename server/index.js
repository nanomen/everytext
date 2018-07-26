const WebSocket = require('ws')
const HOST = '0.0.0.0'
const PORT = 8080

const wss = new WebSocket.Server({
  host: HOST,
  port: PORT
})

wss.on('connection', ws => {
  ws.on('message', msg => {
    console.log('recieved msg ' + msg)
    ws.send('answer for ' + msg)
  })

  ws.send('hello')
})

console.log(`server ${host}:${port} is running`)
