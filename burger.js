class Burger {
	constructor(type, orderNum) {
		this.type = type;
		this.notes = "";
		this.orderNum = orderNum;
		this.status = 'ordered';
	}

	cook(cookTime) {
		this.status = 'cooking';
		setTimeout(function(){console.log("finished cooking one!!")}, cookTime)
	}

	serve() {
		this.status = 'served';
		return this;
	}
}