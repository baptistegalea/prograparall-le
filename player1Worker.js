var playerData;



var interUpdatePly=ayer = setInterval(function(){
	
	postMessage({type: 'updatePlayer1', player: playerData});
}, 30);



onmessage=function(event){
	var data = event.data;	
	
	if(data.type === 'init'){
		playerData = data.data;

	}else if(data.type === 'updateDirection'){
		updateDirection(data.key);
		
	}else if(data.type === 'updateSize'){
		playerData.size = data.newSize;
		
	}
	
	
};

function updateDirection(key){
	
	/* keyCode
	 * 38 : haut
	 * 39 : droite
	 * 40 : bas
	 * 37 : gauche
	 */
	var result = true;

	
	if((playerData.direction == 'left' && key == 39) || (playerData.direction == 'right' && key == 37)){
		result = false;
	}
	
	if((playerData.direction == 'top' && key == 40) || (playerData.direction == 'bot' && key == 38)){
		result = false;
	}
	
	if(result){
		if(key == 37){
			playerData.direction = "left";
			playerData.deplacement = {left: "-=5"};
		}
		
		if(key == 38){
			playerData.direction = "top";
			playerData.deplacement = {top: "-=5"};
		}	
	
		if(key == 39){
			playerData.direction = "right";
			playerData.deplacement = {left: "+=5"};
		}
		
		if(key == 40){
			playerData.direction = "bot";
			playerData.deplacement = {top: "+=5"};
		}	
	}
}


