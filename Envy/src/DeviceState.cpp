#include <DeviceState.h>

deviceStatus DeviceState :: getState(){ return this->state; }
dsEvent DeviceState :: getEvent(){ return this->event; }
char* DeviceState :: getSensorID(){ return this->sensorID; }

