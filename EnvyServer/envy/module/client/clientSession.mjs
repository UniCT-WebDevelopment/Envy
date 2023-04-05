
class ClientSession
{
	#sessionID;
	#sessionToken;
	#expireAt;
	#sessionTime;

	constructor(sessionTime, sessionID, sessionToken)
	{
		this.#sessionID = sessionID;
		this.#sessionTime = sessionTime;
		this.#sessionToken = sessionToken;
		this.#expireAt =  new Date(Date.now() + this.#sessionTime);
	}
	get sessionToken(){ return this.#sessionToken; }
	get expireAt(){ return this.#expireAt; }
	get sessionID(){ return this.#sessionID; }
	isStillValid(){ return this.#expireAt > new Date() ? true : false; }
	hasSessionToken(token){ return this.#sessionToken == token ? true : false; }
	renew(){ this.#expireAt =  new Date(Date.now() + this.#sessionTime); }
	getSessionInfo()
	{ 
		let session = {};
		session["token"] = this.#sessionToken;
		session["expireAt"] = this.#expireAt;
		return session;
	}
}

export { ClientSession };