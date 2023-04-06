class SensEventDispatcher extends Observer
{
    #dbm;
    #thSensor;
    #prSensor;
    #lmSensor;
    #tmObj;
    constructor(socket, dbm)
    {
        super(socket);
        this.#dbm = dbm;
        this.#thSensor = [];
        this.#prSensor = [];
        this.#lmSensor = [];    
        this.#tmObj = [];
    }
    LogSensorList(sensorList, type)
    {
        console.log("[SensEventDispatcher][socketID]["+ this.socket.id + "]");
        console.log("[sensorList][type][" + type + "][sensorList]");
        console.log(sensorList);
        console.log("");
    }
    update(transition)
    {
        if(transition.currentState == "registered"  && transition.newState == "logged")
        {
            super.logUpdate("SensEventDispatcher", transition.currentState, transition.newState);
            this.#dbm.readDevIDSockID(this.socket.id).then(
            (id) =>
            {
                this.#dbm.readSensorList({"devID" : id, "type" : 0}, {"projection" : {"_id" : 1, "type" : 1}}).then(
                    (sensorList) => { this.#tmObj.push(setInterval(this.dispatchDataReq, 10000, sensorList, this.socket)); })
                this.#dbm.readSensorList({"devID" : id, "type" : 2}, {"projection" : {"_id" : 1, "type" : 1}}).then(
                    (sensorList) => { this.#tmObj.push(setInterval(this.dispatchDataReq, 10000, sensorList, this.socket)); })
            });
        }
        if(transition.currentState == "logged"  && (transition.newState == "disconnected" || transition.newState == "logout"))
        {
            super.logUpdate("SensEventDispatcher", transition.currentState, transition.newState);
            console.log("[SensEventDispatcher][stoppingPollingSensor]");
            console.log("");
            for(let interval of this.#tmObj)
                clearInterval(interval);
            this.#tmObj = [];
        }
    }
    dispatchDataReq(sensorList, socket)
    {
        for(let sensor of sensorList)
        {
            socket.emit("sensorData", {"_id" : ""+sensor._id, "type" : sensor.type});
            console.log("[SensEventDispatcher][dispatchDataRequest][sensorID]" + "[" + sensor._id + "]");
            console.log("");
        }
    }
}
