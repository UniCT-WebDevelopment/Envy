import { HomeDBManager } from "./module/system/homeDBManager.mjs"
import { v4 as uuidv4 } from 'uuid';

const user =
{
	"name" : "userTest",
	"email" : "userTest@domain.it",
	"password" : "dslopòjakdslaopòkdaopls"
};


const user1 =
{
	"name" : "userTest1",
	"email" : "userTest1@domain.it",
	"password" : "òdsakllkgfòdkgòfkgòdfkg"
};

const home = 
{
	"name" : "casa de pazzi",
	"location" :
	{
		"district" : "Siracusa",
		"city" : "Buccheri",
		"street" : "Ramoddetta",
		"streetNumber" : 3
	},
	"roomSet" :
	[
		{
			"name" : "room",
			"floor" : 4,
		},
		{
			"name" : "room2",
			"floor" : 4,
		}
	],
	"deviceSet" : 
	[
		{"name" : "gianfryProto", "room" : "room"},
		{"name" : "gianfryProto1", "room" : "room"},
		{"name" : "gianfryProto2", "room" : "room2"},
		{"name" : "gianfryProto3", "room" : "room"},
	],
	"allarmSet" : 
	[
		{
			"device" :  "gianfryProto",
			"sensor" : "PIR1",
			"type" : "Activity",
		}, 
		{
			"device" :  "gianfryProto1",
			"sensor" : "PIR1",
			"type" : "Activity",
		},
		{
			"device" :  "gianfryProto1",
			"sensor" : "PIR1",
			"type" : "Activity",
		},
		{
			"device" :  "gianfryProto2",
			"sensor" : "PIR1",
			"type" : "Activity",
		}
	]
};

const homeLocation =
{
	"district" : "Siracusa",
	"city" : "Pagghiazzolo",
	"street" : "Ramoddetta",
	"streetNumber" : 3
}

const room = 
{
	"name" : "room",
	"floor" : 4
};

const room2 = 
{
	"name" : "room2",
	"floor" : 4
};

const device = {name : "gianfryProto"};
const device1 = {name : "gianfryProto1"};
const device2 = {name : "gianfryProto2"};
const device3 = {name : "gianfryProto3"};
const device4 = {name : "gianfryProto4"};

const allarm =
{
	"device" :  "gianfryProto",
	"sensor" : "PIR1",
	"type" : "Activity",
}

/*

"priority" : 3,
	"message" : "Human activity detected",
*/
/*
async function homeDataBaseTest()
{
	const db = new HomeDBManager();
	await db.init("mongodb://localhost:27017");
	await db.drop();
	await db.insertHome(home);
	console.log(await db.readHomeInfo(home.name));
	const rooms = await db.readHomeRooms(home.name);
	console.log(rooms);
	if(rooms[0].name === home.rooms[0].name 
		&& rooms[0].floor === home.rooms[0].floor
		&& rooms[1].name === home.rooms[1].name
		&& rooms[1].floor === home.rooms[1].floor)
		console.log("found all home rooms! URRAAAAA!!!");
	const expRoom2 = await db.readHomeRoom(home.name, "room2");
	console.log(expRoom2);
	console.log(room2);
	if(expRoom2.name === room2.name &&
		expRoom2.floor === room2.floor)
		console.log("found room2! URRAAAAA!!!");
	const expRoom = await db.readHomeRoom(home.name, "room");
	console.log(expRoom);
	console.log(room);
	if(expRoom.name === room.name &&
		expRoom.floor === room.floor)
		console.log("found room! URRAAAAA!!!");
	const oldLocation = await db.readHomeLocation(home.name);
	await db.updateHomeLocation(home.name, homeLocation);
	const newLocation = await db.readHomeLocation(home.name); 
	console.log(oldLocation);
	console.log(newLocation);
	await db.updateHomeName(home.name, "casa dei fattoni");
	await db.updateRoomFloor( "casa dei fattoni", "room", 7);
	await db.updateRoomName("casa dei fattoni", "room", "room7");
	console.log(await db.readHomeRooms("casa dei fattoni"));	
	await db.updateRoomInfo("casa dei fattoni", "room7","gianfryRoom", 11);
	
	await db.addDevice("casa dei fattoni", "gianfryRoom", device);
	await db.addDevice("casa dei fattoni", "gianfryRoom", device1);
	await db.addDevice("casa dei fattoni", "gianfryRoom", device2);
	await db.addDevice("casa dei fattoni", "room2", device3);
	await db.addDevice("casa dei fattoni", "room2", device4);
	console.log(await db.readHomeInfo("casa dei fattoni"));
	console.log(await db.readHomeRooms("casa dei fattoni"));
	console.log(await db.readHomeDevice("casa dei fattoni"));	
	console.log("gianfryRoomDevice list");
	console.log(await db.readRoomDevice("casa dei fattoni", "gianfryRoom"));	
	await db.updateDeviceRoom("casa dei fattoni", "room2", device.name);
	console.log(await db.readRoomDevice("casa dei fattoni","gianfryRoom"));	
	console.log(await db.readRoomDevice("casa dei fattoni","room2"));	
	console.log(await db.insertAllarm(allarm));	
	console.log(await db.readRoomAllarm("room2"));
}
*/


