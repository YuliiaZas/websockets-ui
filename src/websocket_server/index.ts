import ws from 'ws'

const webSocketServer = new ws.Server({ port: 3000 })

webSocketServer.on('connection', (ws) => {
    console.log('New client connected')
})
