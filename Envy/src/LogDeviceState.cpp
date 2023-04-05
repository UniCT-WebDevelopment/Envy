#include <DeviceState.h>

LogDeviceState :: LogDeviceState(Device *device):ErrDeviceState(device, LOGGED){}

void LogDeviceState :: handleEvent(char *event)
{
    DynamicJsonDocument buff(1024);
    deserializeJson(buff, event);
    if(!strcmp(buff[0].as<const char *>(), "sensorData"))
        return this->sensorData((sensorType) buff[1]["type"].as<uint16_t>(), buff[1]["_id"].as<const char *>());
    this->badEvent();
}

void LogDeviceState :: sensorData(sensorType type, const char *sensorID)
{
    if(type == TH_TYPE)
        this->event = TH_DATA_ACK;
    if(type == PIR_TYPE)
        this->event = PR_DATA_ACK;
    if(type == LUM_TYPE)
        this->event = LM_DATA_ACK;
    strcpy(this->sensorID, sensorID);
    this->device->notify();
}

void LogDeviceState :: notifySensorEvent(const char *sensorID, dsEvent event)
{ 
    Serial.printf("[LogDeviceState][sensorEvent][sensorID][%s][event][%i]\n", sensorID, event);
    strcpy(this->sensorID, sensorID); 
    this->event = event; 
    this->device->notify();
}

void LogDeviceState :: loop()
{
    this->device->checkSensorUpdate();
}