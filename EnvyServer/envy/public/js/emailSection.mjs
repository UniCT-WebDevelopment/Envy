import { ProfileFieldSection } from "http://envy-server.homenet.telecomitalia.it/subMenuSection.mjs"

class EmailSection extends ProfileFieldSection
{
	#emailInput;
	#emailRegex;
	#currentEmailContainer;
	#lastModifyContainer;
	#currentStatusContainer;

	#handleUploadValue()
	{
		const error = super.parseInputValue(this.#emailRegex, this.#emailInput);
		if(!error)
		{
			super.client.sectionUpdate("updateUserEmail", 
				this.#emailInput.value);
			super.displayLog(
				"Ok, " + this.#emailInput.value + 
				" i'm sending an email for confirm the new address. " + 
				"Click on the link inside!");
			super.compleate = true;
		}
		else 
		{	
			super.displayLog("Invalid email format! " + 
			"The admitted format is the following email@[subdomain.].domain!");
		}
	}

	constructor(transDuration)
	{
		super(2, "email-section", 
			"email-form-header", 
			"email-log-container",
			"email-form-container",
			"update-email-button", 
			transDuration);
		this.#emailInput = 
			document.getElementById("email-input"); 
		this.#emailRegex = /\w+@(\w+\.)+\w+/;
		this.#currentEmailContainer = 
			document.getElementById("current-email-value-container");	
		this.#lastModifyContainer = 
			document.getElementById("email-last-modify-value-container");
		this.#currentStatusContainer = 
			document.getElementById("email-current-status-value-container");								
		super.uploadButton.addEventListener("click", 
			() => this.#handleUploadValue());
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "emailInfo" :
				this.#currentEmailContainer.innerHTML = 
					"<span>" + payload.email + "</span>";
				const year = new Date(payload.lastModify).getFullYear();
				const month = new Date(payload.lastModify).getMonth() + 1;
				const day = new Date(payload.lastModify).getUTCDate();
				this.#lastModifyContainer.innerHTML = 
					"<span>" + day + "/" + month + "/" + year + "</span>";
				this.#currentStatusContainer.innerHTML = 
					"<span>" + payload.status + "</span>";
				break;
			case "userEmailUpdated" :
				this.refreshContent();
				super.displayLog(
					"Your email address has been updated!");		
				break;
		}
	}

	reset()
	{
		super.reset();
		super.compleate = false;
		this.#emailInput.value = "";
		this.#emailInput.backgroundColor = "transparent";
	}

	refreshContent()
	{
		super.client.sectionUpdate("emailInfo");
	}
}

export { EmailSection }