import { CardSection } from "http://127.0.0.1:8080//subMenuSection.mjs";
import { SelectWrapper } from "./selectWrapper.mjs";

class AnnualHighlightSection extends CardSection
{
	#chart
	#measureName;
	#measureUnit;
	#chartCanvas;
	#chartContainer;
	#homeName;
	#yearSelect
	#yearChoosed;
	#availableYearForMeasure;
	#chartLog;
	#updateYearOptionList()
	{
		let contentList = [];
		for(let year of this.#availableYearForMeasure)
			contentList.push(year._id);
		this.#yearSelect.updateSelectOptionList(contentList);
	}

	#queryForPeriod()
	{
		super.client.sectionUpdate("dailyHighlightsHomeStatForYear", 
		{
			homeName : this.#homeName, 
			measure : this.#measureName, 
			period : { year : this.#yearChoosed }
		});
	}

	constructor(num, fadeDuration, sectionID, containerID, measureName, measureUnit)
	{
		super(num, sectionID, fadeDuration);
		this.#measureName = measureName;
		this.#measureUnit = measureUnit;
		this.#yearSelect =  new SelectWrapper(this, 
											 "annual-" + 
											 this.#measureName + 
											 "-year-select", 
											 "annual-" + 
											 this.#measureName + 
											 "-year-select-wrapper", 
											 	"year", 
												true);
								
		this.#chartContainer = document.getElementById(containerID);
		this.#chartCanvas = document.createElement("canvas");
		this.#chartCanvas.id = "annual-" + measureName + "-chart-canvas";
		this.#chartCanvas.className = "card-wide-canvas";
		this.#chartCanvas.style.display = "none";
		this.#chartContainer.appendChild(this.#chartCanvas); 
		this.#chartLog = document.createElement("div");
		this.#chartLog.className = "chart-log"
		this.#chartLog.id = "annual-" + this.#measureName + "-chart-log"
		this.#chartLog.innerHTML = "Choose an year first!";
		this.#chartContainer.appendChild(this.#chartLog); 
		this.#chartLog = document.getElementById("annual-" + this.#measureName + "-chart-log");
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
			case "selectChoiche" :
					this.#yearChoosed = payload.optionValue;
					this.#queryForPeriod();
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
			case "dailyHighlightsHomeStatForYear" :
				if(payload._id == this.#measureName)
				{
					this.#chartLog.style.display = "none";
					this.#chartCanvas.style.display = "flex";
					if(this.#chart != null)
						this.#chart.destroy()
					this.#chart = new Chart(this.#chartCanvas.getContext("2d"), 
					{
						type: 'bar',
						data: 
						{
							labels: [...Array(364).keys()].map(x => x + 1),
							datasets: 
							[{
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
							maintainAspectRatio : false,
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
		this.#availableYearForMeasure = null;
		this.#yearChoosed=null;
	}
}

export { AnnualHighlightSection }