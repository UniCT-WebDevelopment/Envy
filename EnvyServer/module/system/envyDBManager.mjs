import { DataBaseManager } from "./dataBaseManager.mjs"
import { HomeDBManager } from "./homeDBManager.mjs"
import { DeviceDBManager } from "./deviceDBManager.mjs"
import { UserDBManager } from "./userDBManager.mjs"


class EnvyDBManager extends DataBaseManager
{
	static #instance = null;
	#homeDBM;
	#userDBM;
	#deviceDBM;

	constructor(sysDbUrl, homeDbURL, userDbURL, deviceDbURL)
	{
		this.#deviceDBM = DeviceDBManager.instance();
		this.#homeDBM = HomeDBManager.instance();
		this.#userDBM = UserDBManager.instance();
		super.init(sysDbUrl, "envySys");
		this.#homeDBM.init(homeDbURL, "envyHome");
		this.#deviceDBM.init(deviceDbURL, "deviceHome");
		this.#userDBM.init(userDbURL, "userHome");
	}

	async clientList()
    {
        this.#dbm.readclientList().then( 
            (queryRes) => this.#socket.emit("usericeList", queryRes));
    }

	async homeDeviceStatus(homeName)
	{
		const deviceIDList = await this.#homeDBM.homeDeviceList(homeName);
		
	}

	async RoomSensorList()
	{

	}

	async RoomDeviceList()
	{

	}

	async homeDeviceList()
	{

	}

	async homeSensorList()
	{
		
	}

	async homeStat(homeName, stat, value)
	{
		

	}	

	async RoomStat(roomName, stat, value)
	{


	}	

	async hottestRoom(homeName)
	{

	}

	async coldestRoom(homeName)
	{
		
	}

	async mostVistedRoom(homeName)
	{

	}

	async lessVistedRoom(homeName)
	{

	}

	async mostHumidRoom(homeName)
	{

	}

	async lessHumidRoom(homeName)
	{

	}

	async brightestRoom(homeName)
	{

	}

	async leastBrightRoom(homeName)
	{

	}

	async hottesthome()
	{

	}

	async coldestHome()
	{

	}

	async mostVistedHome()
	{

	}

	async lessVistedHome()
	{

	}

	async mostHumidHome()
	{

	}

	async lessHumidHome()
	{

	}

	async brightestHome()
	{

	}

	async leastBrightHome()
	{

	}
}