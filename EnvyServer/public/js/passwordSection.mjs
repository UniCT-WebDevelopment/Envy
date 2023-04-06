import { ProfileFieldSection } from "http://127.0.0.1:8080//subMenuSection.mjs";

class PasswordSection extends ProfileFieldSection
{
	#oldPasswordInput;
	#newPasswordInput;
	#passwordConfirmInput;
	#passwordRegex;
	#lastModifyContainer;

	#parseInputValue()
	{
		super.log.innerHTML = "";
		let logElement = "<p>", error = false;
		super.compleate = false;
		if(super.parseInputValue(this.#passwordRegex, 
			this.#oldPasswordInput))
		{
			logElement += "Invalid old password format.<br>";
			error = true;
		}
		if(super.parseInputValue(this.#passwordRegex, 
			this.#newPasswordInput))
		{
			logElement += "Invalid new password format.<br>";
			error = true;
		}
		if(super.parseInputValue(this.#passwordRegex, 
			this.#passwordConfirmInput))
		{
			logElement += "Invalid password confirm format.<br>";
			error = true;
		}
		if(this.#passwordConfirmInput.value != this.#newPasswordInput.value)
		{
			error = true;
			logElement += "The new password and the confirm one mismatch.<br>";
			this.#passwordConfirmInput.style.background = "red";
			this.#newPasswordInput.style.background = "red";
		}
		if(!error)
		{
			logElement += "I have fowarded your password change request.";
			super.compleate = true;
		}
		return logElement += "</p>";
	}

	#handleUploadValue()
	{
		const logElement = this.#parseInputValue();
		super.displayLog(logElement);
		if(super.compleate)
			super.client.sectionUpdate("updateUserPassword", 
				{ 
					"newPassword" : this.#passwordConfirmInput.value, 
				  	"oldPassword" : this.#oldPasswordInput.value 
				});
	}

	constructor(fadeDuration)
	{
		super(2, 
			"password-section", 
			"password-form-header", 
			"password-log-container",
			"password-form-container",
			"update-password-button", 
			fadeDuration);
		this.#passwordConfirmInput = 
			document.getElementById("password-confirm-input"); 
		this.#newPasswordInput = 
			document.getElementById("new-password-input"); 
		this.#oldPasswordInput = 
			document.getElementById("old-password-input"); 
		this.#lastModifyContainer = 
			document.getElementById("password-last-modify-value-container");
		this.#passwordRegex = /^(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[0-9]){1})(?=(.*[@#$%^!&+=.\-_*]){2})([a-zA-Z0-9@#$%^!&+=*.\-_]){8,}$/;
		super.uploadButton.addEventListener("click", 
			() => this.#handleUploadValue());
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "passwordInfo" :
				const year = new Date(payload.lastModify).getFullYear();
				const month = new Date(payload.lastModify).getMonth() + 1;
				const day = new Date(payload.lastModify).getUTCDate();
				this.#lastModifyContainer.innerHTML = 
					"<span>" + day + "/" + month + "/" + year + "</span>";
				break;
			case "userPasswordUpdated" :
				if(payload.esit == 1)	
					super.displayLog(
						"This password is already used with this account! Choose another one...");	
				if(payload.esit == 2)	
					super.displayLog(
						"Your password does not meet the requirements, how did you send it?");
				if(payload.esit == 3)	
				{
					this.refreshContent();
						super.displayLog(
							"Your password has been updated!");		
				}
				if(payload.esit == 4)	
					super.displayLog(
						"Your old password is wrong!");		
				
				break;
		}
	}

	reset()
	{
		super.reset();
		super.compleate = false;
		this.#oldPasswordInput.value = "";
		this.#newPasswordInput.value = "";
		this.#passwordConfirmInput.value = "";
		this.#oldPasswordInput.backgroundColor = "transparent";
		this.#newPasswordInput.backgroundColor = "transparent";
		this.#passwordConfirmInput.backgroundColor = "transparent";
	}

	refreshContent()
	{
		super.client.sectionUpdate("passwordInfo");
	}
}

export { PasswordSection }