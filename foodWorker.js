
var foodList = [];
var increment = 1;
var player1 = {
		nom: 'Player1',
		vitesse: 5,
		size: {width:30, height: 30},
		direction: 'right',
		position: {	left: 0, top: 0}
};
var player2 = {
		nom: 'Player2',
		vitesse: 5,
		size: {width:30, height: 30},
		direction: 'right',
		position: {	left: 1850, top: 890}
};

var interGenFood = setInterval(function(){
	
	var random = Math.random() * 10000;
	
	if(random < 5000){
		
		var pourcLeft = Math.floor(Math.random() * 1820) + 10; 
		var pourcTop = Math.floor(Math.random() * 870) + 10;
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
		
		if(collision(player1, food)){
			onCollision(food, player1);
		}else if(collision(player2, food)){
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
		player1 = data.player;
	}else if(data.type === 'updatePlayer2Po'){
		player2 = data.player;
	}
}

function collision(player, food) {
    var x1 = player.position.left;
    var y1 = player.position.top;
    var h1 = player.size.height;
    var w1 = player.size.width;
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = food.left;
    var y2 = food.top;
    var h2 = food.size;
    var w2 = food.size;
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    console.log('collision');
    return true;

  }

function onCollision(food, player){
	var bonus = (food.size/4);
	postMessage({type: 'collision', divId: food.id});
	postMessage({type: 'playerSizeUpdate', bonus: bonus, nomPlayer: player.nom});
}


