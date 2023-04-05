#include <SensorWrapper.h>

#ifndef _SENSOR_MANAGER_
#define _SENSOR_MANAGER_

class SensorManager
{
        THSensWrapper *ths[TH_SENSOR_NUM];
        PRSensWrapper *prs[PR_SENSOR_NUM];
        LMSensWrapper *lms[LM_SENSOR_NUM];

    public :

        SensorManager(THSensWrapper *ths[TH_SENSOR_NUM], PRSensWrapper *prs[PR_SENSOR_NUM], LMSensWrapper *lms[LM_SENSOR_NUM]);
        void  initSensorPointer(THSensWrapper *ths);
        float readTemperature(const char *sensorID);
        float readHumidity(const char *sensorID);
        uint16_t readLuminosity(const char *sensorID);
        THSensWrapper** getSensor(){ return this->ths; }
        void initSensor();
};

#endif