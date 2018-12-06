var canvas;
var ctx;
var currentShape;
var shapeList;
var currentColor;
var offsetX;
var offsetY;
var tmpShape;
var clicked = 0;
var websocket;
var textArea;
var text;
var chatbutton;
var canvasSocket;
var log;
var logSocket;
var deleteSocket;
var robotActive = false;
var btnrobot;

function init(){
	canvas = document.getElementById('myCanvas');
	log = document.getElementById('log');
	textArea = document.getElementById('chat');
	chatbutton = document.getElementById('chatbutton');
	text = document.getElementById('text');
	text.addEventListener("keyup",function(event){
		if(event.keyCode === 13){
			chatbutton.click();
			textArea.scrollTop = textArea.scrollHeight - textArea.clientHeight;
		}
		
	});
	window.addEventListener('beforeunload', function(){
		textArea.value = "";
		log.value = "";
	}, false);
	ctx = canvas.getContext('2d');
    tmpShape = new shape();
    canvas.width = canvas.width - canvas.offsetLeft;
    canvas.height = canvas.height - canvas.offsetTop;
    websocket = new WebSocket("ws://195.37.49.24:80/wp_sose15_03/chat");
    websocket.onmessage = function processMessage(message){
    	textArea.value += message.data + "\n";
    };
    shapeList = [];
    canvasSocket = new WebSocket("ws://195.37.49.24:80/wp_sose15_03/draw/canv");
//    canvasSocket = new WebSocket("ws://localhost:8080/webdrawprog/draw/canv");
    canvasSocket.onmessage = function(event){
    	var obj = JSON.parse(event.data);
    	if(!obj.del){
		    if(!containsObject(obj, shapeList)){
		    	shapeList.push(obj);
		    }
	    	drawAllShapes();
    	}
    };
    
    logSocket = new WebSocket("ws://195.37.49.24:80/wp_sose15_03/draw/log");
    logSocket.onmessage = function(event){
//    	console.log('++++++++ log data: ' + event.data);
    	var obj = JSON.parse(event.data);
    	if(!obj.del)
    		log.value += obj.type + ": " + obj.time +"\n";
    };
    
    deleteSocket = new WebSocket("ws://195.37.49.24:80/wp_sose15_03/draw/delete");
    deleteSocket.onmessage = function(event){
    	var obj = JSON.parse(event.data);
    	if(obj.del){
    		deletelogitem(obj.line, log);
    	}
    };
	currentShape = 'rect';
	currentColor = '#ff0000';
	btnrobot = document.getElementById('btnrobot');
	setInterval(robot, (Math.random()*10000)+5);
    
    offsetX = canvas.offsetLeft;
    offsetY = canvas.offsetTop;
    
    var button = document.getElementById('btn-download');
    button.addEventListener('click', function (e) {
        var dataURL = canvas.toDataURL('image/png');
        button.href = dataURL;
    });
}

function sendMessage(){
	
	websocket.send(text.value);
	text.value = "";
}

