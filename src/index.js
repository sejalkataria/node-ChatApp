const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocationMessage } = require('./utlis/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.emit("message", generateMessage('Welcome!'))
    socket.broadcast.emit("message", generateMessage("A user a joined a chat room"))
    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed')
        }
        io.emit("message", generateMessage(msg))
        callback()
    })
    socket.on('sendLocation', (location, callback) => {
        io.emit("locationMessage", generateLocationMessage(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })
    socket.on('disconnect', () => {
        io.emit("message", generateMessage("A user left the chat room"))
    })

})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})