async function logoutTest(db, userID, sessionID)
{
	await db.logoutUser(userID, sessionID);
	console.log("User info : ", await db.readUserInfo(userID));	
//	console.log("Session info : ", await db.readSessionInfo(userID, sessionID));
//	console.log("Session time : ", await db.readSessionTime(userID, sessionID));
	console.log("Session set : ", await db.readSessionSet(userID));

	const userID1 = await db.authUser(user);
	console.log("userID : ", userID1);
	if(userID1)
	{
	//	console.log("User info : ", await db.readUserInfo(userID1));	
		const sessionID1 = await db.loginUser(userID1, uuidv4());
		console.log("sessionID1 : ", sessionID1);
		console.log("Last login : ", await db.readLastLogin(userID1));	

		//	console.log("User info after login : ", userInfo);	
	//	console.log("Session info : ", await db.readSessionInfo(userID1, sessionID1));
		console.log("Login Time : ", await db.readLoginTime(userID1, sessionID1));		
		console.log("Logout Time : ", await db.readLogoutTime(userID1, sessionID1));			
		setTimeout(() => logoutTest(db, userID1, sessionID1), 10000);	
	}
}

async function userDataBaseTest()
{
	await db.drop();
	console.log("User subscrition esit : ", await db.subscribeUser(user));
	console.log("User subscrition esit : ", await db.subscribeUser(user1));
	const userID = await db.authUser(user);
	console.log("userID : ", userID);
	if(userID)
	{
		console.log("User info : ", await db.readUserInfo(userID));	
		const sessionID = await db.loginUser(userID, uuidv4());
	//	console.log("sessionID : ", sessionID);
	//	const userInfo = await db.readUserInfo(userID);
	//	console.log("User info after login : ", userInfo);	
	//	console.log("Session info : ", await db.readSessionInfo(userID, sessionID));	
		setTimeout(() => logoutTest(db, userID, sessionID), 10000);	
	}
}


async function fillHomeDB(db)
{
	db.drop();
	let homeSet = []
	let homeNum = 1
	let roomNum = 3
	let deviceNum = homeNum * roomNum;
	for(let i = 0; i < homeNum; i++)
		homeSet.push({
			
			"name": "gianfryHome" + i,
			"location": {
			  "district": "Siracusa",
			  "city": "Buccheri",
			  "street": "Ramoddetta",
			  "streetNumber": 3
			},
			"roomSet": [],
			"deviceSet" : []
		})
	for(let i = 0; i < homeNum; i++)
		for(let j = 0; j < roomNum; j++)
			homeSet[i].roomSet.push(
			{
				"name" : "room" + j,
				"floor" : 1,
			})	
			
	for(let i = 0, dev = 0; i < homeNum; i++)
		for(let j = 0; j < roomNum; j++, dev ++)
				homeSet[i].deviceSet.push(
				{
					"room" : "room" + j,
					"name" : "device" + dev
				})	

	for(let i = 0; i < homeNum; i++)
			await db.addHome(homeSet[i]);
	let measureName = ["temperature", "humidity", "luminosity"]

	for(let i = 0; i < homeNum; i++)
		for(let j = 0; j < roomNum; j++)	
		{					
			for(let m = 0; m < 3; m++)		
				for(let w = 0; w < 12; w++)		
					for(let k = 1; k <= 31; k++)		
					{	
						for(let a = 0; a < 7; a++)
						{
							await db.addMeasure(
							{
								"homeName" : "gianfryHome" + i, 
								"measure" : measureName[m],
								"value" : Math.floor(4 + Math.random() * 10 * (w % 3)),
								"device" : "device" + Math.floor(Math.random() * deviceNum),	
								"time" : new Date(2022, w, k, Math.floor(Math.random() * 23),Math.floor(Math.random() * 59)),							
							});
						}
					}
		}
}

