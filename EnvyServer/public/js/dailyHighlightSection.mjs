import { CardSection } from "http://127.0.0.1:8080//subMenuSection.mjs";

class DailyHighlightSection extends CardSection
{
	#infoContainer;
	#chart
	#measureName;
	#measureUnit;
	#chartCanvas;
	#chartContainer;
	#chartLabel;
	#homeName;

	#buildRoomMeasureCardList(roomMeasureSet)
	{
		this.#infoContainer.innerHTML = "";
		for(let room of roomMeasureSet)
		{
			this.#infoContainer.innerHTML +=  
				"<div id=\"" + room.name + "-measure-card\" class=\"room-measure-card\">" + 
					"<div class=\"room-measure-card-header\"><span>" + room.id  + "</span></div>" +
					"<div class=\"room-measure-card-value-container\">" +
						"<div class=\"room-measure-card-value\"><span>" +  room.minMeasure.value + " " + this.#measureUnit + "</span></div>" +
						"<div class=\"room-measure-card-value\"><span>" +  room.midMeasure.value + " " + this.#measureUnit + "</span></div>" +
						"<div class=\"room-measure-card-value\"><span>" +  room.maxMeasure.value + " " + this.#measureUnit + "</span></div>" +
					"</div>" +
				"</div>";
		}
	}

	constructor(num, fadeDuration, sectionID, containerID, measureName, measureUnit, chartLabel)
	{
		super(num, sectionID, fadeDuration);
		this.#measureName = measureName;
		this.#measureUnit = measureUnit;
		this.#chartLabel = chartLabel;
		this.#chartContainer = document.getElementById(containerID);
		this.#chartCanvas = document.createElement("canvas");
		this.#chartCanvas.id = "" + measureName + "-chart-canvas";
		this.#chartCanvas.className = "card-canvas";
		this.#chartContainer.appendChild(this.#chartCanvas); 
		this.#infoContainer = document.getElementById(measureName + "-info-container");
		this.#chart = new Chart(this.#chartCanvas.getContext("2d"), 
		{
			type: 'doughnut',
			label : this.#chartLabel,
			plugins:[ChartDataLabels],
			data: 
			{
				labels: ['Min', 'Mid', 'Max'],
				datasets: 
				[{
					label: chartLabel,
					data: [0, 0, 0],
					backgroundColor: 
					[
						'#F9C74F',
						'#90BE6D',
						'#43AA8B'
					],
					borderWidth: 0
				}],
			},
			options :
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
					tooltip : { enabled:false },
					datalabels:
					{
						color : ["white", "white", "white"],
						font : 
						{
							family : "'Nunito', sans-serif",

							
							size : 16
						},
						formatter : 
							(value, context) => 
								{ return value + " " + measureUnit; }						
					}
				}
			}
		});
	}

	refreshContent()
	{
		super.client.sectionUpdate("homeName", {"num" : super.num});
	}

	clientUpdate(event, payload)
	{
		switch(event)
		{
			case "homeName" :
				if(payload.num == super.num)
				{
					this.#homeName = payload.name;
					super.client.sectionUpdate("dailyHighlightsHomeStat", {"homeName" : this.#homeName, "measure" : this.#measureName});
					super.client.sectionUpdate("dailyHighlightsForRoomStat", {"homeName" : this.#homeName, "measure" : this.#measureName});
				}
				break;

			case "dailyHighlightsHomeStat" :
				if(payload.measureName == this.#measureName)
				{
					this.#chart.data.datasets[0].data[0] = payload.minMeasure.value;
					this.#chart.data.datasets[0].data[1] = payload.midMeasure.value;
					this.#chart.data.datasets[0].data[2] = payload.maxMeasure.value;
					this.#chart.update();
				}
				break;
			case "dailyHighlightsForRoomStat" :
				if(payload._id == this.#measureName)
					this.#buildRoomMeasureCardList(payload.roomDailyMeasureSet);
				break;
			
		}
	}
}

export { DailyHighlightSection }