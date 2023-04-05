#include <ArduinoUniqueID.h>
#include <Sensor.h>

#ifndef _MCU_MODEL_
#define _MCU_MODEL_

typedef enum MCU_MODEL
{
    STM32F401RE_MOD = 0,
    ATMEGA328P_MOD
}mcuModel;

#endif

#ifndef _MCU_FAMILY_
#define _MCU_FAMILY_

typedef enum MCU_FAMILY
{
    STM32,
    AVR
}mcuFamily;

#endif

#ifndef _MCU_ARC_
#define _MCU_ARC_

typedef enum MCU_ARC
{
    ARM,
    HARWARD
}mcuArc;

#endif

#ifndef _BOARD_MODEL_
#define _BOARD_MODEL_

typedef enum BOARD_MODEL
{
    NUCLEO_64_STM32F401RE,
    ARDUINO_UNO_REV3
}boardModel;

#endif

#ifndef _BOARD_FAMILY_
#define _BOARD_FAMILY_

typedef enum BOARD_FAMILY
{
    _NUCLEO_64_,
    _ARDUINO_
}boardFamily;

#endif

#ifndef __DEVICE_STATE__
#define __DEVICE_STATE__

typedef enum DEVICE_STATE
{
    DEV_ERROR = 0,
    UNKNOW = 1,
    SENSOR_UNKNNOW = 2,
    SENSOR_REGISTERED = 3,
    REGISTERED,
    LOGGED,
}deviceStatus;

#endif

#ifndef _MCU_INFO_
#define _MCU_INFO_

class McuInfo
{
    public :
        
        McuInfo(mcuModel model, mcuFamily family, mcuArc arc):model(model), family(family), arc(arc){}
        mcuModel model;
        mcuFamily family;
        mcuArc arc;
};

#endif

#ifndef _BOARD_INFO_
#define _BOARD_INFO_

class BoardInfo
{
    public :

        BoardInfo(boardModel model, boardFamily family):model(model),family(family){}
        boardModel model;
        boardFamily family;
};

#endif

#ifndef _DEV_INFO_
#define _DEV_INFO_

class DevInfo
{
    public :

        String *devID;
        McuInfo *mcu;
        BoardInfo *board;
        Sensor *sensor[SENSOR_NUM];
        char buff[UniqueIDsize];
        DevInfo(McuInfo *mcu, BoardInfo *board, Sensor *sensor[]):mcu(mcu),board(board)
        {
            for(uint8_t i = 0; i < SENSOR_NUM; i++)
                this->sensor[i] = sensor[i];
        }
        void computeDevID()
        {
            for (uint8_t i = 0; i < UniqueIDsize; i++)
                sprintf((buff + i), "%0x", UniqueID[i]);
            devID =  new String(buff);
        }
        Sensor** getSensor(){ return this->sensor; }
        String* getDevID(){ return devID; }
};

#endif 

#define LED_NUM 1