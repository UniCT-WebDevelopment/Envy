#ifndef _DHT_WRAP_
#define _DHT_WRAP_

#include <SensorWrapper.h>

class DHTSensWrapper : public THSensWrapper
{
        DHT *dht;

    public :

        DHTSensWrapper(DHT *dht):dht(dht){}
        float readTemperature(){ return dht->readTemperature(); }
        float readHumidity(){ return dht->readHumidity(); }
        void init(){ dht->begin(); }
};

#endif
