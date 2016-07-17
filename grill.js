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
		console.log(burgersArr)
		burgersArr.forEach(function(burger, index) {
			console.log(burger);
			burger.promise = new Promise(function(resolve){
				burger.cook(10000);
			})
			burger.promise.then(function(cookedBurgers){
				console.log("promisedFinished")
			})
		})
	}

	render($location, template){
		console.log(this)
		$location.append(template(this))
	}
}