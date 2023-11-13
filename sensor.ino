#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include <ArduinoJson.h>
#define DHTPIN 23
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "ETEC-UBA";
const char* password = "ETEC-alumnos@UBA";

const char* mqtt_server = "10.9.120.185";

WiFiClient ESP32Client;
PubSubClient client(ESP32Client);

float t = 0;
float h = 0;

StaticJsonDocument<200> doc;

void setUp_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  for (int i = 0; i < length; i++) {
  Serial.print((char)message[i]);
  messageTemp += (char)message[i];
  }
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  delay(100);
  dht.begin();
  setUp_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  doc["ubicacion"] = "aula313";
  doc["humedad"] = 0;
  doc["temperatura"] = 0;
}
void reconnect() {
  while (!client.connected()) {
  Serial.print("Attempting MQTT connection...");
  if (client.connect("ESP32Client")) {
	Serial.println("connected");
	if(client.subscribe("/cargar")==true){
  	Serial.println("se suscribio correctamente");
	}
  } else {
	Serial.print("failed, rc=");
	Serial.print(client.state());
	Serial.println(" try again in 5 seconds");
	delay(5000);
  }
  }
}
void loop() {
  if (!client.connected()) {
  reconnect();
  }
  client.loop();
  delay(2000);
  t = dht.readTemperature();
  h = dht.readHumidity();
  if (isnan(t)||isnan(h)) {
  Serial.println(F("Failed to read from DHT sensor!"));
  return;
  }
  char tempString[8];
  dtostrf(t, 1, 2, tempString);
  doc["temperatura"] = tempString;
  char humString[8];
  dtostrf(h, 1, 2, humString);
  doc["humedad"] = humString;
  char jsonConvertidoACharN[100];
  serializeJson(doc, jsonConvertidoACharN, 100);
  client.publish("/cargar",jsonConvertidoACharN);
}
