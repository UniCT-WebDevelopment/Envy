import { DataBaseManager } from "./dataBaseManager.mjs"
import { ObjectId } from "mongodb"

class UserDBManager extends DataBaseManager
{   
    static #instance = null;        

	#createUser(user, userInfo) 
	{
		user["name"] =
		{
			"value" : userInfo.name,
			"lastModify" : new Date()
		},
		user["passwordSet"] =
		[
			{
				"value" : userInfo.password,
				"creation" : new Date()
			}
		], 
		user["emailSet"] = 
		[
			{
				"value" : userInfo.email,
				"creation" : new Date(),
				"status" : "active",
			}
		],
		user["lastModify"] = new Date();
		user["state"] = "unknow";
		user["role"] = "admin";
		return user;
	}

	#createSession(session, token) 
	{
		session["sessionID"] = ObjectId();
		session["token"] = token;
		session["state"] = "open";
		return session;
	}

	async readUserID(username)
	{
		const filter = {"name.value" : username}
		const option = {projection : {_id : 1}}
		const user = await super.readOne("user", filter, option);
		return user._id;
	}

	async #addUser(userInfo)
    {
		let user = {};
		this.#createUser(user, userInfo);
		await super.insertOne("user", user);
    }

	async #updateUserState(userID, state)
	{
		const command = {$set: {state : state}}
		const filter = {_id: userID};
		await super.updateColl("user", filter, command);
	}

	async #addSession(userID, sessionToken)
    {
        let userSession = {};
		this.#createSession(userSession, sessionToken);
		const filter = {_id : userID};
		const command = {$addToSet : {sessions : userSession}};
		await super.updateColl("user", filter, command);
		return userSession.sessionID;
    }

	async #updateSessionLogoutInfo(userID, sessionID)
    {
		const filter = { _id : userID, "sessions.sessionID" : sessionID};
		const command = 
		{
			$set: 
			{
				"sessions.$.state": "closed",
				"sessions.$.logoutTime" : new Date()
			}
		}
		await super.updateColl("user", filter, command);
    }

	async #updateSessionLoginInfo(userID, sessionID)
    {
		const filter = { _id : userID, "sessions.sessionID" : sessionID};
		const command = 
		{
			$set: 
			{
				"sessions.$.state": "active",
				"sessions.$.loginTime" : new Date()
			}
		}
		await super.updateColl("user", filter, command);
    }

	async userExist(name)
	{
		const filter = {"name.value" : name};
		return super.itemExist("user", filter);
	}

	async userLogged(name)
    {
		const filter = {"name.value" : name , state : "loggedIn"};
		return super.itemExist("user", filter);
    }

	async userIDExist(userID)
	{
		const filter = {_id : userID};
		return super.itemExist("user", filter);
	}

	async userIDLogged(userID)
    {
		const filter = {_id : userID, state : "loggedIn"};
		return super.itemExist("user", filter);
    }

	async readUserName(userID)
	{
		const filter = {_id : userID}
		const option = {projection : {_id : 0, "name.value": 1}}
		const user = await super.readOne("user", filter, option);
		return user;
	}

	async readUserPassword(userID)
	{
		const pipeline = 
		[
			{
			  "$match": {
				_id: userID
			  }
			},
			{
			  "$project": {
				"_id": 0,
				"passwordInfo": {
				  "$last": "$passwordSet"
				}
			  }
			},
			{
			  "$project": {
				password: {
				  "$getField": {
					field: "value",
					input: "$passwordInfo"
				  }
				}
			  }
			}
		];
		const passwordSet = await super.aggregate("user", pipeline);
		return passwordSet[0];
	}

	async readUserPasswordInfo(userID)
	{
		const pipeline = 
		[
			{
			  "$match": {
				_id: userID
			  }
			},
			{
			  "$project": {
				"_id": 0,
				"passwordInfo": {
				  "$last": "$passwordSet"
				}
			  }
			},
			{
			  "$project": {
				lastModify: {
					"$getField": {
					  field: "creation",
					  input: "$passwordInfo"
					}
			   }
			}		
			}
		];
		const passwordSet = await super.aggregate("user", pipeline);
		return passwordSet[0];
	}

