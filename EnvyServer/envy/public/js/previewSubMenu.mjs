import { SectionSubMenu } from "http://envy-server.homenet.telecomitalia.it/subMenu.mjs"
import { PreviewSection } from "http://envy-server.homenet.telecomitalia.it/previewSection.mjs"

class PreviewSubMenu extends SectionSubMenu
{
	constructor(disappireSectionDuration, swipeMenuDuration)
	{
		super(1, [new PreviewSection(disappireSectionDuration)],
			document.getElementById("preview-home-component"), 
				disappireSectionDuration, swipeMenuDuration);
		for(let section of super.sectionSet)
			section.client = this;
	}
	
	clientUpdate(event, payload)
	{
		const set = super.sectionSet;
		if(event == "lastVisit"|| event == "userName")
			set[0].clientUpdate(event, payload);
	}

	display()
	{
		super.display();
	}

	reset()
	{
		for(let session of super.sectionSet)
			session.reset();
	}
}

export { PreviewSubMenu }