import { EnvyServer } from "./module/system/envyServer.mjs";
import path  from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const deviceServerConfig = 
{
	'port' : 8000,
	'socketIOconfig' : 
	{
    	'connectTimeout' : 20000,
    	'pingTimeout' : 10000,
    	'pingInterval' : 5000,
    	'maxHttpBufferSize' : 1e6
	}
}

const serverPath = dirname(fileURLToPath(import.meta.url));
const publicResourceMainPath = path.join(serverPath, "/public");
const reservedPath = path.join(serverPath, "/node_modules");
const userServerConfig = 
{
	'port' : 8080,
	'sessionTime' : 60000,
	'resourcePath' : 
	{
		'htmlResourcePath' : path.join(publicResourceMainPath, "/html/"),
		'cssResourcePath' : path.join(publicResourceMainPath, "/css/"),
		'javascriptResourcePath' : path.join(publicResourceMainPath, "/js/"),
		'vectorImgResourcePath' : path.join(publicResourceMainPath, "/image/"),
		'iconResourcePath' : path.join(publicResourceMainPath, "/icon/"), 
		'socketIOResourcePath' : path.join(reservedPath, "/socket.io/dist"),
		'chartJSResourcePath' : path.join(reservedPath, "/chart.js/dist/")
	},
	'dbPath' : 
	{
		'userDataBase' : "mongodb://localhost:27017/envyUser",
		'homeDataBase' : "mongodb://localhost:27017/envyHome",
		'deviceDataBase' : "mongodb://localhost:27017/envyDevice"
	},
	'socketIOconfig' : 
	{
    	'connectTimeout' : 20000,
    	'pingTimeout' : 10000,
    	'pingInterval' : 5000,
    	'maxHttpBufferSize' : 1e6,
		'cors': 
		{
			origin: "https://127.0.0.1.com",
			methods: ["GET", "POST"]
		}
	}
}

function init()
{
	const server = new EnvyServer(userServerConfig, deviceServerConfig);
}

init();
