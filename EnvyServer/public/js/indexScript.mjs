import { EnvyScript } from "http://127.0.0.1:8080//envyScript.mjs"
import { LoginSubMenu } from "http://127.0.0.1:8080//loginSubMenu.mjs";
import { SubscribeSubMenu } from "http://127.0.0.1:8080//subscribeSubMenu.mjs";

class IndexScript extends EnvyScript
{

	#loginReq(accountCredential)
	{		
		let xhttp = new XMLHttpRequest();
		xhttp.open("POST", super.envyUrl + "auth", true);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.onreadystatechange =  
		() => 
		{
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 200) 
					window.location.href = super.envyUrl + "menu.html";
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 400) 
					super.subMenuSet[0].clientUpdate("loginDenided");
		}
		xhttp.send(JSON.stringify(accountCredential));
	}

	#subscribeReq(account)
	{
		let xhttp = new XMLHttpRequest();
		xhttp.open("POST", super.envyUrl + "sub", true);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.onreadystatechange = 
		() => 
		{
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 200) 
					super.subMenuSet[1].clientUpdate("subAccepted");
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 400) 
					super.subMenuSet[1].clientUpdate("subDenided");
		}
		xhttp.send(JSON.stringify(account));
	}

	#restore()
	{
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", super.envyUrl + "restore", true);
		xhttp.setRequestHeader('Content-Type', 'text/html');
		xhttp.onreadystatechange = 
		() => 
		{
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 200) 
					window.location.assign(super.envyUrl + "menu.html");
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 400) {}
		}
		xhttp.send();
	}

	menuUpdate(event, payload)
	{
		switch(event)
		{
			case "subscribeReq":
				this.#subscribeReq(payload);
				break;
			case "loginReq":
				this.#loginReq(payload);
				break;
			case "goToSubSection":
				super.swipeMenuFromTo({"begin" : 0, "end" : 100},
					{"begin" : 100, "end" : 0}, 1, () => {});
				break;
			case "goToLogSection":
				super.swipeMenuFromTo({"begin" : 0, "end" : 100},
					{"begin" : 100, "end" : 0}, 0, () => {});
				break;
		}
	}

	constructor(envyUrl, swipeMenuDuration, fadeSectDuration)
	{
		super(envyUrl, 
		[	
			new LoginSubMenu(fadeSectDuration, swipeMenuDuration),
		 	new SubscribeSubMenu(fadeSectDuration, swipeMenuDuration),
		], swipeMenuDuration);
		this.#restore();
	}
}


const menuScript = new IndexScript("/", 500, 600);
