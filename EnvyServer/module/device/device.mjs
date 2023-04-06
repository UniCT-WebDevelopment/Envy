class Device
{
    #socket;
    #state;
    #obsList;
	
    constructor(socket, dbm, obsList)
    {
        this.#socket = socket;
        this.#state = new UnkDevState(socket, this, dbm);
        this.#init();
        this.#obsList =[];
        for(let obs of obsList) 
            this.#obsList.push(obs);
    }
    #init()
    {
        console.log("[Device][Connection]["+this.#socket.id+"]");
        console.log("");
        this.#socket.on("deviceInfoReply", (dev) => this.#state.registration(dev));
        this.#socket.on("sensorInfoReply", (info) => this.#state.updateDevSens(info));
        this.#socket.on("sensorData", (data) => this.#state.sensorData(data));
        this.#socket.on("deviceStateReply", (data) => this.#state.deviceState(data));
        this.#socket.on("sensorIDListAck", (data) => this.#state.sensorIDList(data));
        this.#socket.on("login", (login) => this.#state.login(login));
        this.#socket.on("disconnect", (logout) => this.#state.logout(logout));
        this.#socket.on("logout", (logout) => this.#state.logout(logout));
        this.#socket.emit("deviceInfo");
    }
    changeState(state, transition)
    {
        this.#state = state;
        for(let obs of this.#obsList)
            obs.update(transition);
    }
    getID(){ return this.#socket.id; }
}

export { Device };