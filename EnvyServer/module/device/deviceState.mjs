import { DeviceDBManager } from "../system/deviceDBManager.mjs"

class StateTransition
{
    constructor(currentState, newState, payload)
    {
        this.currentState = currentState;
        this.newState = newState;
        this.payload = payload;
    }
    currentState;
    newState;
    payload;
}

class DevState
{
    #socket;
    #device;
    dbm;

    constructor(socket, device, dbm)
    {
        this.#socket = socket;
        this.#device = device; 
        this.#dbm = DeviceDBManager.instance();
    }
    LogEvent(subject, event, payload)
    {
        console.log("["+ subject +"][socketID][" + this.socket.id + "][event]["+ event +"]");
        console.log("[payload]");
        console.log(payload);
        console.log("");
    }
    error(err){this.socket.emit(err);}
    registration(dev){} 
    updateDevSens(sensorList){}
    login(dev){}
    logout(dev){}
    sensorData(data, type){}
    deviceState(status){}
}

class ErrDevState extends DevState
{
    prevState;
    constructor(socket, device, dbm, prevState)
    {
        super(socket, device, dbm); 
        this.prevState = prevState; 
    }
    #error(id, code)
    {
        const state = new ErrDevState(this.socket, this.device, this.dbm);
        const transition = new StateTransition(this.prevState, "error", code);
		this.dbm.updateDevStatus(id, "error");
        this.device.changeState(state, transition);
    }
    registration(dev){ this.error({"code" : 466}); } 
    updateDevSens(sensorList){ this.error({"code" : 466}); }
    sensorIDList(device){ this.error({"code" : 466}); }
    login(dev){ this.error({"code" : 466}); }
    logout(dev){ this.error({"code" : 466}); }
    sensorData(data, type){ this.error({"code" : 466}); }
    deviceState(state){ this.error({"code" : 466}); }
}

class UnkDevState extends ErrDevState
{
    constructor(socket, device, dbm){ super(socket, device, dbm, "unknow"); }
    registration(dev)
    {
        super.LogEvent("Device][UnkDevState", "devInfo", dev);
        this.dbm.subscribeDevice(dev).then(
            (registered) => registered ? this.socket.emit("deviceState", {"code" : 403}) //device already registered.
                : this.socket.emit("deviceState", {"code" : 200})); // device registered.
    }
    deviceState(device)
    {
        super.LogEvent("Device][UnkDevState", "deviceState", device);
        if(device.state == 1)
        {
            const state = new SensUnkDevState(this.socket, this.device, this.dbm);
            const transition = new StateTransition("unknow", "sensUnk");
			this.dbm.updateDevStatus(this.device._id, "sensUnknow");
			this.device.changeState(state, transition);
        }else super.error({"code" : 400});
    }
}

class SensUnkDevState extends ErrDevState
{
    constructor(socket, device, dbm){ super(socket, device, dbm, "sensUnk"); }
    updateDevSens(sensorInfo)
    {   
        super.LogEvent("Device][SensUnkState", "sensorInfo", sensorInfo); 
        const state = new RegDevState(this.socket, this.device, this.dbm);
        this.dbm.updateSensorList(sensorInfo.list, sensorInfo._id).then(
            () => this.socket.emit("deviceState", {"code" : 201}));
    }
    deviceState(device)
    {
        super.LogEvent("Device][SensUnkDevState", "deviceState", device);
        if(device.state == 2)
        {
            this.dbm.readSensorList({ "devID" : device._id },  
            { projection : { "devID" : 0, "type" : 0, "model": 0} }).then(
                (sensorIDList) => 
                {
                    const state = new SensRegDevState(this.socket, this.device, this.dbm);
                    const transition = new StateTransition("sensUnk", "sensRegistered", sensorIDList);
					this.dbm.updateDevStatus(this.device._id, "sensRegistered");
                    this.device.changeState(state, transition);
                });
        }else super.error({"code" : 400});
    }
}

class SensRegDevState extends ErrDevState
{
    constructor(socket, device, dbm){ super(socket, device, dbm, "sensRegistered"); }
    sensorIDList(sensorIDList)
    {
        console.log(sensorIDList); 
        this.socket.emit("deviceState", {"code" : 202}); 
    }
    deviceState(device)
    {
        super.LogEvent("Device][SensRegDevState", "deviceState", device);
        if(device.state == 3)
        {
            const state = new RegDevState(this.socket, this.device, this.dbm);
            const transition = new StateTransition("sensRegistered", "registered", {"code" : 203});
			this.dbm.updateDevStatus(this.device._id, "registered");
			this.device.changeState(state, transition);
        }else super.error({"code" : 400});
    }
}

class RegDevState extends ErrDevState
{
    constructor(socket, device, dbm){ super(socket, device, dbm, "registered"); }
    login(dev)
    { 
        console.log(dev._id);
        super.LogEvent("Device][RegDevState", "login", dev); 
        this.dbm.devExist(dev._id).then(
            exist => exist ? this.dbm.devLogged(dev._id).then(
                login => login ?  this.dbm.loginDevice(dev._id, this.socket.id).then( 
                    () => this.socket.emit("deviceState", {"code" : 405}))
                    : this.dbm.loginDevice(dev._id, this.socket.id).then(
                        () => this.socket.emit("deviceState", {"code" : 204})))
            : super.error({"code" : 404}));
    }
    deviceState(device)
    {
        super.LogEvent("Device][RegDevState", "deviceState", device);
        if(device.state == 4)
        {
            const state = new LoginDevState(this.socket, this.device, this.dbm);
            const transition = new StateTransition("registered", "logged");
			this.dbm.updateDevStatus(this.device._id, "logged");
            this.device.changeState(state, transition);
        }else super.error({"code" : 400});
    }
}

class LoginDevState extends ErrDevState
{
    constructor(socket, device, dbm){ super(socket, device, dbm, "logged"); }
    #_logout(devID, code)
    {
        const state = null;
        const transition = new StateTransition("logged", "disconnected", {"id" : this.socket.id, "code" : code});
        this.dbm.deviceLogout(devID).then(
            () => this.device.changeState(state, transition));
    }
    logout(dev)
    { 
        super.LogEvent("Device][LoginDevState", "logout", dev); 
        this.dbm.readDevIDSockID(this.socket.id).then(
            (devID) => this.dbm.devExist(devID).then(
                exist => exist ? this.dbm.devLogged(devID).then( 
                    login => login ? this.#_logout(devID)
                                : super.error({"code" : 403}))
                        : super.error({"code" : 401})));
    }
    sensorData(data)
    { 
        super.LogEvent("Device][LoginDevState", "sensorData", data); 
        this.dbm.postNewStat(data.type, data.measureInfo);
    }
    deviceState(device)
    { 
        super.LogEvent("Device][RegDevState", "deviceState", device);
        this.socket.emit("deviceState", {"code" : 405}); 
    }
}