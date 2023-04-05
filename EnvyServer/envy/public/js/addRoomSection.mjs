import { FormSubMenuSection } from "http://envy-server.homenet.telecomitalia.it/subMenuSection.mjs"

class AddRoomSection extends FormSubMenuSection
{
	#roomList;
	#roomListSection;
	#roomInput;
	#floorInput;
	#addButton;
	#doneButton;
	#roomNameRegex;
	#floorRegex; 
	#roomNum;

	#removeRoom(buttonID)
	{
		this.#roomList = this.#roomList.filter((room) => 
			room.id != buttonID.replace("rrb", ""));
		document.getElementById("rb" + buttonID.replace("rrb", ""))
					.remove();
	}

	#createRoomRow()
	{
		return "<div id=\"" + "rb" + this.#roomNum + "\"class=\"room-list-row\">" +
					"<div class=\"room-name\">" + this.#roomInput.value + "</div>" + 
					"<div class=\"room-floor\">" + this.#floorInput.value + "</div>" + 
					"<div class=\"room-remove-button\">" + 
						"<button id=\"" + "rrb" + this.#roomNum + "\"" + "type=\"button\" class=\"action-button\">" + 
							"delete" + 
						"</button>" + 
					"</div>" + 
				"</div>";
	}

	#createRoomObj()
	{
		return {
			"name" : this.#roomInput.value,
			"floor" : this.#floorInput.value
		};
	}

	#handleAddRoomReq()
	{
		super.compleate = false;
		if(!this.#parseInputValue())
		{									
			this.#roomListSection.innerHTML += this.#createRoomRow();
			this.#roomList.push(this.#createRoomObj());
			this.#roomNum++;
		}
	}

	#handleDoneReq()
	{
		if(this.#roomList.length == 0)
		{
			super.compleate = false;
			super.hideLog();
			super.displayLog("<p>Empty room list. Do you not have any rooms?<p>");
		}
		else
		{
			super.hideLog();
			super.displayLog("<p>Now we can go forward!<p>");
			super.compleate = true;
			super.client.sectionUpdate("roomList", this.#roomList);
		} 
	}

	constructor(transDuration)
	{
		super(2, "room-section", "add-room-form-header", 
			"add-room-log-container",
			"add-room-form-container", transDuration);
		this.#initElement();
		this.#roomListSection.addEventListener('click', 
			(event) => this.#removeRoom(event.target.id));
		this.#addButton.addEventListener("click", 
			() => this.#handleAddRoomReq());
		this.#doneButton.addEventListener("click", 
			() => this.#handleDoneReq());
	}

	#initElement()
	{
		this.#doneButton = document.getElementById("done-room"); 
		this.#addButton = document.getElementById("add-room");
		this.#roomListSection = document.getElementById("room-list-section");
		this.#roomInput = document.getElementById("room-name-input");
		this.#floorInput = document.getElementById("room-floor-num-input");
		this.#roomNameRegex = /^(\w{1,30})/;
		this.#floorRegex = /^(\d{1,30})/;
		this.reset();
	}

	#parseInputValue()
	{
		super.log.innerHTML = "";
		let logElement = "<p>", error = false;
		if(!this.#roomNameRegex.test(this.#roomInput.value))
		{
			error = true;
			this.#roomInput.style.background = "red";
			logElement += "Invalid room name format.<br>";
		}
		else this.#roomInput.style.background = "green";
		if(!this.#floorRegex.test(this.#floorInput.value))
		{
			error = true;
			this.#floorInput.style.background = "red";
			logElement += "Invalid floor format.<br>";
		}
		else this.#floorInput.style.background = "green";
		for(let room of this.#roomList)
			if(room.name == this.#roomInput.value)
			{
				error = true;
				logElement += "There is already a room that has this name.<br>";
			}
		if(!error)
		{
			logElement += "Ok, do you want to add another room?";
		}
		logElement += "</p>";
		super.hideLog();
		super.displayLog(logElement);
		return error;
	}

	reset()
	{
		super.reset();
		super.compleate = false;
		this.#roomList = [];
		this.#roomListSection.innerHTML = 
		"<div class=\"list-row\">" +
			"<div class=\"room-name\">Room</div>" +
			"<div class=\"room-floor\">Floor</div>" +
			"<div class=\"room-remove-button\">Action</div>" +
		"</div>";
		this.#roomInput.value = "";
		this.#floorInput.value = "";
		this.#roomInput.style.backgroundColor = "transparent";
		this.#floorInput.style.backgroundColor = "transparent";
		this.#roomNum = 0;
		super.log.innerHTML = "";
	}
}


export { AddRoomSection }