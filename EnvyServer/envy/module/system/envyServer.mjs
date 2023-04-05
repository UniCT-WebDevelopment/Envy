import { UserServer } from "./userServer.mjs";
//import { DeviceServer } from "./deviceServer.mjs";

class EnvyServer
{
	#userServer;
	#deviceServer;
    static #instance;

    constructor (userServerConfig, deviceServerConfig)
    {
		
		this.#userServer = UserServer.instance(userServerConfig);
		//this.#deviceServer = DeviceServer.instance(deviceServerConfig);   
	}
};


export { EnvyServer };