#include <SensorConfig.h>
#include <DHTSensWrapper.h>
#include <PPRSensWrapper.h>
#include <HCSR501SensWrapper.h>
#include <Envy.h>
#include <LED.h>

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length);
IPAddress remoteIP(192, 168, 0, 5);
uint8_t mac[] = {0x0, 0x16, 0x67, 0x1, 0x9B, 0x3C}; 
NetInfo remoteNetInfo(8000, &remoteIP);
DHT dht(D5, DHT11);
DHTSensWrapper s0(&dht);
HCSR501SensWrapper s1(D6);
PPRSensWrapper s2(A5);
Sensor *sensorSet[] = {&s0, &s1, &s2};
THSensWrapper *ths[] = {&s0}; 
PRSensWrapper *prs[] = {&s1}; 
LMSensWrapper *lms[] = {&s2}; 
McuInfo mcu(STM32F401RE_MOD, STM32, ARM);
BoardInfo board(NUCLEO_64_STM32F401RE, _NUCLEO_64_);
DevInfo info(&mcu, &board, sensorSet);
Device device(mac, &info, &remoteNetInfo, ths, prs, lms, D7, true);
EventFactory factory(&device);
SocketIOclient socketIO;
Envy envy(&device, &socketIO, &factory);

void setup()
{ 
    Serial.begin(115200);
    envy.init(socketIOEvent); 
}

void loop()
{
    socketIO.loop();
    envy.loop();
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) 
{
    switch (type) 
    {
        case sIOtype_DISCONNECT:
            Serial.println("[IOc] Disconnected");
            envy.handleEvent(NULL);
            break;
        case sIOtype_CONNECT:
            Serial.print("[IOc] Connected to url: ");
            Serial.println((char*) payload);
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
            Serial.print("[IOc] Get event: ");
            Serial.println((char*) payload);
            envy.handleEvent((char*) payload);
            break;
        case sIOtype_ACK:
            Serial.print("[IOc] Get ack: ");
            Serial.println(length);      
            break;
        case sIOtype_ERROR:
            Serial.print("[IOc] Get error: ");
            Serial.println(length);
            break;
        case sIOtype_BINARY_EVENT:
            Serial.print("[IOc] Get binary: ");
            Serial.println(length);
            break;
        case sIOtype_BINARY_ACK:
            Serial.print("[IOc] Get binary ack: ");
            Serial.println(length);
            break;  
        default:
      break;  
  }
}
