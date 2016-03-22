var foodList = [];
var increment = 1;
var projectileMaxSize = 35;
var mapHeight;
var mapWidth;
var marge;
var taille;
var player1;
var player2;

var interGenFood;
var interUpdateFoodList;
var projectileList = [];

function loopInterGenFood(){
	var left;
	var top;
	var food;
	var random = Math.random() * 10000;
	var size;
	var time;
	var type;
	var id;
	if(random < 6000){
		random = Math.random() * 80;

		size;
		time = 600;
		
		if(random <= 72){
			type = 'food';
			size =  Math.floor(Math.random() * 12) + 4;
			time = 1000;
		}else if (random <= 74){
			type = 'bonus';
			size =  20;
		}else if (random <= 76){
			type = 'malus';
			size =  20;	
		}else if (random <= 79){
			type = 'shieldbloc';
			size =  20;	
		}else if (random <= 80){
			type = 'deathhead';
			size =  40;	
		}
		left = Math.floor(Math.random() * (mapWidth - marge - size)) + marge; 
		top = Math.floor(Math.random() * (mapHeight - marge - size)) + marge;
		while(collision(player1, {position: {left: left, top: top}, size : { height: size, width : size}}) || collision(player2, {position: {left: left, top: top}, size : { height: size, width : size}})){
			left = Math.floor(Math.random() * (mapWidth - marge - size)) + marge; 
			top = Math.floor(Math.random() * (mapHeight - marge - size)) + marge;
		}
		id = type + '-' + increment;
		food = {id: id, type: type, classe: type , position: {left: left, top: top}, timeLeft: time, size:{width: size, height: size}};
		foodList.push(food);	
		increment++;
		
		postMessage({type: 'addNewFood', html: getHtmlFood(food), divId: food.id});
	}

}

function loopInterUpdateFoodList(){
	foodList = updateFoodList();
	if(projectileList.length > 0){
		projectileList = updateProjectileList();
	}
}

function start(){
	
	
	player1 = {
			nom: 'Player1',
			vitesse: 2.5,
			size: {width:taille, height: taille},
			direction: 'right',
			position: {	left: marge, top: marge},
			malus: {name : 'slow', active: false, timeLeft: 0, value: 0},
			bonus: {name : 'boost', active: false, timeLeft: 0, value: 0},
			shield: {name : 'bouclier', active: false, timeLeft: 0},
			death: {name : 'deathhead', value: 0, timeLeft: 0}
	};
	player2 = {
			nom: 'Player2',
			vitesse: 2.5,
			size: {width:taille, height: taille},
			direction: 'right',
			position: {left: mapWidth - taille, top: mapHeight - taille},
			malus: {name : 'slow', active: false, timeLeft: 0, value: 0},
			bonus: {name : 'boost', active: false, timeLeft: 0, value: 0},
			shield: {name : 'bouclier', active: false, timeLeft: 0},
			death: {name : 'deathhead', value: 0, timeLeft: 0}
	};
	
	interGenFood = setInterval(function(){
		loopInterGenFood();
		
	}, 150);

	interUpdateFoodList = setInterval(function(){
		loopInterUpdateFoodList();
	}, 13);
}


function updateProjectileList(){
	
	var newList = [];

	projectileList.forEach(function(projectile){
		projectile.timeLeft--;	
		if(projectile.direction == 'right'){
			if(projectile.position.left + projectile.size.width >= mapWidth){
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
			if(projectile.position.top + projectile.size.width >= mapHeight){
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
		var time = 120;
		var size = (player.size.width / 3 > projectileMaxSize ? projectileMaxSize : player.size.width / 3);
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
		var vitesse = (player.vitesse * 2) + player.bonus.value - player.malus.value;
		projectile = {id: id, type: 'projectile', classe: 'projectile-' + player.nom , position : {left: left, top: top}, timeLeft: time, size: {height: size, width: size}, owner: player, vitesse: vitesse, direction: direction};
		
		projectileList.push(projectile);
		postMessage({type: 'addNewProjectile', html: getHtmlFood(projectile), divId: id});

		increment++;
	}else if(data.type === 'initMap'){
		mapHeight = data.map.mapHeight;
		mapWidth = data.map.mapWidth;
		marge = data.map.marge;
		taille = data.taille;
		start();
	}
}

function collision(object1, object2) {
	
    var x1 = object1.position.left;
    var y1 = object1.position.top;
    var h1 = object1.size.height;
    var w1 = object1.size.width;

    var x2 = object2.position.left;
    var y2 = object2.position.top;
    var h2 = object2.size.height;
    var w2 = object2.size.width;
    var b2 = y2 + h2;
    var r2 = x2 + w2;
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    
    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;

    return true;

}

function onCollision(food, player){
	var bonus;
	var malus;
	var shield;
	postMessage({type: 'collision', divId: food.id});
	
	//si owner alors c'est un projectile et non une food, dans ce cas on enlève
	if(food.type == 'projectile'){
		bonus = -7;
		postMessage({type: 'playerSizeUpdateProjectile', bonus: bonus, nomPlayer: player.nom});
	}else if(food.type == 'food'){
		bonus = (food.size.width /4);
		postMessage({type: 'playerSizeUpdate', bonus: bonus, nomPlayer: player.nom});
	}else if(food.type == 'bonus'){
		bonus = {type: 'vitesse', value: 2.5, time: 175};
		postMessage({type: 'playerAddBonus', bonus: bonus, nomPlayer: player.nom});
	}else if(food.type == 'malus'){
		malus = {type: 'vitesse', value: 1.5, time: 225};
		postMessage({type: 'playerAddMalus', malus: malus, nomPlayer: player.nom});
	}else if(food.type == 'shieldbloc'){
		shield = {time: 250};
		postMessage({type: 'playerAddShield', shield: shield, nomPlayer: player.nom});
	}else if(food.type == 'deathhead'){
		postMessage({type: 'playerDeathMalus', nomPlayer: player.nom, data: {value: (player.size.width / 2)/100, timeLeft: 100}});		
	}
}


