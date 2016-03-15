
var foodList = [];
var increment = 1;
var player1 = {
		nom: 'Player1',
		vitesse: 5,
		size: {width:30, height: 30},
		direction: 'right',
		position: {	left: 0, top: 0},
		malus: {active: false, timeLeft: 0},
		bonus: {active: false, timeLeft: 0}
};
var player2 = {
		nom: 'Player2',
		vitesse: 5,
		size: {width:30, height: 30},
		direction: 'right',
		position: {	left: 1850, top: 890},
		malus: {active: false, timeLeft: 0},
		bonus: {active: false, timeLeft: 0}
};

var projectileList = [];

var interGenFood = setInterval(function(){
	
	var random = Math.random() * 10000;
	
	if(random < 4000){
		random = Math.random() * 25;
		var left = Math.floor(Math.random() * 1820) + 10; 
		var top = Math.floor(Math.random() * 870) + 10;
		var size;
		
		if(random <= 22){
			type = 'food';
			size =  Math.floor(Math.random() * 12) + 4;
		}else if (random <= 23){
			type = 'bonus';
			size =  20;
		}else if (random <= 24){
			type = 'malus';
			size =  20;	
		}else if (random <= 25){
			type = 'shieldbloc';
			size =  20;	
		}
		
		while(collision(player1, {position: {left: left, top: top}, size : { height: size, width : size}}) || collision(player2, {position: {left: left, top: top}, size : { height: size, width : size}})){
			left = Math.floor(Math.random() * 1820) + 10; 
			top = Math.floor(Math.random() * 870) + 10;
		}


		var time = 400;
		
		id = type + '-' + increment;
		var food = {id: id, type: type, classe: type , position: {left: left, top: top}, timeLeft: time, size:{width: size, height: size}};
		foodList.push(food);	
		increment++;
		
		postMessage({type: 'addNewFood', html: getHtmlFood(food), divId: food.id});
	}

	
}, 150);

var interUpdateFoodList = setInterval(function(){
	foodList = updateFoodList();
	if(projectileList.length > 0){
		projectileList = updateProjectileList();
	}
	
	checkPlayersCollision();
}, 30);

function checkPlayersCollision(){
	/*if(collision(player1, player2)){
	}*/
}
function updateProjectileList(){
	
	var newList = [];

	projectileList.forEach(function(projectile){
		projectile.timeLeft--;	
		if(projectile.direction == 'right'){
			if(projectile.position.left + projectile.size.width >= 1880){
				postMessage({type: 'deleteProjectile', divId: projectile.id});
				return;
			}else{
				projectile.position.left += projectile.vitesse;
			}
		}
		if(projectile.direction == 'left'){
			if(projectile.position.left <= 0){
				postMessage({type: 'deleteProjectile', divId: projectile.id});
				return;
			}else{
				projectile.position.left -= projectile.vitesse;
			}
		}
		if(projectile.direction == 'bot'){
			if(projectile.position.top + projectile.size.width >= 925){
				postMessage({type: 'deleteProjectile', divId: projectile.id});
				return;
			}else{
				projectile.position.top += projectile.vitesse;
			}
		}
		if(projectile.direction == 'top'){
			if(projectile.position.top <= 0){
				postMessage({type: 'deleteProjectile', divId: projectile.id});
				return;
			}else{
				projectile.position.top -= projectile.vitesse;
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
	
	html = '<div class="' + food.classe + '" id="'+ food.id +'" style="left:' + food.position.left + 'px; top: '+ food.position.top + 'px; width:' + food.size.width + 'px; height:' + food.size.height + 'px;"></div>';
	
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
		
		projectile = {id: id, type: 'projectile', classe: 'projectile-' + player.nom , position : {left: left, top: top}, timeLeft: time, size: {height: size, width: size}, owner: player, vitesse: 10, direction: direction};
		
		projectileList.push(projectile);
		postMessage({type: 'addNewProjectile', html: getHtmlFood(projectile), divId: id});

		increment++;
	}
}

function collision(object1, object2) {
	
	    var x1 = object1.position.left;
	    var y1 = object1.position.top;
	    var h1 = object1.size.height;
	    var w1 = object1.size.width;
	    var b1 = y1 + h1;
	    var r1 = x1 + w1;
	    var x2 = object2.position.left;
	    var y2 = object2.position.top;
	    var h2 = object2.size.height;
	    var w2 = object2.size.width;
	    var b2 = y2 + h2;
	    var r2 = x2 + w2;
	
	    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
	
	    return true;

}

function onCollision(food, player){
	var bonus;
	var malus;
	postMessage({type: 'collision', divId: food.id});
	
	//si owner alors c'est un projectile et non une food, dans ce cas on enlève
	if(food.type == 'projectile'){
		bonus = -7;
		postMessage({type: 'playerSizeUpdateProjectile', bonus: bonus, nomPlayer: player.nom});
	}else if(food.type == 'food'){
		bonus = (food.size.width /4);
		postMessage({type: 'playerSizeUpdate', bonus: bonus, nomPlayer: player.nom});
	}else if(food.type == 'bonus'){
		bonus = {type: 'vitesse', value: 4, time: 125};
		postMessage({type: 'playerAddBonus', bonus: bonus, nomPlayer: player.nom});
	}else if(food.type == 'malus'){
		malus = {type: 'vitesse', value: 4, time: 125};
		postMessage({type: 'playerAddMalus', malus: malus, nomPlayer: player.nom});
	}else if(food.type == 'shieldbloc'){
		shield = {time: 200};
		postMessage({type: 'playerAddShield', shield: shield, nomPlayer: player.nom});
		
	}
}


