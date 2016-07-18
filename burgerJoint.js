
var mainJs = (function($){
	var grills = [];
	var orders = [];
	var cookTime = 10000;
	var orderInterval = 3000;
	var numGrills = 5;

	var $ui, $orderedList, $veggieQueue, $beefQueue, $grillSpaces, $servedList, burgerTemplate, grillTemplate;

	function cacheDom() {
		$ui = $('main');
		$orderedList = $ui.find("#ordered-list");
		$veggieQueue = $ui.find("#veggie-queue");
		$beefQueue = $ui.find("#beef-queue");
		$grillSpaces = $ui.find("#grill-spaces");
		burgerTemplate = Handlebars.compile($ui.find("#burger-template").html());
		grillTemplate = Handlebars.compile($ui.find("#grill-template").html());
	}

	function generateGrills(number){
		for(var i = 1; i <= number; i++){
			var grill = new Grill(i);
			grill.render($grillSpaces, grillTemplate)
			grills.push(grill);
		}
	}

	function generateOrder(orderNum) {
		var selectedType = chooseBurgerType();
		return new Burger(selectedType, orderNum);
	}

	function continuouslyGenerateOrders(interval, orderNum) {
		var currentBurger = generateOrder(orderNum);
		orders.push(currentBurger)
		renderBurger(currentBurger);
		orderNum++;
		setTimeout(function(){continuouslyGenerateOrders(interval, orderNum)}, interval);
	}

	function chooseBurgerType() {
		var burgerTypes = ["Vegetarian", "Beef"];
		var rand = Math.floor(Math.random() * burgerTypes.length);
		return burgerTypes[rand];
	}

	function renderBurger(burger){
		var burgerHtml = burgerTemplate(burger);
		$orderedList.append(burgerHtml)
		var currentItem = $orderedList.children().last()
		doubleClickListener(currentItem)
		createDraggables(currentItem)
	}

	function createDraggables(item) {
		item.draggable({
			revert: "invalid",
			scope: "items",
			helper: "clone"
		})
	}

	function createDroppable() {
		$("#cooking-module").droppable({
			scope: "items",
			drop: function(event, ui){
				var $draggedBurger = $(ui.draggable)
				var targetQueue = chooseQueue($draggedBurger)
				changeBurgerStatus($draggedBurger, "queued")
				relocateHtmlBurger($draggedBurger, targetQueue)
				$draggedBurger.draggable({disabled: "true"});
				checkQueueLength(targetQueue);
			}
		})
	}

	function findJsAndJqueryBurger(burger){
		var jsBurger, jQueryBurger; 
		if(burger instanceof jQuery){
			var htmlId = burger.attr("id");
			var orderIndex = parseInt(htmlId.replace("order-", ""));
			jsBurger = orders[orderIndex];
			jQueryBurger = burger;
		} else {
			var index = burger.orderNum;
			var htmlId = "#order-" + burger.orderNum;
			jsBurger = burger;
			jQueryBurger = $(htmlId);
		}
		return {
			$obj: jQueryBurger,
			jsObj: jsBurger
		}
	}

	function changeBurgerStatus(burger, status){ 
		var target = findJsAndJqueryBurger(burger);
		target.jsObj.status = status;
		target['$obj'].find(".status-text").text(status);
	}

	function relocateHtmlBurger(burger, location){
		var target = findJsAndJqueryBurger(burger)
		target['$obj'].detach().appendTo(location)
	}

	function chooseQueue(burger) {
		var target = findJsAndJqueryBurger(burger)
		var htmlClass = target['$obj'].attr("class");
		if(htmlClass.includes("Beef")){
			return $beefQueue;
		} else {
			return $veggieQueue; 
		}
	}

	function doubleClickListener(target){
		target.on('dblclick', function(){
			$( this ).children().each(function(){
				$( this ).toggleClass( "hidden" );
			})
		})
	}

	function checkQueueLength(queue){
		var queueItems;
		if(queue === "beef"){
			queueItems = $beefQueue.find('li');
		} else if(queue === "veggie"){
			queueItems = $veggieQueue.find('li');
		} else {
			queueItems = queue.find('li');
		}
		if(queueItems.length >= 3){
			var targetGrill = findVacantGrill();
			var burgers = findAllBurgerObjects(queueItems);		
			if(targetGrill){
				populateGrill(targetGrill, burgers, queueItems)
			} else {
				console.log('No grill available')
			}
		}
	}

	function findVacantGrill(){
		for(let i = 0, l = grills.length; i < l; i++){
			if(grills[i].vacant === true){
				return grills[i];
			}
		}
	}

	function findAllBurgerObjects(listItemArr){
		burgers = [];
		listItemArr.each(function(index){
			var burger = findJsAndJqueryBurger($(this))
			burgers.push(burger.jsObj);
		})
		return burgers;
	}

	function populateGrill(grill, burgers, burgersList){
		grill.cook(burgers)
		var grillNum = grill.grillNum
		var targetHtmlGrill = $("#grill-" + grillNum)
		$(burgersList).detach().appendTo(targetHtmlGrill)
	}

	$(function(){
		cacheDom();
		generateGrills(numGrills);
		createDroppable();
		continuouslyGenerateOrders(orderInterval, 0);
	})

	return {
		cookTime: cookTime,
		changeBurgerStatus: changeBurgerStatus,
		relocateHtmlBurger: relocateHtmlBurger,
		orders: orders,
		grills: grills,
		checkQueueLength: checkQueueLength
	}
})(jQuery);

