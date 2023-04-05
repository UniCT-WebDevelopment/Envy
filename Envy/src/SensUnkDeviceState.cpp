#include <DeviceState.h>

SensUnkDeviceState :: SensUnkDeviceState(Device *device):ErrDeviceState(device, SENSOR_UNKNNOW){}

void SensUnkDeviceState :: handleEvent(char *event)
{
    DynamicJsonDocument buff(1024);
    deserializeJson(buff, event);
    if(!strcmp(buff[0].as<const char *>(), "sensorInfo"))
        return this->sensorInfo();
    if(!strcmp(buff[0].as<const char *>(), "deviceState"))
        return this->deviceState((sdEventStatus)buff[1]["code"].as<uint16_t>());
    this->badEvent();
}

void SensUnkDeviceState :: sensorInfo()
{
    this->event = SENSOR_INFO_ACK;
    this->device->notify();
}
