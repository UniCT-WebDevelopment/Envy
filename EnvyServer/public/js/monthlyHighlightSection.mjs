import { CardSection } from "http://127.0.0.1:8080//subMenuSection.mjs";
import { SelectWrapper } from "./selectWrapper.mjs";

class MonthlyHighlightSection extends CardSection
{
	#chart
	#measureName;
	#measureUnit;
	#chartCanvas;
	#chartContainer;
	#homeName;
	#yearSelect
	#monthSelect;
	#yearChoosed;
	#monthChoosed;
	#availableYearForMeasure;
	#monthNameSet;
	#chartLog;

	#updateYearOptionList()
	{
		let contentList = [];
		for(let year of this.#availableYearForMeasure)
			contentList.push(year._id);
		this.#yearSelect.updateSelectOptionList(contentList);
	}

	#updateMonthOptionList()
	{
		let contentList = [];
		if(!this.#availableYearForMeasure.length)
			console.log("month list " + this.#measureName + " full ", this.#availableYearForMeasure)
		for(let year of this.#availableYearForMeasure)
		{
			if(year._id == this.#yearChoosed)
			{
				for(let month of year.monthAvailable)
					contentList.push(this.#monthNameSet[month.month - 1]);
				console.log(contentList);
				this.#monthSelect.updateSelectOptionList(contentList);
				break;
			}
		}
	}

	#queryForMonthlyMeasure()
	{
		super.client.sectionUpdate("dailyHighlightsHomeStatForMonth", 
		{
			homeName : this.#homeName, 
			measure : this.#measureName, 
			period : 
			{ 
				month : this.#monthChoosed,
				year : this.#yearChoosed
			}
		});
	}

	constructor(num, fadeDuration, sectionID, containerID, measureName, measureUnit)
	{
		super(num, sectionID, fadeDuration);
		this.#measureName = measureName;
		this.#measureUnit = measureUnit;
		this.#yearSelect =  new SelectWrapper(this, 
											 "monthly-" + 
											 this.#measureName + 
											 "-year-select", 
											 "monthly-" + 
											 this.#measureName + 
											 "-year-select-wrapper", 
											 	"year", 
												true);
		this.#monthSelect = new SelectWrapper(this,
											  "monthly-" + this.#measureName + "-month-select", "monthly-" + this.#measureName + "-month-select-wrapper",
											  "month", 
											  false);
		this.#chartContainer = document.getElementById(containerID);
		this.#chartCanvas = document.createElement("canvas");
		this.#chartCanvas.id = "monthly-" + measureName + "-chart-canvas";
		this.#chartCanvas.className = "card-wide-canvas";
		this.#chartContainer.appendChild(this.#chartCanvas); 
		this.#chartCanvas.style.display = "none";
		this.#chartLog = document.createElement("div");
		this.#chartLog.className = "chart-log"
		this.#chartLog.id = "monthly-" + this.#measureName + "-chart-log"
		this.#chartLog.innerHTML = "Choose an year first!";
		this.#chartContainer.appendChild(this.#chartLog); 
		this.#monthNameSet =  ["January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December"];
		this.#chart = null;
	}

	refreshContent()
	{
		super.client.sectionUpdate("homeName", {"num" : super.num});
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "selectClick" :
				//if(payload.id == ("monthly-" + this.#measureName + "-year-select"))
				//	this.#monthSelect.closeSelect();		
			//	else this.#yearSelect.closeSelect();		
			//	break;
				break;
			case "selectChoiche" :
				if(payload.id == ("monthly-" + this.#measureName + "-year-select"))
				{
					console.log("choiche ", payload.optionValue)
					this.#chartLog.innerHTML = "Choose a month...";
					this.#yearChoosed = payload.optionValue;
					this.#monthSelect.enabled = true;
					this.#updateMonthOptionList();
				}			
				else 
				{
					this.#monthChoosed = payload.optionValue;
					for(let index = 0; index < this.#monthNameSet.length; index++)
						if(this.#monthNameSet[index] == this.#monthChoosed)
						{
							this.#monthChoosed = index;
							this.#queryForMonthlyMeasure();
						}
				
				}
				break;
			case "homeName" :
				if(payload.num == super.num)
				{
					this.#homeName = payload.name;
					super.client.sectionUpdate("availableYearForMeasure", 
						{"homeName" : this.#homeName, "measure" : this.#measureName});
				}			
				break;
			case "availableYearForMeasure" :
				if(payload.measure == this.#measureName)
				{
					this.#availableYearForMeasure = [];
					for(let year of payload.data)
						this.#availableYearForMeasure.push(year);	
					this.#updateYearOptionList();
				}
				break;
			case "dailyHighlightsHomeStatForMonth" :
				if(payload._id == this.#measureName)
				{
					this.#chartCanvas.style.display = "flex";
					this.#chartLog.style.display = "none";
					if(this.#chart != null)
						this.#chart.destroy()
					this.#chart = new Chart(this.#chartCanvas.getContext("2d"), 
					{
						type: 'bar',
						data: 
						{
							labels: [...Array(payload.dailyMeasureSet.length).keys()].map(x => x + 1),
							datasets: 
							[{
								color:  "white",
								label: "Min", 
								data: [],
								backgroundColor: ['#F9C74F']
							},
							{
								label: "Mid", 
								data: [],
								backgroundColor: ['#90BE6D']
								
							},
							{
								label: "Max", 
								data: [],
								backgroundColor: ['#43AA8B']
							},
							{
								label: "Avg", 
								data: [],
								backgroundColor: ['rgba(75, 192, 192, 0.8)']
							}],
						},
						options: 
						{
							plugins:
							{ 
								legend: 
								{
									labels: 
									{
										font : 
										{ 
											family : "'Nunito', sans-serif",
										},										
										color: '#ffffffde'
									}
								},
							},
							maintainAspectRatio : false,
							scales: {
							  y: {
								max : 40,
								min : -10,
								grid: {
									color: 'transparent',
									borderColor: '#ced4da',
									tickColor: '#ced4da'
								  },
								  ticks: {
									color : "white"
								  }
							  },
							  x: 
							  {
								stacked : true,
								grid: {
									color: 'transparent',
									borderColor: '#ced4da',
									tickColor: '#ced4da'
								  },
								  ticks: {
									color : "white"
								  }
							  }
							  }
						}
					});
					for(let i = 0; i < payload.dailyMeasureSet.length; i++)
					{
						this.#chart.data.datasets[0].data[i] = payload.dailyMeasureSet[i].minMeasure.value;
						this.#chart.data.datasets[1].data[i] = payload.dailyMeasureSet[i].midMeasure.value;
						this.#chart.data.datasets[2].data[i] = payload.dailyMeasureSet[i].maxMeasure.value;
						this.#chart.data.datasets[3].data[i] = payload.dailyMeasureSet[i].avgMeasure;
					}
					this.#chart.update();
				}
				break;
		}
	}

	reset()
	{
		this.#yearSelect.reset();
		this.#monthSelect.reset();
		this.#monthSelect.enabled = false;
		this.#availableYearForMeasure = null;
		this.#yearChoosed=null;
		this.#monthChoosed=null;
	}
}

export { MonthlyHighlightSection }