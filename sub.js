const mqtt = require('mqtt')
const mysql = require('mysql')


const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'uba',
    database: 'sistemas_embebidos_integrador'
})

db.connect(() => {
    console.log('todo piola')
})

const sub = mqtt.connect('mqtt://localhost:1883')

sub.on('connect', () => {
    sub.subscribe('/cargar')
    console.log("se suscribrio al topico")
})



sub.on('message', (topic, message) => {
    message = message.toString()
    message = message.split(" ")
    console.log("test " + message)
    miConsulta = "INSERT INTO cargar (ubicacion,modelo,valor) VALUES ('" + message[1]+ "','" + message[2] + "','" + message[3] + "');"
    db.query(
        miConsulta,
        {data: message},
        (err, rows) => {
            if(!err) console.log('se guardo')
        }
    )
})