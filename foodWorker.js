
var foodList = [];
var increment = 1;
var player1= {nom: 'Player1', position: {left: '1', top: '1', height: '30', width: '30'}};
var player2= {nom: 'Player2', position: {left: '500', top: '500', height: '30', width: '30'}};

var interGenFood = setInterval(function(){
	
	var random = Math.random() * 10000;
	
	if(random < 5000){
		
		var pourcLeft = Math.floor(Math.random() * 1820) + 10; 
		var pourcTop = Math.floor(Math.random() * 1820) + 10;
		var size =  Math.floor(Math.random() * 12) + 5;
		var time = 400;	
		var id = 'food-' + increment;
		
		var food = {id: id, left: pourcLeft, top: pourcTop, timeLeft: time, size: size};
		
		foodList.push(food);	
		increment++;
		
		postMessage({type: 'addNewFood', html: getHtmlFood(food), divId: food.id});
	}

	
}, 250);

var interUpdateFoodList = setInterval(function(){
	foodList = updateFoodList();
}, 30);

function updateFoodList(){
	
	var newList = [];
	
	foodList.forEach(function(food){
		food.timeLeft--;	
		
		if(collision(player1.position, food)){
			onCollision(food, player1);
		}else if(collision(player2.position, food)){
			onCollision(food, player2);
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
	}else if(data.type === 'updatePlayer1Po'){
		player1.position = data.position;
	}else if(data.type === 'updatePlayer2Po'){
		player2.position = data.position;
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

function onCollision(food, player){
	var bonus = (food.size/4);
	
	var newPlayerWidth = player.position.width + bonus;
	var newPlayerHeight = player.position.height + bonus;
	
	var size = {width: newPlayerWidth, height: newPlayerHeight};
	postMessage({type: 'collision', divId: food.id});
	postMessage({type: 'playerSizeUpdate', newPlayerSize: size, nomPlayer: player.nom});
}


