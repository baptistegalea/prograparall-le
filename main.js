	/* keyCode
	 * 38 : haut
	 * 39 : droite
	 * 40 : bas
	 * 37 : gauche
	 */



// liste des touches autorisées //
var keysAllowed = [27, 38, 39, 40, 37];

var player1=new Worker("player1Worker.js");
//var player2=new Worker("player2Worker.js");
var foodWorker=new Worker("foodWorker.js");
var player = {
		deplacement: {left: "+=5"},
		vitesse: '30',
		size: {width:30, height: 30},
		direction: 'right'
};

var avancer = setInterval(function(){
	main();
	
		
	var x1 = $( "#player1" ).offset().left;
    var y1 = $( "#player1" ).offset().top;
    var h1 = $( "#player1" ).outerHeight(true);
    var w1 = $( "#player1" ).outerWidth(true);
    var playerPosition = {left: x1, top: y1, height: h1, width: w1};
    
    // transmission de la position du player, à chaque déplacement, au thread food
	foodWorker.postMessage({type: 'updatePlayerPo', position: playerPosition});
}, player.vitesse);


function main(){

	/*$( "#player1" ).animate(
			player.deplacement , 1, function() {
	});
	*/
	/*$( "#player1" ).animate(
			player.size, 1, function() {
	});*/
	$( "#player1" ).css( "width", player.size.width).css( "height", player.size.height).css(player.deplacement);

}
  
onkeydown = function(e){
    e = e || event;
    if(jQuery.inArray(e.keyCode, keysAllowed ) != -1){
        if(e.keyCode == 27){
        	clearInterval(avancer);
        	foodWorker.postMessage({type: 'stop'});
        }else{
        	var data = {snakeData: player, keyData: e.keyCode};
        	player1.postMessage(data);
        }    
    };
    
};

player1.onmessage=function(event){
	var value = event.data; 
	if(value){
		player = value;
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
			player.size = value.newPlayerSize;
		}
	
	}
};