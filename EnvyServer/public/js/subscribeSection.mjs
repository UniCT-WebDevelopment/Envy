import { FormSubMenuSection } from "http://127.0.0.1:8080//subMenuSection.mjs";

class SubscribeSection extends FormSubMenuSection
{
	#subButton;
	#backButton;
	#usernameRegex;
	#emailInput;
	#passwordInput;
	#passwordConfirmInput;
	#usernameInput;
	#passwordRegex;

	#readSubscribeInfo()
	{
		return {	
			"name": this.#usernameInput.value, 
			"email": this.#emailInput.value,
			"password" : this.#passwordInput.value
		}
	}

	#parseInputValue()
	{
		let logElement = "", error = false;
		super.compleate = false;
		if(super.parseInputValue(this.#usernameRegex, 
			this.#usernameInput))
		{
			logElement += "Invalid username format.<br>";
			this.#usernameInput.style.background = "#F9C74F";
			error = true;
		}
		else this.#usernameInput.style.background = "#43AA8B";
		if(super.parseInputValue(this.#passwordRegex, 
			this.#passwordInput))
		{
			logElement += "Invalid new password format.<br>";
			this.#passwordInput.style.background = "#F9C74F";
			error = true;
		}
		else this.#passwordInput.style.background = "#43AA8B";
		if(super.parseInputValue(this.#passwordRegex, 
			this.#passwordConfirmInput))
		{
			logElement += "Invalid password confirm format.<br>";
			this.#passwordConfirmInput.style.background = "#F9C74F";
			error = true;
		}
		else this.#passwordConfirmInput.style.background = "#43AA8B";
		if(this.#passwordConfirmInput.value != this.#passwordInput.value)
		{
			error = true;
			logElement += "The new password and the confirm one mismatch.<br>";
			this.#passwordConfirmInput.style.background = "#F9C74F";
			this.#passwordInput.style.background = "#F9C74F";
		}
		else
		{
			this.#passwordConfirmInput.style.background = "#43AA8B";
			this.#passwordInput.style.background = "#43AA8B";
		} 
		if(!error)
			super.compleate = true;
		return logElement += "</p>";
	}

	#handleSubscribeRequest()
	{
		let logElement = this.#parseInputValue();
		console.log(super.compleate);
		if(super.compleate)
			super.client.sectionUpdate("subscribeReq", 
				this.#readSubscribeInfo());
		else super.compleate = false; 
		super.displayLog(logElement);
	}

	constructor(transDuration)
	{
		super(0, "subscribe-section", 
				 "subscribe-form-header", 
				 "subscribe-log-container", 
				 "subscribe-form-container", 
				 transDuration);
		this.#usernameRegex = /^(\w{1,30})/;
		this.#passwordRegex = /^(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[0-9]){1})(?=(.*[@#$%^!&+=.\-_*]){2})([a-zA-Z0-9@#$%^!&+=*.\-_]){8,}$/;
		this.#usernameInput = document.getElementById("subscribe-username-input");
		this.#passwordInput =  document.getElementById("subscribe-password-input");
		this.#emailInput = document.getElementById("subscribe-email-input");
		this.#passwordConfirmInput =  document.getElementById("subscribe-confirm-password-input");
		this.#subButton = document.getElementById("subscribe-button");
		this.#backButton = document.getElementById("subscribe-back-button");
		this.#subButton.addEventListener("click", () => this.#handleSubscribeRequest())
		this.#backButton.addEventListener("click", 
			() => super.client.sectionUpdate("goToLogSection"));
	}

	clientUpdate(event, payload)
	{
		console.log("sub event", event);
		switch(event)
		{
			case "subDenided" :
				super.displayLog("This account already exist!");
				this.#emailInput.style.backgroundColor = "red";
				this.#passwordInput.style.backgroundColor = "red";
				this.#passwordConfirmInput.style.backgroundColor = "red";
				this.#usernameInput.style.backgroundColor = "red";
				break;
			case "subAccepted" :
				super.displayLog("Account created!")
				break;				
		}
	}

	reset()
	{
		super.reset();
		super.compleate = false;
		this.#usernameInput.value = "";
		this.#passwordInput.value = "";
		this.#passwordConfirmInput.value = "";
		this.#usernameInput.style.backgroundColor = "transparent";
		this.#passwordInput.style.backgroundColor = "transparent";	
		this.#passwordConfirmInput.style.backgroundColor = "transparent";	
	}
}

export { SubscribeSection }