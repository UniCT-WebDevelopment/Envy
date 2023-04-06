import { FormSubMenuSection } from "http://127.0.0.1:8080//subMenuSection.mjs"
import { SelectWrapper } from "./selectWrapper.mjs";

class AddDeviceSection extends FormSubMenuSection
{
	#associationList;
	#deviceListSection;
	#roomSelect;
	#deviceSelect;
	#addButton;
	#doneButton;
	#associationNum;

	#removeAssociation(buttonID)
	{
		super.compleate = false;
		this.#associationList = this.#associationList.filter((asssociation) => 
			asssociation.id != buttonID.replace("drb", ""));
			const devRow = document.getElementById("db" + buttonID.replace("drb", ""));
			const devName = new String(devRow.innerHTML).match(/<div class=\"device-name\">\w*<\/div>/)[0]
												  .replace(/<div class=\"device-name\">/,"")
												  .replace(/<\/div>/,"");
		
			this.#deviceSelect.addOption = devName; 	
			devRow.remove();
	}

	#createAssociationRow()
	{
		return "<div id=\"" + "db" + this.#associationNum + "\"class=\"list-row\">" +
					"<div class=\"device-name\">" +  this.#deviceSelect.selectedOptionValue + "</div>" + 
					"<div class=\"device-room-name\">" +  this.#roomSelect.selectedOptionValue + "</div>" + 
					"<div class=\"device-remove-button\">" + 
						"<button id=\"" + "drb" + this.#associationNum + "\"" + "type=\"button\" class=\"action-button\">" + 
							"delete" + 
						"</button>" + 
					"</div>" + 
				"</div>";
	}

	#createDeviceObj()
	{
		return {
			"name" : this.#deviceSelect.selectedOptionValue,
			"room" : this.#roomSelect.selectedOptionValue
		};
	}

	#handleAddDeviceReq()
	{
		super.compleate = false;
		super.hideLog();		
		if(this.#deviceSelect.empty)
		{
			super.displayLog("<p>All device associated</p>");
			return;
		}
		if(!this.#deviceSelect.selected)
		{
			super.displayLog("<p>Choose a device first<p>");
			return;
		}
		if(!this.#roomSelect.selected)
		{
			super.displayLog("<p>Choose a room first<p>");
			return;
		}
		super.displayLog("<p>Association done.</p>");
		this.#deviceListSection.innerHTML += this.#createAssociationRow();
		this.#associationList.push(this.#createDeviceObj());
		this.#deviceSelect.removeOption(this.#deviceSelect.selectedOptionIndex);
		this.#associationNum++;
	}

	#handleDoneReq()
	{
		if(!super.compleate)
		{
			if(this.#associationList.length == 0)
			{
				super.compleate = false;
				super.hideLog();
				super.displayLog(
					"<p>Empty device list." + 
					" I can't tell you anything about your home" + 
					" if i don't have my EYES...</p>");
			}
			else
			{
				super.displayLog("<p>Ok, your home is set up, waiting for confirm!</p>");
				super.hideContent();
				super.compleate = true;
				super.client.sectionUpdate("deviceList", this.#associationList);
			} 
		}
	}

	constructor(num, section, header, log, content, button, list, transDuration)
	{
		super(num, section, header, log, content, transDuration);
		this.#initElement(button, list);
		this.#deviceListSection.addEventListener('click', 
			(event) => this.#removeAssociation(event.target.id));
		this.#addButton.addEventListener("click", 
			() => this.#handleAddDeviceReq());
		this.#doneButton.addEventListener("click", 
			() => this.#handleDoneReq());
	}
	#initElement(button, list)
	{
		this.#doneButton = document.getElementById(button[0]); 
		this.#addButton = document.getElementById(button[1]);
		this.#deviceListSection = document.getElementById(list);
		super.compleate = false;
		this.#associationList = [];
		this.#associationNum = 0;
		this.#deviceListSection.innerHTML = 
		"<div class=\"list-row\">" +
			"<div class=\"device-name\">Device</div>" +
			"<div class=\"device-room-name\">Room</div>" +
			"<div class=\"device-remove-button\">Action</div>" +
		"</div>";
		this.#roomSelect= new SelectWrapper(this,
			"room-select", 
			"room-select-wrapper", 
			"room", 
			true);
		this.#deviceSelect = new SelectWrapper(this,
			 "device-select", 
			 "device-select-wrapper",
			 "device", 
			 true);
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "roomListOpt" :
				let roomList = [];
				for(let room of payload)
					roomList.push(room.name);
				this.#roomSelect.updateSelectOptionList(roomList);
				break;
			case "deviceListOpt" :
				let deviceList = [];
				for(let device of payload)
					deviceList.push(device.name);	
				this.#deviceSelect.updateSelectOptionList(deviceList);			
				break;
			case "homeAdded" :
				if(payload.esit)
				{
					super.displayLog("Congratulation, your home has been created!</br>Now you can find it in \"Search home\" menu.");
					setTimeout(() => super.client.sectionUpdate("home"), 5000);
				}else 
				{
					super.displayLog("An home seems to already exist with this name.</br>Choose another one.");
					setTimeout(() => super.client.sectionUpdate("rewind"), 5000);
				}
		}
	}

	display()
	{
		super.client.sectionUpdate("roomListOpt");
		super.client.sectionUpdate("deviceListOpt");
		super.display();
		super.displayContent();
	}

	reset()
	{
		super.reset();
		super.compleate = false;
		this.#associationList = [];
		this.#deviceListSection.innerHTML = 
		"<div class=\"list-row\">" +
			"<div class=\"device-name\">Device</div>" +
			"<div class=\"device-room-name\">Room</div>" +
			"<div class=\"device-remove-button\">Action</div>" +
		"</div>";
		this.#deviceSelect.reset();
		this.#roomSelect.reset();
		this.#associationNum = 0;
	}
}


class UpdateDeviceSection extends AddDeviceSection
{
	constructor(num, section, header, log, content, button, list, preset, transDuration)
	{
		super(num, section, header, log, content, button, list, transDuration);

	}

}

export { AddDeviceSection }