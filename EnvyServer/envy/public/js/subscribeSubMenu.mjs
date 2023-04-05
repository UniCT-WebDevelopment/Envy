import { SectionSubMenu } from "http://envy-server.homenet.telecomitalia.it/subMenu.mjs"
import { SubscribeSection } from "http://envy-server.homenet.telecomitalia.it/subscribeSection.mjs"

class SubscribeSubMenu extends SectionSubMenu
{
	constructor(disappireSectionDuration, swipeMenuDuration)
	{
		super(0, [new SubscribeSection(disappireSectionDuration)],
			document.getElementById("subscribe-component"), 
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

export { SubscribeSubMenu }