	/* keyCode
	 * 38 : haut
	 * 39 : droite
	 * 40 : bas
	 * 37 : gauche
	 */



// liste des touches autorisées //
var keysAllowed = [27, 38, 39, 40, 37];

var snakeWorker=new Worker("snakeWorker.js");
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
    
	foodWorker.postMessage(playerPosition);
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
        	foodWorker.postMessage('stop');
        }else{
        	var data = {snakeData: player, keyData: e.keyCode};
        	snakeWorker.postMessage(data);
        }    
    };
    
};

snakeWorker.onmessage=function(event){
	var value = event.data; 
	if(value){
		player = value;
	}
};
foodWorker.onmessage=function(event){
	var value = event.data;
	if(value){
		if(value.collision){
			player.size = value.size;
		}else{
			if($('#map').html != value){
				$('.food').remove();
				$('#map').append(value);
			}

		}
	}
};