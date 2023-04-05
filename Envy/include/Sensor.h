#ifndef _SENSOR_
#define _SENSOR_

#include <SensorConfig.h>

class Sensor
{
        sensorModel model;
        sensorType type; 
        char sensorID[SENS_ID_SIZE];
        bool dataRequest;
    
    public : 
        
        Sensor(sensorModel model, sensorType type):model(model), type(type), dataRequest(false){}   
        sensorModel getModel(){ return model; }
        sensorType getType(){ return type; }
        void getPin(uint8_t *pin, uint8_t *pinNum);
        char* getSensorID(){ return sensorID; }
        virtual void init() = 0;

};

#endif
