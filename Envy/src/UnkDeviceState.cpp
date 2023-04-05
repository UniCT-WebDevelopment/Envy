#include <DeviceState.h>

UnkDeviceState :: UnkDeviceState(Device *device):ErrDeviceState(device, UNKNOW){}

void UnkDeviceState :: handleEvent(char *event)
{
    DynamicJsonDocument buff(1024);
    deserializeJson(buff, event);
    if(!strcmp(buff[0].as<const char *>(), "deviceInfo"))
        return this->deviceInfo();
    if(!strcmp(buff[0].as<const char *>(), "deviceState"))
        return this->deviceState((sdEventStatus)buff[1]["code"].as<uint16_t>());
    this->badEvent();
}

void UnkDeviceState :: deviceInfo()
{     
    this->event = DEVICE_INFO_ACK;
    this->device->notify();
}

