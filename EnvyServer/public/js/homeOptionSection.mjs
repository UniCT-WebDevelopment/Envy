import { FormSubMenuSection } from "http://127.0.0.1:8080//subMenuSection.mjs"

class HomeOptionSection extends FormSubMenuSection
{
	#homeChoosedContainer;
	#optionButtonContainer;

	constructor(transDuration)
	{
		super(2, "manage-home-section", 
				 "manage-home-header", 
				 "manage-home-log-container",
				 "manage-home-preview-container", transDuration);
		this.#initElement();
	}

	#initElement()
	{
		this.#homeChoosedContainer =  document.getElementById("home-choosed-value-container"); 
		this.#optionButtonContainer = document.getElementById("manage-home-preview-container")
			    							  .getElementsByClassName("option-wrapper")[0];
		this.#optionButtonContainer.addEventListener("click", 
		(e) => 
		{
			e.stopPropagation();
			switch(e.target.id)
			{			
				case "modify-home-button" :
					super.client.sectionUpdate("goToModifyHomeSection");
					break;
				case "add-device-button" :
					super.client.sectionUpdate("goToAddDeviceSection");
					break;
				case "add-room-button" :
					super.client.sectionUpdate("goToAddRoomSection");
					break;
				case "modify-device-button" :				
					super.client.sectionUpdate("goToUpdateDeviceSection");
					break;
				case "modify-room-button" :				
					super.client.sectionUpdate("goToUpdateRoomSection");	
			}
		});
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "homeName" :
				this.#homeChoosedContainer.innerHTML = "<span>" + payload.name + "</span>";
				break;
		}
	}

	refreshContent()
	{

	}

	display()
	{
		super.display();
		document.getElementById("manage-home-preview-container")
				.classList.add("add-shift");
	}
}

export { HomeOptionSection }