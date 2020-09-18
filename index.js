const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 2001
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

io.on('connection', socket => {
    return null
})

app.io = io

app.get('/', (req,res) => {
    res.status(200).send('<p>Musito Farm-App API</p>')
})

const { 
   kandangRouter,
   userRouter
} = require('./router')

app.use('/kandang', kandangRouter)
app.use('/user', userRouter)

// app.listen(port , ()=>{
//     console.log('api akitf bro')
// })

server.listen(port, () => {
    console.log('API Farm-App in ' + port)
})
