var ordered = [];
var cooking = [];
var served = []

var $ui, $orderedList, $cookingList, $servedList, burgerTemplate;

function cacheDom() {
	$ui = $('main');
	$orderedList = $ui.find("#ordered-list");
	$cookingList = $ui.find("#cooking-list");
	$servedList = $ui.find("#served-list");
	var templateScript = $ui.find("#burger-template").html();
	burgerTemplate = Handlebars.compile(templateScript);
}

function generateOrder(orderNum) {
	var selectedType = chooseBurgerType();
	// console.log(ordered)
	// console.log(cooking)
	// console.log(served)
	return {
		type: selectedType,
		notes: "",
		complete: false,
		orderNumber: orderNum
	}
}

function continuouslyGenerateOrders(interval, orderNum) {
	var currentBurger = generateOrder(orderNum);
	console.log(currentBurger)
	ordered.push(currentBurger);
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
}

function createSortables() {
	$("#cooking-list, #ordered-list").sortable({
		connectWith: ".connectedSortable"
	}).disableSelection();
}

function doubleClickListener(target){
	target.on('dblclick', function(){
		$( this ).children().each(function(){
			$( this ).toggleClass( "hidden" );
		})
	})
}

function Drop(event, ui) {
  var draggableId = $ui.draggable.attr("id");
  var droppableId = $(this).attr("id");
  console.log(draggableId, droppableId);
}

$(function(){
	console.log("Success");
	cacheDom();
	createSortables();
	continuouslyGenerateOrders(5000, 1);
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

