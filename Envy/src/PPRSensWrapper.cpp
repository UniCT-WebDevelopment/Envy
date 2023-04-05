#include <PPRSensWrapper.h>

double PPRSensWrapper :: alumen(int RawADC0)
{
    const double k = 5.0/1024;
    const double luxFactor = 500000;
    const double R2 = 10000;
    const double LowLightLimit = 200; 
    const double B = 1.25*pow(10.0,7);
    const double m = -1.4059;
    double V2 = k*RawADC0; 
    double R1 = (5.0/V2 - 1)*R2;
    double lux = B*pow(R1,m);  // luxFactor/R1;
    return lux;
}

double PPRSensWrapper :: readLuminosity(){ return alumen(analogRead(pin)); }

void PPRSensWrapper :: init(){}