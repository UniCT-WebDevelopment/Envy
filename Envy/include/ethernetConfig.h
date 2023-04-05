#include <Ethernet.h>

#if ( defined(ARDUINO_SAM_DUE) || defined(__SAM3X8E__) )
  // Default pin 10 to SS/CS
  #define USE_THIS_SS_PIN       10
  #define BOARD_TYPE      "SAM DUE"
#elif ( defined(CORE_TEENSY) )  
  #error You have to use examples written for Teensy
#endif

#ifndef BOARD_NAME
#define BOARD_NAME BOARD_TYPE
#endif

#define _WEBSOCKETS_LOGLEVEL_ 3

#define USE_UIP_ETHERNET false

// Only one if the following to be true
#define USE_ETHERNET true
#define USE_ETHERNET2 false
#define USE_ETHERNET3 false
#define USE_ETHERNET_LARGE false
#define USE_ETHERNET_ESP8266 false
#define USE_ETHERNET_ENC false

#if (USE_ETHERNET2 || USE_ETHERNET3 || USE_ETHERNET_LARGE || USE_ETHERNET)
#define WEBSOCKETS_NETWORK_TYPE NETWORK_W5100
#elif (USE_ETHERNET_ENC)
#define WEBSOCKETS_NETWORK_TYPE NETWORK_ETHERNET_ENC
#endif

#if USE_ETHERNET3
#include "Ethernet3.h"
#warning Using Ethernet3 lib
#define SHIELD_TYPE "W5x00 using Ethernet3 Library"
#elif USE_ETHERNET2
#include "Ethernet2.h"
#warning Using Ethernet2 lib
#define SHIELD_TYPE "W5x00 using Ethernet2 Library"
#elif USE_ETHERNET_LARGE
//  #include "EthernetLarge.h"
#warning Using EthernetLarge lib
#define SHIELD_TYPE "W5x00 using EthernetLarge Library"
#elif USE_ETHERNET_ESP8266
#include "Ethernet_ESP8266.h"
#warning Using Ethernet_ESP8266 lib
#define SHIELD_TYPE "W5x00 using Ethernet_ESP8266 Library"
#elif USE_ETHERNET_ENC
#include "EthernetENC.h"
#warning Using EthernetENC lib
#define SHIELD_TYPE "ENC28J60 using EthernetENC Library"
#else
#define USE_ETHERNET true
#include "Ethernet.h"
#warning Using Ethernet lib
#define SHIELD_TYPE "W5x00 using Ethernet Library"
#endif

#if (defined(ARDUINO_ARCH_RP2040) || defined(ARDUINO_RASPBERRY_PI_PICO) || defined(ARDUINO_ADAFRUIT_FEATHER_RP2040) || defined(ARDUINO_GENERIC_RP2040))
#if defined(ETHERNET_USE_RPIPICO)
#undef ETHERNET_USE_RPIPICO
#endif
#define ETHERNET_USE_RPIPICO true
#endif

#if ETHERNET_USE_RPIPICO
// Default pin 10 to SS/CS
#define USE_THIS_SS_PIN SS
#else
// Default pin 10 to SS/CS
#define USE_THIS_SS_PIN 10
#endif
// Only for W5100
#define SDCARD_CS 4
// Enter a MAC address and IP address for your controller below.
#define NUMBER_OF_MAC 20

// Select the IP address according to your local network
