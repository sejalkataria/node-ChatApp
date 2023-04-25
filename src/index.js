const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.emit("message", "welcome")
    socket.on('sendMessage', (msg) => {
        io.emit("message", msg)
    })

})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})