	async readUserEmail(userID)
	{
		const pipeline = 
		[
			{
			  "$match": {
				_id: userID
			  }
			},
			{
			  "$project": {
				"_id": 0,
				"emailInfo": {
				  "$last": "$emailSet"
				}
			  }
			},
			{
				"$project": {
				  email: {
					"$getField": {
					  field: "value",
					  input: "$emailInfo"
					}
				  }
				}
			}
		];
		const emailSet = await super.aggregate("user", pipeline);
		return emailSet[0];
	}

	async readUserEmailInfo(userID)
	{
		const pipeline = 
		[
			{
			  "$match": {
				_id: userID
			  }
			},
			{
			  "$project": {
				"_id": 0,
				"emailInfo": {
				  "$last": "$emailSet"
				}
			  }
			},
			{
			  "$project": {
				email: {
				  "$getField": {
					field: "value",
					input: "$emailInfo"
				  }
				},
				lastModify: {
					"$getField": {
					  field: "creation",
					  input: "$emailInfo"
					}
				},
				status: {
					"$getField": {
					  field: "status",
					  input: "$emailInfo"
					}
				}
			  }
			}
		];
		const emailSet = await super.aggregate("user", pipeline);
		return emailSet[0];
	}

	async readUserState(userID)
	{
		const option = {projection : {_id : 0, state : 1}}
		const filter = {_id : userID}
		const user =  await super.readOne("user", filter, option);
		return user; 		
	}

	async readUserInfo(userID)
	{
		const option = {projection : {_id : 0, role : 1, lastModify : 1}}
		const filter = {_id : userID}
		const user =  await super.readOne("user", filter, option);
		return user; 		
	}

	async readSessionInfo(userID, sessionID)
    {
		const filter = {_id : userID, "sessions.sessionID" : sessionID}
		const command = {projection : {_id : 0, "sessions.$" : 1}}
		const queryRes = await super.readOne("user", filter, command);	
		return queryRes.sessions[0];
    }
		
	async readSessionSet(userID)
    {
		const filter = {_id : userID}
		const option = {_id : 0, sessions : {_id : 0}}
		const queryRes = await super.readMany("user", filter, option);
		return queryRes[0].sessions;	
    }

	async readLastLogin(userID)
    {
		const pipeline =
		[
			{
				"$match": {
				  _id: userID,
				  
				}
			  },
			  {
				"$project": {
				  _id: 0,
				  sessionClosed: {
					$filter: {
					  input: "$sessions",
					  as: "session",
					  cond: {
						$eq: [
						  "$$session.state",
						  "closed"
						]
					  }
					}
				  }
				}
			  },
			  {
				"$project": {
				  lastLogin: {
					"$max": "$sessionClosed.loginTime"
				  }
				}
			  }
		];
		const queryRes =  await super.aggregate("user", pipeline);
		return queryRes[0];
    }

	async readUserPasswordSet(userID)
    {
		const pipeline = 
		[
			{
			  "$match": {
				_id: userID
			  }
			},
			{
			  "$project": {
				"_id": 0,
				"passwordSet": 1
			  }
			}
		]
		const queryRes =  await super.aggregate("user", pipeline);
		return queryRes[0].passwordSet;
    }

	//checked

	async readLoginTime(userID, sessionID)
    {
		const filter = {_id : userID, "sessions.sessionID" : sessionID}
		const command = {projection : {_id : 0, "sessions.$" : 1}}
		const queryRes = await super.readOne("user", filter, command);
		return queryRes.sessions;
    }

	//checked

