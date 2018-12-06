<!DOCTYPE html>
<html>
<head>
</head>
<body>
IMAGE:<br>
<canvas id="myCanvas" width="1080" height="1920"></canvas>

<script>
function init(){
	canvas = document.getElementById('myCanvas');
	ctx = canvas.getContext('2d');
	canvas.width = 1920;
	canvas.height = 1080;

    shapeList = [];   
    offsetX = canvas.offsetLeft;
    offsetY = canvas.offsetTop;
    
    var jsonobj = ${it.object};
    for(var i=0;jsonobj[i] !== undefined;++i){
    	console.log(jsonobj[i]);
    	shapeList.push(jsonobj[i]);
    }
    console.log(shapeList.length);
    drawAllShapes();
}

function drawAllShapes(){
//	console.log("drawshapes::::::");
	var tmpCanvas = document.createElement('canvas');
	tmpCanvas.width = canvas.width;
	tmpCanvas.height = canvas.height;
	var tmpCtx = tmpCanvas.getContext('2d');
	
	tmpCtx.fillStyle = '#ffffff';
	tmpCtx.fillRect(0,0,canvas.width,canvas.height);
    for(var i=0; i<shapeList.length;++i) {
    	tmpCtx.beginPath();
    	tmpCtx.fillStyle = shapeList[i].color;
        switch (shapeList[i].type) {
            case 'rect':
//                console.log(shapeList[i].x + " " + shapeList[i].y + " " + shapeList[i].x2 + " " + shapeList[i].y2);
                tmpCtx.fillRect(shapeList[i].x, shapeList[i].y, shapeList[i].x2 - shapeList[i].x, shapeList[i].y2 - shapeList[i].y);
                break;
            case 'circle':
//                console.log(shapeList[i].x + " " + shapeList[i].y + " " + shapeList[i].x2 + " " + shapeList[i].y2);
                var rad = Math.sqrt(Math.pow(shapeList[i].x2 - shapeList[i].x, 2) + Math.pow((shapeList[i].y2) - (shapeList[i].y), 2));
//                console.log(rad);
                tmpCtx.arc(shapeList[i].x, shapeList[i].y, rad, 0, 2 * Math.PI);
                break;
        }

        tmpCtx.fill();
    }
    
    
    function render(){
    	ctx.drawImage(tmpCanvas, 0, 0);
    	requestAnimationFrame(render);
    }
    render();
}

init();
</script>
</body>
</html>