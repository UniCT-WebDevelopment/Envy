#include <SensorWrapper.h>

#ifndef _PPR_WRAP_
#define _PPR_WRAP_

class PPRSensWrapper : public LMSensWrapper
{   
        uint8_t pin;
        double alumen(int RawADC0);

    public :

        PPRSensWrapper(uint8_t pin):pin(pin)
        {
            pinMode(pin, INPUT);
        }
        double readLuminosity();
        void init();
};

#endif
