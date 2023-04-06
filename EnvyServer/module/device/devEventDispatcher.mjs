class DevEventDispatcher extends Observer
{

    constructor(socket)
    { 
        super(socket); 
        this ; 
    }
   
    update(transition)
    {
        super.logUpdate("DevEventDispatcher", transition.currentState, transition.newState);
        if(transition.newState == "badEvent")
        {
            this.LogEvent("BadEvent");
            this.socket.emit("BadEvent");
            this.socket.disconnect();
        }
        if(transition.currentState == "unknow" && transition.newState == "sensUnk")
        {
            this.LogEvent("sensorInfo");
            this.socket.emit("sensorInfo", transition.payload);    
        }
        if(transition.currentState == "sensUnk" && transition.newState == "sensRegistered")
        {
            this.LogEvent("sensorIDList", transition.payload);
            this.socket.emit("sensorIDList", transition.payload);
        }
        if(transition.currentState == "sensRegistered" && transition.newState == "registered")
        {
            this.LogEvent("loginPermission");
            this.socket.emit("loginPermission");
        }
    }
    dispatchStateChange(state)
    {
        this.LogEvent("deviceState", state);
        this.socket.emit("deviceState", state);    
    }
}