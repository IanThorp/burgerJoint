class Burger {
	constructor(type, orderNum) {
		this.type = type;
		this.notes = "";
		this.orderNum = orderNum;
		this.status = 'ordered';
	}

	cook(cookTime, cb) {
		this.status = 'cooking';
		var that = this
		setTimeout(function(){cb(that.serve())}, cookTime)
	}

	serve() {
		changeBurgerStatus(this, "served");
		relocateHtmlBurger(this, "#served-list");
		return this;
	}
}