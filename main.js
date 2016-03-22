	/* keyCode
	 * 38 : haut
	 * 39 : droite
	 * 40 : bas
	 * 37 : gauche
	 */



// liste des touches autorisées //
var keysAllowed = [27, 38, 39, 40, 37, 81, 90, 68, 83, 96, 70];
var keysPlayer1 = [38, 39, 40, 37];
var keysPlayer2 = [81, 90, 68, 83];
var vitesse = 30;
var wplayer1=new Worker("player1Worker.js");
var wplayer2=new Worker("player2Worker.js");
var foodWorker=new Worker("foodWorker.js");
var player1;
var player2;
var htmlHeight;
var htmlWidth;
var mapHeight;
var mapWidth;
var marge = 10;
var taille = 30;

function init(){
	htmlHeight = $('html').height();
	htmlWidth = $('html').width();
	
	mapHeight = htmlHeight - marge;
	mapWidth = htmlWidth - marge;

	$('#map').css("height", mapHeight);
	$('#map').css("width", mapWidth);
	
	$('#map').css("top", marge);
	$('#map').css("left", marge);
	
	wplayer1.postMessage({type:'initMap', map: {mapHeight: mapHeight, mapWidth: mapWidth, marge: marge}, taille: taille});
	wplayer2.postMessage({type:'initMap', map: {mapHeight: mapHeight, mapWidth: mapWidth, marge: marge}, taille: taille});
	foodWorker.postMessage({type:'initMap', map: {mapHeight: mapHeight, mapWidth: mapWidth, marge: marge}, taille: taille});
}

  
onkeydown = function(e){
    e = e || event;
    if(jQuery.inArray(e.keyCode, keysAllowed ) != -1){
        if(e.keyCode == 27){
        	end();
        }else if(jQuery.inArray(e.keyCode, keysPlayer1 ) != -1){
        	wplayer1.postMessage({type: 'updateDirection', key: e.keyCode});
        }else if(jQuery.inArray(e.keyCode, keysPlayer2 ) != -1){
        	wplayer2.postMessage({type: 'updateDirection', key: e.keyCode});
        }
    };
    
};


onkeyup = function(e){
    e = e || event;
    if(jQuery.inArray(e.keyCode, keysAllowed ) != -1){
    	if(e.keyCode == 96){
        	wplayer1.postMessage({type: 'getAuthToProjectile'});
        }else if(e.keyCode == 70){
        	wplayer2.postMessage({type: 'getAuthToProjectile'});
        }
    };
    
};

function getTimeLeft(player){
	var timeLeftList =[];
	var minElement;
	
	if(player.malus.active === true) timeLeftList.push(player.malus);
	if(player.bonus.active === true) timeLeftList.push(player.bonus);
	if(player.shield.active === true) timeLeftList.push(player.shield);
	
	//console.log(timeLeftList);
	
	if(timeLeftList.length == 0) {
		return '';
	}else if(timeLeftList.length == 1){
		return "<span class='event " + timeLeftList[0].name + "' style='font-size:" + (player.size.width/5 > 20 ? player.size.width/5 : 20) + "px'>" + Math.floor(timeLeftList[0].timeLeft/10) + "</span>";
	}

	minElement = timeLeftList[0];
	for (var i = 1; i < timeLeftList.length; i++) {
		if(timeLeftList[i].timeLeft < minElement){
			minElement = timeLeftList[i];
		}
	}

	return "<span class='event " + minElement.name + "' style='font-size:" + (player.size.width/5 > 20 ? player.size.width/5 : 20) + "px'>" + Math.floor(minElement.timeLeft/10) + "</span>";
}

wplayer1.onmessage=function(event){
	var value = event.data; 
	if(value){
		if(value.type === 'updatePlayer'){

			player1 = value.player;
			$( "#player1" ).css( "left", player1.position.left).css( "top", player1.position.top).css( "height",player1.size.height).css( "width", player1.size.width);
			$('#scoreplayer1').text(Math.floor(player1.size.width));
			$( "#player1" ).text('');
			$( "#player1" ).append(getTimeLeft(player1));
			 
			foodWorker.postMessage({type: 'updatePlayer1Po', player: player1});
		}else if(value.type === 'projectileAutorisation' && value.value == true){
        	foodWorker.postMessage({type: 'newProjectile', player: player1});
		}else if(value.type === 'projectileAutorisation' && value.value == false){
        	//foodWorker.postMessage({type: 'newProjectile', player: player1});
		}else if(value.type === 'death'){
			end();
			$("#player1").remove();
			$("#scoreplayer1").text('0');
        	alert('Le player 2 a remporté la partie');
		}else if(value.type === 'endOfShield'){
			$('#player1').removeClass('shield');
		}
	}
};

