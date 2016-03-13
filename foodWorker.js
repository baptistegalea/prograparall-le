
var foodList = [];
var increment = 1;
var player;
	
var interGenFood = setInterval(function(){
	
	var random = Math.random() * 10000;
	
	if(random < 5000){
		
		var pourcLeft = Math.floor(Math.random() * 1820) + 10; 
		var pourcTop = Math.floor(Math.random() * 1820) + 10;
		var size =  Math.floor(Math.random() * 12) + 5;
		var time = 330;	
		var id = 'food-' + increment;
		
		var food = {id: id, left: pourcLeft, top: pourcTop, timeLeft: time, size: size};
		
		foodList.push(food);	
		increment++;
		
		postMessage({type: 'addNewFood', html: getHtmlFood(food)});
	}

	
}, 250);

var interUpdateFoodList = setInterval(function(){
	foodList = updateFoodList();
}, 30);

function updateFoodList(){
	
	var newList = [];
	
	foodList.forEach(function(food){
		food.timeLeft--;	
		
		if(collision(player, food)){
			onCollision(food);			
		}else{
			if(food.timeLeft > 0){
				newList.push(food);
			}else{
				postMessage({type: 'foodTimeLeft', divId: food.id});
			}
		}
	});

	return newList;
}

function getHtmlFood(food){
	var html = '';
	
	html = '<div class="food" id="'+ food.id +'" style="left:' + food.left + 'px; top: '+ food.top + 'px; width:' + food.size + 'px; height:' + food.size + 'px;"></div>';
	
	return html;
	
}

onmessage=function(event){
	
	var data = event.data;
	if (data.type === 'stop'){
    	clearInterval(interGenFood);
    	clearInterval(interUpdateFoodList);
	}else if(data.type === 'updatePlayerPo'){
		player = data.position;
	}
}

function collision(player, food) {
    var x1 = player.left;
    var y1 = player.top;
    var h1 = player.height;
    var w1 = player.width;
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = food.left;
    var y2 = food.top;
    var h2 = food.size;
    var w2 = food.size;
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

function onCollision(food){
	var bonus = (food.size/4);
	
	var newPlayerWidth = player.width + bonus;
	var newPlayerHeight = player.height + bonus;
	
	var size = {width: newPlayerWidth, height: newPlayerHeight};
	postMessage({type: 'collision', divId: food.id});
	postMessage({type: 'playerSizeUpdate', newPlayerSize: size});
}


