import { NavigableSubMenu } from "http://envy-server.homenet.telecomitalia.it/subMenu.mjs"
import { ProfileChoiceSection } from "http://envy-server.homenet.telecomitalia.it/profileChoiceSection.mjs"
import { EmailSection } from "http://envy-server.homenet.telecomitalia.it/emailSection.mjs"
import { UsernameSection } from "http://envy-server.homenet.telecomitalia.it/usernameSection.mjs"
import { PasswordSection } from "http://envy-server.homenet.telecomitalia.it/passwordSection.mjs"

class ProfileSubMenu extends NavigableSubMenu
{
	constructor(disappireSectionDuration, swipeMenuDuration)
	{
		super(3, [new ProfileChoiceSection(disappireSectionDuration), 
				  new UsernameSection(disappireSectionDuration), 
				  new EmailSection(disappireSectionDuration),
				  new PasswordSection(disappireSectionDuration)], 
				document.getElementById("profile-component"), 
				disappireSectionDuration, "profile-choice-next-form-button",
					"profile-choice-back-form-button", "profile-choice-next-button-container", 
						"profile-choice-back-button-container", swipeMenuDuration);
		for(let section of super.sectionSet)
			section.client = this;
	}

	handleMenuNavigation(button)
	{
		if(button.id == "profile-choice-back-form-button" &&
			super.currSectNum >= 1)
				super.swipeToSection(0);				
	}

	handleButtonFadeOut()
	{
		switch(super.currSectNum)
		{
			case 0 :
				this.hideButton(super.prevButtonContainer);
				this.hideButton(super.nextButtonContainer);
				break;
			case 1 :
			case 2 :
			case 3 :
				this.hideButton(super.nextButtonContainer);
		}
	}

	handleButtonFadeIn()
	{
		switch(super.currSectNum)
		{
			case 0 :
				break;
			case 1 :
			case 2 :
			case 3 :
			case 4 :
				this.displayButton(super.prevButtonContainer);
		}
	}

	sectionUpdate(event, payload)
	{
		switch(event)
		{
			case "goToUsernameSection" :
				super.swipeToSection(1);
				break;
			case "goToEmailSection" :
				super.swipeToSection(2);
				break;
			case "goToPasswordSection" :
				super.swipeToSection(3);
				break;
			default :
				super.client.update(event, payload);
		}
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "userName" :
			case "email" :
				super.sectionSet[0].clientUpdate(event, payload);	
				break;	
			case "userInfo" :
			case "userNameUpdated" :
				super.sectionSet[1].clientUpdate(event, payload);
				break;
			case "emailInfo" :
			case "userEmailUpdated" :
				super.sectionSet[2].clientUpdate(event, payload);
				break;
			case "passwordInfo" :
			case "userPasswordUpdated" :
				super.sectionSet[3].clientUpdate(event, payload);
				break;
		}
	}
	
	display()
	{
		this.currSectNum = 0;
		super.display();
		super.hideButton(super.prevButtonContainer);
		super.hideButton(super.nextButtonContainer);
	}
}

export { ProfileSubMenu }

