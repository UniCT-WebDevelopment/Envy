/*import { UserDBManager } from "./userDBManager.mjs"*/
import { HomeDBManager } from "./homeDBManager.mjs"
import { uuid } from 'uuidv4';

const user =
{
	"name" : "userTest",
	"email" : "userTest@domain.it",
	"password" : "dslopòjakdslaopòkdaopls"
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
	"rooms" :
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

async function userDataBaseTest()
{
/*	const db = await UserDBManager.instance("mongodb://localhost:27017");
	await db.drop();
	await db.subscribeUser(user).then( 
		(registered) => registered ? 
			db.readUserInfo(user.name).then((userInfo) => console.log(userInfo))
				: console.log("User already exist"));
	await db.authUser(user).then( 
			(authenticated) => authenticated ? 
				db.loginUser(user.name, uuid()).then( 
					(login) => login ? db.readUserInfo(user.name).then(
							(userInfo) => console.log(userInfo))
						: console.log("User already logged"))
				: console.log("Wrong username or password"));
	await db.logoutUser(user.name).then( 
			(logout) => logout ? console.log("User logout")
					: console.log("User not exist or not be logged"));
	await db.readLastUserSessionInfo(user.name).then(
			(userSessionInfo) => console.log(userSessionInfo));*/
}

homeDataBaseTest();