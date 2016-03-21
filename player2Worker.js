var mapHeight;
var mapWidth;
var mapHeight;
var mapWidth;
var marge;
var taille;
var maxSize;
var playerData;
function start(){
	
	playerData = {
			nom: 'Player2',
			vitesse: 2.5,
			size: {width:taille, height: taille},
			direction: 'right',
			position: {left: mapWidth - taille, top: mapHeight - taille},
			malus: {active: false, timeLeft: 0, value: 0},
			bonus: {active: false, timeLeft: 0, value: 0},
			shield: {active: false, timeLeft: 0}
	};
	
	interUpdatePlayer = setInterval(function(){
		loopInterUpdatePlayer();

	}, 13);
}

function loopInterUpdatePlayer(){
	var vitesse = playerData.vitesse;
	
	if(playerData.malus.active == true && playerData.malus.timeLeft > 0){
		vitesse-= playerData.malus.value;
	}
		
	if(playerData.bonus.active == true && playerData.bonus.timeLeft > 0){
		vitesse+= playerData.bonus.value;
	}
	
	updateEvent();
	
	if(playerData.direction == 'right'){
		if(playerData.position.left + playerData.size.width >= mapWidth){
			playerData.direction = 'left';
		}else{
			playerData.position.left += vitesse;
		}
	}
	if(playerData.direction == 'left'){
		if(playerData.position.left <= 0){
			playerData.direction = 'right';
		}else{
			playerData.position.left -= vitesse;
		}
	}
	if(playerData.direction == 'bot'){
		if(playerData.position.top + playerData.size.height >= mapHeight){
			playerData.direction = 'top';
		}else{
			playerData.position.top += vitesse;
		}
	}
	if(playerData.direction == 'top'){
		if(playerData.position.top <= 0){
			playerData.direction = 'bot';
		}else{
			playerData.position.top -= vitesse;
		}
	}
	postMessage({type: 'updatePlayer', player: playerData});
}



function updateEvent(){
	if(playerData.malus.active == true){
		if(playerData.malus.timeLeft == 0){
			playerData.malus.active = false;
			playerData.malus.timeLeft = 0;
			playerData.malus.value = 0;
		}else{
			playerData.malus.timeLeft--;
		}
	}
	
	if(playerData.bonus.active == true){
		if(playerData.bonus.timeLeft == 0){
			playerData.bonus.active = false;
			playerData.bonus.timeLeft = 0;
			playerData.bonus.value = 0;
		}else{
			playerData.bonus.timeLeft--;
		}
	}
	if(playerData.shield.active == true){
		if(playerData.shield.timeLeft == 0){
			playerData.shield.active = false;
			playerData.shield.timeLeft = 0;
			// remove shield dans le dom
			postMessage({type : 'endOfShield'});
		}else{
			playerData.shield.timeLeft--;
		}
	}
}

onmessage=function(event){
	var data = event.data;	
	
	if(data.type === 'init'){
		playerData = data.data;

	}else if(data.type === 'updateDirection'){
		updateDirection(data.key);
		
	}else if(data.type === 'updateSize'){
		if(playerData.size.width + data.bonus <= maxSize || playerData.size.height + data.bonus <= maxSize){
			playerData.size.width += data.bonus;
			playerData.size.height += data.bonus;
		}
		
		var diffTailleWidth = mapWidth - (playerData.size.width + playerData.position.left);
		if(diffTailleWidth < 0){
			playerData.position.left += diffTailleWidth;
		}
		
		var diffTailleHeight = mapHeight - (playerData.size.height + playerData.position.top);
		if(diffTailleHeight < 0){
			playerData.position.top += diffTailleHeight;
		}
			
		
		if(playerData.size.width < 3 || playerData.size.height < 3){
			postMessage({type: 'death'});
		}
	}else if(data.type === 'updateSizeProjectile'){
		if(playerData.shield.active == false){
			playerData.size.width += data.bonus;
			playerData.size.height += data.bonus;
			
			if(playerData.size.width < 3 || playerData.size.height < 3){
				postMessage({type: 'death'});
			}
		}
	}else if(data.type === 'stop'){
    	clearInterval(interUpdatePlayer);
		
	}else if(data.type === 'getAuthToProjectile'){
		if(playerData.size.width >= 32){
			playerData.size.width -= 1;
			playerData.size.height -= 1;
			postMessage({type: 'projectileAutorisation', value: true});
		}else{
			postMessage({type: 'projectileAutorisation', value: false});

		}
	}else if(data.type === 'newMalus'){
		playerData.malus = {active: true, timeLeft: data.malus.time, value : data.malus.value};
	}else if(data.type === 'newBonus'){
		playerData.bonus = {active: true, timeLeft: data.bonus.time, value : data.bonus.value};
	}else if(data.type === 'newShield'){
		playerData.shield = {active: true, timeLeft: data.shield.time};
	}else if(data.type === 'initMap'){
		mapHeight = data.map.mapHeight;
		mapWidth = data.map.mapWidth;
		marge = data.map.marge;
		taille = data.taille;
		maxSize = (mapHeight > mapWidth ? mapWidth / 2 : mapHeight / 2);
		start();
	}
};

function revertPlayerDirection(){
	if(playerData.direction == 'right'){
		playerData.position.left-=30;
		playerData.direction = 'left';

	}else if(playerData.direction == 'left'){
		playerData.position.left+=30;
		playerData.direction = 'right';

	}else if(playerData.direction == 'bot'){
		playerData.position.top-=30;
		playerData.direction = 'top';
	}else if(playerData.direction == 'top'){
		playerData.position.top+=30;

		playerData.direction = 'bot';
	}	
}
function updateDirection(key){
	
	/* keyCode
	 * 38 : haut
	 * 39 : droite
	 * 40 : bas
	 * 37 : gauche
	 */
	
	if(key == 81){
		playerData.direction = "left";
	}
	
	if(key == 90){
		playerData.direction = "top";
	}	

	if(key == 68){
		playerData.direction = "right";
	}
	
	if(key == 83){
		playerData.direction = "bot";
	}	
}

