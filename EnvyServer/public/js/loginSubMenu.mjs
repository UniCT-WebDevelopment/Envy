import { SectionSubMenu } from "http://127.0.0.1:8080//subMenu.mjs"
import { LoginSection } from "http://127.0.0.1:8080//loginSection.mjs"

class LoginSubMenu extends SectionSubMenu
{
	constructor(disappireSectionDuration, swipeMenuDuration)
	{
		super(0, [new LoginSection(disappireSectionDuration)],
			document.getElementById("login-component"), 
				disappireSectionDuration, swipeMenuDuration);
		for(let section of super.sectionSet)
			section.client = this;
	}
	
	clientUpdate(event, payload)
	{
		super.sectionSet[0].clientUpdate(event);
	}

	display()
	{
		super.displaySync();
	}

	reset()
	{
		for(let session of super.sectionSet)
			session.reset();
	}
}

export { LoginSubMenu }