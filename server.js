require('dotenv').config()
const {PORT} = process.env
const http = require('http')
const socketio = require('socket.io')
const createExpressApp = require('./app/createExpressApp')
//db conexion
require('./database/util/createDB')()
    .then(db => {
        console.log('Database connected Succesfully')
        //express se integra con la data bas
        const app = createExpressApp({ db })
        const server = http.createServer(app)
        //servidor creado y escuchando
        server.listen(PORT, () => console.log(`server ready on ${PORT}`))
        //web sockets recibe el servidor como parametro
        const io = socketio(server)
        //socket connection
        io.on('connection', socket => {
            console.log('un paciente o el administrador se ha conectado')
            //socket escucha evento drag & drop
            socket.on('drag and drop', drag => {
                io.emit('drag an drop', drag)
            })
            //socket escucha evento disconect
            socket.on('disconect', () => {
                console.log('el paciente o el administrado se ha desconectado')
            })
        })
    })




