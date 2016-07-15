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

	cook(burgersArr){
		this.cooking = burgersArr;
		this.vacant = false;
		var promise = new Promise(function(resolve, reject){
			burgersArr.forEach(function(burger, index) {
				console.log(burgersArr[index])
				console.log(this)
				console.log(burger)
				burger.cook(10000)
			})
		})
		promise.then(function(cookedBurgers){
			this.cooking = [];
			this.vacant = true;
			console.log("promisedFinished")
			return cookedBurgers;
		})
	}

	render($location, template){
		console.log(this)
		$location.append(template(this))
	}
}