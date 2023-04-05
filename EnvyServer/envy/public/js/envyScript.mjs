
class EnvyScript
{
	#envyUrl;
	#subMenuSet;
	#currSubMenuIndex;
	#swipeMenuDuration;

	get envyUrl() { return this.#envyUrl; }
	get subMenuSet() { return this.#subMenuSet; }
	set subMenuSet(subMenuSet) { this.#subMenuSet = subMenuSet; }

	swipeMenuFromTo(currMenuPos, nextMenuPos, nextMenuIndex, handler)
	{
		this.#subMenuSet[this.#currSubMenuIndex].swipeFromTo(currMenuPos.begin,
			currMenuPos.end, 1, 0).then(
		() =>
		{
			this.#subMenuSet[this.#currSubMenuIndex].hide();
			this.#subMenuSet[this.#currSubMenuIndex].reset();
			this.#currSubMenuIndex = nextMenuIndex;
			this.#subMenuSet[this.#currSubMenuIndex].display();
			this.#subMenuSet[this.#currSubMenuIndex].swipeFromTo(nextMenuPos.begin, 
				nextMenuPos.end, 0, 1).then(() => handler());
		});
	}

	swipeCaroselMenu(nextSubMenuIndex, handler)
	{
		if(this.#currSubMenuIndex == nextSubMenuIndex)
		{
			handler();
			return;
		}
		let currMenuTransform, nextMenuTransform;
		if(nextSubMenuIndex > this.#currSubMenuIndex)
			currMenuTransform = -100;
		else currMenuTransform = 100;
		nextMenuTransform = currMenuTransform * - 1;
		this.swipeMenuFromTo(
			{"begin" : 0, "end" : currMenuTransform }, 
			{ "begin" : nextMenuTransform, "end" : 0}, 
			nextSubMenuIndex,
			handler);
	}

	constructor(envyUrl, subMenuSet, swipeMenuDuration)
	{
		this.#subMenuSet = subMenuSet;
		for(let subMenu of subMenuSet)
			subMenu.client = this;
		this.#envyUrl = envyUrl;
		this.#swipeMenuDuration = swipeMenuDuration;
		this.#currSubMenuIndex = 0;
	}

	menuUpdate(event, payload) {}
}

export { EnvyScript };