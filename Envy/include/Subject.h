#ifndef _SUBJECT_TYPE_
#define _SUBJECT_TYPE_
#include <Observer.h>

class Observer;

class Subject
{
    protected :

        Observer *obs;

    public :

        Subject(){}
        virtual void attach(Observer *obs);
        virtual void notify();
};

#endif