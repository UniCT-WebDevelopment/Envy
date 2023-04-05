#include <Sensor.h>

#ifndef _TH_WRAP_
#define _TH_WRAP_

class THSensWrapper : public Sensor 
{
    public :

        THSensWrapper():Sensor(DHT_11_MODEL, TH_TYPE){}
        virtual float readTemperature() = 0;
        virtual float readHumidity() = 0; 
};

#endif

#ifndef _PR_WRAP_
#define _PR_WRAP_

class PRSensWrapper : public Sensor
{
    public :       
        
        PRSensWrapper(sensorModel model, sensorType type):Sensor(model, type){}
        virtual unsigned long int getPrTime() = 0;
        virtual bool presence() = 0;
        virtual bool isBegin() = 0;
        virtual bool dataAvailable() = 0;
        virtual void start(unsigned long int start) = 0; 
        virtual void stop(unsigned long int stop) = 0;
        virtual void reset() = 0;
};

#endif

#ifndef _LM_WRAP_
#define _LM_WRAP_

class LMSensWrapper : public Sensor
{
    public :

        LMSensWrapper():Sensor(RES_MODEL, LUM_TYPE){}
        virtual double readLuminosity() = 0;
};

#endif
