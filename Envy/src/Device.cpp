#include <Device.h>
#include <Arduino.h>

void Device :: disconnected()
{
    Serial.println("[Device][disconnected]");
    this->state = new UnkDeviceState(this);
}

deviceStatus Device :: transFunc(deviceStatus state, sdEventStatus resp)
{
    Serial.printf("[Device][stateTransition][state][%i][resp][%i]\n",state, resp);
    if(state == UNKNOW && resp == REG_DEN_CODE)
        return DEV_ERROR;
    if(state == UNKNOW && resp == DEV_ALR_REG_CODE)
        return SENSOR_UNKNNOW;
    if(state == UNKNOW && resp == DEVICE_INFO_ACK_CODE)
        return SENSOR_UNKNNOW;
    if(state == SENSOR_UNKNNOW && resp == SENSOR_INFO_CODE)
        return SENSOR_REGISTERED;
    if(state == SENSOR_REGISTERED && resp == SENSOR_REG_CODE)
        return REGISTERED;
    if(state == REGISTERED && resp == LOGIN_ACK_CODE)
        return LOGGED;
    if(state == REGISTERED && resp == DEV_ALR_LOG_CODE)
        return LOGGED;
    return DEV_ERROR;
}

dsEvent Device :: getEvent()
{
    return this->state->getEvent();
}

void Device :: changeState(deviceStatus state, sdEventStatus event)
{ 
    switch (transFunc(state, event))
    {
        case DEV_ERROR :
            Serial.println("[Device][newState][UnkDeviceState]");
            this->state = new UnkDeviceState(this);
            break;
        case SENSOR_UNKNNOW :
            Serial.println("[Device][newState][SensUnkDeviceState]");
            this->state = new SensUnkDeviceState(this);
            break;
        case SENSOR_REGISTERED :
            Serial.println("[Device][newState][SensRegDeviceState]");
            this->state = new SensRegDeviceState(this);
            break;
        case REGISTERED :
            Serial.println("[Device][newState][RegDeviceState]");
            this->state = new RegDeviceState(this);
            break;
        case LOGGED :
            Serial.println("[Device][newState][LogDeviceState]");
            this->state = new LogDeviceState(this);
            break;    
        default:
            this->state = new UnkDeviceState(this);
            break;
    }
}

void Device :: fillLedSet(LED *ledSet[LED_NUM])
{
   // this->ledSet[0] = ledSet[0];
    //memcpy(this->ledSet, ledSet, sizeof(LED *) * LED_NUM);
}

void Device :: fillSensorSet(THSensWrapper *ths[TH_SENSOR_NUM], PRSensWrapper *prs[PR_SENSOR_NUM], LMSensWrapper *lms[LM_SENSOR_NUM])
{
    memcpy(this->ths, ths, sizeof(THSensWrapper *) * TH_SENSOR_NUM);
    memcpy(this->lms, lms, sizeof(LMSensWrapper *) * LM_SENSOR_NUM);
    memcpy(this->prs, prs, sizeof(PRSensWrapper *) * PR_SENSOR_NUM);
}

void Device :: initDevice(uint8_t *mac, DevInfo *info, NetInfo *remoteNetInfo, bool autoLogin)
{
    this->autoLogin = autoLogin;
    this->mac = mac;
    this->remoteNetInfo = remoteNetInfo;
    this->info = info;
    this->state = new UnkDeviceState(this);
}

Device :: Device(uint8_t *mac, DevInfo *info, NetInfo *remoteNetInfo, THSensWrapper *ths[TH_SENSOR_NUM], PRSensWrapper *prs[PR_SENSOR_NUM], LMSensWrapper *lms[LM_SENSOR_NUM], uint16_t ledPin, bool autoLogin)
{
    l = new LED(ledPin);
    //this->fillLedSet(ledSet);
    this->fillSensorSet(ths, prs, lms);
    this->initDevice(mac, info, remoteNetInfo, autoLogin);
    this->localNetInfo = NULL;
}

Device :: Device(uint8_t *mac, DevInfo *info, NetInfo *localNetInfo, NetInfo *remoteNetInfo, THSensWrapper *ths[TH_SENSOR_NUM], PRSensWrapper *prs[PR_SENSOR_NUM], LMSensWrapper *lms[LM_SENSOR_NUM], uint16_t ledPin, bool autoLogin)
{
    l = new LED(ledPin);
   // this->fillLedSet(ledSet);
    this->fillSensorSet(ths, prs, lms);
    this->initDevice(mac, info, remoteNetInfo, autoLogin);
    this->localNetInfo = localNetInfo;
}

void Device ::setSDcard(bool status)
{
    pinMode(SDCARD_CS, OUTPUT);
    if (status)
        digitalWrite(SDCARD_CS, HIGH); // Deselect the SD card}
    else
        digitalWrite(SDCARD_CS, LOW); // Select the SD card
}

void Device ::logSPIpinout()
{
    Serial.println("Default SPI pinout:");
    Serial.printf("MOSI: %i \n", MOSI);
    Serial.printf("MISO: %i \n", MISO);
    Serial.printf("SCK: %i \n", SCK);
    Serial.printf("SS: %i \n", MOSI);
}

