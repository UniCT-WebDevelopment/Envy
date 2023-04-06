import { SubMenuSection } from "http://127.0.0.1:8080//subMenuSection.mjs"

class PreviewSection extends SubMenuSection
{
	#lastVisit;
	#userMessage;

	constructor(transDuration)
	{
		super(0, "preview-section", "message-header", 
			"menu-status-icon-wrapper", transDuration);
		this.#lastVisit = document.getElementById("last-visit");
		this.#userMessage =  document.getElementById("user-message");
	}

	updateLastVisit(lastVisitInfo)
	{
		const year = new Date(lastVisitInfo.lastLogin).getFullYear();
		const month = new Date(lastVisitInfo.lastLogin).getMonth() + 1;
		const day = new Date(lastVisitInfo.lastLogin).getUTCDate();
		this.#lastVisit.innerHTML = "Last visit : " + day + "/" + month + "/" + year;
	}

	updateUserMessage(userName)
	{
		this.#userMessage.innerHTML = "Welcome back..." + "<br>" + userName.name + " !";
	}

	refreshPreviewInfo()
	{
		super.client.sectionUpdate("lastVisit");
		super.client.sectionUpdate("userMessage");
	}

	displayHeader()
	{ 
		super.header.style.display = "flex";
		super.header.animate(super.fadeIn, 
			super.fadeOpt); 
	}

	displaySync()
	{
		super.displaySync();
		super.header.style.display = "flex";
		super.content.style.display = "flex";	
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "lastVisit" :
				this.updateLastVisit(payload);
				break;
			case "userName" :
				this.updateUserMessage(payload);
				break;
		}
	}
}

export { PreviewSection }