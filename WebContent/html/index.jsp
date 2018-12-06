<!DOCTYPE html>
<html>
<head>
	<title>Meine Webseite</title>
	<link rel="stylesheet" type="text/css" href="../../html/css/design.css">
	<script type="text/javascript" src="../../html/js/shape.js"></script>
	<script type="text/javascript" src="../../html/js/main.js"></script>
</head>
<body>
	<div id="webseite">
		<div id="header">
			<h1>Webprogrammierung - Zeichen Programm</h1>
		</div>
		<div id="main">
			<div id="left">
				<div id="drawOption">
					<input class="myButton" type="button" name="fname" value="Red" onclick="setCurrentColor('#ff0000');">
					<input class="myButton" type="button" name="fname" value="Green" onclick="setCurrentColor('#00ff00');">
					<input class="myButton" type="button" name="fname" value="Blue" onclick="setCurrentColor('#0000ff');">
					<input class="myButton" type="button" name="fname" value="Circle" onclick="setShape('circle');">
					<input class="myButton" type="button" name="fname" value="Rectangle" onclick="setShape('rect');">
				</div>
				<div id="settings">
					<input id="btnrobot" type="button" value="activate robot" onclick="startRobot();">
					<a href="#" class="button" id="btn-download" download="file.png">Download</a>
				</div>
			</div>
			<div id="middle">
				<canvas id="myCanvas" onclick="draw(event);"></canvas>
			</div>
			<div id="right">
				<textarea onkeyup="getLineNumber(this, document.getElementById('lineNo'));" onmouseup="this.onkeyup();" id="log"></textarea>
				<!--<input type="button" value="delete" onclick="deletelogitem(getLineNumber(document.getElementById('log'), 'lineNo'),document.getElementById('log'));"/>
				-->
				<input type="button" value="delete" onclick="sendDeleteRequest();"/>
				<input type="button" value="delete older" onclick="deleteOlder();"/>
				<input type="button" value="delete newer" onclick="deleteNewer();"/>
			</div>
			
		</div>
		<div id="footer">
			<textarea id="chat" readonly></textarea>
			<input type="text"  id="text"/>
			<input type="button" id="chatbutton" value="send" onclick="sendMessage();"/>
		</div>
	</div>
	<!--<div id="lineNo"></div>-->
	<script type="text/javascript">
		init();
		(function() {
		    // resize the canvas to fill browser window dynamically
		    window.addEventListener('resize', resizeCanvas, false);

		    function resizeCanvas() {
		        canvas.width = window.innerWidth;
		        canvas.height = window.innerHeight;

		        /**
		         * Your drawings need to be inside this function otherwise they will be reset when
		         * you resize the browser window and the canvas goes will be cleared.
		         */
		        //draw(event);
		    }
		    resizeCanvas();

		})();
	</script>
</body>
</html>