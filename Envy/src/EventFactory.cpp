#include <EventFactory.h>

void EventFactory :: buildJsonDeviceInfo(DynamicJsonDocument *doc)
{
    (*doc)[0] = "deviceInfoReply";
    (*doc)[1]["_id"] = *(this->device->info->getDevID());
    (*doc)[1]["mcu"]["arc"] = this->device->info->mcu->arc;
    (*doc)[1]["mcu"]["family"] = this->device->info->mcu->family;
    (*doc)[1]["mcu"]["model"] = this->device->info->mcu->model;
    (*doc)[1]["board"]["family"] =  this->device->info->board->family;
    (*doc)[1]["board"]["model"] =  this->device->info->board->model;
}

void EventFactory :: buildJsonDeviceState(DynamicJsonDocument *doc)
{
    (*doc)[0] = "deviceStateReply";
    (*doc)[1]["_id"] = *(this->device->info->getDevID());
    (*doc)[1]["state"] = this->device->state->getState();
}

void EventFactory :: buildJsonSensorInfo(DynamicJsonDocument *doc)
{
    (*doc)[0] = "sensorInfoReply";
    (*doc)[1]["_id"] = *(this->device->info->getDevID());
    for (uint8_t i = 0; i < SENSOR_NUM; i++)
    {
        (*doc)[1]["list"][i]["model"] = this->device->info->sensor[i]->getModel();
        (*doc)[1]["list"][i]["type"] = this->device->info->sensor[i]->getType();
        (*doc)[1]["list"][i]["sensorNum"] = i;
    }
}

void EventFactory :: buildJsonSensorIDList(DynamicJsonDocument *doc)
{
    (*doc)[0] = "sensorIDListAck";
    (*doc)[1]["_id"] = *(this->device->info->getDevID());
    for (uint8_t i = 0; i < SENSOR_NUM; i++)
        (*doc)[1]["list"][i]["sensorID"] = String(this->device->info->sensor[i]->getSensorID());
}

void EventFactory :: buildJsonLOGIN(DynamicJsonDocument *doc)
{
    (*doc)[0] = "login";
    (*doc)[1]["_id"] = *(this->device->info->getDevID());
}

void EventFactory :: buildJsonTH(DynamicJsonDocument *doc)
{
    (*doc)[0] = "sensorData";
    (*doc)[1]["type"] = "tempHum";
    (*doc)[1]["measureInfo"]["sensorID"] = String(this->device->state->getSensorID());
    (*doc)[1]["measureInfo"]["temp"] = this->device->readTemperature(this->device->state->getSensorID());
    (*doc)[1]["measureInfo"]["hum"] = this->device->readHumidity(this->device->state->getSensorID());
}

void EventFactory :: buildJsonPR(DynamicJsonDocument *doc)
{
    (*doc)[0] = "sensorData";
    (*doc)[1]["type"] = "presence";
    (*doc)[1]["measureInfo"]["sensorID"] = String(this->device->state->getSensorID());
    (*doc)[1]["measureInfo"]["prTime"] = this->device->readPrTime(this->device->state->getSensorID());
}

void EventFactory :: buildJsonLM(DynamicJsonDocument *doc)
{
    (*doc)[0] = "sensorData";
    (*doc)[1]["type"] = "luminosity";
    (*doc)[1]["measureInfo"]["sensorID"] = String(this->device->state->getSensorID());
    (*doc)[1]["measureInfo"]["lum"] = this->device->readLuminosity(this->device->state->getSensorID());
}

void EventFactory :: factoryMethod(String *event, dsEvent eventType)
{
    DynamicJsonDocument buff(2048);       
    switch(eventType)
    {
        case DEVICE_INFO_ACK :
            buildJsonDeviceInfo(&buff);
            serializeJson(buff, *event);
            break;
        case SENSOR_INFO_ACK :
            buildJsonSensorInfo(&buff);
            serializeJson(buff, *event);
            break;
        case SENSOR_ID_LIST_ACK :
            buildJsonSensorIDList(&buff);
            serializeJson(buff, *event);
            break;
        case DEVICE_STATUS_ACK :
            buildJsonDeviceState(&buff);
            serializeJson(buff, *event);
            break;
        case LOGIN_REQ :
            buildJsonLOGIN(&buff);
            serializeJson(buff, *event);
            break;
        case TH_DATA_ACK :
            buildJsonTH(&buff);
            serializeJson(buff, *event);
            break;
        case LM_DATA_ACK :
            buildJsonLM(&buff);
            serializeJson(buff, *event);
            break;
        case PR_DATA_ACK :
            buildJsonPR(&buff);
            serializeJson(buff, *event);
            break;
    }
}