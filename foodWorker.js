
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

var projectileList = [];

var interGenFood = setInterval(function(){
	
	var random = Math.random() * 10000;
	
	if(random < 5000){
		
		var left = Math.floor(Math.random() * 1820) + 10; 
		var top = Math.floor(Math.random() * 870) + 10;
		var size =  Math.floor(Math.random() * 12) + 5;
		var time = 400;	
		var id = 'food-' + increment;
		
		var food = {id: id, left: left, top: top, timeLeft: time, size: size};
		
		foodList.push(food);	
		increment++;
		
		postMessage({type: 'addNewFood', html: getHtmlFood(food), divId: food.id});
	}

	
}, 250);

var interUpdateFoodList = setInterval(function(){
	foodList = updateFoodList();
	if(projectileList.length > 0){
		projectileList = updateProjectileList();
	}
}, 30);


function updateProjectileList(){
	
	var newList = [];

	projectileList.forEach(function(projectile){
		projectile.timeLeft--;	
		if(projectile.direction == 'right'){
			if(projectile.left + projectile.size >= 1880){
				postMessage({type: 'deleteProjectile', divId: projectile.id});
				return;
			}else{
				projectile.left += projectile.vitesse;
			}
		}
		if(projectile.direction == 'left'){
			if(projectile.left <= 0){
				postMessage({type: 'deleteProjectile', divId: projectile.id});
				return;
			}else{
				projectile.left -= projectile.vitesse;
			}
		}
		if(projectile.direction == 'bot'){
			if(projectile.top + projectile.size >= 925){
				postMessage({type: 'deleteProjectile', divId: projectile.id});
				return;
			}else{
				projectile.top += projectile.vitesse;
			}
		}
		if(projectile.direction == 'top'){
			if(projectile.top <= 0){
				postMessage({type: 'deleteProjectile', divId: projectile.id});
				return;
			}else{
				projectile.top -= projectile.vitesse;
			}
		}
		
		if(projectile.owner.nom == 'Player1'){
			var player = player2;
		}else if(projectile.owner.nom == 'Player2'){
			var player = player1;
		}
		if(collision(player, projectile)){
			onCollision(projectile, player);
		}else{
			if(projectile.timeLeft > 0){
				newList.push(projectile);
				postMessage({type: 'projectileUpdate', projectile: projectile});
			}else{
				postMessage({type: 'projectileTimeLeft', divId: projectile.id});
			}
		}

	});

	return newList;
}

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
	}else if(data.type === 'newProjectile'){
		var projectile;
		var id = 'projectile-' + increment;
		var player = data.player;
		var left = player.position.left;
		var top = player.position.top;
		var time = 60;
		var size = 10;
		var direction = player.direction;
		
		if(player.direction == 'right'){
			left = player.position.left + player.size.width; 
		}
		if(player.direction == 'top' || player.direction == 'bot'){
			left = player.position.left + (player.size.width/2); 
		}	

		
		if(player.direction == 'bot'){
			top = player.position.top + player.size.height; 
		}
		if(player.direction == 'right' || player.direction == 'left'){
			top = player.position.top + (player.size.height/2); 
		}	
		
		projectile = {id: id, left: left, top: top, timeLeft: time, size: size, owner: player, vitesse: 10, direction: direction};
		
		projectileList.push(projectile);
		postMessage({type: 'addNewProjectile', html: getHtmlFood(projectile), divId: id});

		increment++;
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
	
	    return true;

  }

function onCollision(food, player){
	var bonus = (food.size/4);
	//si owner alors c'est un projectile et non une food, dans ce cas on enlève
	if(food.owner){
		bonus = -4;
	}

	postMessage({type: 'collision', divId: food.id});
	postMessage({type: 'playerSizeUpdate', bonus: bonus, nomPlayer: player.nom});

}


