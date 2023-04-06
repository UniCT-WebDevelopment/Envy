import { SysLogger } from "../system/logger.mjs"

class EnvyHttpClient
{   
	#server;
	#homeDBM;
	#userDBM;
	#session;
	#userID;

	/*************************************{Public}*************************************/

	constructor(server, homeDBM, userDBM, session, userID)
    {
		this.#server = server;
		this.#homeDBM = homeDBM;
		this.#userDBM = userDBM;
		this.#session = session;
		this.#userID = userID;		
    }
	get server (){ return this.#server; }
	get homeDBM(){ return this.#homeDBM; }
	get userDBM(){ return this.#userDBM; }
	get session(){ return this.#session; }
	get userID(){ return this.#userID; }
}


class EnvyHybridMenuClient extends EnvyHttpClient
{
	#socket;

	#initEventHandler()
    {
		this.#socket.on("disconnect", 
			(reason) => super.server.clientUpdate("sockDisconnection", 
				{ "reason" : reason, "socket" : this.#socket}));
		this.#socket.on("updateUserName", (userInfo) => 
			this.#updateUserName(userInfo));
		this.#socket.on("updateUserPassword", 
			(passwordSet) => this.#updateUserPassword(passwordSet));
		this.#socket.on("updateUserEmail", 
			(email) => this.#updateUserEmail(email));
		this.#socket.on("lastVisit", () => this.#userLastVisit());
		this.#socket.on("removeAccount", () => this.#removeAccount());
		this.#socket.on("userName", () => this.#userName());
		this.#socket.on("userInfo", () => this.#userInfo());
		this.#socket.on("passwordInfo", () => this.#passwordInfo());
		this.#socket.on("emailInfo", () => this.#emailInfo());
		this.#socket.on("email", () => this.#email());
		this.#socket.on("uploadHome", (home) => this.#addHome(home));
		this.#socket.on("updateHome", (home) => this.#updateHome(home));
		this.#socket.on("homeRoomList", (homeName) => this.#homeRoomList(homeName));
		this.#socket.on("homeInfo", (homeName) => this.#homeInfo(homeName));
		this.#socket.on("homeList", () => this.#homeList());
		this.#socket.on("dailyHomeStat", 
			(homeStat) => this.#dailyHomeStat(homeStat));
		this.#socket.on("dailyRoomStat", 
			(homeStat) => this.#dailyRoomStat(homeStat));			
		this.#socket.on("dailyHighlightsHomeStat", 
			(homeStat) => this.#dailyHighlightsHomeStat(homeStat));
		this.#socket.on("dailyHighlightsHomeStatForMonth", 
			(homeStat) => this.#dailyHighlightsHomeStatForMonth(homeStat));	
		this.#socket.on("dailyHighlightsHomeStatForYear", 
			(homeStat) => this.#dailyHighlightsHomeStatForYear(homeStat));			
		this.#socket.on("dailyHighlightsForRoomStat", 
			(homeStat) => this.#dailyHighlightsForRoomStat(homeStat));
		this.#socket.on("availableYearForMeasure", 
			(homeStat) => this.#availableYearForMeasure(homeStat));			
    }

	constructor(server, httpClient, socket)
    {
		super(server, httpClient.homeDBM, httpClient.userDBM,
			  httpClient.session, httpClient.userID);
		this.#socket = socket;
		this.#initEventHandler();
		SysLogger.logEvent("EnvyHybridClient", 
							"SocketConnection", 
							"IP", this.#socket.handshake.address);
		SysLogger.logEvent("EnvyHybridClient", 
						   "SocketConnection", 
						   "SessionToken", super.session
												.getSessionInfo().token);
		SysLogger.logEvent("EnvyHybridClient", 
						   "SocketConnection", 
						   "SocketID", socket.id);
    }

	#updateHome(home)
	{
		SysLogger.logEvent("EnvyHybridClient", 
					   "updateHome", 
					   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
					   "updateHome", 
					   "oldName", home.oldName);
		SysLogger.logEvent("EnvyHybridClient", 
					   "updateHome", 
					   "newName", home.name)
		SysLogger.logEvent("EnvyHybridClient", 
					   "updateHome", 
					   "location", home.location);					   					   
		this.homeDBM.updateHomeLocation(home.oldName, home.location).then( 
			() => this.homeDBM.updateHomeName(home.oldName, home.name));
	}

	#addHome(home)
	{
		SysLogger.logEvent("EnvyHybridClient", 
					   "addHomeEvent", 
					   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
					   "addHomeEvent", 
					   "home", home);						
		this.homeDBM.addHome(home).then( 
			(esit) => this.#socket.emit("homeAdded", {"esit" : esit}));
	}

	#userLastVisit()
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "userLastVisitEvent", 
						   "userID", this.userID);	
		super.userDBM.readLastLogin(this.userID).then(
			(lastLogin) => lastLogin.lastLogin ?
				this.#socket.emit("lastVisit", lastLogin)
				:  super.userDBM.readLoginTime(this.userID, super.session.sessionID)
									.then((loginTime) => 
										this.#socket.emit("lastVisit", loginTime)));
	}

	#removeAccount()
	{
		super.userDBM.logoutUser(this.userID, this.session.sessionID).then(
			() =>
			{ 		
				super.server.clientUpdate("removeUser", this.session.sessionToken);
			 	super.userDBM.removeUser(this.userID).then(
					() => this.#socket.emit("accountRemoved"));
			});
	}

	#userName()
	{
		SysLogger.logEvent("EnvyHybridClient", 
							"userNameEvent", 
							"userID", this.userID);
		super.userDBM.readUserName(this.userID).then(
			(username) => 
				this.#socket.emit("userName", {"name" : username.name.value}));
	}

	#userInfo()
	{
		SysLogger.logEvent("EnvyHybridClient", 
							"userInfoEvent", 
							"userID", this.userID);
		super.userDBM.readUserInfo(this.userID).then(
			(userInfo) => 
			{
				this.#socket.emit("userInfo", userInfo)});
	}

	#emailInfo()
	{
		SysLogger.logEvent("EnvyHybridClient", 
							"emailInfoEvent", 
							"userID", this.userID);
		super.userDBM.readUserEmailInfo(this.userID).then(
			(userInfo) => 
			{
				this.#socket.emit("emailInfo", userInfo)
			});
	}

	#passwordInfo()
	{
		SysLogger.logEvent("EnvyHybridClient", 
							"passwordInfoEvent", 
							"userID", this.userID);
		super.userDBM.readUserPasswordInfo(this.userID).then(
			(userInfo) => 
			{
				this.#socket.emit("passwordInfo", userInfo)
			});
	}

	#email()
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "userEmailEvent", 
						   "userID", this.userID);	
		super.userDBM.readUserEmail(this.userID).then(
			(email) => this.#socket.emit("email", email));
	}

	#updateUserName(username)
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "userNameUpdateEvent", 
						   "userID", this.userID);
		SysLogger.logEvent("EnvyHybridClient", 
						   "userNameUpdateEvent", 
						   "newUsername",username);						   
		super.userDBM.updateUserName(this.userID, username).then(
			() => this.#socket.emit("userNameUpdated"));
	}

	#updateUserPassword(passwordSet)
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "passwordUpdateEvent", 
						   "userID", this.userID);
		SysLogger.logEvent("EnvyHybridClient", 
						   "passwordUpdateEvent", 
						   "passwordSet", passwordSet);								   						   
		super.userDBM.updateUserPassword(this.userID, 
										 passwordSet.newPassword, 
										 passwordSet.oldPassword)
					 .then(
			(esit) => this.#socket.emit("userPasswordUpdated", {esit : esit}));
	}

	#updateUserEmail(email)
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "emailUpdateEvent", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "emailUpdateEvent", 
						   "email", email);										   
		super.userDBM.updateUserEmail(this.userID, email).then(
			() => this.#socket.emit("userEmailUpdated"));
	}

	systemStatus()
	{
		this.homeDBM.systemStatus().then( 
			(status) => this.#socket.emit("systemStatus", status));
	}

	#homeList()
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "homeList", 
						   "userID", this.userID);	
		this.homeDBM.readHomeNameList().then( 
			(homeNameList) => this.#socket.emit("homeList", homeNameList));
	}

	#homeRoomList(homeName)
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "homeRoomList", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "homeRoomList", 
						   "homeName", homeName);	
		this.homeDBM.readHomeRoomList(homeName).then( 
			(homeRoomList) => this.#socket.emit("homeRoomList", homeRoomList));
	}

	#homeInfo(homeName)
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "homeInfo", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "homeInfo", 
						   "homeName", homeName);	
		this.homeDBM.readHomeInfo(homeName).then( 	
			(homeInfo) => this.#socket.emit("homeInfo", homeInfo));
	}

	#dailyHighlightsHomeStat(homeStat)
	{

		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStat", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStat", 
						   "homeName", homeStat.homeName);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStat", 
						   "measure", homeStat.measure);							   
		this.homeDBM.readDailyHighlightsHomeStat(homeStat).then(
												(dailyHighlightsHomeStat) => 
													this.#socket.emit("dailyHighlightsHomeStat",
																	   dailyHighlightsHomeStat));										   
	}

	#dailyHighlightsHomeStatForMonth(homeStat)
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForMonth", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForMonth", 
						   "homeName", homeStat.homeName);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForMonth", 
						   "year", homeStat.period.year);
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForMonth", 
						   "month", homeStat.month + 1);						   
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForMonth", 
						   "measure", homeStat.measure);	
		this.homeDBM.readDailyHighlightHomeStatForMonth(homeStat).then(
			(dailyHighlightsHomeStatForMonth) => 
				this.#socket.emit("dailyHighlightsHomeStatForMonth",
								   dailyHighlightsHomeStatForMonth));
	}

	#dailyHighlightsHomeStatForYear(homeStat)
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForYear", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForYear", 
						   "homeName", homeStat.homeName);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForMonth", 
						   "year", homeStat.period.year);
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsHomeStatForYear", 
						   "measure", homeStat.measure);	
		this.homeDBM.readDailyHighlightHomeStatForYear(homeStat).then(
			(dailyHighlightsHomeStatForYear) => 
				this.#socket.emit("dailyHighlightsHomeStatForYear",
								   dailyHighlightsHomeStatForYear));
	}

	#dailyHighlightsForRoomStat(homeStat)
	{

		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsForRoomStat", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsForRoomStat", 
						   "homeName", homeStat.homeName);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsForRoomStat", 
						   "measure", homeStat.measure);							   							   
		this.homeDBM.readDailyHighlightsForRoomStat(homeStat).then(
							(dailyHighlightsRoomStat) => 
								this.#socket.emit("dailyHighlightsForRoomStat",
								dailyHighlightsRoomStat));										   
	}

	#availableYearForMeasure(homeStat)
	{
		SysLogger.logEvent("EnvyHybridClient", 
						   "availableYearForMeasure", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "availableYearForMeasure", 
						   "homeName", homeStat.homeName);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "availableYearForMeasure", 
						   "measure", homeStat.measure);	
		this.homeDBM.readAvailableYearForMeasure(homeStat).then(
							(availableYearForMeasure) => 
							{
								this.#socket.emit("availableYearForMeasure",
								availableYearForMeasure)
							});									   	
	}

	#dailyRoomStat(homeStat)
	{

		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyRoomStat", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyRoomStat", 
						   "homeName", homeStat.homeName);
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsRoomName", 
						   "homeName", homeStat.roomName);								   
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyRoomStat", 
						   "measure", homeStat.measure);							   
		SysLogger.logEvent("EnvyHybridClient", 
							"dailyRoomStat", 
							"periodBegin", homeStat.periodBegin);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyRoomStat", 
						   "periodEnd", homeStat.periodEnd);	
		this.homeDBM.dailyRoomStat(homeStat).then(
							(dailyRoomStat) => 
								this.#socket.emit("dailyRoomStat",
								dailyRoomStat));										   
	}

	#dailyHomeStat(homeStat)
	{

		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHomeStat", 
						   "userID", this.userID);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHomeStat", 
						   "homeName", homeStat.homeName);
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHighlightsRoomName", 
						   "homeName", homeStat.roomName);								   
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHomeStat", 
						   "measure", homeStat.measure);							   
		SysLogger.logEvent("EnvyHybridClient", 
							"dailyHomeStat", 
							"periodBegin", homeStat.periodBegin);	
		SysLogger.logEvent("EnvyHybridClient", 
						   "dailyHomeStat", 
						   "periodEnd", homeStat.periodEnd);	
		this.homeDBM.dailyHomeStat(homeStat).then(
							(dailyHomeStat) => 
								this.#socket.emit("dailyHomeStat",
								dailyHomeStat));										   
	}

	removeHome(home)
	{
		/*this.dbm.systemStatus().then( 
			(status) => this.socket.emit("systemStatus", status));*/
	}
}

