class SysLogger
{	
	static logEvent(subject, event, argLabel, argPayload)
	{
		console.log(
					"[Subject  ][" + subject +"]\n" +
				    "[Event    ][" + event + "]\n" +
				    "[Arg 	  ][" + argLabel + "]\n" +
					"[Value    ][" + argPayload + "]\n" +
					"[TimeStamp][" + Date() + "]\n");  
	}
};

export {SysLogger};