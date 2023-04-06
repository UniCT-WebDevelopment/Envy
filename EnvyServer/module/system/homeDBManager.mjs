import { ObjectId } from "bson";
import { DataBaseManager } from "./dataBaseManager.mjs"

class HomeDBManager extends DataBaseManager 
{
	static #instance = null;

	async #homeExist(name)
	{
		const filter = { name: name };
		return await super.itemExist("home", filter);
	}

	async #roomExist(homeName, roomName)
	{
		const filter = 
		{
			name: homeName,
			roomSet: { $elemMatch: { name: roomName } }
		};
		return await super.itemExist("home", filter);
	}

	async #readHomeID(homeName) 
	{
		const filter = { name: homeName }
		const option = { projection: { _id: 1 } }
		await super.readOne("home", filter, option);
	}

	async addHome(home) 
	{
		if (!await this.#homeExist(home.name)) 
		{
			home["lastModify"] = new Date();
			home["allarmSet"] = [];
			home["warningSet"] = [];
			home["measure"] =
			[
				{
					"name": "temperature",
					"unit": "°C",
					"measureSet": []
				},
				{
					"name": "humidity",
					"unit": "RH",
					"measureSet": []
				},
				{
					"name": "luminosity",
					"unit": "lum",
					"measureSet": [],
				},
				{
					"name": "presence",
					"unit": "s",
					"measureSet": []
				},
			]
			await super.insertOne("home", home);
			return true;
		}
		return false;
	}

	async addRoom(homeName, room) 
	{
		if(!await this.#roomExist(homeName, room.name)) 
		{
			const filter = { name: homeName };
			room["creation"] = new Date();
			room["lastModify"] = new Date();
			const command = { $addToSet: { roomSet: room} };
			await super.updateColl("home", filter, command);
			return true;
		}
		return false;
	}

	async addMeasure(homeMeasure) 
	{
		const filter = { name: homeMeasure.homeName, "measure.name" : homeMeasure.measure };
		let measure = 
		{
			"value" : homeMeasure.value,
			"device" : homeMeasure.device,
			"time" :  homeMeasure.time, // new Date()
		}
		const command = { $addToSet: { "measure.$.measureSet":  measure}};
		await super.updateColl("home", filter, command);
	}

	async readHomeRoomList(homeName) 
	{
		const filter = { name: homeName };
		const option = { _id: 0, roomSet: 1 };
		const homeListRooms = await super.readMany("home", filter, option);
		return homeListRooms[0].roomSet;
	}

	async readHomeNameList() 
	{
		const filter = {}
		const option = { _id: 0, name: 1, location : 1};
		const homeList = await super.readMany("home", filter, option);
		return homeList;
	}

	async readHomeRoomInfo(homeName, roomName)
	{
		const filter = { name: homeName, "roomSet.name": roomName };
		const option = { _id: 0, 'roomSet.$': 1 };
		const homeList = await super.readMany("home", filter, option);
		return homeList[0].roomSet[0];
	}

	async readHomeInfo(homeName) 
	{
		const pipeline = 
		[
			{
			  "$match": {
				"name": homeName
			  }
			},
			{
			  "$project": {
				"_id": 0,
				"measure": 0,
				"roomSet": 0
			  }
			},
			{
			  "$project": {
				"allarmSet": 1,
				"name": 1,
				"location": 1,
				"deviceInfo": {
				  "online": {
					"$size": {
					  "$filter": {
						"input": "$deviceSet",
						"as": "device",
						"cond": {
						  "$eq": [
							"$$device.status",
							"online"
						  ]
						}
					  }
					}
				  },
				  "associated": {
					"$size": "$deviceSet"
				  }
				}
			  }
			}
		];
		const homeInfo = await super.aggregate("home", pipeline);
		return homeInfo[0];
	}

	async updateHomeLocation(homeName, location) 
	{
		const filter = { name: homeName };
		const command = {
			$currentDate: { lastModify: true },
			$set: { location: location }
		};
		await super.updateColl("home", filter, command);
	}

	async updateHomeName(homeName, newHomeName) 
	{
		const filter = { name: homeName };
		const command = {
			$currentDate: { lastModify: true },
			$set: { name: newHomeName }
		};
		await super.updateColl("home", filter, command);
	}

	async updateRoomName(homeName, roomName, newRoomName) 
	{
		const filter = 
		{
			name: homeName,
			roomSet: { $elemMatch: { name: roomName } }
		};
		const command = {
			$currentDate: { lastModify: true },
			$set: { "roomSet.$.name": newRoomName }
		};
		await super.updateColl("home", filter, command);
	}

	async updateRoomFloor(homeName, roomName, floor) 
	{
		const filter = 
		{
			name: homeName,
			roomSet: { $elemMatch: { name: roomName } }
		};
		const command = 
		{
			$currentDate: { lastModify: true },
			$set: { "roomSet.$.floor": floor }
		};
		await super.updateColl("home", filter, command);
	}

	async updateRoomName(homeName, roomName, newRoomName) 
	{
		const filter = 
		{
			name: homeName,
			roomSet: { $elemMatch: { name: roomName } }
		};
		const command = 
		{
			$currentDate: { lastModify: true },
			$set: { "roomSet.$.name": newRoomName }
		};
		await super.updateColl("home", filter, command);
	}

	async updateRoomInfo(homeName, roomName, newRoomName, newfloor) 
	{
		const filter = 
		{
			name: homeName,
			roomSet: { $elemMatch: { name: roomName } }
		};
		const command = 
		{
			$currentDate: { lastModify: true },
			$set: { "roomSet.$.name": newRoomName, "roomSet.$.floor": newfloor }
		};
		await super.updateColl("home", filter, command);
	}

	async addDevice(homeName, roomName, device) 
	{
		device["room"] = roomName;
		device["allarms"] = [];
		const filter = { name: homeName };
		const command = { $addToSet: { 'deviceSet': device } };
		await super.updateColl("home", filter, command);
	}

	async readHomeDevice(homeName)
	{
		const filter = { name: homeName };
		const option = { _id: 0, deviceSet: 1 };
		const homeDeviceSet = await super.readMany("home", filter, option);
		return homeDeviceSet[0].deviceSet;
	}

	async readRoomDevice(homeName, roomName) 
	{
		const pipeline = 
		[
			{
				"$match": {
					name: homeName
				}
			},
			{
				"$project": {
					_id: 0,
					roomDeviceSet: {
						$filter: {
							input: "$deviceSet",
							as: "device",
							cond: {
								$eq: [
									"$$device.room", roomName
								]
							}
						}
					}
				}
			},
			{
				"$project": {
					_id: 0,
					roomDeviceSet: {
						room: 0
					}
				}
			}
		];
		const homeDeviceSet = await super.aggregate("home", pipeline);
		return homeDeviceSet[0].roomDeviceSet;
	}

	async removeDevice(homeName, deviceName) {
		const filter = { name: homeName };
		const command = { $pull: { 'deviceSet': deviceName } };
		await super.updateColl("home", filter, option);
	}

	async updateDeviceRoom(homeName, newRoom, deviceName) {
		const filter = {
			name: homeName,
			deviceSet: { $elemMatch: { name: deviceName } }
		};
		const command = {
			$currentDate: { lastModify: true },
			$set: { "deviceSet.$.room": newRoom }
		};
		await super.updateColl("home", filter, command);
	}

	async insertAllarm(allarm) {
		allarm["date"] = new Date();
		const filter = {
			deviceSet: { $elemMatch: { name: allarm.device } }
		};
		const command = { $addToSet: { '$allarmSet': { allarm } } };
		await super.insertOne("home", filter, command);
		return true;
	}

	async readRoomAllarm(homeName, roomName) 
	{
		const pipeline =
		[
			{
				"$match": {
					name: homeName
				}
			},
			{
				"$project": {
					_id: 0,
					roomDeviceSet: {
						$filter: {
							input: "$deviceSet",
							as: "device",
							cond: {
								$eq: [
									"$$device.room",
									roomName
								]
							}
						}
					},
					allarmSet: 1
				}
			},
			{
				"$project": {
					_id: 0,
					roomAllarmSet: {
						$filter: {
							input: "$allarmSet",
							as: "allarm",
							cond: {
								$in: [
									"$$allarm.device",
									"$roomDeviceSet.name"
								]
							}
						}
					}
				}
			}
		];
		const roomAllarmSet = await super.aggregate("home", pipeline);
		return roomAllarmSet;
	}

	async readHomeAllarm(homeName) 
	{
		const pipeline =
		[
			{
				"$match":
				{
					name: homeName
				}
			},
			{
				"$project":
				{
					_id: 0,
					homeAllarmSet: { allarmSet: 1 }
				}
			}
		];
		const homeDeviceSet = await super.aggregate("home", pipeline);
		return homeDeviceSet[0].homeAllarmSet;
	}

	async readSystemStatus() 
	{
		const pipeline =
		[
			{
				"$project":
				{
					_id: 0,
					allarmSet:
					{
						$filter: {
							input: "$allarmSet",
							as: "allarm",
							cond: {
								$eq: [
									"$$allarm.checked",
									false
								]
							}
						}
					},
					allarmSet: 1
				}
			},
			{
				"$project":
				{
					_id: 0,
					globalAllarmSet: { allarmSet: 1 }
				}
			}
		];
		const homeDeviceSet = await super.aggregate("home", pipeline);
		return homeDeviceSet[0].globalAllarmSet;
	}

	async readDailyHighlightsHomeStat(homeStat) 
	{
		let todayBegin  = new Date(
			new Date().getFullYear(), 
			new Date().getMonth(), 
			new Date().getDate(), 0, 0, 0);
		let todayEnd  = new Date(
			new Date().getFullYear(), 
			new Date().getMonth(), 
			new Date().getDate(), 23, 58, 58);		
		
		console.log();
		const pipeline =
		[
			{
			  "$match": {
				"name": homeStat.homeName
			  }
			},
			{
			  "$addFields": {
				measureName: homeStat.measure
			  }
			},
			{
			  "$project": {
				"_id": 0,
				measureName: 1,
				researchedMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$measure",
					  "as": "m",
					  "cond": {
						"$eq": [
						  "$$m.name",
						  homeStat.measure
						]
					  }
					}
				  }
				}
			  }
			},
			{
				"$project": 
				{
				  "_id": 0,
				  measureName: 1,
				  todayMeasureSet: {
					  "$filter": {
						"input": "$researchedMeasure.measureSet",
						"as": "m",
						"cond": {
						  "$and": 
						  [
							{"$lte" : [ "$$m.time",  todayEnd]},
							{"$gte" : [ "$$m.time",  todayBegin]}
						  ]
						}
					  }
				  },
				}
			},
			{
			  "$project": {
				"_id": 0,
				measureName: 1,
				lastMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$todayMeasureSet",
					  "as": "m",
					  "cond": {"$max": "$todayMeasureSet.time"}
				  	}
					}
				},
				maxMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$todayMeasureSet",
					  "as": "q",
					  "cond": {"$eq": ["$$q.value", {"$max": "$todayMeasureSet.value"}]},			  
					}
				  }
				},
				minMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$todayMeasureSet",
					  "as": "m",
					  "cond": {"$eq": ["$$m.value", {"$min": "$todayMeasureSet.value"}]},			  
					  }
					}
				},
				smallerThanAvgMeasureSet: {
				  "$filter": {
					"input": "$todayMeasureSet",
					"as": "m",
					"cond": {"$lte": ["$$m.value", {"$avg": "$todayMeasureSet.value"}]},
					}
				}
			  }
			},
			{
			  "$project": {
				measureName: 1,
				lastMeasure: 1,
				maxMeasure: 1,
				minMeasure: 1,
				midMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$smallerThanAvgMeasureSet",
					  "as": "m",
					  "cond": {
						"$eq": [
						  "$$m.value",
						  {
							"$max": "$smallerThanAvgMeasureSet.value"
						  }
						]
					  }
					}
				  }
				}
			  }
			}
		 ]
		const homeMeasureSet = await super.aggregate("home", pipeline);
		return homeMeasureSet[0];			
	}

	async readAvailableYearForMeasure(homeStat)
	{	
		const pipeline =
		[
			{
			  "$match": {
				"name": homeStat.homeName
			  }
			},
			{
			  "$project": {
				"_id": 0,
				measureName: homeStat.measure,
				researchedMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$measure",
					  "as": "m",
					  "cond": {
						"$eq": [
						  "$$m.name",
						  homeStat.measure
						]
					  }
					}
				  }
				}
			  }
			},
			{
				"$project": {
				  "_id": 0,
					measure: 
					{
						"$map" :
						{
							"input" : "$researchedMeasure.measureSet",
							"as" : "measure",
							"in" : 
							{  
								name: homeStat.measure,
								time : "$$measure.time" 
							}
						}
					}
				}
			},
			{
				"$unwind" : "$measure"
			},
			{
				"$group": 
				{
				  "_id": 
				  {
					"year" : {"$year" : "$measure.time"},
					"month" : {"$month" : "$measure.time"},
				  },
				  monthMeasureNum: 
				  {
						"$count" : {}
				  }
				}
			},
			{
				"$sort" : { "_id.year" : 1, "_id.month" : 1}
			},
			{
				"$group": 
				{
				  "_id": "$_id.year",
				  monthAvailable: {
					"$push" : { "month" : "$_id.month", monthMeasureNum : "$monthMeasureNum"}
				  }
				}
			},
			{
				"$sort" : { _id : 1}
			}
		]
		const homeMeasureSet = await super.aggregate("home", pipeline);
		return { "measure" : homeStat.measure , "data" : homeMeasureSet};			
	}

	async readDailyHighlightHomeStatForMonth(homeStat)  //home Highlight measure for month
	{
		console.log(homeStat.period);
		let periodEnd = new Date(homeStat.period.year, homeStat.period.month + 1, 0);
		periodEnd.setMinutes(59);
		periodEnd.setHours(23);
		let periodBegin  = new Date(homeStat.period.year, homeStat.period.month, 1);
		console.log(periodEnd);
		console.log(periodBegin);
		console.log(periodEnd.toString());
		console.log(periodBegin.toString());
		const pipeline =
		[
			{
			  "$match": {
				"name": homeStat.homeName
			  }
			},
			{
			  "$project": {
				"_id": 0,
				researchedMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$measure",
					  "as": "m",
					  "cond": {
						"$eq": [
						  "$$m.name",
						  homeStat.measure
						]
					  }
					}
				  }
				}
			  }
			},
			{
			  "$project": {
				measure: {
				  "$filter": {
					"input": "$researchedMeasure.measureSet",
					"as": "t",
					"cond": {
					  "$and": [
						{
						  "$lte": [
							"$$t.time",
							periodEnd,
						  ]
						},
						{
						  "$gte": [
							"$$t.time",
							periodBegin,
						  ]
						}
					  ]
					}
				  }
				}
			  }
			},
			{
			  "$unwind": "$measure"
			},
			{
			  "$group": {
				"_id": {
					"$dayOfMonth" : "$measure.time"
				},
				dayMeasureSet: {
				  "$addToSet": "$measure"
				}
			  }
			},
			{
			  "$project": {
				measureName : homeStat.measure,
				dayMeasureSet: 1
			  }
			},
			{
			  "$project": {
				measureName: 1,
				avgMeasure: {
				  "$avg": "$dayMeasureSet.value"
				},
				maxMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$dayMeasureSet",
					  "as": "m",
					  "cond": {
						"$and": [
						  {
							"$eq": [
							  "$$m.value",
							  {
								"$max": "$dayMeasureSet.value"
							  }
							]
						  }
						]
					  }
					}
				  }
				},
				minMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$dayMeasureSet",
					  "as": "m",
					  "cond": {
						"$and": [
						  {
							"$eq": [
							  "$$m.value",
							  {
								"$min": "$dayMeasureSet.value"
							  }
							]
						  },
						  
						]
					  }
					}
				  }
				},
				midMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$dayMeasureSet",
					  "as": "m",
					  "cond": {
						"$eq": [
						  "$$m.value",
						  {
							"$max": {
							  "$map": {
								"input": {
								  "$filter": {
									"input": "$dayMeasureSet",
									"as": "x",
									"cond": {
									  "$lte": [
										"$$x.value",
										{
										  "$avg": "$dayMeasureSet.value"
										}
									  ]
									}
								  }
								},
								"as": "me",
								"in": "$$me.value"
							  }
							}
						  }
						]
					  }
					}
				  }
				}
			  }
			},
			{
				"$sort" :
				{
					"_id" : 1
				}
			},
			{
			  	"$group": 
			  	{
					"_id": "$measureName",
					dailyMeasureSet: 
					{
						"$push" : 
						{
							id: "$_id",
							avgMeasure: "$avgMeasure",
							minMeasure: "$minMeasure",
							midMeasure: "$midMeasure",
							maxMeasure: "$maxMeasure"
						}
					}
				}
			}
		]
		const roomMeasureSet = await super.aggregate("home", pipeline);
		return roomMeasureSet[0];	
	}

	async readDailyHighlightHomeStatForYear(homeStat)  //home Highlight measure for year
	{
		let periodEnd  = new Date(homeStat.period.year, 12);
		let periodBegin  = new Date(homeStat.period.year, 0);
		console.log(periodEnd);
		const pipeline =
		[
			{
			  "$match": {
				"name": homeStat.homeName
			  }
			},
			{
			  "$project": {
				"_id": 0,
				researchedMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$measure",
					  "as": "m",
					  "cond": {
						"$eq": [
						  "$$m.name",
						  homeStat.measure
						]
					  }
					}
				  }
				}
			  }
			},
			{
			  "$project": {
				measure: {
				  "$filter": {
					"input": "$researchedMeasure.measureSet",
					"as": "measure",
					"cond": {
					  "$and": [
						{
						  "$lte": [
							"$$measure.time",
							periodEnd,
						  ]
						},
						{
						  "$gte": [
							"$$measure.time",
							periodBegin,
						  ]
						}
					  ]
					}
				  }
				}
			  }
			},
			{
			  "$unwind": "$measure"
			},
			{
			  "$group": {
				"_id": {
					"$dayOfYear" : "$measure.time"
				},
				dayMeasureSet: {
				  "$addToSet": "$measure"
				}
			  }
			},
			{
			  "$project": {
				measureName: homeStat.measure,
				dayMeasureSet: 1
			  }
			},
			{
			  "$project": {
				measureName: 1,
				avgMeasure: {
				  "$avg": "$dayMeasureSet.value"
				},
				maxMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$dayMeasureSet",
					  "as": "m",
					  "cond": {
						"$and": [
						  {
							"$eq": [
							  "$$m.value",
							  {
								"$max": "$dayMeasureSet.value"
							  }
							]
						  }
						]
					  }
					}
				  }
				},
				minMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$dayMeasureSet",
					  "as": "m",
					  "cond": {
						"$and": [
						  {
							"$eq": [
							  "$$m.value",
							  {
								"$min": "$dayMeasureSet.value"
							  }
							]
						  },
						  
						]
					  }
					}
				  }
				},
				midMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$dayMeasureSet",
					  "as": "m",
					  "cond": {
						"$eq": [
						  "$$m.value",
						  {
							"$max": {
							  "$map": {
								"input": {
								  "$filter": {
									"input": "$dayMeasureSet",
									"as": "x",
									"cond": {
									  "$lte": [
										"$$x.value",
										{
										  "$avg": "$dayMeasureSet.value"
										}
									  ]
									}
								  }
								},
								"as": "me",
								"in": "$$me.value"
							  }
							}
						  }
						]
					  }
					}
				  }
				}
			  }
			},
			{
				"$sort" :
				{
					"_id" : 1
				}
			},
			{
			  "$group": {
				"_id": "$measureName",
				dailyMeasureSet: {
					"$push" : 
					{
						id: "$_id",
						minMeasure: "$minMeasure",
						midMeasure: "$midMeasure",
						maxMeasure: "$maxMeasure"
					  }
					}
				}
			}
		]
		const roomMeasureSet = await super.aggregate("home", pipeline);
		return roomMeasureSet[0];	
	}

	async readDailyHighlightsRoomStat(homeStat)  //room daily measure highlight 
	{
		let todayBegin = new Date();
		let todayEnd  = new Date();
		todayBegin.setHours(0);
		todayBegin.setMinutes(0);
		todayBegin.setSeconds(0);
		todayEnd.setMinutes(59);
		todayEnd.setSeconds(59);
		todayEnd.setHours(23);
		const pipeline = 
		[
			{
				"$match": {
					"name": homeStat.homeName
				}
			},
			{
				"$project": {
					_id: 0,
					roomDeviceSet: {
						$filter: {
							input: "$deviceSet",
							as: "device",
							cond: {
								$eq: [
									"$$device.room",
									homeStat.roomName
								]
							}
						}
					}
				}
			},
			{
				"$addFields" :
				{
					measureName : homeStat.measure
				}
			},
			{
				"$addFields" :
				{
					roomName : homeStat.roomName
				}
			},
			{
				"$project": {
					"_id": 0,
					measureName : 1,
					roomName: 1,
					roomDeviceSet: 1,
					researchedMeasure: {
						"$first": {
							"$filter": {
								"input": "$measure",
								"as": "m",
								"cond": {
									"$and": [
										{
											"$eq": [
												"$$m.name",
												homeStat.measure
											]
										}
									]
								}
							}
						}
					}
				}
			},
			{
				"$project": {
					researchedMeasure: {
						"$filter": {
							"input": "$researchedMeasure.measureSet",
							"as": "m",
							"cond": {
								"$in": [
									"$$m.device",
									"$roomDeviceSet.name"
								]
							}
						}
					}
				}
			},
			{
				"$project": {
					"_id": 0,
					lastMeasure: {
						"$first": {
							"$filter": {
								"input": "$researchedMeasure.measureSet",
								"as": "m",
								"cond": {
									"$eq": [
										"$$m.time",
										{
											"$max": "$researchedMeasure.time"
										}
									]
								}
							}
						}
					},
					maxMeasure: {
						"$first": {
							"$filter": {
								"input": "$researchedMeasure.measureSet",
								"as": "m",
								"cond": 
								{
									"$and" : 
									[ 

										{"$eq": ["$$m.value", {"$max": "$researchedMeasure.value"}]},
										{"$lte" : ["$$m.time", todayEnd]},
										{"$gte" : ["$$m.time", todayBegin]}
									]
								}
								}
							}
					},
					minMeasure: {
						"$first": {
							"$filter": {
								"input": "$researchedMeasure.measureSet",
								"as": "m",
								"cond": 
								{
									"$and" : 
									[ 
										{"$eq": ["$$m.value", {"$min": "$researchedMeasure.value"}]},
										{"$lte" : ["$$m.time", todayEnd]},
										{"$gte" : ["$$m.time", todayBegin]}
									]
								}
							}
						}
					},
					midMeasure: {
						"$filter": {
							"input": "$researchedMeasure.measureSet",
							"as": "m",
							"cond": 
							{
								"$and" : 
								[ 
									{"$lte": ["$$m.value", {"$avg": "$researchedMeasure.value"}]},
									{"$lte" : ["$$m.time", todayEnd]},
									{"$gte" : ["$$m.time", todayBegin]}
								]
							}
						}
					},
				}
			},
			{
				"$project": {
					roomName : 1,
					measureName : 1,
					lastMeasure: 1,
					maxMeasure: 1,
					minMeasure: 1,
					midMeasure: {
						"$first": {
							"$filter": {
								"input": "$midMeasure",
								"as": "m",
								"cond": {
									"$eq": [
										"$$m.value",
										{
											"$max": "$midMeasure.value"
										}
									]
								}
							}
						}
					}
				}
			}
		]
		const roomMeasureSet = await super.aggregate("home", pipeline);
		return roomMeasureSet[0];			
	}

	async readDailyHighlightsForRoomStat(homeStat) //room set daily measure highlight 
	{
		let todayBegin  = new Date(
			new Date().getFullYear(), 
			new Date().getMonth(), 
			new Date().getDate(), 0, 0, 0);
		let todayEnd  = new Date(
			new Date().getFullYear(), 
			new Date().getMonth(), 
			new Date().getDate(), 23, 59, 59);

			console.log(todayBegin.toString());
			console.log(todayEnd.toString());
		const pipeline =
		[
			{
			  "$match": {
				"name": homeStat.homeName
			  }
			},
			{
			  "$project": {
				"_id": 0,
				deviceSet: 1,
				roomSet: 1,
				measureName: 1,
				researchedMeasure: {
				  "$first": {
					"$filter": {
					  "input": "$measure",
					  "as": "m",
					  "cond": {
						"$eq": [
						  "$$m.name",
						homeStat.measure
						]
					  }
					}
				  }
				}
			  }
			},
			{
				"$project": 
				{
				  "_id": 0,
				  measureName: 1,
				  roomSet: 1,
				  deviceSet: 1,
				  todayMeasureSet: {
					  "$filter": {
						"input": "$researchedMeasure.measureSet",
						"as": "m",
						"cond": {
							"$and": 
							[
							  {"$lte" : ["$$m.time", todayEnd]},
							  {"$gte" : ["$$m.time",  todayBegin]}
							]
						}
					  }
				  },
				}
			},
			{
			  "$project": {
				todayDeviceMeasureSet: {
				  "$map": {
					input: "$deviceSet",
					as: "device",
					in: {
					  deviceMeasure: {
						"$filter": {
						  "input": "$todayMeasureSet",
						  "as": "m",
						  "cond": {
							"$eq": [
							  "$$m.device",
							  "$$device.name"
							]
						  }
						}
					  },
					  deviceRoom: "$$device.room"
					}
				  }
				}
			  }
			},
			{
			  "$unwind": "$todayDeviceMeasureSet"
			},
			{
			  "$unwind": "$todayDeviceMeasureSet.deviceMeasure"
			},
			{
			  "$group": {
				"_id": "$todayDeviceMeasureSet.deviceRoom",
				dayMeasureSet: {
				  $addToSet: "$todayDeviceMeasureSet.deviceMeasure"
				}
			  }
			},
			{
				"$project": {
					"_id": 1,
					lastMeasure: {
						"$first": {
							"$filter": {
								"input": "$dayMeasureSet",
								"as": "m",
								"cond": {
									"$eq": [
										"$$m.time",
										{
											"$max": "$dayMeasureSet.time"
										}
									]
								}
							}
						}
					},
					maxMeasure: {
						"$first": {
							"$filter": {
								"input": "$dayMeasureSet",
								"as": "m",
								"cond": 
								{
									"$eq": ["$$m.value", {"$max": "$dayMeasureSet.value"}]
								}
								}
							}
					},
					minMeasure: {
						"$first": {
							"$filter": {
								"input": "$dayMeasureSet",
								"as": "m",
								"cond": 
								{
								
										"$eq": ["$$m.value", {"$min": "$dayMeasureSet.value"}],
									
								}
							}
						}
					},
					midMeasure: {
						"$filter": {
							"input": "$dayMeasureSet",
							"as": "m",
							"cond": 
							{ 
								"$lte": ["$$m.value", {"$avg": "$dayMeasureSet.value"}],
								
							}
						}
					},
				}
			},
			{
				"$addFields" :
				{
					measureName : homeStat.measure,
				}
			},
			{
				"$project": 
				{
					measureName : 1,
					lastMeasure: 1,
					maxMeasure: 1,
					minMeasure: 1,
					midMeasure: {
						"$first": {
							"$filter": {
								"input": "$midMeasure",
								"as": "m",
								"cond": {
									"$eq": [
										"$$m.value",
										{
											"$max": "$midMeasure.value"
										}
									]
								}
							}
						}
					}
				}
			},
			{
				"$group": {
				  "_id": "$measureName",
				  roomDailyMeasureSet: {
					  "$push" : 
					  {
						  id: "$_id",
						  minMeasure: "$minMeasure",
						  midMeasure: "$midMeasure",
						  maxMeasure: "$maxMeasure"
						}
					  }
				}
			}
		]
		const roomMeasureSet = await super.aggregate("home", pipeline);
		return roomMeasureSet[0];			
	}

	constructor() {
		super();
	}

	async init(dbURL) {
		await super.init(dbURL, "envyHome");
	}

	static async instance(dbURL) {
		if (!HomeDBManager.#instance) {
			HomeDBManager.#instance = new HomeDBManager()
			await HomeDBManager.#instance.init(dbURL);
		}
		return HomeDBManager.#instance;
	}
}

export { HomeDBManager };


