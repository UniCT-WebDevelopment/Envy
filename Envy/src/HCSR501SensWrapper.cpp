#include <HCSR501SensWrapper.h>

bool HCSR501SensWrapper :: presence(){ return digitalRead(pin); }

bool HCSR501SensWrapper :: isBegin(){ return begin; }

bool HCSR501SensWrapper ::  dataAvailable(){ return available;}

unsigned long int HCSR501SensWrapper ::  getPrTime(){ return (time - 3000) > 0 ?  (time - 3000) : 0; }

void HCSR501SensWrapper :: start(unsigned long int start)
{ 
    begin = false;
    this->time = start; 
}

void HCSR501SensWrapper :: stop(unsigned long int stop)
{ 
    available = true;
    this->time = stop - time; 
}

void HCSR501SensWrapper :: reset()
{ 
    begin = true;
    available = false;
    this->time = 0;
}

void HCSR501SensWrapper :: init(){}