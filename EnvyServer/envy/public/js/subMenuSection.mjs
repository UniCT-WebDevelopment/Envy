class CardSection
{
	#num;
	#client;
	#instance;
	#fadeDuration;
	#fadeIn;
	#fadeOut;
	#fadeOpt;

	constructor(num, instanceID, fadeDuration)
	{
		this.#num = num;
		this.#instance = document.getElementById(instanceID);
		this.#fadeDuration = fadeDuration;
		this.#fadeIn =[{ opacity: 0 },{ opacity: 1 }];
		this.#fadeOut =[{ opacity: 1 },{ opacity: 0 }];
		this.#fadeOpt = 
		{
			duration: this.#fadeDuration,
			iteration: 1,
			fill: 'both',
			easing: "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
		} 
	}

	get instance() { return this.#instance; }
	get num(){ return this.#num; }
	get client() { return this.#client; }
	set client(client){ this.#client = client; }
	get fadeIn(){ return this.#fadeIn; }
	get fadeOut(){ return this.#fadeOut; }
	get fadeDuration(){ return this.#fadeDuration; }
	get fadeOpt(){ return this.#fadeOpt; }

	display()
	{
		this.#instance.style.display = "flex";
		this.#instance.animate(this.#fadeIn, 
			this.#fadeOpt); 
	}

	hide()
	{
		this.#instance.animate(this.#fadeOut, 
			this.#fadeOpt); 
		setTimeout(() => this.#instance.style.display = "none", 
				this.#fadeDuration + 1);
	}

	displaySync()
	{
		this.#instance.style.display = "flex";
	}

	clientUpdate(event, payload) {}
	reset() {}
	refreshContent(){}
}

class SubMenuSection extends CardSection
{
	#header;
	#content;

	constructor(num, instanceID, headerID, contentID, fadeDuration)
	{
		super(num, instanceID, fadeDuration);
		this.#header = document.getElementById(headerID);
		this.#content = document.getElementById(contentID);
	}

	get header() { return this.#header; }
	get content() { return this.#content; }

	displayHeader()
	{ 
		this.#header.style.display = "contents";
		this.#header.animate(super.fadeIn, 
			super.fadeOpt); 
	}

	displayContent()
	{ 
		this.#content.style.display = "flex";
		this.#content.animate(super.fadeIn, 
			super.fadeOpt); 
	}

	hideHeader()
	{ 	
		this.#header.animate(super.fadeOut, 
					super.fadeOpt); 
		setTimeout(() => this.#header.style.display = "none", 
				super.fadeDuration + 1)
	}

	hideContent()
	{ 
		this.#content.animate(super.fadeOut, 
					super.fadeOpt); 
		setTimeout(() => this.#content.style.display = "none", 
					super.fadeDuration + 1)
	}

	display()
	{
		super.display();
		this.displayHeader();	
		this.refreshContent();
	}

	displaySync()
	{
		super.displaySync();
		this.#header.style.display = "contents";
		this.#content.style.display = "flex";	
		this.refreshContent();
	}
}

class FormSubMenuSection extends SubMenuSection
{
	#log;
	#compleate;

	constructor(num, instanceID, headerID, logID, contentID, fadeDuration)
	{
		super(num, instanceID, headerID, contentID, fadeDuration);
		this.#log = document.getElementById(logID);
		this.#compleate = false;
	}

	get compleate() { return this.#compleate; }
	set compleate(compleate) { this.#compleate = compleate; }
	get log(){ return this.#log; }
	set log(log){ return this.#log = log; }
	
	parseInputValue(regex, fieldInput)
	{
		let error = false;
		if(!regex.test(fieldInput.value))
		{
			fieldInput.style.background = "red";
			error = true;
		}
		else fieldInput.style.background = "green";
		return error;
	}

	displayLog(logElement)
	{
		super.hideHeader();
		setTimeout(() => 
		{
			this.#log.innerHTML = logElement; 
			this.#log.style.display = "flex";
			this.#log.animate(super.fadeIn, 
				super.fadeOpt); 
		}, super.fadeDuration + 1);
	}

	display()
	{
		this.#log.style.display = "none"; 
		super.display();
	}

	hideLog()
	{ 
		this.#log.animate(super.fadeIn, 
			super.fadeOpt); 
		setTimeout(() => 
		{
			this.#log.innerHTML = ""; 
			this.#log.style.display = "flex";
		
		}, super.fadeDuration + 1);
		this.#log.style.display = "none"; 
	}

	reset(){ this.hideLog(); }
}

class ProfileFieldSection extends FormSubMenuSection
{
	#uploadButton;
	
	get uploadButton() { return this.#uploadButton; }

	#handleUploadValue(){}

	constructor(num, instanceID, headerID, 
		logID, contentID, uploadButtonID, 
			fadeDuration)
	{
		super(num, instanceID, 
			headerID, logID,
			contentID, fadeDuration);
		this.#uploadButton = 
			document.getElementById(uploadButtonID); 
	}
}

export { CardSection, SubMenuSection, FormSubMenuSection, ProfileFieldSection }