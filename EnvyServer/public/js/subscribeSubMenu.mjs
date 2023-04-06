import { SectionSubMenu } from "http://127.0.0.1:8080//subMenu.mjs"
import { SubscribeSection } from "http://127.0.0.1:8080//subscribeSection.mjs"

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