import { Observer } from "./observer.mjs"

class Dispatcher extends Observer
{
	#dispatch(event, payload)
    {
        this.logEvent(event, payload);
        this.socket.emit(event, payload);    
    }

    constructor(socket, devStatusHandler)
    { 
        super(socket); 
    }

	logEvent(event, payload)
    {
      
    }

    update(event){ }
}




export { Dispatcher };