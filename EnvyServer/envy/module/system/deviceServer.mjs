import { Device } from "./device.mjs"
import { DevEventDispatcher } from "../lib/dispatcher.mjs"
import { SensEventDispatcher } from "../lib/dispatcher.mjs"
import { Server } from "socket.io"

class DeviceServer
{
	static #instance = null;  
	#address;  
	#port;
	#socketOption;
	#deviceIO;    
	#logger;
	#dbm;

	#initSocketIO()
	{
		this.#deviceIO = new Server(this.#port, this.#socketOption);
		this.#deviceIO.on("connection", (socket) =>
		{
			const devDisp = new DevEventDispatcher(socket);
			const sensDisp = new SensEventDispatcher(socket, this.#dbm);
			const obsList = [];
			obsList.push(devDisp);
			obsList.push(sensDisp);
			obsList.push(this);
			this.devicePool.push(new Device(socket, this.#dbm, obsList));
			this.devDispPool.push(devDisp);
		});
	}

	#initDeviceServer(address, port, socketOption)
	{
		this.#logger = SysLogger.instance();
		this.#clientFactory = ClientFactory.instance();
		this.#dbm = DataBaseManager.instance();
		this.#port = port;
		this.#address = address;
		this.#address = address;
		this.#socketOption = socketOption;
	}

	update(transition)
    {
        if(transition.currentState == "logged" && 
			(transition.newState == "disconnected" || 
				transition.newState == "logout"))
        {
            console.log("[Envy][dismissDeviceObject][socketID][" + transition.payload.id +"]");
            this.devicePool.pop((device) => device.getID() == transition.payload.id);
            this.devDispPool.pop((device) => device.getID() == transition.payload.id);
            this.sensDispPool.pop((device) => device.getID() == transition.payload.id);
        }
    }

	static async instance()
    { 
        if(!DeviceServer.#instance)
        {
            DeviceServer.#instance = new DeviceServer() 
            await DeviceServer.#instance.#init();
        }
        return DeviceServer.#instance;
    }
}

export { DeviceServer };
