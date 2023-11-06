const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  client.subscribe("presence", (err) => {
    if (!err) {
      client.publish("presence", "Hello mqtt");
    }
  });
});
