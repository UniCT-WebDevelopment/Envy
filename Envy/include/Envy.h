#include <WebSocketsClient_Generic.h>
#include <SocketIOclient_Generic.h>

#ifndef _ENVY_TYPE_
#define _ENVY_TYPE_

#include <Arduino.h>
#include <ArduinoJson.h>
#include <SensorManager.h>
#include <NetInfo.h>
#include <DevInfo.h>
#include <EventFactory.h>
#include <Observer.h>
#include <Device.h>
#include <Observer.h>

typedef SocketIOclient::SocketIOclientEvent EventHandler;

class EnvyState;
class FreeEnvyState;
class BusyEnvyState;
class Envy;

class EnvyState 
{
    protected :

        Envy *envy;
        void logState(const char *state);

    public : 

        EnvyState(Envy *envy):envy(envy){}
        virtual void loop() = 0; 
};

class FreeEnvyState : public EnvyState
{
    public:
        
        FreeEnvyState(Envy *envy):EnvyState(envy){ this->logState("FreeEnvyState"); }
        void loop();
};

class BusyEnvyState : public EnvyState
{
    public:
        
        BusyEnvyState(Envy *envy):EnvyState(envy){ this->logState("BusyEnvyState"); }
        void loop(); 
};

class Envy : public Observer
{
        friend class EnvyState;
        friend class FreeEnvyState ;
        friend class BusyEnvyState ;

    protected :
        
        EnvyState *state;
        Device *device;
        EventFactory *factory;
        SocketIOclient *socketIO;

        dsEvent getEvent();
        DynamicJsonDocument* getPayload();
        void initSocketIO(uint16_t recTimeInt, const char * auth, EventHandler handler);

    public :

        Envy(Device *device, SocketIOclient *socketIO, EventFactory *factory):device(device),socketIO(socketIO),factory(factory){}
        void init(EventHandler handler);
        void loop();
        void handleEvent(char *event);
        void update();
};

void Envy :: init(EventHandler handler)
{
    state = new FreeEnvyState(this);
    device->init();
    device->attach(this);
    Serial.println("Envy v1.0");
    initSocketIO(10000, "Authorization: 1234567890", handler);
}

void Envy :: initSocketIO(uint16_t recTimeInt, const char * auth, EventHandler handler)
{
    socketIO->setReconnectInterval(recTimeInt);
    socketIO->setExtraHeaders(auth);
    socketIO->begin(*(device->getRemoteIP()), device->getRemotePort());
    socketIO->onEvent(handler);
}

void Envy :: loop(){ this->state->loop(); }

void Envy :: update(){ this->state = new BusyEnvyState(this); }

void Envy :: handleEvent(char* event){ this->device->handleEvent(event); }

void EnvyState :: logState(const char *state)
{
    Serial.printf("[EnvyState][%s]\n", state);
}

void BusyEnvyState :: loop()
{
    String str;
    this->envy->factory->factoryMethod(&str, this->envy->device->getEvent());
    this->envy->socketIO->sendEVENT(str);
    Serial.print("[Envy][dispatch]");
    Serial.println(str);
    this->envy->device->free();
    this->envy->state = new FreeEnvyState(this->envy);
}

void FreeEnvyState :: loop()
{
    this->envy->device->loop();
}

#endif