function sendDeleteRequest(){
	var linenr = getLineNumber(document.getElementById('log'), 'lineNo');
//	console.log("+++++######### lineno: " + linenr);
	if(linenr > -1){
		var obj = new Object();
		obj.line = linenr;
		obj.del = true;
		deleteSocket.send(JSON.stringify(obj));
	}
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

function draw(event){

    tmpShape.clicked += 1;
    tmpShape.color = currentColor;
    tmpShape.type = currentShape;
    var pos = getMousePos(event);
//    console.log("func draw posx: " + pos.x + " posy " + pos.y + " currentshape: " + currentShape);
    if(tmpShape.clicked === 2){
        tmpShape.x2 = pos.x;
        tmpShape.y2 = pos.y;

        tmpShape.time = new Date().timeNow();
        
        //log.value += tmpShape.type + ": " + tmpShape.time + "\n";
        //logSocket.send(JSON.stringify(tmpShape.type + ": " + tmpShape.time + "\n"));
        
//        console.log('::::::: added shape ::::::');
        canvasSocket.send(JSON.stringify(tmpShape));
        tmpShape = new shape();
        drawAllShapes();
    }else {
        tmpShape.x = pos.x;
        tmpShape.y = pos.y;
    }

}

function startRobot(){
	robotActive = true;
	btnrobot.onclick = stopRobot;
	btnrobot.value = 'deactivate robot';
	
}

function stopRobot(){
	robotActive = false;
	btnrobot.onclick = startRobot;
	btnrobot.value = 'activate robot';
}

function robot(){
//	console.log("robot");
	if(robotActive){
		var shapetype = Math.floor((Math.random()*10)%2);
		var color = Math.floor((Math.random()*10)%3);
		console.log('shapetype: ' + shapetype + 'color: ' + color);
		
		var tmpShape = new shape();
		tmpShape.time = new Date().timeNow();
		tmpShape.color = '#ffff00';
		if(color === 0){
			tmpShape.color = '#ff0000';
		}else if(color === 1){
			tmpShape.color = '#00ff00';
		}else if(color === 2){
			tmpShape.color = '#0000ff';
		}
		switch(shapetype){
		case 0:
			var x2 = (Math.random()*canvas.width)%canvas.width;
			var y2 = (Math.random()*canvas.height)%canvas.height;
			console.log('rect: ' + x2 + ' ' + y2);
			var x = (Math.random()*canvas.width);
			var y = (Math.random()*canvas.height);
			tmpShape.x = x;
			tmpShape.y = y;
			tmpShape.x2 = x2;
			tmpShape.y2 = y2;
			tmpShape.type = 'rect';
			break;
		case 1:
			var r = (Math.random()*canvas.height)/4;
			var xr = ((Math.random()*canvas.width)+r)%(canvas.width-r);
			var yr = ((Math.random()*canvas.height)+r)%(canvas.height-r);
			tmpShape.x = xr;
			tmpShape.y = yr;
			tmpShape.x2 = xr+r;
			tmpShape.y2 = yr;
			tmpShape.type = 'circle';
			break;
		}
		canvasSocket.send(JSON.stringify(tmpShape));
	}
}

function downloadCanvas(link, filename) {
//	console.log("download");
	var dataURL = canvas.toDataURL();
    link.href = dataURL;
    link.setAttribute('href', dataURL.replace("image/png", "image/octet-stream"));
    link.download = filename;
}

function saveImage(){
    downloadCanvas(this, 'test.png');
}

function selectTextareaLine(tarea,lineNum) {
    lineNum--; // array starts at 0
    var lines = tarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = tarea.value.length;
    for(var x = 0; x < lines.length; x++) {
        if(x == lineNum) {
            break;
        }
        startPos += (lines[x].length+1);

    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}

function getLineNumber(textarea, indicator) {
    //indicator.innerHTML = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
//	textarea.focus();
	var lineno = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
	selectTextareaLine(log, lineno);
	if(!(textarea.selectionStart == textarea.selectionEnd) && textarea.selectionStart != undefined){
		return lineno;
	}else
		return -1;
}

function deleteOlder(){
	var lineNo = getLineNumber(document.getElementById('log'), 'lineNo');
	if(lineNo > -1){
		for(var i=(parseInt(lineNo)-1);i>=0;--i){
			var obj = new Object();
			obj.line = (i+1)%(lineNo+1);
			obj.del = true;
			deleteSocket.send(JSON.stringify(obj));
		}
	}
}

function deleteNewer(){
	var lineNo = getLineNumber(document.getElementById('log'), 'lineNo');
	if(lineNo > -1){
		for(var i=shapeList.length-1;i>=shapeList.length-parseInt(lineNo);--i){
			var obj = new Object();
			obj.line = i+1;
			obj.del = true;
			deleteSocket.send(JSON.stringify(obj));
		}
	}
}

function deletelogitem(lineNo, textarea){
//	console.log("delete log item");
	var startCharNo = 0;
	var endCharNo = 0;
	for(var i = 0, k = 0; k<lineNo-1; ++i){
		if(textarea.value.charAt(i) === "\n"){
			++k;
		}
		startCharNo++;
	}
	for(var i = 0, k = 0; k<lineNo; ++i){
		if(textarea.value.charAt(i) === "\n"){
			++k;
		}
		console.log(i + ' ' + k);
		endCharNo++;
	}
//	console.log("start: "+startCharNo+" end: "+endCharNo);
	var sub = textarea.value.substr(startCharNo, endCharNo).split("\n");
	textarea.value = textarea.value.replace(sub[0]+'\n','');
//	console.log(textarea.value);
//	console.log(":::: substring " + sub[0] + " shapelist length: " + shapeList.length);
	for(var i=0; i<shapeList.length;++i){
//		console.log("1: " + sub[0] + " 2: " + (shapeList[i].type + ": " + shapeList[i].time));
		if((shapeList[i].type + ": " + shapeList[i].time) === sub[0]){
			shapeList.splice(i,1);
			console.log("shape deleted");
		}
	}
//	console.log(":::::::::shapes after delete: " + shapeList.length + " :::::::");
	drawAllShapes();
}

Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function getMousePos(event){
    var rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX-rect.left)/(rect.right-rect.left)*canvas.width,
        y: (event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height
    };
}

function setCurrentColor(color){
    tmpShape.color = color;
    currentColor = color;
}

function setShape(type) {
	tmpShape.type = type;
	currentShape = type;
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

