#include <DeviceState.h> 

RegDeviceState ::RegDeviceState(Device *device):ErrDeviceState(device, REGISTERED){}

void RegDeviceState :: handleEvent(char *event)
{
    DynamicJsonDocument buff(1024);
    deserializeJson(buff, event);
    if(!strcmp(buff[0].as<const char *>(), "deviceState"))
        return this->deviceState((sdEventStatus)buff[1]["code"].as<uint16_t>());
    if(!strcmp(buff[0].as<const char *>(), "loginPermission")) 
        return this->loginPermission();
    this->badEvent();
}

void RegDeviceState :: loginPermission()
{
    if(this->device->autoLogin)
    {
        this->event = LOGIN_REQ;
        this->device->notify();
    }
}