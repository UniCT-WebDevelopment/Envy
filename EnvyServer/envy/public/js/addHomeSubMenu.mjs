import { NavigableSubMenu } from "http://envy-server.homenet.telecomitalia.it/subMenu.mjs"
import { AddHomeSection } from "http://envy-server.homenet.telecomitalia.it/addHomeSection.mjs"
import { AddRoomSection } from "http://envy-server.homenet.telecomitalia.it/addRoomSection.mjs"
import { AddDeviceSection } from "http://envy-server.homenet.telecomitalia.it/addDeviceSection.mjs"

class AddHomeSubMenu extends NavigableSubMenu
{
	#homeInfo;
	#roomList;
	#deviceList;

	constructor(disappireSectionDuration, swipeMenuDuration)
	{
		super(1, 
				[new AddHomeSection(0,
									"home-section", 
									"add-home-form-header", 
									"add-home-log-container",
									"add-home-form-container",
									["home-name-input", "city-input", "district-input", "street-input"],
									"submit-home-button",
									disappireSectionDuration),
				new AddRoomSection(disappireSectionDuration), 
			    new AddDeviceSection(2, 
									"device-section", 
									"add-device-form-header", 
									"add-device-log-container",
									"add-device-form-container",
									["done-device", "add-device"],
									"device-list-section",
									disappireSectionDuration)
				], 
				document.getElementById("add-home-component"), 
				disappireSectionDuration, "add-home-next-form-button",
				"add-home-back-form-button", "add-home-next-button-container", 
				"add-home-back-button-container", swipeMenuDuration);
		super.nextButtonContainer.style.display = "flex";
		for(let section of super.sectionSet)
			section.client = this;
		this.#homeInfo = null;
	}

	handleButtonFadeOut()
	{
		switch(super.currSectNum)
		{
			case 0 :
				this.hideButton(super.prevButtonContainer);
				break;
			case 2 :
				this.hideButton(super.nextButtonContainer);
		}
	}

	handleButtonFadeIn()
	{
		switch(super.currSectNum)
		{
			case 0 :
				this.displayButton(super.nextButtonContainer);
				break;
			case 1 :
				this.displayButton(super.prevButtonContainer);
				this.displayButton(super.nextButtonContainer);
				break;
			case 2 :
				this.displayButton(super.prevButtonContainer);
		}
	}

	handleMenuNavigation(button)
	{
		if(button.id == "add-home-next-form-button" 
			&& super.sectionSet[super.currSectNum].compleate)
				super.swipeToSection(super.currSectNum + 1);
		if(button.id == "add-home-back-form-button")
		{
			super.sectionSet[super.currSectNum].reset();
			super.swipeToSection(super.currSectNum - 1);		
		}
	}

	sectionUpdate(event, payload)
	{
		switch(event)
		{
			case "homeInfo" :
				this.#homeInfo = payload;
				super.sectionSet[super.currSectNum].compleate = true;
				break;
			case "roomList" :
				this.#roomList = [];
				for(let room of payload)
					this.#roomList.push(room);
				break;
			case "deviceList" :
				this.#deviceList = [];
				for(let device of payload)
					this.#deviceList.push(device);
				this.#homeInfo["roomSet"] = this.#roomList;
				this.#homeInfo["deviceSet"] =  this.#deviceList;
				super.client.update("uploadHome", this.#homeInfo);
				super.hideButton(super.prevButtonContainer);
				break;
			case "deviceListOpt" :
				const devOpt = 
				[
					{"name" : "gianfryProto1"}, 
					{"name" : "gianfryProto2"}
				];
				super.sectionSet[2].clientUpdate("deviceListOpt", devOpt);
				break;
			case "roomListOpt" :
				super.sectionSet[2].clientUpdate("roomListOpt", this.#roomList);
				break;	
			case "home"	:
				super.client.update("home");
				break;
			case "rewind"	:
				this.reset();
				super.swipeToSection(0);
				break;				
		}
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "homeAdded" :
				super.sectionSet[2].clientUpdate(event, payload);	
				break;	
		}
	}

	display()
	{
		super.display();
		super.hideButton(super.prevButtonContainer);
		this.displayButton(super.nextButtonContainer);
	}

	reset()
	{
		super.reset();
		this.#homeInfo = [];
		this.#deviceList = [];
		this.#roomList = [];
	}
}

export { AddHomeSubMenu }