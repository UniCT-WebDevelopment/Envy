#ifndef _DEVICE_TYPE_
#define _DEVICE_TYPE_

#include <DeviceState.h>
#include <NetInfo.h>
#include <DevInfo.h>
#include <SensorWrapper.h>
#include <SensorManager.h>
#include <EventFactory.h>
#include <Subject.h>
#include <LED.h>

class DeviceState;
class THSensWapper;
class PRSensWapper;
class LMSensWapper;

class Device : public Subject
{    
    protected:
        
        friend class DeviceState;
        friend class UnkDeviceState;
        friend class ErrDeviceState;
        friend class SensUnkDeviceState;
        friend class SensRegDeviceState;
        friend class RegDeviceState;
        friend class LogDeviceState;
        friend class EventFactory;

        LED *l;
        THSensWrapper *ths[TH_SENSOR_NUM];
        PRSensWrapper *prs[PR_SENSOR_NUM];
        LMSensWrapper *lms[LM_SENSOR_NUM];
        uint8_t *mac;
        NetInfo *localNetInfo;
        NetInfo *remoteNetInfo;
        DevInfo *info;
        DeviceState *state;
        Observer *observer;
        bool autoLogin;

        void initDevice(uint8_t *mac, DevInfo *info, NetInfo *remoteNetInfo, bool autoLogin);
        void fillSensorSet(THSensWrapper *ths[TH_SENSOR_NUM], PRSensWrapper *prs[PR_SENSOR_NUM], LMSensWrapper *lms[LM_SENSOR_NUM]);
        void fillLedSet(LED *ledSet[LED_NUM]);
        void displayNetInfo();
        void initConnection(IPAddress *localAddr);
        void initConnection();
        void initEthernet();
        void setSDcard(bool status);
        void logSPIpinout();
        void initSensor();
        void initLed();
        deviceStatus transFunc(deviceStatus state, sdEventStatus resp);
        void changeState(deviceStatus state, sdEventStatus event);
        
        void disconnected();
        float readTemperature(const char *sensorID);
        float readHumidity(const char *sensorID);
        uint16_t readLuminosity(const char *sensorID);
        unsigned long int readPrTime(const char * sensorID);
        void clearSensorEventReq(const char * sensorID);
        void checkPIRSensoUpdate();
        void checkSensorUpdate();
        
    public:
    
        Device(uint8_t *mac, DevInfo *info, NetInfo *localNetInfo, NetInfo *remoteNetInfo, THSensWrapper *ths[TH_SENSOR_NUM], PRSensWrapper *prs[PR_SENSOR_NUM], LMSensWrapper *lms[LM_SENSOR_NUM], uint16_t ledPin, bool autoLogin);
        Device(uint8_t *mac, DevInfo *info, NetInfo *remoteNetInfo, THSensWrapper *ths[TH_SENSOR_NUM], PRSensWrapper *prs[PR_SENSOR_NUM], LMSensWrapper *lms[LM_SENSOR_NUM], uint16_t ledPin, bool autoLogin);
        void init();
        void handleEvent(char *event);
        dsEvent getEvent();
        IPAddress *getLocalIP();
        IPAddress *getRemoteIP();
        uint16_t getLocalPort();
        uint16_t getRemotePort();
        void free();
        void notify();
        void attach(Observer *observer);
        void loop();
};

#endif

