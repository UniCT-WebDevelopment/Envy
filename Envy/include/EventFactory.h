#include <NetInfo.h>
#include <event.h>
#include <ArduinoJson.h>

#ifndef _EVENT_FACTORY_
#define _EVENT_FACTORY_

#include <Device.h>

class Device;

class EventFactory
{   
        Device *device;

        void buildJsonDeviceState(DynamicJsonDocument *doc);
        void buildJsonDeviceInfo(DynamicJsonDocument *doc);
        void buildJsonSensorInfo(DynamicJsonDocument *doc);
        void buildJsonSensorIDList(DynamicJsonDocument *doc);
        void buildJsonLOGIN(DynamicJsonDocument *doc);
        void buildJsonTH(DynamicJsonDocument *doc);
        void buildJsonPR(DynamicJsonDocument *doc);
        void buildJsonLM(DynamicJsonDocument *doc);    
    
    public:

        EventFactory(Device *device):device(device){}
        void factoryMethod(String *event, dsEvent eventType);
};

#endif