

class Grill{
	constructor(grillNum) {
		this.grillNum = grillNum;
		this.cooking = [];
		this.vacant = true;
	}

	cook(burgersArr, time){
		this.cooking = burgersArr;
		this.vacant = false;
		var allPromises = []
		var that = this;
		burgersArr.forEach(function(burger, index) {
			burger.promise = new Promise(function(resolve, reject){
				burger.cook(cookTime, resolve);
			})
			allPromises.push(burger.promise);
		})
		Promise.all(allPromises)
		.then(function(){
			that.vacant = true;
			that.cooking = [];
			checkQueueLength($beefQueue)
			checkQueueLength($veggieQueue)
			// checkBothQueues();
		})
	}

	render($location, template){
		$location.append(template(this))
	}
}