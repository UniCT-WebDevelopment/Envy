
#ifndef _SENSOR_CONFIG_
#define _SENSOR_CONFIG_

#include <Arduino.h>
#include <inttypes.h>

#define _USE_DHT_ true

#if _USE_DHT_    
    #include <DHT.h>
    #include <Adafruit_Sensor.h>
#endif

#define SENSOR_NUM 3
#define TH_SENSOR_NUM 1
#define PR_SENSOR_NUM 1
#define LM_SENSOR_NUM 1
#define SENS_ID_SIZE 30 

#ifndef _SENSOR_MODEL_
#define _SENSOR_MODEL_

typedef enum SENSOR_MODEL
{
    DHT_11_MODEL = 0,
    HC_SR_501_MODEL = 1,
    RES_MODEL = 2
}sensorModel;

#endif

#ifndef _SENSOR_TYPE_
#define _SENSOR_TYPE_

typedef enum SENSOR_TYPE
{
    TH_TYPE = 0,
    PIR_TYPE = 1,
    LUM_TYPE = 2
}sensorType;

#endif

#endif