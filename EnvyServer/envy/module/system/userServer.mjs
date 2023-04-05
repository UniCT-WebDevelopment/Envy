/*client*/
import { EnvyHybridMenuClient, EnvyHttpClient } from "../client/client.mjs"
import { ClientSession } from "../client/clientSession.mjs"
import { SysLogger } from "./logger.mjs"
import { UserDBManager } from "./userDBManager.mjs"
//import { DeviceDBManager } from "deviceDBManager.mjs"
import { HomeDBManager } from "./homeDBManager.mjs"
import cookieParser from 'cookie-parser'
import express from 'express';
import { createServer } from "http"
import { Server } from "socket.io"
import { v4 as uuidv4 } from 'uuid';

class UserServer
{
	static #instance = null;  
	#sessionManager;
	#port;
	#httpServer;
	#expressApp;
	#clientIO;    
	#htmlResourcePath;
	#cssResourcePath;
	#javascriptResourcePath;
	#vectorImgResourcePath;
	#iconResourcePath;
	#socketIOResourcePath;
	#chartJSResourcePath;
	#clientList;
	#userDBM;
	#homeDBM;
	#deviceDBM;
	#sessionTime;
	#socketIOconfig;
	#userNameRegex;
	#emailRegex;
	#passwordRegex;

	#initExpressServer(config)
	{
		this.#htmlResourcePath =  config.htmlResourcePath;
		this.#cssResourcePath = config.cssResourcePath;
		this.#javascriptResourcePath = config.javascriptResourcePath;
		this.#vectorImgResourcePath = config.vectorImgResourcePath;
		this.#iconResourcePath = config.iconResourcePath;
		this.#socketIOResourcePath = config.socketIOResourcePath;
		this.#chartJSResourcePath = config.chartJSResourcePath;
       	this.#expressApp = express();
		this.#expressApp.use(express.static(this.#htmlResourcePath));
		this.#expressApp.use(express.static(this.#cssResourcePath));
		this.#expressApp.use(express.static(this.#javascriptResourcePath));
		this.#expressApp.use(express.static(this.#vectorImgResourcePath));
		this.#expressApp.use(express.static(this.#iconResourcePath));
        this.#expressApp.use(express.static(this.#chartJSResourcePath));	
		this.#expressApp.use(express.json());
		this.#expressApp.use(cookieParser());
		this.#httpServer = createServer(this.#expressApp);
		this.#httpServer.listen(this.#port);
		SysLogger.logEvent("UserServer", "logExpressServerPath", "htmlResourcePath", this.#htmlResourcePath);
		SysLogger.logEvent("UserServer", "logExpressServerPath", "cssResourcePath", this.#cssResourcePath);
		SysLogger.logEvent("UserServer", "logExpressServerPath", "javascriptResourcePath", this.#javascriptResourcePath);
		SysLogger.logEvent("UserServer", "logExpressServerPath", "vectorImgResourcePath", this.#vectorImgResourcePath);
		SysLogger.logEvent("UserServer", "logExpressServerPath", "iconResourcePath", this.#iconResourcePath);
		SysLogger.logEvent("UserServer", "logExpressServerPath", "socketIOResourcePath", this.#socketIOResourcePath);
		SysLogger.logEvent("UserServer", "logExpressServerPath", "toastUIchartResourcePath", this.#chartJSResourcePath);
	}

	#removeClient(token)
	{
		this.#clientList = this.#clientList.filter(
			(client) => client.session
							  .getSessionInfo()
							  .token != token);
	}

	async #handleSockConnectionReq(socket)
	{
		const sessionToken = socket.handshake.auth.token;
		const client =  this.#searchAuthClient(sessionToken);
		if(socket.handshake.query.service == "Menu" && client)
		{
			this.#removeClient(sessionToken);
			this.#clientList.push(new EnvyHybridMenuClient(this, client, socket));
		}
	}

	async #handleSockDisconnectionReq(payload)
	{
		if(payload.reason == "ping timeout" ||
		   payload.reason == "transport error" )
		{
			SysLogger.logEvent("UserServer", "socketDisconnection", "sessionToken", payload.socket.handshake.auth.token);
			SysLogger.logEvent("UserServer", "socketDisconnection", "reason", payload.reason);
			const client = this.#searchAuthClient(payload.socket.handshake.auth.token);
			SysLogger.logEvent("UserServer", "logoutReq", "msg", "Logout user");
			SysLogger.logEvent("UserServer", "logoutReq", "sessionID", client.session
																			 .sessionID);
			SysLogger.logEvent("UserServer", "logoutReq", "userID", client.userID);
			await this.#userDBM.logoutUser(client.userID, client.session.sessionID);
			this.#removeClient(payload.socket.handshake.auth.token);
		}
	}

	#initSocketIOServer(socketIOconfig)
	{
		this.#socketIOconfig = socketIOconfig;
		this.#clientIO = new Server(this.#httpServer, this.#socketIOconfig);
		this.#clientIO.on("connection", (socket) => this.#handleSockConnectionReq(socket));
	}

	#checkForExpiredClientSession()
	{
		SysLogger.logEvent("ClientSessionManager", "log", "msg", "Check for expired client session.");
		let validSessionClient = []
		for(let client of this.#clientList)
		{
			if(!client.session.isStillValid())
			{
				SysLogger.logEvent("ClientSessionManager", "ExpiredUserSession", "User", client.userID);
				this.#userDBM.logoutUser(client.userID, client.session.sessionID);
			}
			else validSessionClient.push(client);
		}
		this.#clientList = validSessionClient;
		SysLogger.logEvent("UserServer", "log", "msg", "Valid client session : " + this.#clientList.length);
	}

	async #initUserServer(port, sessionTime, dbPath)
	{
		//this.#deviceDBM = await DeviceDBManager.instance(config.dbPath.deviceDataBase);
		this.#homeDBM = await HomeDBManager.instance(dbPath.homeDataBase);
		this.#userDBM = await UserDBManager.instance(dbPath.userDataBase);
		this.#port = port;
		this.#sessionTime = sessionTime;
		this.#userNameRegex = /\w{1,30}/;
		this.#emailRegex = /\w+@(\w+\.)+\w+/;
		this.#passwordRegex = /^(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[0-9]){1})(?=(.*[@#$%^!&+=.\-_*]){2})([a-zA-Z0-9@#$%^!&+=*.\-_]){8,}$/
		this.#clientList = [];
		SysLogger.logEvent("UserServer", "logServerConfig", "port", this.#port);
		SysLogger.logEvent("UserServer", "logServerConfig", "UserSessionTime", this.#sessionTime);
		setInterval(() => this.#checkForExpiredClientSession(), sessionTime);
	}

	#searchAuthClient(sessionToken)
	{
		for(let client of this.#clientList)
			if(client.session.hasSessionToken(sessionToken))
				return client;
		return null;
	}

	#parseSubReq(userInfo)
	{
		if( !userInfo.name || 
			!userInfo.password ||
			!userInfo.email)
				return "UserInfo not well formed";
		if(!this.#userNameRegex.test(userInfo.name) ||
		   !this.#emailRegex.test(userInfo.email)	||
		   !this.#passwordRegex.test(userInfo.password))
				return "Invalid UserInfo format";
		return "Valid request format";
	}

	#parseAuthReq(userInfo)
	{
		if( !userInfo.name || 
			!userInfo.password)
				return "UserInfo not well formed";
		if(!this.#userNameRegex.test(userInfo.name) ||
		   !this.#passwordRegex.test(userInfo.password))
				return "Invalid UserInfo format";
		return "Valid request format";
	}
	
	#buildSessionResponse(res, sessionInfo)
	{ 
		res.cookie("sessionToken", sessionInfo.token, 
		{
			expire : JSON.stringify(new Date(Date.now() + this.#sessionTime)),
			sameSite : "Strict",
			httpOnly: false
		});
		res.json({"sessionTime" : this.#sessionTime});
		res.status(200);
		return res;
	}

	async #handleAuthReq(profile)
	{ 
		const userID = await this.#userDBM.authUser(profile);
		if(userID != null)
		{
			SysLogger.logEvent("UserServer", "authenticationReq", "authRes", "user authenticated.");
			const sid = uuidv4();
			const sessionID = await this.#userDBM.loginUser(userID, sid);
			const clientSession = new ClientSession(this.#sessionTime, sessionID, sid);
			const client = new EnvyHttpClient(this, this.#homeDBM, this.#userDBM, clientSession, userID);
			this.#clientList.push(client);
			return client;
		}
		SysLogger.logEvent("UserServer", "authenticationReq", "authRes", "invalid user identity.");
		return null;
	}

	#handleMenuReq(req, res)
	{
		const sessionToken = req.cookies['sessionToken'];
		if(this.#searchAuthClient(sessionToken))
			res.sendFile(this.#htmlResourcePath + "menu.html");
		else res.status(400).end();
	}

	#initExpressMiddlieware()
	{
		this.#expressApp.get("/", (req, res) =>
		{
			SysLogger.logEvent("UserServer", "indexReq", "msg", "new user session.");
			res.sendFile(this.#htmlResourcePath + "index.html");
		});
		this.#expressApp.get("/restore", (req, res) =>
		{
			const client = this.#searchAuthClient(req.cookies.sessionToken);
			if(client)
			{
				SysLogger.logEvent("UserServer", "restoreReq", "msg", "restore user session");
				SysLogger.logEvent("UserServer", "restoreReq", "sessionID", client.session
																				.sessionID);
				SysLogger.logEvent("UserServer", "restoreReq", "userID", client.userID);
				res.status(200).end();
			}
			else 
			{
				SysLogger.logEvent("UserServer", "restoreReq", "msg", "invalid session cookie");
				res.status(400).end();
			}
		});		
		this.#expressApp.post("/sub", (req, res) =>
		{
			const profile = req.body;
			const parseRes = this.#parseSubReq(profile);
			SysLogger.logEvent("UserServer", "subscritionReq", "profileName", profile.name);
			SysLogger.logEvent("UserServer", "subscritionReq", "profileEmail", profile.email);
			SysLogger.logEvent("UserServer", "subscritionReq", "profilePassword", profile.password);
			SysLogger.logEvent("UserServer", "subscritionReq", "profileParseRes", parseRes);
			parseRes == "Valid request format" ? this.#userDBM.subscribeUser(profile).then(
				(sub) => sub ? res.status(200).end()
					:  res.status(400).end())
				: 	res.status(400).end()
		});		
		this.#expressApp.post("/auth", (req, res) =>
		{
			const profile = req.body;
			const parseRes = this.#parseAuthReq(profile);
			SysLogger.logEvent("UserServer", "authenticationReq", "profileName", profile.name);
			SysLogger.logEvent("UserServer", "authenticationReq", "profilePassword", profile.password);
			SysLogger.logEvent("UserServer", "authenticationReq", "profileParseRes", parseRes);
			parseRes == "Valid request format" ?
				this.#handleAuthReq(profile).then(
					(client) => client ? 
						this.#buildSessionResponse(res, client.session.getSessionInfo()).end()
							: res.status(400).end())
				:  res.status(400).end();	
		})
		this.#expressApp.post("/logout", (req, res) =>
		{
			const sessionToken = req.cookies.sessionToken;
			SysLogger.logEvent("UserServer", "logoutReq", "sessionToken", sessionToken);
			const client = this.#searchAuthClient(sessionToken);
			if(client)
			{
				SysLogger.logEvent("UserServer", "logoutReq", "msg", "Logout user");
				SysLogger.logEvent("UserServer", "logoutReq", "sessionID", client.session
																				 .sessionID);
				SysLogger.logEvent("UserServer", "logoutReq", "userID", client.userID);
				this.#removeClient(sessionToken);
				this.#userDBM.logoutUser(client.userID, client.session.sessionID);
				res.status(200).end();
			}
			else
			{
				SysLogger.logEvent("UserServer", "logoutReq", "msg", "Invalid client logout req");
				res.status(400).end();
			} 
		})
		this.#expressApp.post("/renew", (req, res) => 
		{
			const sessionToken = req.cookies.sessionToken;
			SysLogger.logEvent("UserServer", "renewReq", "sessionToken", sessionToken);
			const client = this.#searchAuthClient(sessionToken);
			if(client)
			{
				SysLogger.logEvent("UserServer", "renewReq", "userID", client.userID);
				SysLogger.logEvent("UserServer", "renewReq", "msg", "Client session renew");
				client.session.renew();
				this.#buildSessionResponse(res, client.session.getSessionInfo()).end();
			}
			else
			{
				SysLogger.logEvent("UserServer", "renewReq", "msg", "Invalid client session renew req");
				res.status(400).end();
			} 
		});
		this.#expressApp.get("/menu", (req, res) =>
		{
			const sessionToken = req.cookies.sessionToken;
			SysLogger.logEvent("UserServer", "menu", "sessionToken", sessionToken);
			const client = this.#searchAuthClient(sessionToken);
			if(client)
				res.sendFile(this.#htmlResourcePath + "menu.html");
			else
			{
				res.send("<p>Bad Request<p>");
				res.status(400).end();
			} 
		});
	}

	constructor(){}

	async init(config)
	{
		await this.#initUserServer(config.port, config.sessionTime, config.dbPath);
		this.#initExpressServer(config.resourcePath);
		this.#initSocketIOServer(config.socketIOconfig);
		this.#initExpressMiddlieware();
		SysLogger.logEvent("UserServer", "log", 
							  "msg", "UserServer initializated. Waiting for incoming connection.");
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "sockDisconnection" :
				this.#handleSockDisconnectionReq(payload);
				break;
			case "removeUser" :
				this.#removeClient(payload);
				break;				
		}

	}

	static async instance(config)
    { 
        if(!UserServer.#instance)
        {
            UserServer.#instance = new UserServer() 
            await UserServer.#instance.init(config);
        }
        return UserServer.#instance;
    }
}

export { UserServer };

