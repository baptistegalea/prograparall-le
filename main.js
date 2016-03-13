	/* keyCode
	 * 38 : haut
	 * 39 : droite
	 * 40 : bas
	 * 37 : gauche
	 */



// liste des touches autorisées //
var keysAllowed = [27, 38, 39, 40, 37, 81, 90, 68, 83];
var keysPlayer1 = [38, 39, 40, 37];
var keysPlayer2 = [81, 90, 68, 83];
var vitesse = 30;
var wplayer1=new Worker("player1Worker.js");
var wplayer2=new Worker("player2Worker.js");
var foodWorker=new Worker("foodWorker.js");
var player1;

player1 = {
		nom: 'Player1',
		deplacement: {left: "+=5"},
		size: {width:30, height: 30},
		direction: 'right',
		position: {	left: '0', top: '0'}
};

wplayer1.postMessage({type: 'init', data: player1});



var player2;

player2 = {
		nom: 'Player2',
		deplacement: {left: "+=5"},
		size: {width:30, height: 30},
		direction: 'left',
		position: {	left: '500', top: '500'}
};

wplayer2.postMessage({type: 'init', data: player2});

var avancer = setInterval(function(){
	main();	
	var x1 = $( "#player1" ).offset().left;
    var y1 = $( "#player1" ).offset().top;
    var h1 = $( "#player1" ).outerHeight(true);
    var w1 = $( "#player1" ).outerWidth(true);
    var player1Position = {left: x1, top: y1, height: h1, width: w1};
    
    // transmission de la position du player, à chaque déplacement, au thread food
	foodWorker.postMessage({type: 'updatePlayer1Po', position: player1Position});
	
	var x1 = $( "#player2" ).offset().left;
    var y1 = $( "#player2" ).offset().top;
    var h1 = $( "#player2" ).outerHeight(true);
    var w1 = $( "#player2" ).outerWidth(true);
    var player2Position = {left: x1, top: y1, height: h1, width: w1};
    
    // transmission de la position du player, à chaque déplacement, au thread food
	foodWorker.postMessage({type: 'updatePlayer2Po', position: player2Position});
}, vitesse);


function main(){

	/*$( "#wplayer1" ).animate(
			player.deplacement , 1, function() {
	});
	*/
	/*$( "#wplayer1" ).animate(
			player.size, 1, function() {
	});*/
	$( "#player1" ).css( "width", player1.size.width).css( "height", player1.size.height).css(player1.deplacement);
	$( "#player2" ).css( "width", player2.size.width).css( "height", player2.size.height).css(player2.deplacement);
}
  
onkeydown = function(e){
    e = e || event;
    if(jQuery.inArray(e.keyCode, keysAllowed ) != -1){
        if(e.keyCode == 27){
        	clearInterval(avancer);
        	foodWorker.postMessage({type: 'stop'});
        }else if(jQuery.inArray(e.keyCode, keysPlayer1 ) != -1){
        	wplayer1.postMessage({type: 'updateDirection', key: e.keyCode});
        }else if(jQuery.inArray(e.keyCode, keysPlayer2 ) != -1){
        	wplayer2.postMessage({type: 'updateDirection', key: e.keyCode});
        }
    };
    
};

wplayer1.onmessage=function(event){
	var value = event.data; 
	if(value){
		if(value.type === 'updatePlayer1'){
			player1 = value.player;
		}	
	}
};


wplayer2.onmessage=function(event){
	var value = event.data; 
	if(value){
		if(value.type === 'updatePlayer1'){
			player2 = value.player;
		}	
	}
};

foodWorker.onmessage=function(event){
	var value = event.data;
	if(value){
		if(value.type === 'collision'){
			console.log(value.divId);
			$('#' + value.divId).remove();
		}else if(value.type === 'foodTimeLeft'){
			$('#' + value.divId).fadeOut('slow', function(){
				$('#' + value.divId).remove();
			});
			
		}else if(value.type === "addNewFood"){
			$('#map').append(value.html);
			$('#' + value.divId).fadeIn();
		}else if(value.type === "playerSizeUpdate"){
			console.log(value.nomPlayer);
			if(value.nomPlayer === "Player1"){
				
				wplayer1.postMessage({type: 'updateSize', newSize: value.newPlayerSize});
			}
			if(value.nomPlayer === "Player2"){
				
				wplayer2.postMessage({type: 'updateSize', newSize: value.newPlayerSize});
			}
		}
	
	}
};