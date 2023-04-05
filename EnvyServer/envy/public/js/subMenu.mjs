class SubMenu
{
	#client;
	#num;
	#instance;
	#swipeMenuOption;

	get num() { return this.#num; }
	set client(client) { this.#client = client; }
	get client() {return this.#client; }
	constructor(num, instance, swipeMenuDuration)
	{
		this.#num = num;
		this.#instance = instance;
		this.#swipeMenuOption = 
		{
			easing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
			duration: swipeMenuDuration,
			iteration: 1,
			fill: 'forwards',
			direction: "normal",
			fill: "both"
		} 
	}

	swipeFromTo(positionFrom, positionTo, opacityFrom, opacityTo)
	{
		const trasition = 
		[
			{ 
				transform: "translateX(" + positionFrom + "%)",
				opacity : opacityFrom
			},
			{ 
				transform: "translateX(" + positionTo + "%)",
				opacity : opacityTo
			}
		]
		return this.#instance.animate(trasition, this.#swipeMenuOption).finished;
	}

	display()
	{
		this.#instance.style.display = "flex";
	}

	hide()
	{
		this.#instance.style.display = "none";
	}

	sectionUpdate(event, payload)
	{
		this.#client.menuUpdate(event, payload);
	}	

	reset(){}
	refreshContent(){}
	clientUpdate(event, payload){}
}

class SectionSubMenu extends SubMenu
{
	#sectionSet;
	#currSectNum;
	#fadeSectionDuration;

	constructor(num, sectionSet, instance, 
		fadeSectionDuration, swipeMenuDuration)
	{
		super(num, instance, swipeMenuDuration);
		this.#sectionSet = sectionSet;
		this.#currSectNum = 0;
		this.#fadeSectionDuration = fadeSectionDuration;
	}

	get sectionSet(){ return this.#sectionSet; }
	get currSectNum() { return this.#currSectNum; }
	set currSectNum(currSectNum) { this.#currSectNum = currSectNum; }
	get fadeSectionDuration() { return this.#fadeSectionDuration; }

	swipeToSection(nextSectionNum)
	{
		this.#sectionSet[this.#currSectNum].hide();
		this.#currSectNum = nextSectionNum;
		setTimeout(() => this.#sectionSet[this.#currSectNum].display(), 
			this.#fadeSectionDuration + 1);							
	}
	
	display()
	{
		super.display();
		this.#currSectNum = 0;
		this.#sectionSet[0].display();
	}

	displaySync()
	{
		super.display();
		this.#currSectNum = 0;
		this.#sectionSet[0].displaySync();
	}

	reset()
	{
		for(let session of this.#sectionSet)
			session.reset();
		this.#sectionSet[this.#currSectNum].hide();
		this.#currSectNum = 0;
		this.#sectionSet[0].display();
	}

	refreshContent()
	{
		for(let section of this.#sectionSet)
			section.refreshContent();
	}
}

class NavigableSubMenu extends SectionSubMenu
{
	#nextButtonContainer;
	#prevButtonContainer;
	#nextButton;
	#prevButton;
	#fadeIn;
	#fadeOut;
	#fadeOption;
	get nextButton() { return this.#nextButton; }
	get prevButton() { return this.#prevButton; }
	get nextButtonContainer() { return this.#nextButtonContainer; }
	get prevButtonContainer() { return this.#prevButtonContainer; }

	constructor(num, sectionSet, instance, 
		fadeSectionDuration, nextButtonID, 
		prevButtonID, nextButtonContainerID,
		prevButtonContainerID, swipeMenuDuration)
	{
		super(num, sectionSet, instance, fadeSectionDuration, swipeMenuDuration)
		this.#fadeIn =[{ opacity: 0 },{ opacity: 1 }];
		this.#fadeOut =[{ opacity: 1 },{ opacity: 0 }];
		this.#fadeOption = 
		{
			duration: super.fadeSectionDuration,
			iteration: 1,
			fill: 'forwards'
		} 
		this.#nextButton = document.getElementById(nextButtonID);
		this.#prevButton = document.getElementById(prevButtonID);
		this.#nextButtonContainer = document.getElementById(nextButtonContainerID);
		this.#prevButtonContainer = document.getElementById(prevButtonContainerID);
		this.#nextButton.addEventListener("click", 
			() => this.handleMenuNavigation(this.#nextButton));
		this.#prevButton.addEventListener("click", 
			() => this.handleMenuNavigation(this.#prevButton))
	}

	#displayContainerButton(container)
	{
		container.style.display = "flex";
		container.style.alignItems = "center";
		container.style.position = "relative";
		container.style.zIndex = "5";
	}

	hideButton(container)
	{
		if(container.style.display != "none")
		{
			container.animate(this.#fadeOut, this.#fadeOption);
				setTimeout(() => container.style.display = "none", 
					super.fadeSectionDuration + 1);
			console.log("hiding", container.id);
		}
	}

	displayButton(container)
	{
		if(container.style.display != "flex")
		{
			this.#displayContainerButton(container);		
			container.animate(this.#fadeIn, this.#fadeOption);
			console.log("displaing", container.id);
		}
	}

	handleButtonFadeOut(){}

	handleButtonFadeIn(){}

	swipeToSection(nextSectionNum)
	{
		super.sectionSet[super.currSectNum].hide();
		super.currSectNum = nextSectionNum;
		this.handleButtonFadeOut();
		setTimeout(()=> 
		{
			super.sectionSet[super.currSectNum].display();
			this.handleButtonFadeIn();
		}, super.fadeSectionDuration + 1);							
	}

	handleMenuNavigation(button){}
}

export { SubMenu, SectionSubMenu, NavigableSubMenu }