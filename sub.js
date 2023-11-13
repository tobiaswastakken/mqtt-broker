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
    let now = new Date();
    message = JSON.parse(message)
    miConsulta = "INSERT INTO cargar (ubicacion,humedad,temperatura,fecha) VALUES ('" + message.ubicacion+ "','" + message.humedad + "','" + message.temperatura + "', + now());"
    console.log(message)
    db.query(
        miConsulta,
        {data: message},
        (err, rows) => {
            if(!err) console.log('se guardo')
        }
    )
})