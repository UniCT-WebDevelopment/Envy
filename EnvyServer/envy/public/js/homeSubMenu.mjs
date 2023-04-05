import { NavigableSubMenu } from "http://envy-server.homenet.telecomitalia.it/subMenu.mjs"
import { SearchHomeSection } from "http://envy-server.homenet.telecomitalia.it/searchHomeSection.mjs"
import { HomePreviewSection } from "http://envy-server.homenet.telecomitalia.it/homePreviewSection.mjs"
import { RoomPreviewSection } from "http://envy-server.homenet.telecomitalia.it/roomPreviewSection.mjs"
import { DailyHighlightSection } from "http://envy-server.homenet.telecomitalia.it/dailyHighlightSection.mjs"
import { MonthlyHighlightSection } from "http://envy-server.homenet.telecomitalia.it/monthlyHighlightSection.mjs"
import { AnnualHighlightSection } from "http://envy-server.homenet.telecomitalia.it/annualHighlightSection.mjs"

class HomeSubMenu extends NavigableSubMenu
{
	#homeInfo;
	#researchedHome
	#eventList;
	#active;

	handleMenuNavigation(button)
	{
		if(button.id == "home-next-form-button" 
			&& super.currSectNum >= 3 
			&& super.currSectNum)
		{
			super.swipeToSection(super.currSectNum + 1);
			return ;
		}
		if(button.id == "home-back-form-button" && 
			super.currSectNum == 3)
		{
			super.sectionSet[super.currSectNum].reset();
			super.swipeToSection(1);
			return ;
		}
		if(button.id == "home-back-form-button" && 
			(super.currSectNum > 3 || 
			super.currSectNum == 2 || super.currSectNum == 1 ))
		{
			super.sectionSet[super.currSectNum].reset();
			super.swipeToSection(super.currSectNum - 1);
			return ;		
		}
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
				this.hideButton(super.nextButtonContainer);
				break
			case 2 :			
			case 5 :
				//this.hideButton(super.nextButtonContainer);
				break;
		}
	}

	handleButtonFadeIn()
	{
		switch(super.currSectNum)
		{
			case 0 :
				break;
			case 1 :
				this.displayButton(super.prevButtonContainer);
				break;
			case 3 :
			case 4 :
				this.displayButton(super.prevButtonContainer);
				this.displayButton(super.nextButtonContainer);
				break
			case 2 :
			case 5 :
			case 6 :
			case 7 :
			case 8 : 
				this.displayButton(super.prevButtonContainer);
				this.displayButton(super.nextButtonContainer);
		}
	}
	
	constructor(fadeDuration, swipeMenuDuration)
	{
		super(1, 
				[   
					new SearchHomeSection(0,
										  "search-home-section", 
										  "search-home-form-header", 
										  "search-home-log-container",
										  "search-home-list-wrapper",
										  "home-list-section",
										  fadeDuration),
				  	new HomePreviewSection(fadeDuration),
					new RoomPreviewSection(fadeDuration),
				 	new DailyHighlightSection(3, 
										fadeDuration, 
										"temperature-section", 
										"temperature-chart-container", 
										"temperature", 
										"°C",
										"home2 measure stat"),
					new DailyHighlightSection(4, 
										fadeDuration, 
										"humidity-section", 
										"humidity-chart-container", 
										"humidity", 
										"RH",
										"home2 measure stat"),
					new DailyHighlightSection(5, 
										fadeDuration, 
										"luminosity-section", 
										"luminosity-chart-container", 
										"luminosity", 
										"l",
										"home2 measure stat"),
					new MonthlyHighlightSection(6,
												fadeDuration,
												"monthly-temperature-section",
												"monthly-temperature-chart-container",
												"temperature"),
					new MonthlyHighlightSection(7,
												fadeDuration,
												"monthly-humidity-section",
												"monthly-humidity-chart-container",
												"humidity"),
					new MonthlyHighlightSection(8,
												fadeDuration,
												"monthly-luminosity-section",
												"monthly-luminosity-chart-container",
												"luminosity"),
					new AnnualHighlightSection(9,
												fadeDuration,
												"annual-temperature-section",
												"annual-temperature-chart-container",
												"temperature"),
					new AnnualHighlightSection(10,
												fadeDuration,
												"annual-humidity-section",
												"annual-humidity-chart-container",
												"humidity"),	
					new AnnualHighlightSection(11,
												fadeDuration,
												"annual-luminosity-section",
												"annual-luminosity-chart-container",
												"luminosity")																																		
				],												
				document.getElementById("home-component"), 
				fadeDuration, "home-next-form-button",
				"home-back-form-button", "home-next-button-container", 
				"home-back-button-container", swipeMenuDuration);
		this.#active = false;
		for(let section of super.sectionSet)
			section.client = this;
		
	}

	clientUpdate(event, payload)
	{
		if(this.#active)
		{
			switch(event)
			{	
				case "homeInfo" :
					this.#homeInfo = payload;
					super.sectionSet[1].clientUpdate(event, payload);
					super.swipeToSection(1);
					break;
				case "homeList" :
					super.sectionSet[0].clientUpdate(event, payload);
					break;
				case "homeRoomList" :				
					super.sectionSet[2].clientUpdate(event, payload);
					break;
				case "dailyHighlightsForRoomStat" : 
				case "dailyHighlightsHomeStat" :	
					super.sectionSet[3].clientUpdate(event, payload);
					super.sectionSet[4].clientUpdate(event, payload);			
					super.sectionSet[5].clientUpdate(event, payload);
					break;	
				case "availableYearForMeasure" :
					super.sectionSet[6].clientUpdate(event, payload);
					super.sectionSet[7].clientUpdate(event, payload);
					super.sectionSet[8].clientUpdate(event, payload);
					super.sectionSet[9].clientUpdate(event, payload);
					super.sectionSet[10].clientUpdate(event, payload);
					super.sectionSet[11].clientUpdate(event, payload);
					break
				case "dailyHighlightsHomeStatForMonth" :
					super.sectionSet[6].clientUpdate(event, payload);
					super.sectionSet[7].clientUpdate(event, payload);
					super.sectionSet[8].clientUpdate(event, payload);
				case "dailyHighlightsHomeStatForYear" :
					super.sectionSet[9].clientUpdate(event, payload);
					super.sectionSet[10].clientUpdate(event, payload);
					super.sectionSet[11].clientUpdate(event, payload);
					break
			}
		}
	}

	sectionUpdate(event, payload)
	{
		switch(event)
		{			
			case "viewHomeInfo" :
				this.#researchedHome = payload;
				super.client.update("homeInfo", this.#researchedHome);
				for(let i = 1; i < super.sectionSet.length; i++)
					super.sectionSet[i].clientUpdate("homeName", {"name" : this.#researchedHome, "num" : i});
				break;
			case "dailyStat" :
				this.swipeToSection(3);
				break;
			case "monthlyStat" :
				this.swipeToSection(6);
				break;	
			case "annualStat" :
				this.swipeToSection(9);
				break;					
			case "homeName" :
				super.sectionSet[payload.num].clientUpdate("homeName", {"name" : this.#researchedHome, "num" : payload.num });
				break;
			case "room" :
				this.swipeToSection(2);
				super.client.update("homeRoomList", this.#researchedHome);
				break;				
			default : 
				super.client.update(event, payload);	
				break;			
		}
	}	

	display()
	{
		this.#active = true;
		super.currSectNum = 0;
		super.display();
		super.hideButton(super.prevButtonContainer);
		super.hideButton(super.nextButtonContainer);
	}

	reset()
	{
		this.#active = false;
		super.reset();
		this.#researchedHome = null;
		this.#homeInfo = null;
		for(let section of super.sectionSet)
			section.reset();
	}
}

export { HomeSubMenu }