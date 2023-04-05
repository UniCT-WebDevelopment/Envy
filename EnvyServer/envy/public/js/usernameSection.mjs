import { ProfileFieldSection } from "http://envy-server.homenet.telecomitalia.it/subMenuSection.mjs"

class UsernameSection extends ProfileFieldSection
{
	#usernameInput;
	#usernameRegex;
	#lastModifyContainer;
	#activityTimeContainer;
	#userRoleContainer;

	#handleUploadValue()
	{
		const error = super.parseInputValue(this.#usernameRegex, 
			this.#usernameInput)
		if(!error)
		{
			super.client.sectionUpdate("updateUserName", 
				this.#usernameInput.value);
			super.displayLog(
				"Ok, " + this.#usernameInput.value + 
				" nice choice, i'm sending your new username!");
			super.compleate = true;
		}
		else 
		{	
			super.displayLog(
				"Invalid username format!" +
				"Use only latin letter and numbers!");
			super.compleate = false;
		}
	}

	constructor(transDuration)
	{
		super(2, "username-section", 
			"username-form-header", 
			"username-log-container",
			"username-form-container",
			"update-username-button", 
			transDuration);
		this.#usernameInput = 
			document.getElementById("username-input"); 
		this.#usernameRegex = /^(\w{1,30})/;
		super.uploadButton.addEventListener("click", 
			() => this.#handleUploadValue());
		this.#lastModifyContainer = 
			document.getElementById("username-last-modify-value-container");
		this.#activityTimeContainer = 
			document.getElementById("activity-time-value-container");
		this.#userRoleContainer = 
			document.getElementById("user-role-value-container");							
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "userInfo" :
				const year = new Date(payload.lastModify).getFullYear();
				const month = new Date(payload.lastModify).getMonth() + 1;
				const day = new Date(payload.lastModify).getUTCDate();
				this.#lastModifyContainer.innerHTML = 
					"<span>" + day + "/" + month + "/" + year + "</span>";
				this.#userRoleContainer.innerHTML = 
					"<span>" + payload.role + "</span>";
				break;
			case "userNameUpdated" :
				this.refreshContent();
				super.displayLog(
					"Your username has been updated!");		
				break;
		}
	}

	refreshContent()
	{
		super.client.sectionUpdate("userInfo");
	}

	reset()
	{
		super.reset();
		super.compleate = false;
		this.#usernameInput.value = "";
		this.#usernameInput.style.backgroundColor = "transparent";
	}
}

export { UsernameSection }