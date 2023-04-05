#ifndef _HCSR501_DISPATCHER_
#define _HCSR501_DISPATCHER_

#include <SensorWrapper.h>

class HCSR501SensWrapper : public PRSensWrapper
{
    protected :

        uint8_t pin;
        bool begin;
        bool available;

    public :       

        HCSR501SensWrapper(uint8_t pin):PRSensWrapper(HC_SR_501_MODEL, PIR_TYPE),pin(pin),time(0),begin(true)
        {
            pinMode(pin, INPUT);
        };
        unsigned long int time;
        bool presence();
        bool isBegin();
        bool dataAvailable();
        unsigned long int getPrTime();
        void start(unsigned long int start);
        void stop(unsigned long int stop);
        void reset();
        void init();
};

#endif