wplayer2.onmessage=function(event){
	var value = event.data; 
	if(value){
		if(value.type === 'updatePlayer'){
			player2 = value.player;
			$( "#player2" ).css( "left", player2.position.left).css( "top", player2.position.top).css( "height",player2.size.height).css( "width", player2.size.width);
			$('#scoreplayer2').text(Math.floor(player2.size.width));
			$( "#player2" ).text('');
			$( "#player2" ).append(getTimeLeft(player2));
			foodWorker.postMessage({type: 'updatePlayer2Po', player: player2});
		}else if(value.type === 'projectileAutorisation' && value.value == true){
        	foodWorker.postMessage({type: 'newProjectile', player: player2});

		}else if(value.type === 'death'){
			end();
			$("#player2").remove();
			$("#scoreplayer2").text('0');
        	alert('Le player 1 a remporté la partie');
		}else if(value.type === 'endOfShield'){
			$('#player2').removeClass('shield');
		}
	}
};

foodWorker.onmessage=function(event){
	var value = event.data;
	if(value){
		if(value.type === 'collision'){
			$('#' + value.divId).remove();
		}else if(value.type === 'foodTimeLeft'){
			$('#' + value.divId).fadeOut('fast', function(){
				$('#' + value.divId).remove();
			});
			
		}else if(value.type === "addNewFood"){
			$('#map').append(value.html);
			$('#' + value.divId).fadeIn();
		}else if(value.type === "addNewProjectile"){
			$('#map').append(value.html);
			$('#' + value.divId).fadeIn();
		}else if(value.type === "playerSizeUpdateProjectile"){
			if(value.nomPlayer === "Player1"){
				wplayer1.postMessage({type: 'updateSizeProjectile', bonus: value.bonus});
			}
			if(value.nomPlayer === "Player2"){
				wplayer2.postMessage({type: 'updateSizeProjectile', bonus: value.bonus});
			}
		}else if(value.type === "playerSizeUpdate"){
			if(value.nomPlayer === "Player1"){
				wplayer1.postMessage({type: 'updateSize', bonus: value.bonus});
			}
			if(value.nomPlayer === "Player2"){
				wplayer2.postMessage({type: 'updateSize', bonus: value.bonus});
			}
		}else if(value.type === 'projectileUpdate'){
			$('#' + value.projectile.id).css( "left", value.projectile.position.left).css( "top", value.projectile.position.top).css( "height",value.projectile.size.height).css( "width", value.projectile.size.width);
		}else if(value.type === 'projectileTimeLeft'){
			$('#' + value.divId).remove();
		}else if(value.type === 'deleteProjectile'){
			$('#' + value.divId).remove();
		}else if(value.type === 'playerAddMalus'){
			if(value.nomPlayer === "Player1"){	
				wplayer1.postMessage({type: 'newMalus', malus: value.malus});
			}
			if(value.nomPlayer === "Player2"){	
				wplayer2.postMessage({type: 'newMalus', malus: value.malus});
			}
		}else if(value.type === 'playerAddBonus'){
			if(value.nomPlayer === "Player1"){	
				wplayer1.postMessage({type: 'newBonus', bonus: value.bonus});
			}
			if(value.nomPlayer === "Player2"){	
				wplayer2.postMessage({type: 'newBonus', bonus: value.bonus});
			}
		}else if(value.type === 'playerAddShield'){
			if(value.nomPlayer === "Player1"){	
				wplayer1.postMessage({type: 'newShield', shield: value.shield});
				$('#player1').addClass('shield');
			}
			if(value.nomPlayer === "Player2"){	
				wplayer2.postMessage({type: 'newShield', shield: value.shield});
				$('#player2').addClass('shield');
			}
		}else if(value.type === 'playerDeathMalus'){
			if(value.nomPlayer === "Player1"){
				wplayer1.postMessage({type: 'deathMalus', data: value.data});
			}
			if(value.nomPlayer === "Player2"){
				wplayer2.postMessage({type: 'deathMalus', data: value.data});
			}
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