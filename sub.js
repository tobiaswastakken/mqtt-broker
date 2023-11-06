const mqtt = require('mqtt')
const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: '',
    password: '',
    database: ''
})

db.connect(() => {
    console.log('todo piola')
})

const sub = mqtt.connect('mqtt://localhost:9000')

sub.on('connect', () => {
    sub.subscribe(' topico')
})

sub.on('message', (topic, message) => {
    message = message.toString()
    message = message.split(' ')
    message = parseInt(message[1])
    console.log(message)
    db.query(
        'insert into  set ?',
        {data: message},
        (err, rows) => {
            if(!err) console.log('data saved!')
        }
    )
})