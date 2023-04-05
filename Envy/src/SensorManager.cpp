#include <SensorManager.h>

SensorManager :: SensorManager(THSensWrapper *ths[TH_SENSOR_NUM], PRSensWrapper *prs[PR_SENSOR_NUM], LMSensWrapper *lms[LM_SENSOR_NUM])
{
    memcpy(this->ths, ths, sizeof(THSensWrapper *) * TH_SENSOR_NUM);
    memcpy(this->lms, lms, sizeof(LMSensWrapper *) * LM_SENSOR_NUM);
    memcpy(this->prs, prs, sizeof(PRSensWrapper *) * PR_SENSOR_NUM);
}

float SensorManager :: readTemperature(const char *sensorID)
{
    for(uint8_t i = 0; i < TH_SENSOR_NUM; i++)
        if(!strcmp(this->ths[i]->getSensorID(), sensorID))
        {
            Serial.println(sensorID);
            return ths[i]->readTemperature();
        }
    return -1;
}

float SensorManager :: readHumidity(const char *sensorID)
{
    for(uint8_t i = 0; i < TH_SENSOR_NUM; i++)
        if(!strcmp(ths[i]->getSensorID(), sensorID))
        {
            Serial.println(sensorID);
            return ths[i]->readHumidity();
        }
    return -1;
}

uint16_t SensorManager :: readLuminosity(const char *sensorID)
{
    for(uint8_t i = 0; i < LM_SENSOR_NUM; i++)
        if(!strcmp(lms[i]->getSensorID(), sensorID))
        {
            Serial.println(sensorID);
            return lms[i]->readLuminosity();
        }
    return -1;
}

void SensorManager :: initSensor()
{
    for(uint8_t i = 0; i < LM_SENSOR_NUM; i++)
        lms[i]->init();
    for(uint8_t i = 0; i < PR_SENSOR_NUM; i++)
        prs[i]->init();
    for(uint8_t i = 0; i < TH_SENSOR_NUM; i++)
        ths[i]->init();
}
