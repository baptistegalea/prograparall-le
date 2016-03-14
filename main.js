	/* keyCode
	 * 38 : haut
	 * 39 : droite
	 * 40 : bas
	 * 37 : gauche
	 */



// liste des touches autorisées //
var keysAllowed = [27, 38, 39, 40, 37, 81, 90, 68, 83, 17, 70];
var keysPlayer1 = [38, 39, 40, 37];
var keysPlayer2 = [81, 90, 68, 83];
var vitesse = 30;
var wplayer1=new Worker("player1Worker.js");
var wplayer2=new Worker("player2Worker.js");
var foodWorker=new Worker("foodWorker.js");
var player1;
var player2;


/*function updateAffichage(){
	
	$( "#player1" ).css( "left", player1.position.left).css( "top", player1.position.top).css( "height", player1.size.height).css( "width", player1.size.width);
	$( "#player2" ).css( "left", player2.position.left).css( "top", player2.position.top).css( "height", player2.size.height).css( "width", player2.size.width);
}*/
  
onkeydown = function(e){
    e = e || event;
    if(jQuery.inArray(e.keyCode, keysAllowed ) != -1){
        if(e.keyCode == 27){
        	//clearInterval(avancer);
        }else if(jQuery.inArray(e.keyCode, keysPlayer1 ) != -1){
        	wplayer1.postMessage({type: 'updateDirection', key: e.keyCode});
        }else if(jQuery.inArray(e.keyCode, keysPlayer2 ) != -1){
        	wplayer2.postMessage({type: 'updateDirection', key: e.keyCode});
        }else if(e.keyCode == 17){
        	wplayer1.postMessage({type: 'getAuthToProjectile'});
        }else if(e.keyCode == 70){
        	//foodWorker.postMessage({type: 'newProjectile', player: player2});
        	wplayer2.postMessage({type: 'getAuthToProjectile'});
        }
    };
    
};

wplayer1.onmessage=function(event){
	var value = event.data; 
	if(value){
		if(value.type === 'updatePlayer'){

			player1 = value.player;
			$( "#player1" ).css( "left", player1.position.left).css( "top", player1.position.top).css( "height",player1.size.height).css( "width", player1.size.width);
			
			foodWorker.postMessage({type: 'updatePlayer1Po', player: player1});
		}else if(value.type === 'projectileAutorisation' && value.value == true){
        	foodWorker.postMessage({type: 'newProjectile', player: player1});

		}else if(value.type === 'death'){
			end();
        	alert('Le player 2 a remporté la partie');

		}
	}
};

wplayer2.onmessage=function(event){
	var value = event.data; 
	if(value){
		if(value.type === 'updatePlayer'){
			player2 = value.player;
			$( "#player2" ).css( "left", player2.position.left).css( "top", player2.position.top).css( "height",player2.size.height).css( "width", player2.size.width);
			foodWorker.postMessage({type: 'updatePlayer2Po', player: player2});
		}else if(value.type === 'projectileAutorisation' && value.value == true){
        	foodWorker.postMessage({type: 'newProjectile', player: player2});

		}else if(value.type === 'death'){
			end();
        	alert('Le player 1 a remporté la partie');
		}
	}
};

foodWorker.onmessage=function(event){
	var value = event.data;
	if(value){
		if(value.type === 'collision'){
			$('#' + value.divId).remove();
		}else if(value.type === 'foodTimeLeft'){
			$('#' + value.divId).fadeOut('slow', function(){
				$('#' + value.divId).remove();
			});
			
		}else if(value.type === "addNewFood"){
			$('#map').append(value.html);
			$('#' + value.divId).fadeIn();
		}else if(value.type === "addNewProjectile"){
			$('#map').append(value.html);
			$('#' + value.divId).fadeIn();
		}else if(value.type === "playerSizeUpdate"){
			if(value.nomPlayer === "Player1"){	
				wplayer1.postMessage({type: 'updateSize', bonus: value.bonus});
			}
			if(value.nomPlayer === "Player2"){	
				wplayer2.postMessage({type: 'updateSize', bonus: value.bonus});
			}
		}else if(value.type === 'projectileUpdate'){
			$('#' + value.projectile.id).css( "left", value.projectile.left).css( "top", value.projectile.top).css( "height",value.projectile.height).css( "width", value.projectile.width);
		}else if(value.type === 'projectileTimeLeft'){
			$('#' + value.divId).remove();
		}else if(value.type === 'deleteProjectile'){
			console.log('removing projectile');
			$('#' + value.divId).remove();
		}
	
	}
};

function end(){
	foodWorker.postMessage({type: 'stop'});
	wplayer1.postMessage({type: 'stop'});
	wplayer2.postMessage({type: 'stop'});
	foodWorker.terminate();
	wplayer1.terminate();
	wplayer2.terminate();
}