
var foodList = [];
var increment = 1;

	
var genFood = setInterval(function(){
	
	var random = Math.random() * 10000;
	
	if(random < 5000){
		
		var pourcLeft = Math.floor(Math.random() * 1820) + 10; 
		var pourcTop = Math.floor(Math.random() * 1820) + 10;
		var size =  Math.floor(Math.random() * 12) + 5;
		var time = 120;	
		var id = 'food-' + increment;
		foodList.push({id: id, left: pourcLeft, top: pourcTop, timeLeft: time, size: size});	
		increment++;
	}
	postMessage({type: 'update', html: getHtml()});
	
	foodList = updateFoodList();
	
}, 250);


function updateFoodList(){
	
	var newList = [];
	
	foodList.forEach(function(food){
		food.timeLeft--;
		if(food.timeLeft > 0)
			newList.push(food);		
	});

	return newList;
}

function getHtml(){
	
	var html = '';
	
	foodList.forEach(function(food){
		
		html += '<div class="food" id="'+ food.id +'" style="left:' + food.left + 'px; top: '+ food.top + 'px; width:' + food.size + 'px; height:' + food.size + 'px;"></div>';
		
	});
	
	return html;
	
}

onmessage=function(event){
	
	var data = event.data;
	if (data.type === 'stop'){
    	clearInterval(genFood);
	}else if(data.type === 'playerPo'){
		var player = data.position;
		var safeFoodList = [];
		//console.log(player);
		foodList.forEach(function(food){
			
			if(collision(player, food)){
				console.log('collision');
				var size = {width: (food.size/4) + player.width, height: (food.size/4) + player.height};
				postMessage({type: 'collision', collision: 'true', size: size});
				
			}else{
				safeFoodList.push(food);
			}
		});
		foodList = safeFoodList;
		//console.log(event.data);
	}
}

function collision(player, food) {
    var x1 = player.left;
    var y1 = player.top;
    var h1 = player.height;
    var w1 = player.width;
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = food.left;
    var y2 = food.top;
    var h2 = food.size;
    var w2 = food.size;
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

