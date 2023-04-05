#include  <DeviceState.h>

void ErrDeviceState :: free()
{
    if(this->event == DEVICE_STATUS_ACK)
        this->device->changeState(this->state, this->sstate);
    if(this->event == PR_DATA_ACK )
        this->device->clearSensorEventReq(this->sensorID);
}

void ErrDeviceState :: deviceState(sdEventStatus code)
{
    this->sstate = code;
    this->event = DEVICE_STATUS_ACK;
    this->device->notify();
}

void ErrDeviceState :: badEvent(){ this->device->disconnected(); }
void ErrDeviceState :: handleEvent(char *event){ this->badEvent(); }
void ErrDeviceState :: deviceInfo(){ this->badEvent(); }
void ErrDeviceState :: sensorInfo(){ this->badEvent(); }
void ErrDeviceState :: loginPermission(){ this->badEvent(); }
void ErrDeviceState :: sensorIDList(){ this->badEvent(); }
void ErrDeviceState :: sensorData(sensorType type, const char *sensorID){ this->badEvent(); }
void ErrDeviceState :: notifySensorEvent(const char *sensorID, dsEvent event){}
void ErrDeviceState :: loop(){}