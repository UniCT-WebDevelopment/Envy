#include <ArduinoJson.h>
#include <DevInfo.h>
#include <inttypes.h>
#include <event.h>
#include <string.h>

#ifndef _DEVICE_STATE_
#define _DEVICE_STATE_

#include <Device.h>

class Device;

class DeviceState
{
        friend class EventFactory;

    protected :

        deviceStatus state;
        sdEventStatus sstate;
        char sensorID[30];
        Device *device;
        dsEvent event;
        DeviceState(Device *device, deviceStatus state):device(device),state(state){}

    public : 

        deviceStatus getState();
        dsEvent getEvent();
        char* getSensorID();
        virtual void free() = 0;
        virtual void handleEvent(char *event) = 0;
        virtual void badEvent() = 0;
        virtual void deviceState(sdEventStatus code) = 0;
        virtual void sensorInfo() = 0;
        virtual void sensorIDList() = 0;
        virtual void loginPermission() = 0;
        virtual void sensorData(sensorType type, const char *sensorID) = 0;
        virtual void notifySensorEvent(const char *sensorID, dsEvent event) = 0;
        virtual void loop() = 0;
};

class ErrDeviceState : public DeviceState
{   
    public :
        
        ErrDeviceState(Device *device, deviceStatus state):DeviceState(device, state){}
        void free();
        void handleEvent(char *event);
        void badEvent();
        void deviceInfo();        
        void deviceState(sdEventStatus code);
        void sensorInfo();
        void sensorIDList();
        void loginPermission();
        void sensorData(sensorType type, const char *sensorID);
        void notifySensorEvent(const char *sensorID, dsEvent event);
        void loop();
}; 

class UnkDeviceState : public ErrDeviceState
{   
    public :
        
        UnkDeviceState(Device *device);
        void handleEvent(char *event);
        void deviceInfo();        
};

class SensUnkDeviceState : public ErrDeviceState
{
    public :

        SensUnkDeviceState(Device *device);
        void handleEvent(char *event);
        void sensorInfo();
};

class SensRegDeviceState : public ErrDeviceState
{
        void copySensorID(DynamicJsonDocument *buff);
    
    public :

        SensRegDeviceState(Device *device);
        void handleEvent(char *event);
        void sensorIDList();
};

class RegDeviceState : public ErrDeviceState
{
    public :

        RegDeviceState(Device *device);
        void handleEvent(char *event);
        void loginPermission();
};

class LogDeviceState : public ErrDeviceState
{
    public :

        LogDeviceState(Device *device);
        void handleEvent(char *event);
        void sensorData(sensorType type, const char *sensorID);
        void notifySensorEvent(const char *sensorID, dsEvent event);
        void loop();
};

#endif







