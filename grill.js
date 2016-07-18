

class Grill{
	constructor(grillNum) {
		this.grillNum = grillNum;
		this.cooking = [];
		this.veggieQueue = [];
		this.beefQueue = [];
		this.vacant = true;
	}

	checkQueue(){
		if(this.veggieQueue >= 3){
			cook(this.veggieQueue)
			this.veggieQueue = [];
		} else if(this.beefQueue >= 3){
			cook(this.beefQueue)
			this.beefQueue = [];
		}
	}	

	cook(burgersArr, time){
		this.cooking = burgersArr;
		this.vacant = false;
		var that = this;
		burgersArr.forEach(function(burger, index) {
			burger.promise = new Promise(function(resolve, reject){
				burger.cook(cookTime, resolve);
			})
			burger.promise
			.then(function(cookedBurger){
				that.vacant = true;
				that.cooking = [];
			})
		})
	}

	render($location, template){
		$location.append(template(this))
	}
}