import { FormSubMenuSection } from "http://127.0.0.1:8080//subMenuSection.mjs"

class SearchHomeSection extends FormSubMenuSection
{
	#homeList;
	#homeListSection;
	#homeNum;

	#readHome(buttonID)
	{
		super.compleate = false;
		const homeRow = document.getElementById("hb" + buttonID.replace("hvb", ""));
		return new String(homeRow.innerHTML).match(/<div class=\"home-name\">\w*<\/div>/)[0]
											.replace(/<div class=\"home-name\">/,"")
											.replace(/<\/div>/,"");
	}

	#createHomeRow()
	{
		return 	"<div id=\"" + "hb" + this.#homeNum + "\" class=\"list-row home-container\">" +	
					"<div class=\"home-name\">" + this.#homeList[this.#homeNum].name + "<\/div>" +
					"<div class=\"home-location\">" +
						"<div class=\"home-city\">" + this.#homeList[this.#homeNum].location.city + "<\/div>" +
						"<div class=\"home-district\">" + "(" + this.#homeList[this.#homeNum].location.district + ")" + "<\/div>" +
						"<div class=\"home-street\">" + this.#homeList[this.#homeNum].location.street + "<\/div>" +										
					"</div>" +
					"<div class=\"home-button view-home-button\">" + 
							"<button id=\"" + "hvb" + this.#homeNum + "\"" + "type=\"button\" class=\"action-button\">" + 
								"view"  + 
							"</button>" + 
						"</div>" + 
					"<div>" +
				"</div>";
	}

	#fillHomeList()
	{
		this.#homeListSection.innerHTML = "";
		for(let home of this.#homeList)
		{
			this.#homeListSection.innerHTML += this.#createHomeRow();
			this.#homeNum++;
		}
		for(let card of this.#homeListSection.children)
			card.classList.add("add-shift");
	}

	#handleViewHomeReq(id)
	{
		if(id.match(/^(hvb)/) != null)
		{
			super.compleate = true;
			super.hideLog();
			super.displayLog("<p>Wait i'm searching your home!<p>");
			super.client.sectionUpdate("viewHomeInfo", this.#readHome(id));
		}
	}

	constructor(num, section, header, log, content, list, transDuration)
	{
		super(num, section, header, log, content, transDuration);
		this.#homeListSection = document.getElementById(list);
		this.reset();		
		this.#homeListSection.addEventListener('click', 
			(event) => this.#handleViewHomeReq(event.target.id));
	}

	clientUpdate(event, payload)
	{
		if(event == "homeList")
		{
			this.#homeList = [];
			this.#homeNum = 0;
			for(let home of payload)
				this.#homeList.push(home);
			this.#fillHomeList();	
			document.getElementById("search-home-list-wrapper")
				.classList.add("add-shift");
		}
	}

	display()
	{
		super.display();
		
	}

	refreshContent()
	{
		super.client.sectionUpdate("homeList");
	}

	reset()
	{
		this.#homeListSection.innerHTML = "";
		super.reset();
		super.compleate = false;
		this.#homeList = [];
		this.#homeNum = 0;
	}
}


export { SearchHomeSection }