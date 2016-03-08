
onmessage=function(event){
	
	
	/* keyCode
	 * 38 : haut
	 * 39 : droite
	 * 40 : bas
	 * 37 : gauche
	 */

	var data = event.data;
	
	var result = true;

	
	if((data.snakeData.direction == 'left' && data.keyData == 39) || (data.snakeData.direction == 'right' && data.keyData == 37)){
		result = false;
	}
	
	if((data.snakeData.direction == 'top' && data.keyData == 40) || (data.snakeData.direction == 'bot' && data.keyData == 38)){
		result = false;
	}
	
	if(result){
		if(data.keyData == 37){
			data.snakeData.direction = "left";
			data.snakeData.deplacement = {left: "-=5"};
		}
		
		if(data.keyData == 38){
			data.snakeData.direction = "top";
			data.snakeData.deplacement = {top: "-=5"};
		}	
	
		if(data.keyData == 39){
			data.snakeData.direction = "right";
			data.snakeData.deplacement = {left: "+=5"};
		}
		
		if(data.keyData == 40){
			data.snakeData.direction = "bot";
			data.snakeData.deplacement = {top: "+=5"};
		}

		result = data.snakeData;
	
	}
	postMessage(result);
};


