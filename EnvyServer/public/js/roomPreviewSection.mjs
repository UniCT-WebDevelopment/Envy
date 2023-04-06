import { CardSection } from "http://127.0.0.1:8080//subMenuSection.mjs";

class RoomPreviewSection extends CardSection
{
	#brighter;
	#mostVisited;
	#mostHumid;
	#hottest;
	#roomListContainer;
	#homeName;
	
	constructor(fadeDuration)
	{
		super(2, "room-preview-section", fadeDuration);
		this.#brighter =
			document.getElementById("brighter-room-value");
		this.#mostVisited =
			document.getElementById("most-visited-room-value");			
		this.#mostHumid =
			document.getElementById("most-humid-room-value");
		this.#hottest =
			document.getElementById("hottest-room-value");			
		this.#roomListContainer =
			document.getElementById("room-list-container");
	}

	#buildRoomPreview(roomInfo)
	{
		this.#brighter.innerHTML =
			("<h2>" + roomInfo.highlight.brighter + "</h2>");
		this.#mostVisited.innerHTML =
			("<h2>" + roomInfo.highlight.mostVisited + "</h2>");
		this.#mostHumid.innerHTML =
			("<h2>" + roomInfo.highlight.mostHumid + "</h2>");
		this.#hottest.innerHTML =
			("<h2>" + roomInfo.highlight.hottest + "</h2>");
	}

	#buildRoomList(roomList)
	{
		this.#roomListContainer.innerHTML = 	
			"<div class=\"home-card-field-row\">" +
				"<div><h2>" + "Name" + "</h2></div>" +
				"<div><h2>" + "Floor" + "</h2></div>" +
			"</div>"
		for(let room of roomList)
		{
			this.#roomListContainer.innerHTML += 
				"<div class=\"home-card-field-row\">" +
					"<div><h2>" + room.name + "</h2></div>" +
					"<div><h2>" + room.floor + "</h2></div>" +
				"</div>"
		}
	}

	refreshContent()
	{
		super.client.sectionUpdate("homeName", this.#homeName);
		super.client.sectionUpdate("homeRoomList", this.#homeName);
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "homeName" :
				this.#homeName = payload;
				break;
			case "roomInfo" :
				this.#buildRoomPreview(payload);
				break;
			case "homeRoomList" :
				this.#buildRoomList(payload);
				break;

		}
	}
}

export { RoomPreviewSection }