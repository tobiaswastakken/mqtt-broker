const mqtt = require('mqtt')
const serialport = require('serialport')

const port = new serialport('serialport en el arduino ide',{
    baudRate: 9600
})
const parser = port.pipe(new serialport.parsers.Readline({delimiter: '\n'}))

const pub = mqtt.connect('')

pub.on('connect', () => {
    parser.on('data', (data) => {
        pub.publish('topico', data)
    })
})