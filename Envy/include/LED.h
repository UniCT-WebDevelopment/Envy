#ifndef _LED_
#define _LED_

class LED
{
        uint16_t pin;

    public : 

        LED(uint16_t pin):pin(pin){}
        void init(){ pinMode(pin, OUTPUT); }
        void on(){ digitalWrite(pin, HIGH); }
        void off(){ digitalWrite(pin, LOW); }
};

#endif