void Device ::initEthernet()
{
    #if !(USE_BUILTIN_ETHERNET || USE_UIP_ETHERNET)
    // For other boards, to change if necessary
    #if (USE_ETHERNET || USE_ETHERNET_LARGE || USE_ETHERNET2 || USE_ETHERNET_ENC)
        // Must use library patch for Ethernet, Ethernet2, EthernetLarge libraries
        Ethernet.init(USE_THIS_SS_PIN);
    #elif USE_ETHERNET3
        // Use  MAX_SOCK_NUM = 4 for 4K, 2 for 8K, 1 for 16K RX/TX buffer
    #ifndef ETHERNET3_MAX_SOCK_NUM
    #define ETHERNET3_MAX_SOCK_NUM 4
    #endif
        Ethernet.setCsPin(USE_THIS_SS_PIN);
        Ethernet.init(ETHERNET3_MAX_SOCK_NUM);
    #endif //( ( USE_ETHERNET || USE_ETHERNET_LARGE || USE_ETHERNET2  || USE_ETHERNET_ENC )
    #endif
        if (Ethernet.hardwareStatus() == EthernetNoHardware)
            Serial.println("Ethernet shield was not found.");
        else
            Serial.println("Ethernet shield found.");
        if (Ethernet.linkStatus() == LinkOFF)
            Serial.println("Ethernet cable is not connected.");
        else
            Serial.println("Ethernet cable found.");
}

void Device ::initConnection()
{
    Serial.println("Initialize Ethernet with DHCP:");
    if (!Ethernet.begin(mac))
        Serial.println("Failed to configure Ethernet using DHCP");
    else
    {
        Serial.print("IP : ");
        Serial.println(Ethernet.localIP());
    }
}

void Device ::initConnection(IPAddress *local_addr)
{
    Serial.println("Initialize Ethernet with static ip.");
    Ethernet.begin(mac, *local_addr);
    Serial.print("IP : ");
    Serial.println(Ethernet.localIP());
}

void Device ::displayNetInfo()
{
    Serial.print("Connecting IP address : ");
    Serial.print(*(this->remoteNetInfo->addr));
    Serial.print(", on port: ");
    Serial.println(this->remoteNetInfo->port);
}

void Device ::init()
{
    delay(2000);
    Serial.begin(115200);
    while (!Serial);
    logSPIpinout();
    setSDcard(true); //Deselect
    initLed();
    initConnection();
    initEthernet();
    initSensor();
    info->computeDevID();
    displayNetInfo();

}

void Device :: handleEvent(char *event){ this->state->handleEvent(event); }

void Device :: free(){ this->state->free(); }

IPAddress* Device :: getLocalIP(){ return this->localNetInfo->addr; }

IPAddress* Device :: getRemoteIP(){ return this->remoteNetInfo->addr; }

uint16_t Device :: getLocalPort(){ return this->localNetInfo->port; }

uint16_t Device :: getRemotePort(){ return this->remoteNetInfo->port; }

void Device :: notify(){ this->observer->update(); }

void Device :: attach(Observer *observer){ this->observer = observer;}

float Device :: readTemperature(const char *sensorID)
{
    for(uint8_t i = 0; i < TH_SENSOR_NUM; i++)
        if(!strcmp(ths[i]->getSensorID(), sensorID))
            return ths[i]->readTemperature();
    return -1;
}

float Device :: readHumidity(const char *sensorID)
{
    for(uint8_t i = 0; i < TH_SENSOR_NUM; i++)
        if(!strcmp(ths[i]->getSensorID(), sensorID))
            return ths[i]->readHumidity();
    return -1;
}

uint16_t Device :: readLuminosity(const char *sensorID)
{
    for(uint8_t i = 0; i < LM_SENSOR_NUM; i++)
        if(!strcmp(lms[i]->getSensorID(), sensorID))
            return lms[i]->readLuminosity();
    return -1;
}

unsigned long int Device :: readPrTime(const char * sensorID)
{
    for(uint8_t i = 0; i < PR_SENSOR_NUM; i++)
        if(!strcmp(prs[i]->getSensorID(), sensorID))
            return prs[i]->getPrTime();
    return 0;
}

void Device :: initSensor()
{
    for(uint8_t i = 0; i < LM_SENSOR_NUM; i++)
        lms[i]->init();
    for(uint8_t i = 0; i < PR_SENSOR_NUM; i++)
        prs[i]->init();
    for(uint8_t i = 0; i < TH_SENSOR_NUM; i++)
        ths[i]->init();
}

void Device :: checkPIRSensoUpdate()
{
    for(uint8_t i = 0; i < PR_SENSOR_NUM; i++)
    {
        if(prs[i]->presence() && prs[i]->isBegin())
        {
            Serial.printf("[Device][sensor][%s][presenceStart]\n", prs[i]->getSensorID());
            prs[i]->start(millis());
            l->on();
        }
        if(!prs[i]->presence() && !prs[i]->isBegin())
        {
            Serial.printf("[Device][sensor][%s][presenceStop]\n", prs[i]->getSensorID());
            prs[i]->stop(millis());
            l->off();
        }
        if(prs[i]->dataAvailable())
        {
            Serial.printf("[Device][sensor][%s][prTimeAvailable]\n", prs[i]->getSensorID());
            state->notifySensorEvent(prs[i]->getSensorID(), PR_DATA_ACK);
        }
    }   
}

void Device :: checkSensorUpdate(){ this->checkPIRSensoUpdate(); }

void Device :: clearSensorEventReq(const char * sensorID)
{
    for (uint8_t i = 0; i < PR_SENSOR_NUM; i++)
        if(!strcmp(prs[i]->getSensorID(), sensorID))
            prs[i]->reset();
}

void Device :: loop()
{
    this->state->loop();
}

void Device :: initLed()
{
    this->l->init();
   /* for (uint8_t i = 0; i < LED_NUM; i++)
        this->ledSet[i]->init();*/
}