/*

class EnvyHybridHomeClient extends EnvyHttpClient
{   
	#socket;


	#initEventHandler()
    {

		this.#socket.on("updateHomeInfo", (user) => this.updateHomeInfo(home));
		this.#socket.on("updateRoomInfo", (user) => this.updateRoomInfo(home));

        
        this.#socket.on("clientState", (user) => this.clientState(user));


		this.#socket.on("homeInfo", (user) => this.homeInfo(home))
		this.#socket.on("homeDeviceStatus", (home) => this.deviceStatus(home))
		this.#socket.on("deviceList", (home) => this.deviceStatus(home))
		this.#socket.on("allarmList", (home) => this.allarmList(home))
		this.#socket.on("sensorList", (home) => this.sensorList(home))
		this.#socket.on("roomList", (home) => this.roomList(home))
		this.#socket.on("sensorData", (sensor) => this.sensorData(sensor));


		this.#socket.on("startRoutine", (user) => this.startRoutine(routineID));
		this.#socket.on("stopRoutine", (user) => this.stopRoutine(routineID));
		this.#socket.on("addRoutine", (user) => this.addRoutine(routine));
		this.#socket.on("removeRoutine", (user) => this.removeRoutine(routineID));


		this.#socket.on("startAllarm", (user) => this.startAllarm(routineID));
		this.#socket.on("stopAllarm", (user) => this.stopAllarm(routineID));
		this.#socket.on("addAllarm", (user) => this.addAllarm(routine));
		this.#socket.on("removeAllarm", (user) => this.removeAllarm(routineID));
    }

	constructor(httpClient, socket)
    {
		super(httpClient.getSession(), httpClient.getUser());
		this.#socket = socket;
		this.#initEventHandler();
		SysLogger.logEvent("EnvyHybridClient", "SocketConnection", "IP", this.#socket.handshake.address);
		SysLogger.logEvent("EnvyHybridClient", "SocketConnection", "SessionToken", super.getSessionInfo().token);
		SysLogger.logEvent("EnvyHybridClient", "SocketConnection", "SocketID", socket.id);
    }


	homeInfo(home)
	{
	}
	manageHome(home){}
	deviceStatus(home){}
	deviceStatus(home){}
	allarmList(home){}
	sensorList(home){}
	roomList(home){}
	sensorData(sensor){}

	startRoutine(routineID)
    {
        this.#dbm.routineExist(routineID).then(
            (exist) => !exist ? 
                this.#dbm.startRoutine(routineID).then(
                    () => this.#socket.emit("routineStatus", 1))
                    : this.#socket.emit("routineNotExist", {"_id" : routineID}));
    }
    stopRoutine(routineID)
    {
        this.#dbm.routineExist(routineID).then(
            (exist) => !exist ? 
                this.#dbm.stopRoutine(routineID).then(
                    () => this.#socket.emit("routineStatus", 2))
                    : this.#socket.emit("routineNotExist", {"_id" : routineID}));
    }
    addRoutine(routine)
    {
        this.#dbm.addRoutine(routine).then(
            () => this.#socket.emit("routineStatus", 1));
    }
    removeRoutine(routineID)
    {
        this.#dbm.routineExist(routineID).then(
            (exist) => exist ? this.#dbm.removeRoutine(routineID).then(
                () => this.#socket.emit("routineStatus", {"code" : 3}))
                    : this.#socket.emit("routineNotExist", {"_id" : routineID}));  
    }
	startAllarm(routineID){}
	stopAllarm(routineID){}
	addAllarm(routine){}
	removeAllarm(routineID){}


	startAllarm(routineID){}
	stopAllarm(routineID){}
	addAllarm(routine){}
	removeAllarm(routineID){}

}
*/
export { EnvyHttpClient,  EnvyHybridMenuClient };
