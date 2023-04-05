#include <DeviceState.h>

SensRegDeviceState :: SensRegDeviceState(Device *device):ErrDeviceState(device, SENSOR_REGISTERED){}

void SensRegDeviceState :: handleEvent(char *event)
{
    DynamicJsonDocument buff(1024);
    deserializeJson(buff, event);
    if(!strcmp(buff[0].as<const char *>(), "sensorIDList"))
    {
        this->copySensorID(&buff);
        this->sensorIDList();
        return;
    }
    if(!strcmp(buff[0].as<const char *>(), "deviceState"))
        return this->deviceState((sdEventStatus)buff[1]["code"].as<uint16_t>());
    this->badEvent();
}

void SensRegDeviceState :: copySensorID(DynamicJsonDocument *buff)
{
    for(uint8_t i = 0; i < SENSOR_NUM; i++)
        strcpy(this->device->info->sensor[(*buff)[1][i]["sensorNum"].as<uint8_t>()]->getSensorID(),
            (*buff)[1][i]["_id"].as<const char *>());
}

void SensRegDeviceState :: sensorIDList()
{
    this->event = SENSOR_ID_LIST_ACK;
    this->device->notify();
}
