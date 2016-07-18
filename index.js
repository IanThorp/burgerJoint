var grills = [];
var orders = [];
var cookTime = 30000;
var orderInterval = 1000;
var numGrills = 5;

var $ui, $orderedList, $veggieQueue, $beefQueue, $grillSpaces, $servedList, burgerTemplate, grillTemplate;

function cacheDom() {
	$ui = $('main');
	$orderedList = $ui.find("#ordered-list");
	$veggieQueue = $ui.find("#veggie-queue");
	$beefQueue = $ui.find("#beef-queue");
	$grillSpaces = $ui.find("#grill-spaces");
	$servedList = $ui.find("#served-list");
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
	if(queue instanceof Array){
		queue.forEach(function(oneQueue){
			checkQueueLength(oneQueue);
		})
	} else {
		var queueItems = queue.find('li')
		if(queueItems.length >= 3){
			var targetIndex = null;
			for(let i = 0, l = grills.length; i < l; i++){
				if(grills[i].vacant === true){
					targetIndex = i;
					grills[i].vacant = false
					break;
				}
			}
			var burgers = []		
			queueItems.each(function(index){
				var burger = findJsAndJqueryBurger($(this))
				burgers.push(burger.jsObj);
			})
			if(typeof targetIndex === "number"){
				var targetGrill = grills[targetIndex];
				targetGrill.cook(burgers)
				var grillNum = targetGrill.grillNum
				var targetHtmlGrill = $("#grill-" + grillNum)
				$(queueItems).detach().appendTo(targetHtmlGrill)
			} else {
				console.log('ERROR')
			}
		}
	}
}

$(function(){
	console.log("Success");
	cacheDom();
	generateGrills(numGrills);
	createDroppable();
	continuouslyGenerateOrders(orderInterval, 0);
})


// Bob's running a burger place. It's actually super busy, so orders come in
// many times a minute, and they get put into the "Ordered" pile. He's got five
// grill spaces. Bob likes efficient use of space, and keeping vegetarians
// happy, so he only cooks beef burgers together on one grill space, and veggie
// burgers only together on a different grill space. And he only starts cooking
// once there's at least 3 patties ready to cook together on a grill space. Once
// they start cooking, they're done in 10 seconds, and are served, and the grill
// space is cleaned and freed up for the next batch, of either type.

// The challenge is to build a UI for the staff to get trained on managing the
// cooking process. The system generates random orders every few seconds, piling
// them into "Ordered" pile. The user can drag orders from ordered to a numbered
// grill space at any time, and the system notices when there's enough (three)
// to start cooking them, and times 30 seconds once there's three of the same
// type in there, and puts them into the served section when done, as a group
// together. Bonus points if the staff user can annotate each order and group
// with text notes, such as "well done, no cheese".

