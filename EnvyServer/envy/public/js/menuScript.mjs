import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { NavBar } from "http://envy-server.homenet.telecomitalia.it/navBar.mjs"
import { EnvyScript } from "http://envy-server.homenet.telecomitalia.it/envyScript.mjs"
import { ProfileSubMenu } from "http://envy-server.homenet.telecomitalia.it/profileSubMenu.mjs"
import { PreviewSubMenu } from "http://envy-server.homenet.telecomitalia.it/previewSubMenu.mjs"  
import { AddHomeSubMenu } from "http://envy-server.homenet.telecomitalia.it/addHomeSubMenu.mjs"  
import { HomeSubMenu } from "http://envy-server.homenet.telecomitalia.it/homeSubMenu.mjs"
import { ManageHomeSubMenu } from "http://envy-server.homenet.telecomitalia.it/manageHomeSubMenu.mjs"

class MenuScript extends EnvyScript
{
	#socket;
	#sessionToken;
	#renewIntID;
	#navBar;

	#renewReq()
	{
		let xhttp = new XMLHttpRequest();
		xhttp.open("POST",  super.envyUrl + "renew", true);
		xhttp.send();
		xhttp.onreadystatechange = () => 
		{
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 400) 
			{
				if(this.#renewIntID != null)
					clearInterval(this.#renewIntID);
				window.location.href =  super.envyUrl + "index.html";
			}
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 200)
			{
				clearInterval(this.#renewIntID);
				const sessionInfoObj = JSON.parse(xhttp.response);
				this.#renewIntID = setInterval(() => 
					this.#renewReq(), sessionInfoObj.sessionTime / 2);
			}
		}
	}

	#logoutReq()
	{
		let xhttp = new XMLHttpRequest();
		xhttp.open("POST",  super.envyUrl + "logout", true);
		xhttp.send();
		xhttp.onreadystatechange = () => 
		{
			if(xhttp.readyState === XMLHttpRequest.DONE &&
				xhttp.status === 200)
			{
				if(this.#renewIntID != null)
					clearInterval(this.#renewIntID);
				window.location.href =  super.envyUrl + "index.html";
			}
		}
	}

	#loadPageInfo()
	{
		this.#socket.emit("userName");
		this.#socket.emit("lastVisit");	
	}

	#initSocketEvent()
	{
		const set = super.subMenuSet;
		this.#socket.on("disconnect", 
			() => window.location.href =  super.envyUrl + "index.html");
		this.#socket.on("lastVisit", 
			(payload) => super.subMenuSet[0].clientUpdate("lastVisit", payload));
		this.#socket.on("userName", 
			(payload) => 
			{
				super.subMenuSet[0].clientUpdate("userName", payload);
				super.subMenuSet[4].clientUpdate("userName", payload);
			});
		this.#socket.on("email", 
			(payload) => super.subMenuSet[4].clientUpdate("email", payload));
		this.#socket.on("emailInfo", 
			(payload) => super.subMenuSet[4].clientUpdate("emailInfo", payload));	
		this.#socket.on("passwordInfo", 
			(payload) => super.subMenuSet[4].clientUpdate("passwordInfo", payload));					
		this.#socket.on("userInfo", 
			(payload) => super.subMenuSet[4].clientUpdate("userInfo", payload));			
		this.#socket.on("userNameUpdated", 
			() => super.subMenuSet[4].clientUpdate("userNameUpdated"));
		this.#socket.on("accountRemoved", 
			() => window.location.href =  super.envyUrl + "index.html");			
		this.#socket.on("userEmailUpdated", 
			() => super.subMenuSet[4].clientUpdate("userEmailUpdated"));
		this.#socket.on("userPasswordUpdated", 
			(payload) => super.subMenuSet[4].clientUpdate("userPasswordUpdated", payload));
		this.#socket.on("homeAdded", 
			(payload) => super.subMenuSet[1].clientUpdate("homeAdded", payload))
		this.#socket.on("homeRoomList", 
			(payload) => super.subMenuSet[3].clientUpdate("homeRoomList", payload))	
		this.#socket.on("dailyHighlightsForRoomStat", 
			(payload) => super.subMenuSet[3].clientUpdate("dailyHighlightsForRoomStat", payload))												
		this.#socket.on("dailyHighlightsHomeStat", 
			(payload) => super.subMenuSet[3].clientUpdate("dailyHighlightsHomeStat", payload))	
		this.#socket.on("dailyHighlightsHomeStatForMonth", 
			(payload) => super.subMenuSet[3].clientUpdate("dailyHighlightsHomeStatForMonth", payload))
		this.#socket.on("dailyHighlightsHomeStatForYear", 
			(payload) => super.subMenuSet[3].clientUpdate("dailyHighlightsHomeStatForYear", payload))			
		this.#socket.on("availableYearForMeasure", 
			(payload) => super.subMenuSet[3].clientUpdate("availableYearForMeasure", payload))					
		this.#socket.on("homeRoomList", 
			(payload) => super.subMenuSet[3].clientUpdate("homeRoomList", payload))																		
		this.#socket.on("homeList", 
			(payload) => 
			{
				super.subMenuSet[2].clientUpdate("homeList", payload);
				super.subMenuSet[3].clientUpdate("homeList", payload);
			})	
		this.#socket.on("homeInfo", 
			(payload) => 
			{
				super.subMenuSet[2].clientUpdate("homeInfo", payload);
				super.subMenuSet[3].clientUpdate("homeInfo", payload);
			})										
	}

	update(event, payload)
	{
		switch(event)
		{
			case "logout" :
				this.#logoutReq();
				break;
			case "home" : 
				super.swipeCaroselMenu(0, () => this.#navBar.enable());
				break;
			case "addHome" :
				super.swipeCaroselMenu(1, () => this.#navBar.enable());
				break;
			case "manageHome" :
				super.swipeCaroselMenu(2, () => this.#navBar.enable());
				break;
			case "searchHome" :
				super.swipeCaroselMenu(3, () => this.#navBar.enable());
				break;
			case "profile" :
				super.swipeCaroselMenu(4, () => this.#navBar.enable());
				break;
			default :
				console.log("outgoing", event, payload);
				this.#socket.emit(event, payload);
		}		
	}

	constructor(envyUrl, swipeMenuDuration, fadeSectDuration)
	{
		super(envyUrl, 
		[	
			new PreviewSubMenu(fadeSectDuration, swipeMenuDuration),
		 	new AddHomeSubMenu(fadeSectDuration, swipeMenuDuration),
			new ManageHomeSubMenu(fadeSectDuration, swipeMenuDuration),
			new HomeSubMenu(fadeSectDuration, swipeMenuDuration),
			new ProfileSubMenu(fadeSectDuration, swipeMenuDuration)
		], swipeMenuDuration);
		this.#renewIntID = null;
		this.#sessionToken = document.cookie.split('; ')
			.find(row => row.startsWith('sessionToken='))
			.split('=')[1];
		this.#socket = io("ws:" + super.envyUrl, 
		{
			auth: { token: this.#sessionToken },
			query: { service: "Menu" }
		}); 
	/*	document.getElementById("mid-menu-container").style.minHeight = window.innerHeight - 80 + "px"
		for(let sideContainer of  document.getElementsByClassName("side-container"))
			sideContainer.style.minHeight = window.innerHeight - 80 + "px";*/
		if(this.#socket == null)
			window.location.href = super.envyUrl + "index.html";
		this.#navBar = new NavBar(this, fadeSectDuration);
		this.#renewReq();
		this.#initSocketEvent();
		this.#loadPageInfo();
	}
}

const menuScript = new MenuScript("//envy-server.homenet.telecomitalia.it/", 430, 400);