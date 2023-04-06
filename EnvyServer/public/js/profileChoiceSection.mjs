import { FormSubMenuSection } from "http://127.0.0.1:8080//subMenuSection.mjs"

class ProfileChoiceSection extends FormSubMenuSection
{
	#changeUsernameButton;
	#changeEmailButton;
	#changePasswordButton;
	#usernameContainer;
	#emailContainer;
	#removeButton;
	
	constructor(transDuration)
	{
		super(0, "profile-choice-section", 
			"profile-choice-header", 
			"profile-choice-log-container",
			"profile-preview-container", transDuration);
		this.#initElement();
		for(let wrap of document.getElementById("profile-preview-container")
								.getElementsByClassName("option-wrapper"))
			wrap.classList.add("add-shift");
	}

	#initElement()
	{
		this.#usernameContainer =  document.getElementById("username-value-container"); 
		this.#emailContainer =  document.getElementById("email-value-container"); 
		this.#changeUsernameButton = document.getElementById("change-username-button"); 
		this.#changeEmailButton = document.getElementById("change-email-button");
		this.#changePasswordButton = document.getElementById("change-password-button");
		this.#removeButton = document.getElementById("remove-account-button");
		this.#changeUsernameButton.addEventListener("click", 
			() => super.client.sectionUpdate("goToUsernameSection"));
		this.#changeEmailButton.addEventListener("click", 
			() => super.client.sectionUpdate("goToEmailSection"));
		this.#changePasswordButton.addEventListener("click", 
			() => super.client.sectionUpdate("goToPasswordSection"));
		this.#removeButton.addEventListener("click", 
			() => super.client.sectionUpdate("removeAccount"));			
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "userName" :
				this.#usernameContainer.innerHTML = "<span>" + payload.name + "</span>";
				break;
			case "email" :
				this.#emailContainer.innerHTML = "<span>" + payload.email + "</span>";
				break;
		}
	}

	refreshContent()
	{
		super.client.sectionUpdate("userName");
		super.client.sectionUpdate("email");
	}
}

export { ProfileChoiceSection }