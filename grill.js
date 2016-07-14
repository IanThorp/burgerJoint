class Grill{
	constructor(grillNum) {
		this.grillNum = grillNum;
		this.cooking = [];
		this.veggieQueue = [];
		this.beefQueue = [];
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

	cook(burgersArr){
		this.cooking = burgersArr
		var promise = new Promise(function(resolve, reject){
			this.cooking.forEach(function(burger) {
				burger.cook(10000)
			})
		})
		promise.then(function(cookedBurgers){
			this.cooking = [];
			return cookedBurgers;
		})
	}

	render($location, template){
		console.log(this)
		$location.append(template(this))
	}
}