async function homeDBTest()
{
	const forMount = 
	{
		homeName : "gianfryHome0", 
		measure : "temperature", 
		period : 
		{ 
			month : 5,
			year : 2022
		}
	}
	const forYear = 
	{
		homeName : "gianfryHome0", 
		measure : "temperature", 
		period : 
		{ 
			year : 2022
		}
	}
	const daily = 
	{
		homeName : "gianfryHome0", 
		measure : "temperature", 
	}
	const db = await HomeDBManager.instance("mongodb://localhost:27017");
//	await fillHomeDB(db);
/*	const tempSet = await db.readDailyHighlightHomeStatForMonth(forMount)
	const roomTempSet = await db.readDailyHighlightsForRoomStat(daily)
	console.log(tempSet.dailyMeasureSet);		
	console.log(roomTempSet.roomDailyMeasureSet);					*/
	const availableMeasureYear = await db.readAvailableYearForMeasure(daily)
	console.log(availableMeasureYear);
	console.log(availableMeasureYear[0].monthAvailable);
	console.log(availableMeasureYear[1].monthAvailable);
}


homeDBTest();

/*

const homeList = 
		[
			{"name" : "HomeOne"}, 
			{"name" : "HomeTwo"}, 
			{"name" : "HomeThree"}, 
			{"name" : "HomeFour"}
		];
		const homeInfo = 
		{
			"name" : "home1",
			"location" : 
			{
				"street" : "Via dei Posti belli", 
				"city" : "Buccheri",
				"district" : "Siracusa"
			},
			"allarmRoomList" :
			[
				{"name" : "bathroom", "allarm" : "PIR", "time" : "22/08/2022"},
				{"name" : "bathroom", "allarm" : "PIR", "time" : "22/08/2022"},
				{"name" : "bathroom", "allarm" : "PIR", "time" : "22/08/2022"},
				{"name" : "bathroom", "allarm" : "PIR", "time" : "22/08/2022"},
			],
			"deviceInfo" :
			{
				"online" : 3,
				"associated" : 3,
				"warnings" : 
				[
					{
						"name" : "device unreachable",
						"deviceName" : "dev0",
						"time" : "22/08/2022"
					}, 
					{
						"name" : "sensor unavailable",
						"deviceName" : "dev1",
						"time" : "22/08/2022"
					}, 
					{
						"name" : "sensor unavailable",
						"deviceName" : "dev1",
						"time" : "22/08/2022"
					}, 
					{
						"name" : "sensor unavailable",
						"deviceName" : "dev1",
						"time" : "22/08/2022"
					}
				]	
			},
		};
		const homeStat =
		{
			"measureType" : "temperature",
			"min" : "35",
			"mid" : "40",
			"max" : "45"
		}
		const homeStat1 =
		{
			"measureType" : "humidity",
			"min" : "40",
			"mid" : "60",
			"max" : "85"
		}
		const homeStat2 =
		{
			"measureType" : "luminosity",
			"min" : "20000",
			"mid" : "40000",
			"max" : "100000"
		}
		const roomInfo =
		{
			"highlight" :
			{
				"mostVisited" : "Bedroom",
				"hottest" : "Bedroom",
				"mostHumid" : "Bedroom",
				"brighter" : "Bedroom"
			},
			"list" :
			[
				{"name" : "Kitchen", "floor" : "4"},
				{"name" : "Livingroom", "floor" : "4"},
				{"name" : "Livingroom", "floor" : "4"},
				{"name" : "Livingroom", "floor" : "4"},
				{"name" : "Livingroom", "floor" : "4"},
				{"name" : "Livingroom", "floor" : "4"},
				{"name" : "Livingroom", "floor" : "4"},
				{"name" : "Livingroom", "floor" : "4"}
			]
		}
		
		const roomMeasureList =
		[
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			},
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			},
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			},
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			},
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			}
		]
		const roomMeasureList1 =
		[
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			},
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			},
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			},
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			},
			{
				"name" : "bedroom",
				"min" : 32,
				"mid" : 36,
				"max" : 40
			}
		]
		const roomMeasureList2 =
		[
			{
				"name" : "bedroom",
				"min" : 32000,
				"mid" : 36000,
				"max" : 40000
			},
			{
				"name" : "bedroom",
				"min" : 32000,
				"mid" : 36000,
				"max" : 40000
			},
			{
				"name" : "bedroom",
				"min" : 32000,
				"mid" : 36000,
				"max" : 40000
			},
			{
				"name" : "bedroom",
				"min" : 32000,
				"mid" : 36000,
				"max" : 40000
			},
			{
				"name" : "bedroom",
				"min" : 32000,
				"mid" : 36000,
				"max" : 40000
			}
		]
		*/