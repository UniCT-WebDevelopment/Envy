#include <ethernetConfig.h>

#ifndef _NET_INFO_
#define _NET_INFO_

class NetInfo
{
    public :
        
        uint16_t port;
        IPAddress *addr;
        NetInfo(uint16_t port, IPAddress *addr):port(port),addr(addr){}
};

#endif