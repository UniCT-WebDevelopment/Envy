import { FormSubMenuSection } from "http://envy-server.homenet.telecomitalia.it/subMenuSection.mjs"

class AddHomeSection extends FormSubMenuSection
{
	#submitButton;
	homeNameInput;
	cityInput;
	districtInput;
	streetInput;
	#homeNameRegex;
	#cityRegex;
	#districtRegex;
	#streetRegex;
	#homeChoosedContainer;

	notifyHomeInfo()
	{
		const homeInfo =
		{
			"name" : this.homeNameInput.value,
			"location" :
			{
				"district" : this.districtInput.value,
				"city" : this.cityInput.value ,
				"street" : this.streetInput.value
			}
		};
		super.client.sectionUpdate("homeInfo", homeInfo);
	}

	parseInputValue()
	{
		let logElement = "<p>";
		if(!this.#homeNameRegex.test(this.homeNameInput.value))
		{
			this.homeNameInput.style.background = "#F9C74F";
			logElement += "Invalid home name format.<br>";
		}
		else this.homeNameInput.style.background = "#43AA8B";
		if(!this.#cityRegex.test(this.cityInput.value))
		{
			this.cityInput.style.background = "#F9C74F";
			logElement += "Invalid city format.<br>";
		}
		else this.cityInput.style.background = "#43AA8B";
		if(!this.#districtRegex.test(this.districtInput.value))
		{
			this.districtInput.style.background = "#F9C74F";
			logElement += "Invalid district format.<br>";
		}
		else this.districtInput.style.background = "#43AA8B";
		if(!this.#streetRegex.test(this.streetInput.value))
		{
			this.streetInput.style.background = "#F9C74F";
			logElement += "Invalid street format.<br>"
		}
		else this.streetInput.style.background = "#43AA8B";
		if(logElement == "<p>")
		{
			logElement += "Ok, everythings seems to be correct!";
			super.compleate = true;
		}
		logElement += "</p>";
		super.displayLog(logElement);
	}

	handleHomeEvent()
	{
		this.parseInputValue();
		if(super.compleate)
			this.notifyHomeInfo();
	}

	constructor(num, section, header, log, content, input, button, transDuration)
	{
		super(num, section, header, log, content, transDuration);
		this.homeNameInput = document.getElementById(input[0]);
		this.cityInput = document.getElementById(input[1]);
		this.districtInput = document.getElementById(input[2]);
		this.streetInput = document.getElementById(input[3]);
		this.#submitButton = document.getElementById(button);
		this.#homeNameRegex = /^(\w{1,30})/;
		this.#districtRegex = /^(\w{1,30})/;
		this.#cityRegex = /^(\w{1,30})/;
		this.#streetRegex = /^(\w{1,30}\(\d{1,30}\))/;		
		this.#submitButton.addEventListener("click", 
			() => this.handleHomeEvent());
		document.getElementById(content).classList.add("add-shift");
	}

	reset()
	{
		super.reset();
		super.compleate = false;
		this.homeNameInput.value = "";
		this.districtInput.value = "";
		this.cityInput.value = "";
		this.streetInput.value = "";
		this.homeNameInput.style.backgroundColor = "transparent";
		this.districtInput.style.backgroundColor = "transparent";
		this.cityInput.style.backgroundColor = "transparent";
		this.streetInput.style.backgroundColor = "transparent";		
	}
}

class UpdateHomeSection extends AddHomeSection
{
	#homeName;

	constructor(num, section, header, log, content, input, button, transDuration)
	{
		super(num, section, header, log, content, input, button, transDuration);
		this.homeNameInput = document.getElementById(input[0]);
		this.cityInput = document.getElementById(input[1]);
		this.districtInput = document.getElementById(input[2]);
		this.streetInput = document.getElementById(input[3]);
		this.#homeName = "";
	}

	notifyHomeInfo()
	{
		const homeInfo =
		{
			"oldName" : this.#homeName,
			"name" : this.homeNameInput.value,
			"location" :
			{
				"district" : this.districtInput.value,
				"city" : this.cityInput.value ,
				"street" : this.streetInput.value
			}
		};
		super.client.sectionUpdate("updateHome", homeInfo);
	}

	handleHomeEvent()
	{
		super.parseInputValue();
		if(super.compleate)
			this.notifyHomeInfo();
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{		
			case "homeInfo" :
				this.#homeName =  payload.name;
				this.homeNameInput.value =  payload.name;
				this.cityInput.value =  payload.location.city;
				this.districtInput.value =  payload.location.district;
				this.streetInput.value =  payload.location.street;
				break;
			case "homeName" :
				this.#homeName = payload.name;
				super.client.sectionUpdate("homeInfo", this.#homeName);
				break;
		}
	}

	refreshContent()
	{

	}
}

export { AddHomeSection, UpdateHomeSection }