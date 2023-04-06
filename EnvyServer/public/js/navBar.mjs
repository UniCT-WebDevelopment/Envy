class NavBar
{
	#menuOpen;
	#mainHeaderContainer;
	#menuButtonContainer;
	#client;
	#swipeMenuAnimationDuration;
	#menuButtonContainerResizeObs;
	#swipeMenuTransitionIn;
	#swipeMenuTransitionOut;
	#swipeMainHeaderTransitionIn;
	#swipeMainHeaderTransitionOut;
	#menuButtonContTransSet;
	#mainHeaderContTransSet;
	#instance;
	#menuSwipeHandler;
	#mode;
	#swipeOutMenuTiming;
	#verticalTransLast;
	
	#navResponsiveVerticalClosure(verticalTransform)
	{
		console.log("vertical closure", this.#menuOpen, this.#mode);
		if(this.#menuOpen && this.#mode == "orizontal")
		{
			console.log("resizing from orizontal");
			this.#verticalTransLast = verticalTransform[1];
			this.#menuButtonContainer.style.display = "none"
			this.#instance.animate([{height: "240px" }],
				this.#swipeOutMenuTiming);		
			this.#mainHeaderContainer.animate(this.#swipeMainHeaderTransitionOut,
				this.#swipeOutMenuTiming);			
			setTimeout(() => 
			{
				this.#menuButtonContainer.style.display = "flex";
				this.#menuButtonContainer.animate(this.#swipeMenuTransitionOut,
					this.#swipeOutMenuTiming);
			}, 401)		
		}
		this.#swipeMenuTransitionIn = this.#menuButtonContTransSet[2];
		this.#swipeMenuTransitionOut = this.#menuButtonContTransSet[3];
		this.#instance.style.justifyContent = "space-evenly";
		this.#instance.style.flexFlow = "wrap"
		document.getElementById("menu-button-container").style.flexFlow = "wrap";
		for(let sub of document.getElementsByClassName("menu-button-sub-container"))
			sub.style.flexFlow = "wrap";
		this.#menuSwipeHandler = this.#handleVerticalMenuInOut;
	}
	
	#navResponsiveOrizontalClosure(verticalTransform)
	{
		if(this.#menuOpen && (this.#mode == "vertical" || this.#mode == "wide-vertical"))
		{
			this.#verticalTransLast = verticalTransform[1];
			this.#menuButtonContainer.style.display = "none";
			this.#instance.animate(verticalTransform,
				this.#swipeOutMenuTiming);
			this.#mainHeaderContainer.animate(this.#swipeMainHeaderTransitionIn,
				this.#swipeOutMenuTiming);
			setTimeout(() => 
			{
				this.#menuButtonContainer.style.display = "flex";
				this.#menuButtonContainer.animate(this.#swipeMenuTransitionOut,
					this.#swipeOutMenuTiming);
			}, 401)
		}
		this.#swipeMenuTransitionIn = this.#menuButtonContTransSet[1];
		this.#swipeMenuTransitionOut = this.#menuButtonContTransSet[0];
		this.#instance.style.justifyContent = "space-between"
		this.#mainHeaderContainer.style.width = "100%"
		this.#instance.style.flexFlow = "nowrap";
		document.getElementById("menu-button-container").style.flexFlow = "nowrap";
		for(let sub of document.getElementsByClassName("menu-button-sub-container"))
			sub.style.flexFlow = "nowrap";
		this.#menuSwipeHandler = this.#handleOrizontalMenuInOut;
		this.#mode = "orizontal"
	}

	#navResponsiveWideVerticalClosure()
	{
		if(this.#menuOpen && this.#mode == "vertical")
		{
			this.#instance.animate([{height: "240px"},{height: "160px"}],
				this.#swipeOutMenuTiming);
			this.#verticalTransLast = {height: "160px"};
		}
		if(this.#menuOpen && this.#mode == "orizontal")
		{
			this.#mainHeaderContainer.animate(this.#swipeMainHeaderTransitionOut,
				this.#swipeOutMenuTiming);			
			this.#instance.animate([{height: "80px"},{height: "160px"}],
				this.#swipeOutMenuTiming);
			this.#verticalTransLast = {height: "80px"};
		}
		this.#swipeMenuTransitionIn = this.#menuButtonContTransSet[2];
		this.#swipeMenuTransitionOut = this.#menuButtonContTransSet[3];
		this.#instance.style.justifyContent = "space-evenly"
		this.#instance.style.flexFlow = "wrap";
		document.getElementById("menu-button-container").style.flexFlow = "wrap";
		for(let sub of document.getElementsByClassName("menu-button-sub-container"))
			sub.style.flexFlow = "wrap";
		this.#menuSwipeHandler = this.#handleWideVerticalMenuInOut;
		this.#mode = "wide-vertical"
	}

	#detectMenuButtonContainerWrap()
	{
		this.#menuButtonContainerResizeObs = 
		new ResizeObserver(entries => 
		{
			for (let entry of entries) 
			{
				if(entry.contentRect.width > 1350)
				{
					this.#navResponsiveOrizontalClosure([this.#verticalTransLast,{height : "80px"}])
					this.#mode = "orizontal"
				}
				if(entry.contentRect.width >= 880 && 
					entry.contentRect.width <= 1350)
				{
						this.#navResponsiveWideVerticalClosure([{height : "80px"},
							this.#verticalTransLast])
					this.#mode = "wide-vertical"
				}
				if(entry.contentRect.width < 880) 
				{
					this.#navResponsiveVerticalClosure([{height : "80px"},{height: "240px"}])
					this.#mode = "vertical"
				}
			}
		});
		this.#menuButtonContainerResizeObs.observe(this.#instance);
	}
	
	#handleOrizontalMenuInOut(handler)
	{
		if(!this.#menuOpen)
		{
			this.#menuOpen = !this.#menuOpen;
			this.#mainHeaderContainer.animate(this.#swipeMainHeaderTransitionIn,
				this.#swipeOutMenuTiming);
			setTimeout(()=> 
			{
				this.#menuButtonContainer.style.display = "flex";
				this.#menuButtonContainer.animate(this.#swipeMenuTransitionOut,
					this.#swipeOutMenuTiming);
					handler();
			}, 401);
		}
		else
		{	
			this.#menuOpen = !this.#menuOpen;
			this.#menuButtonContainer.animate(this.#swipeMenuTransitionIn,
				this.#swipeOutMenuTiming);			
			setTimeout(()=> 
			{
				this.#menuButtonContainer.style.display = "none";
				this.#mainHeaderContainer.animate(this.#swipeMainHeaderTransitionOut,
					this.#swipeOutMenuTiming);
					handler();
			}, 401);
		}
		
	}

	#handleWideVerticalMenuInOut(handler)
	{
		if(!this.#menuOpen)
		{
			this.#menuOpen = !this.#menuOpen;
			this.#instance.animate([{height : "80px"},{height : "160px"}],
				this.#swipeOutMenuTiming);
			setTimeout(()=> 
			{
				this.#menuButtonContainer.style.display = "flex";
				this.#menuButtonContainer.animate(this.#swipeMenuTransitionOut,
					this.#swipeOutMenuTiming);
					handler();
			}, 401);
		}
		else
		{	
			this.#menuOpen = !this.#menuOpen;
			this.#instance.animate([{height : "160px"},{height : "80px"}],
				this.#swipeOutMenuTiming);
			this.#menuButtonContainer.animate(this.#swipeMenuTransitionIn,
				this.#swipeOutMenuTiming);
			this.#menuButtonContainer.style.display = "none";
			handler();
		}
	}

	#handleVerticalMenuInOut(handler)
	{
		if(!this.#menuOpen)
		{
			this.#menuOpen = !this.#menuOpen;
			this.#instance.animate([{height : "80px"},{height : "240px"}],
				this.#swipeOutMenuTiming);
				console.log("open 240px")
			setTimeout(()=> 
			{
				this.#menuButtonContainer.style.display = "flex";
				this.#menuButtonContainer.animate(this.#swipeMenuTransitionOut,
					this.#swipeOutMenuTiming);
					handler();
			}, 401);
		}
		else
		{	
			console.log("closed 240px")

			this.#menuOpen = !this.#menuOpen;
			this.#instance.animate([{height : "240px"},{height : "80px"}],
				this.#swipeOutMenuTiming);
			this.#menuButtonContainer.animate(this.#swipeMenuTransitionIn,
				this.#swipeOutMenuTiming);
			this.#menuButtonContainer.style.display = "none";
			handler();
		}
	}

	#handleNavButtonClick(e)
	{ 
		this.#menuButtonContainer.removeEventListener("click", 
			this.#mHandler);
		e.stopPropagation();
		switch(e.target.id)
		{
			case "add-home-button" :
				this.#client.update("addHome"); 
				break;
			case "manage-home-button" :
				this.#client.update("manageHome"); 
				break;
			case "search-home-button" :
				this.#client.update("searchHome"); 
				break;
			case "profile-home-button" :
				this.#client.update("profile");
				break;
			default :
				this.enable();
		}		
	}

	#handleHeaderButtonClick(e)
	{
		e.stopPropagation();
		this.#mainHeaderContainer.removeEventListener("click",
			this.#hHandler);
		switch(e.target.id)
		{
			case "main-button" :
				this.#menuSwipeHandler(this.enable);
				break;
			case "home-button" :
				this.#client.update("home"); 
				break;
			case "logout-button" :
				this.#client.update("logout");
				break;
			default :
				this.enable();
		}
	}

	#mHandler = (e) => this.#handleNavButtonClick(e)
	#hHandler = (e) => this.#handleHeaderButtonClick(e)

	constructor(client, swipeMenuAnimationDuration)
	{
		this.#menuOpen = false;
		this.#client = client;
		this.#swipeMenuAnimationDuration = swipeMenuAnimationDuration;
		this.#instance = document.getElementById("envy-header");
		this.#mainHeaderContainer = document.getElementById("main-header-container");
		this.#menuButtonContainer = document.getElementById("menu-button-container");
		this.#menuButtonContainer.addEventListener("click", this.#mHandler);
		this.#mainHeaderContainer.addEventListener("click", this.#hHandler);
		this.#menuButtonContTransSet = 
		[
			[
				{ transform: 'translateX(-100%)'},
				{ transform: 'translateX(0%)'}
			],
			[
				{ transform: 'translateX(0%)'},
				{ transform: 'translateX(-100%)'}
			],
			[ 
				{ transform: 'translateY(0%)'},
				{ transform: 'translateY(-100%)'}
			],
			[
				{ transform: 'translateY(-100%)'},
				{ transform: 'translateY(0%)'}
			]
		]
		this.#mainHeaderContTransSet = 
		[
			[{ width: "100%"}, { width : "480px" }],
			[{ width: "480px"}, { width : "100%" }]
		]
		this.#swipeMenuTransitionIn = this.#menuButtonContTransSet [1];
		this.#swipeMenuTransitionOut = this.#menuButtonContTransSet [0];
		this.#swipeMainHeaderTransitionIn = this.#mainHeaderContTransSet[0];
		this.#swipeMainHeaderTransitionOut = this.#mainHeaderContTransSet[1];
		this.#mode = "orizontal"
		this.#swipeOutMenuTiming =
		{
			duration: this.#swipeMenuAnimationDuration,
			iteration: 1,
			fill: 'both',
			easing: "cubic-bezier(0.190, 1.000, 0.220, 1.000)"
		} 
		this.#detectMenuButtonContainerWrap();
	}

	enable = () =>
	{
		this.#menuButtonContainer.addEventListener("click", this.#mHandler);
		this.#mainHeaderContainer.addEventListener("click", this.#hHandler);
	}
}

export { NavBar };