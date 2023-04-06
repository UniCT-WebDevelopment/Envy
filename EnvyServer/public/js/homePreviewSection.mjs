import { CardSection } from "http://127.0.0.1:8080//subMenuSection.mjs";

class HomePreviewSection extends CardSection
{
	#dailyStatButton;
	#monthlyStatButton;
	#annualStatButton;
	#roomInfoButton;
	#homeInfoContainer;
	#deviceAssociatedValue;
	#deviceOnlineValue;
	#deviceWarningsContainer;
	#allarmRoomContainer;
	#homeName;

	constructor(fadeDuration)
	{
		super(1, "home-preview-section", fadeDuration);
		this.#dailyStatButton = 
			document.getElementById("daily-stat-button");
		this.#monthlyStatButton = 
			document.getElementById("monthly-stat-button");	
		this.#annualStatButton = 
			document.getElementById("annual-stat-button");						
		this.#roomInfoButton = 
			document.getElementById("room-info-button");
		this.#deviceAssociatedValue =
			document.getElementById("device-associated-value");
		this.#deviceOnlineValue =
			document.getElementById("device-online-value");
		this.#deviceWarningsContainer =
			document.getElementById("device-warnings-container");
		this.#homeInfoContainer = 
			document.getElementById("home-card-info-container");
		this.#allarmRoomContainer = 
			document.getElementById("allarms-container");
		this.#dailyStatButton.addEventListener("click", 
			() => super.client.sectionUpdate("dailyStat"));
		this.#monthlyStatButton.addEventListener("click", 
			() => super.client.sectionUpdate("monthlyStat"));	
		this.#annualStatButton.addEventListener("click", 
			() => super.client.sectionUpdate("annualStat"));							
		this.#roomInfoButton.addEventListener("click", 
			() => super.client.sectionUpdate("room"));			
	}

	#buildHomePreview(homeInfo)
	{
		this.#homeInfoContainer.innerHTML = 
			"<h2>" + homeInfo.name +"</h2>" +
			"<h5>" + homeInfo.location.street + "</h3>" +
			"<h6>" + homeInfo.location.city + 
			   "(" + homeInfo.location.district + ")" + 
			"</h6>";
		for(let room of homeInfo.allarmSet)
		{
			this.#allarmRoomContainer.innerHTML +=
			"<div class=\"home-card-field-row\">" +
					"<div><h6>" + room.name + "</h6></div>" +
					"<div><h6>" + room.allarm + "</h6></div>" +
					"<div><h6>" + room.time + "</h6></div>" +
			"</div>";
		}		
		/*for(let warning of homeInfo.deviceInfo.warnings)
		{
			this.#deviceWarningsContainer.innerHTML += 
				"<div class=\"home-card-field-row\">" +
					"<div><h6>" + warning.name + "</h6></div>" +
					"<div><h6>" + warning.deviceName + "</h6></div>" +
					"<div><h6>" + warning.time + "</h6></div>" +
				"</div>"
		}*/
		this.#deviceAssociatedValue.innerHTML = 
			"<h2>" + homeInfo.deviceInfo.associated + "</h2>";
		this.#deviceOnlineValue.innerHTML = 
			"<h2>" + homeInfo.deviceInfo.online + "</h2>";
	}

	refreshContent()
	{
		super.client.sectionUpdate("homeInfo", this.#homeName);
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{		
			case "homeInfo" :
				this.#homeName = payload.name;
				this.#buildHomePreview(payload);
				break;
		}
	}
}

export { HomePreviewSection }