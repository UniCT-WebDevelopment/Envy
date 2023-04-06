import { FormSubMenuSection } from "http://127.0.0.1:8080//subMenuSection.mjs";

class LoginSection extends FormSubMenuSection
{
	#loginButton;
	#subscribeButton;
	#usernameRegex;
	#passwordRegex;
	#passwordInput;
	#usernameInput;

	#readLoginInfo()
	{
		return {	
			"name": this.#usernameInput.value, 
			"password" : this.#passwordInput.value
		}
	}

	#parseInputValue()
	{
		let logElement = "", error = false;
		if(super.parseInputValue(this.#usernameRegex, 
			this.#usernameInput))
		{
			error = true;
			logElement += "Invalid username format!";
			this.#passwordInput.style.background = "#43AA8B";
		}
		else this.#usernameInput.style.background = "#43AA8B";
		if(super.parseInputValue(this.#passwordRegex, 
			this.#passwordInput))
		{
			error = true;
			logElement += "Invalid password format!";
			this.#passwordInput.style.background = "#F9C74F";
		}
		else this.#passwordInput.style.background = "#43AA8B";
		if(error)
			super.displayLog(logElement);
		return error;
	}

	#handleLoginRequest()
	{
		if(!this.#parseInputValue())
		{
			super.compleate = true;
			super.client.sectionUpdate("loginReq", 
				this.#readLoginInfo());
		}else super.compleate = false; 
	}

	constructor(fadeSectDuration)
	{
		super(0, "login-section", 
				 "login-form-header", 
				 "login-log-container", 
				 "login-form-container", 
				 fadeSectDuration);
		this.#usernameRegex = /^(\w{1,30})/;
		this.#passwordRegex = /^(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[0-9]){1})(?=(.*[@#$%^!&+=.\-_*]){2})([a-zA-Z0-9@#$%^!&+=*.\-_]){8,}$/;	
		this.#usernameInput = document.getElementById("login-username-input");
		this.#passwordInput =  document.getElementById("login-password-input");
		this.#loginButton = document.getElementById("login-button");
		this.#subscribeButton = document.getElementById("go-subscribe-button");
		this.#loginButton.addEventListener("click", () => this.#handleLoginRequest())
		this.#subscribeButton.addEventListener("click", 
			() => super.client.sectionUpdate("goToSubSection"));
	}

	clientUpdate(event, payload)
	{
		console.log("login event", event);
		switch(event)
		{
			case "loginDenided" :
				super.displayLog("Invalid username or password!")
				this.#usernameInput.style.backgroundColor = "#F9C74F";
				this.#passwordInput.style.backgroundColor = "#F9C74F";
				break;
		}
	}

	reset()
	{
		super.reset();
		super.compleate = false;
		this.#usernameInput.value = "";
		this.#passwordInput.value = "";
		this.#usernameInput.style.backgroundColor = "transparent";
		this.#passwordInput.style.backgroundColor = "transparent";	
	}
}

export { LoginSection }