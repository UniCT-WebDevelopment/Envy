import { ObjectId, MongoClient } from 'mongodb';

class DeviceDBManager extends DataBaseManager
{   

	/********************************************{Private}********************************************/

	async #checkDeviceStatusConsistency()
	{
		let error;
        const deviceCol = await this.#db.collection("device");
		let devIterator = await deviceCol.find();
		await devIterator.forEach((device) =>
		{
			if(device.logged == true)
			{
				error = true;
				this.logoutDevice(device._id);
			}
		});
		return error;
	}

	#sensorList(filter, projection)
	{
		this.#dbm.readSensorList(filter, projection).then(
			(queryRes) => this.#socket.emit("sensorList", queryRes));
	}       

	/********************************************{Public}********************************************/	

    constructor(){}

	static async instance()
    { 
        if(!DataBaseManager.#instance)
        {
            DataBaseManager.#instance = new DataBaseManager() 
            await DataBaseManager.#instance.#init();
        }
        return DataBaseManager.#instance;
    }
    
    async #_updateSensorList(sensor)  
    {
        const col = await this.#db.collection("sensor");
        const doc = await col.findOne({"sensorNum" : sensor.sensorNum});
        if(!doc)
            await col.insertOne(sensor);
    }

    async updateSensorList(sensorArray, id)
    {   
        for(let i = 0; i < sensorArray.length; i++)
        {
            sensorArray[i].devID = id;
            await this.#_updateSensorList(sensorArray[i]);
        }
		this.updateDevStatus(id, "sensorRegistered")
    } 

    async updateLogTimeInfo(sessionID, setter)
    {
        const devCol = await this.#db.collection("deviceSession", {strict : true});
        await devCol.updateOne({ _id : ObjectId.createFromHexString(sessionID)}, setter);
    }

    async updateDevStatus(devID, status)
    {
        const devCol = await this.#db.collection("device", {strict : true});
        await devCol.updateOne({ _id : devID}, {$set: {status : status}});
    }

    async readDevServiceTime(devID)
    {
        const devCol = await this.#db.collection("device", {strict : true});
        const serviceTime = await devCol.findOne({_id : devID}, {projection : {_id : 0, serviceTime : 1}});
        return serviceTime.serviceTime;
    }

    async updateServiceTime(devID, sessionID)
    {
        const loginTime = await this.readLogTime(devID); 
        const serviceTime = await this.readDevServiceTime(devID); 
        const devCol = await this.#db.collection("device",{strict : true});
        let updateService = (new Date().getTime() - loginTime.getTime());
        updateService += serviceTime;
        const setter = {$set : {serviceTime : updateService}};
        await devCol.updateOne({_id : devID}, setter);
    }

    async addDevSession(devID, socketID)
    {
        let sessionID = null;
        let devSession = {"devID" : devID, "socketID" : socketID}; 
        const sesCol = await this.#db.collection("deviceSession",{strict : true});
        const devCol = await this.#db.collection("device",{strict : true});
        await sesCol.insertOne(devSession).then((r) => sessionID = r.insertedId.toHexString());
        await devCol.updateOne({ _id : devID}, {$set: {sessionID : sessionID}});
        return sessionID;
    }

    async readLogTime(devID)
    {
        const sesCol = await this.#db.collection("deviceSession",{strict : true});
        const sessionID = await this.readDeviceSession(devID);
        const loginTime = await sesCol.findOne({_id : ObjectId.createFromHexString(sessionID)}, {projection: {_id : 0, loginTime : 1}});
        return loginTime.loginTime;
    }

    async readDeviceSession(devID)
    {
        const col = await this.#db.collection("device", {strict : true});
        const obj = await col.findOne({"_id" : devID}, {projection: {sessionID: 1, _id : 0}})
        return obj.sessionID;
    }

    async readDevIDSockID(socketID)
    {
        const sesCol = await this.#db.collection("deviceSession",{strict : true});
        const obj = await sesCol.findOne({"socketID" : socketID}, {projection: {devID:1 ,_id:0}})
        return obj.devID;
    }

    async addDevice(dev)
    {
        const col = await this.#db.collection("device", {strict : true});
        dev.serviceTime = 0;
        return col.insertOne(dev);
    }

    async devExist(id)
    {
        const col = await this.#db.collection("device", {strict : true});
        const count = await col.countDocuments({_id : id});
        return count ? true : false;
    }

    async devLogged(id)
    {
        const col = await this.#db.collection("device", {strict : true});
        const count = await col.countDocuments({_id : id, status : "logged"});
        return count ? true : false;
    }

    async readLoggedDevice()
    {
        const col = await this.#db.collection("device", {strict : true})
        let devList = await col.find({status : "logged"})
        return await devList.toArray();
    }

    async postNewStat(coll, stat)
    {   
        const col = this.#db.collection(coll);
        stat.measureTime = new Date();
        let id = null;
        await col.insertOne(stat).then((stat) => id = stat.insertedId.toHexString());
        return id;
    }

    async readSensorList(filter, projection)  
    {
        const col = await this.#db.collection("sensor");        
        let sensorList  = null;
        sensorList = await col.find(filter, projection);
        sensorList = await sensorList.toArray();
        return sensorList;
    }

	async homeDeviceList(homeName)
	{
		const homeID = await this.#readHomeID(homeName);
		const filter = {_id : homeID};
		const option = {projection : {_id : 0, deviceID : 1}};
		return await super.readMany("homeDevice", filter, option);
	}

	async roomDeviceList(roomName)
	{
		const roomID = await this.#readRoomID(roomName);
		const filter = {_id : roomID};
		const option = {projection : {_id : 0, deviceID : 1}};
		return await super.readMany("homeDevice", filter, option);
	}

    async readDeviceList()
    {
        const col = this.#db.collection("device");
        let deviceList = await col.find();
        deviceList = await deviceList.toArray();
        return deviceList;
    }

	async subscribeDevice(dev)
    {
        const exist = await this.devExist(dev._id);
        if(exist) return 0;
        await this.addDevice(dev);
        return 1;
    }

    async logoutDevice(devID)
    {
		await this.updateDevStatus(devID, "logout");
        const sessionID = await this.readDeviceSession(devID);
        await this.updateLogTimeInfo(sessionID, {$currentDate : {logoutTime: true}});
        await this.updateServiceTime(devID, sessionID);
    }

    async loginDevice(devID, socketID)
    {
		await this.updateDevStatus(devID, "login");
        const sessionID = await this.addDevSession(devID, socketID);
        await this.updateLogTimeInfo(sessionID, {$currentDate : {loginTime : true}});
    }

    async routineExist(routineID)
    {
        const col = await this.#db.collection("deviceRoutine", {strict : true});
        const count = await col.countDocuments({_id : ObjectId.createFromHexString(routineID)});
        return count ? true : false;
    }

    async addRoutine(routine)
    {
        routine["active"] = false;
        routine["lastEnable"] = "ever";
        routine["lastDisable"] = "ever";
        const col = await this.#db.collection("deviceRoutine", {strict : true});
        let id = null;
        await col.insertOne(routine).then((r) => id = r.insertedId.toHexString());
        await col.updateOne({_id : ObjectId.createFromHexString(id)}, {$currentDate : {creation:true}});
        return id;        
    }

    async removeRoutine(routineID)
    {
        const col = await this.#db.collection("deviceRoutine", {strict : true});
        await col.deleteOne({_id : ObjectId.createFromHexString(routineID)});
    }

    async startRoutine(routineID)
    {
        const col = await this.#db.collection("deviceRoutine", {strict : true});
        await col.updateOne({_id : ObjectId.createFromHexString(routineID)}, {$set : {active: true}});
        await col.updateOne({_id : ObjectId.createFromHexString(routineID)}, {$currentDate : {"lastEnable" : true}});
    }

    async stopRoutine(routineID)
    {
        const col = await this.#db.collection("deviceRoutine", {strict : true});
        await col.updateOne({_id : ObjectId.createFromHexString(routineID)}, {$set : {active: false}});
        await col.updateOne({_id : ObjectId.createFromHexString(routineID)}, {$currentDate : {"lastDisable" : true}});
    }
	
    async readRoutineList(filter, projection)
    {
        const col = await this.#db.collection("deviceRoutine", {strict : true});
        let routineList = await col.find(filter, projection);
        routineList = await routineList.toArray();
        return routineList;
    }
}

export { DeviceDBManager };

	