var playerData = {
		nom: 'Player2',
		vitesse: 5,
		size: {width:30, height: 30},
		direction: 'left',
		position: {	left: 1850, top: 890}
};

postMessage({type: 'updatePlayer', player: playerData});

var interUpdatePlayer = setInterval(function(){
	
	if(playerData.direction == 'right'){
		if(playerData.position.left + playerData.size.width >= 1880){
			playerData.direction = 'left';
		}else{
			playerData.position.left += playerData.vitesse;
		}
	}
	if(playerData.direction == 'left'){
		if(playerData.position.left == 0){
			playerData.direction = 'right';
		}else{
			playerData.position.left -= playerData.vitesse;
		}
	}
	if(playerData.direction == 'bot'){
		if(playerData.position.top + playerData.size.height >= 925){
			playerData.direction = 'top';
		}else{
			playerData.position.top += playerData.vitesse;
		}
	}
	if(playerData.direction == 'top'){
		if(playerData.position.top == 0){
			playerData.direction = 'bot';
		}else{
			playerData.position.top -= playerData.vitesse;
		}
	}
	postMessage({type: 'updatePlayer', player: playerData});

}, 30);


onmessage=function(event){
	var data = event.data;	
	
	if(data.type === 'init'){
		playerData = data.data;

	}else if(data.type === 'updateDirection'){
		updateDirection(data.key);
		
	}else if(data.type === 'updateSize'){
		playerData.size.width += data.bonus;
		playerData.size.height += data.bonus;
		if(playerData.size.width < 6 || playerData.size.height < 6){
			postMessage({type: 'death'});
		}
	}else if(data.type === 'stop'){
    	clearInterval(interUpdatePlayer);
		
	}else if(data.type === 'getAuthToProjectile'){
		if(playerData.size.width >= 32){
			playerData.size.width -= 2;
			playerData.size.height -= 2;
			postMessage({type: 'projectileAutorisation', value: true});
		}else{
			postMessage({type: 'projectileAutorisation', value: false});

		}
		
	}
	
	
};

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

