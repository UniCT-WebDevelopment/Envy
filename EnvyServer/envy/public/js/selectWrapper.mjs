class SelectWrapper
{
	#client;
	#state;
	#select;
	#divSelect;
	#selectWrapper;
  	#divLabel;
	#label;
	#selectedOptionID;
	#swipeAnimationOption;
	#enabled;
	#selected;
	#counter;
	#empty;

	get empty(){return this.#empty;}
	get enabled(){ return this.#enabled }
	get selected(){ return this.#selected }
	set enabled(enabled) { this.#enabled = enabled }
	get selectedOptionID() 
	{
		return this.#selectedOptionID 
	}
	get selectedOptionValue()
	{ 
		return document.getElementById(this.#selectedOptionID).innerHTML 
	}
	get selectedOptionIndex()
	{
		return this.#select.selectedIndex 
	}
	set addOption(content)
	{
		let option = document.createElement("option");
			option.innerHTML = content;
		this.#select.appendChild(option);
		let optionDiv = document.createElement("div");
		optionDiv.setAttribute("id", 
			this.#select.id + 
			"-option-" +
			 this.#counter);	
		optionDiv.setAttribute("class", "select-option");		
		optionDiv.innerHTML = content  ;
		if(this.#divSelect.children[0] != null)
			this.#divSelect.children[0].appendChild(optionDiv);
		optionDiv.style.display = "none"
		this.#empty = false;
		this.#counter ++;
	}

	#handleDivOptionClick(e) 
	{
        for (let i = 0; i < this.#select.length; i ++) 
        {          
			if (this.#select.options[i].innerHTML == e.target.innerHTML) 
			{
				this.#select.selectedIndex = i;
				this.#selectedOptionID = e.target.id;
				this.#divLabel.innerHTML = e.target.innerHTML;
				this.#selected = true;
				this.#client.clientUpdate("selectChoiche", 
					{ "id" : this.#select.id , "optionValue" : e.target.innerHTML });
				break;
			}
        }
 	}

	openSelect()
	{
		this.#divLabel.classList.add("select-arrow-active");
		if(this.#divSelect.children[0].children.length >= 2)	
		{
			for(let i = 1, a = 1; i < this.#divSelect.children[0].children.length; i++, a = 1) 
			{
				if(this.#divSelect.children[0].children[i].id != this.#selectedOptionID)
				{
					this.#divSelect.children[0].children[i].style.display = "flex";
					const positionFrom = -100 * a
					const trasition = 
					[
						{ 
							transform: "translateY(" + positionFrom + "%)",
							opacity : 0
						},
						{ 
							transform: "translateY(0%)",
							opacity : 1
						}
					]
					this.#divSelect.children[0]
								.children[i]
								.animate(trasition, this.#swipeAnimationOption);
					a++;
				}
			}
		}
		this.#state = true;
	}

	closeSelect()
	{
		this.#divLabel.classList.remove("select-arrow-active");
		if(this.#divSelect.children[0] != null && this.#divSelect.children[0].children.length >= 2)	
		{
			for(let i = 1; i < this.#divSelect.children[0].children.length; i++) 
			{
					const positionFrom = -100 * i 
					const trasition = 
					[
						{ 
							transform: "translateY(0%)",
							opacity : 1
						},
						{ 
							transform: "translateY(" + positionFrom + "%)",
							opacity : 0
						}
					]
					this.#divSelect.children[0]
								.children[i]
								.animate(trasition, this.#swipeAnimationOption);
					setTimeout(() => { this.#divSelect.children[0].children[i].style.display = "none" }, 401);
				
			}
		}
		this.#state = false;
	}

	#handleSelectClick(e)
	{
		if(this.#enabled && !this.#empty)
		{
			this.#client.clientUpdate("selectClick", {"id" : this.#select.id});
			if(!this.#state)
			{
				if(e.target.id == this.#divLabel.id)
					this.openSelect();
			}
			else
			{
				if(e.target.id != this.#divLabel.id)
					this.#handleDivOptionClick(e);
				this.closeSelect();
			} 
			return;
		}
		this.closeSelect()	
	}

	#updateDivSelectOptionList(contentList)
	{		
		if(this.#divSelect.children[0] != null)
		{
			this.#divSelect.removeChild(this.#divSelect.children[0]);
		}
		let optionList = document.createElement("div");
		optionList.setAttribute("class", "select-list-option");
		this.#divLabel = document.createElement("div");
		this.#divLabel.setAttribute("id", 
									this.#select.id + 
									"-option-label");	
		this.#divLabel.classList.add("select-option");
		this.#divLabel.classList.add("select-label");				
		this.#divLabel.innerHTML =  this.#label;
		optionList.appendChild(this.#divLabel);
		this.#counter = 1;
		for(let content of contentList)
		{
			let optionDiv = document.createElement("div");
			optionDiv.setAttribute("id", 
								   this.#select.id + 
								   		"-option-" + 
										this.#counter);	
			optionDiv.setAttribute("class", "select-option");		
			optionDiv.innerHTML =  content;
			optionDiv.style.display = "none";
			optionList.appendChild(optionDiv);
			this.#counter ++;
		}
		this.#divSelect.appendChild(optionList);
	}

	updateSelectOptionList(contentList)
	{
		this.#empty = false;
		this.#select.innerHTML = "";
		let label = document.createElement("option");
		label.innerHTML = this.#label;
		this.#select.appendChild(label);
		for(let item of contentList)		
		{
			let option = document.createElement("option");
			option.innerHTML = item;
			this.#select.appendChild(option);
		}
		this.#updateDivSelectOptionList(contentList);
	}

	#buildDivSelect(label)
	{
		this.#divSelect = document.createElement("div");
		this.#divSelect.setAttribute("class", " select");
		this.#label = label;
		this.#selectWrapper.appendChild(this.#divSelect);
		let optionList = document.createElement("div");
		optionList.setAttribute("class", "select-list-option");
		this.#divLabel = document.createElement("div");
		this.#divLabel.setAttribute("id", 
									this.#select.id + 
									"-option-label");	
		this.#divLabel.classList.add("select-option");
		this.#divLabel.classList.add("select-label");				
		this.#divLabel.innerHTML =  this.#label;			
		optionList.appendChild(this.#divLabel);
		this.#divSelect.appendChild(optionList)
		this.#divSelect.addEventListener("click", (e) => this.#handleSelectClick(e) )
		this.#counter = 1;
	}

	constructor(client, selectID, wrapperID, label, enabled)
	{
		this.#enabled = enabled;
		this.#swipeAnimationOption = 
		{
			duration: 400,
			iteration: 1,
			fill: 'both',
			easing: "cubic-bezier(0.190, 1.000, 0.220, 1.000)"
		} 
		this.#selected = false;
		this.#empty = true;
		this.#client = client;
    	this.#state = false;
    	this.#select = document.getElementById(selectID),
    	this.#selectWrapper = document.getElementById(wrapperID);
		this.#selectedOptionID = "";
		document.addEventListener("click", (e) => 
		{
			e.stopPropagation();
			if(!e.target.classList.contains("select") &&
			   !e.target.classList.contains("select-label") &&
			   !e.target.classList.contains("select-option"))
					this.closeSelect()
		})
    	this.#buildDivSelect(label);
		this.closeSelect();
  	}

	removeOption(optionIndex)
	{
		if(!this.#divSelect.children[0]) return;
		if(this.#divSelect.children[0].children.length > 1)
		{
			for(let i = 1; i < this.#divSelect.children[0].children.length; i++)
				if(this.#divSelect.children[0].children[i].innerHTML == this.#select.options[optionIndex].innerHTML)
				{
					this.#divSelect.children[0].removeChild(this.#divSelect.children[0].children[i]);
					break;
				}
			this.#select.options[optionIndex].remove(); 
			this.#divLabel.innerHTML = this.#select.options[ 1 % this.#select.options.length].innerHTML;
			this.#select.selectedIndex = 1 % this.#select.options.length;	
			if(1 % this.#select.options.length)
			{
				this.#selected = true;
				for(let i = 1; i < this.#divSelect.children[0].children.length; i++)
					if(this.#divSelect.children[0].children[i].innerHTML == this.#divLabel.innerHTML)
					{
						this.#selectedOptionID = this.#divSelect.children[0].children[i].id;
						break;
					}
			}else
			{
				this.#selected = false;
				this.#divLabel.innerHTML = this.#label;		
				this.#empty = true;
				this.#selectedOptionID = null;
				this.#select.selectedIndex = 0;
			} 
		}
		else
	 	{
			this.#selected = false;
			this.#divLabel.innerHTML = this.#label;		
			this.#empty = true;
			this.#selectedOptionID = null;
			this.#select.selectedIndex = 0;
		} 
	}

  	reset()
  	{
		this.#selected = false;
		if(this.#divLabel != null)
			this.#divLabel.innerHTML = this.#label;
		this.#selectedOptionID = null;
		this.#select.selectedIndex = 0;
		if(this.#divSelect.children[0] != null)
		{ 		
			for(let i = 1; i < this.#divSelect.children[0].children.length; i++)
				this.#divSelect.children[0].children[i].display = "flex";
		}
		this.closeSelect();
  	}
}

export { SelectWrapper }
 
