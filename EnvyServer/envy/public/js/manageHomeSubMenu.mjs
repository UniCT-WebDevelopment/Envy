import { NavigableSubMenu } from "http://envy-server.homenet.telecomitalia.it/subMenu.mjs"
import { HomeOptionSection } from "http://envy-server.homenet.telecomitalia.it/homeOptionSection.mjs"
import { SearchHomeSection } from "http://envy-server.homenet.telecomitalia.it/searchHomeSection.mjs";
import { UpdateHomeSection } from "http://envy-server.homenet.telecomitalia.it/addHomeSection.mjs";
import { AddDeviceSection } from "http://envy-server.homenet.telecomitalia.it/addDeviceSection.mjs";

class ManageHomeSubMenu extends NavigableSubMenu
{
	#active;
	#researchedHome;
	constructor(disappireSectionDuration, swipeMenuDuration)
	{
		super(2, 
				[
				  new SearchHomeSection(0, 
										"search-home-section2", 
										"search-home-form-header2", 
										"search-home-log-container2",
				  						"search-home-list-wrapper2", 
										"home-list-section2",
					disappireSectionDuration), 
				  	new HomeOptionSection(disappireSectionDuration),
				  	new UpdateHomeSection(2,
									"home-section2", 
									"add-home-form-header2", 
									"add-home-log-container2",
									"add-home-form-container2",
									[
										"home-name-input2", 
										"city-input2", 
										"district-input2", 
										"street-input2"
									],
									"submit-home-button2",
									disappireSectionDuration),
				/*	new AddDeviceSection(3, 
										"device-section2", 
										"add-device-form-header2", 
										"add-device-log-container2",
										"add-device-form-container2",
										["done-device2", "add-device2"],
										"device-list-section2",
										disappireSectionDuration)*/				

				], 
				document.getElementById("manage-home-component"), 
				disappireSectionDuration, "manage-home-next-form-button",
					"manage-home-back-form-button", "manage-home-next-button-container", 
						"manage-home-back-button-container", swipeMenuDuration);
		this.#active = false;
		this.#researchedHome = "";
		for(let section of super.sectionSet)
			section.client = this;
	}

	handleMenuNavigation(button)
	{
		if(button.id == "manage-home-back-form-button")
				super.swipeToSection(super.currSectNum - 1);				
	}

	handleButtonFadeOut()
	{
		switch(super.currSectNum)
		{
			case 0 :
				this.hideButton(super.prevButtonContainer);
				this.hideButton(super.nextButtonContainer);
				break;
			case 1 :
			case 2 :
			case 3 :
				this.hideButton(super.nextButtonContainer);
		}
	}

	handleButtonFadeIn()
	{
		switch(super.currSectNum)
		{
			case 0 :
				break;
			case 1 :
			case 2 :
			case 3 :
			case 4 :
				this.displayButton(super.prevButtonContainer);
		}
	}

	sectionUpdate(event, payload)
	{
		switch(event)
		{
			case "goToModifyHomeSection" :
				super.swipeToSection(2);
				break;
			case "goToUpdateDeviceSection" :
				super.swipeToSection(3);
				break;
			case "goToUpdateRoomSection" :
				super.swipeToSection(4);					
				break;	
			case "viewHomeInfo" :
				this.#researchedHome = payload;
				for(let i = 1; i < super.sectionSet.length; i++)
					super.sectionSet[i].clientUpdate("homeName", {"name" : this.#researchedHome, "num" : i});
				break;
			default :
				super.client.update(event, payload);
		}
	}

	clientUpdate(event, payload)
	{
		if(this.#active)
		{
			switch(event)
			{
				case "homeList" :
					super.sectionSet[0].clientUpdate(event, payload);	
					break;		
				case "homeInfo" :
					super.sectionSet[2].clientUpdate(event, payload);	
					super.swipeToSection(1);
					break;									
				/*	super.sectionSet[2].clientUpdate(event, payload);
					break;

					super.sectionSet[3].clientUpdate(event, payload);
					break;*/
			}
		}
	}
	
	display()
	{
		this.#active = true;
		this.currSectNum = 0;
		super.display();
		super.hideButton(super.prevButtonContainer);
		super.hideButton(super.nextButtonContainer);
	}

	reset()
	{
		this.#active = false;
		super.reset();
	}
}

export { ManageHomeSubMenu }