	async readLogoutTime(userID, sessionID)
    {
		const filter = {_id : userID, "sessions.sessionID" : sessionID}
		const command = {projection : {_id : 0, "sessions.$" : 1}}
		const queryRes = await super.readOne("user", filter, command);
		return queryRes;
    }

	//checked

	async readSessionTime(userID, sessionID)
    {
		const filter = {_id : userID, "sessions.sessionID" : sessionID}
		const command = {projection : {_id : 0, "sessions.$" : 1}}
		const queryRes = await super.readOne("user", filter, command);	
		return queryRes.sessions[0].logoutTime.getTime() - queryRes.sessions[0].loginTime.getTime();
    }

	//checked

	async readSessionToken(userID, sessionID)
    {
		const filter = {_id : userID, "sessions.sessionID" : sessionID}
		const command = {projection : {_id : 0, "sessions.$" : 1}}
		const queryRes = await super.readOne("user", filter, command);
		return queryRes.sessions[0].token;
    }

	async removeUser(userID)
	{
        if(await this.userIDExist(userID))
		{
			const filter = {_id : userID}
        	await super.removeOne("user", filter);
        	return true;
		}
		return false;
	}

	async subscribeUser(user)
    {
        const exist = await this.userExist(user.name);
        if(!exist)
		{
        	await this.#addUser(user);
        	return true;
		}
		return false;
	}

	async authUser(user)
	{
		if(!await this.userExist(user.name) ||  
			await this.userLogged(user.name))
			return null;
		const userID =  await this.readUserID(user.name);
		const password = await this.readUserPassword(userID);
		if(password.password == user.password)
			return userID;
		return null;
	}

	async loginUser(userID, sessionToken)
	{
		await this.#updateUserState(userID, "loggedIn");
		const sessionID = await this.#addSession(userID, sessionToken);;
		await this.#updateSessionLoginInfo(userID, sessionID);
		return sessionID;
	}

	async logoutUser(userID, sessionID)
	{
		if(!await this.userIDExist(userID) ||
		   !await this.userIDLogged(userID))
		return false;
		await this.#updateUserState(userID, "loggedOut");
		await this.#updateSessionLogoutInfo(userID, sessionID);
		return true;
	}

	async updateUserName(userID, username)
	{
		const command = 
		{
			$set: 
			{
				"name.value" : username, 
				"name.lastModify" : new Date()
			}
		}
		const filter = {_id: userID};
		await super.updateColl("user", filter, command);
	}

	async updateUserEmail(userID, email)
	{
		const command = 
		{
			$addToSet: 
			{
				emailSet : 
				{
					"value" : email, 
					"creation" :  new Date(),
					"status" : "active"
				}, 
			},
			$set : 
			{
				lastModify : new Date()
			}
		}
		const filter = {_id: userID};
		await super.updateColl("user", filter, command);
	}

	async passwordAlreadyUsed(userID, newPassword)
	{
		const passwordSet = await this.readUserPasswordSet(userID);
		for(let password of passwordSet)
		{
			if(password.value == newPassword)
				return true;
		}
		return false;
	}

	async updateUserPassword(userID, newPassword, oldPassword)
	{
		const currentPassword = await this.readUserPassword(userID);
		if(currentPassword.password != oldPassword)
			return 4;
		if(await this.passwordAlreadyUsed(userID, newPassword))
			return 1;
		const command = 
		{
			$addToSet: 
			{
				passwordSet : 
				{
					"value" : newPassword, 
					"creation" : new Date()
				}
			}, 
			$set : 
			{
				lastModify : new Date()
			}
		}
		const filter = {_id: userID};
		await super.updateColl("user", filter, command);
		return 3;
	}

	//checked

	async init(dbURL){ await super.init(dbURL, "envyUser"); }

	static async instance(dbURL)
    { 
        if(!UserDBManager.#instance)
        {
            UserDBManager.#instance = new UserDBManager(); 
            await UserDBManager.#instance.init(dbURL);
        }
        return UserDBManager.#instance;
    }
}

export { UserDBManager };