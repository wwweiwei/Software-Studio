  var canvas = document.getElementById('art');
	var ctx = canvas.getContext('2d');
	
	var colors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'black', 'white', 'ebebeb'];
	var currentColorsIndex=0;
	
	var size = [1, 3, 5, 10, 15, 20];
	var currentSizesIndex=0;
	var sizeNames = ['default', 'three', 'five', 'ten', 'fifteen', 'twenty'];
	const selectedBorder="inset";
	const nonselectedBorder="outset";
	
	var textBuffer = '';
	var mousePos;
	var startMousePos;
	var lastMousePos;
	var lastStroke;
	var imgDataStackBack = [];
  var imgDataStackForward = [];
  var imgDataBeforeDraw;

  var myFont = "Arial";
  var myFontSize = "30px";
  var myFontWeight = "500";
	
	document.getElementById("line").style.border = selectedBorder;
  document.getElementById("red").style.border = selectedBorder;
  document.getElementById("default").style.border = selectedBorder;
  ctx.strokeStyle=ctx.fillStyle=colors[0];
	ctx.lineWidth=size[0];
	
	document.addEventListener('keydown', function(evt) {
        if(drawType == DrawTypeEnum.text) {
          //for undo
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          imgDataStackBack.push(imgData);
		  
          var charCode = evt.which;
          textBuffer += String.fromCharCode(charCode);
          //console.log(String.fromCharCode(charCode));
          ctx.fillStyle = ctx.strokeStyle;
          
          ctx.font = myFontWeight +" "+myFontSize + " " + myFont;
          //console.log(ctx.font);
          ctx.fillText(textBuffer, mousePos.x, mousePos.y);
		    }
	}, false);
	
	canvas.addEventListener('mousedown', function(evt) {
      mousePos = startMousePos = lastMousePos = getMousePos(canvas, evt);
      textBuffer = "";
      //for undo
      imgDataBeforeDraw = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imgDataStackBack.push(imgDataBeforeDraw);
      
      if(drawType == DrawTypeEnum.line || drawType == DrawTypeEnum.eraser) {
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
      }

      evt.preventDefault();
      canvas.addEventListener('mousemove', mouseMove, false);
	});

	canvas.addEventListener('mouseup', function() {
	  if(drawType == DrawTypeEnum.line || drawType == DrawTypeEnum.eraser) ctx.closePath();
	  canvas.removeEventListener('mousemove', mouseMove, false);
	});
	
	for(var i = 0; i < colors.length; i++) {
	  colorListener(i);
	}

	for(var i = 0; i < size.length; i++) {
	  fontSizeListener(i);
	}	

var DrawTypeEnum = Object.freeze({"line":"line", "text":"text", "rect":"rect",  "rect2":"rect2","oval":"oval","oval2":"oval2","tri":"tri",
  "eraser":"eraser"});
var drawType=DrawTypeEnum.line;
var ctxImageStack=[];

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  //console.log("Left: " + rect.left + ", Top: " + rect.top + ", Width: " + rect.width + ", Height: " + rect.height); 
  //console.log("clientX: " + evt.clientX + ", clientY: " + evt.clientY); 
  
  return {
  x: evt.clientX - rect.left,
  y: evt.clientY - rect.top
  };
}

function mouseMove(evt) {
    var ctx = canvas.getContext('2d');
    mousePos = getMousePos(canvas, evt);
    
    switch(drawType) {
    case DrawTypeEnum.line:
    case DrawTypeEnum.eraser:
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
    break;
    case DrawTypeEnum.rect:
      var width;
      var height;
      ctx.putImageData(imgDataBeforeDraw,0,0);
      width = mousePos.x-startMousePos.x;
      height = mousePos.y-startMousePos.y;
			ctx.fillRect(startMousePos.x,startMousePos.y,width,height);
			ctx.stroke();
    break;
    case DrawTypeEnum.rect2:
      var width;
      var height;
      ctx.putImageData(imgDataBeforeDraw,0,0);
      width = mousePos.x-startMousePos.x;
      height = mousePos.y-startMousePos.y;
      var rectangle = new Path2D();
      rectangle.rect(startMousePos.x,startMousePos.y,width,height);
      ctx.stroke(rectangle);
    break;
    case DrawTypeEnum.oval:
      var width;
      var height;
      ctx.putImageData(imgDataBeforeDraw,0,0);
      width = mousePos.x-startMousePos.x;
      height = mousePos.y-startMousePos.y;
      var circle = new Path2D();
      circle.arc(startMousePos.x, startMousePos.y, parseInt(Math.sqrt(width*width+height*height)),0, 2 * Math.PI);
      ctx.fill(circle);
      break;
    case DrawTypeEnum.oval2:
      var width;
      var height;
      ctx.putImageData(imgDataBeforeDraw,0,0);
      width = mousePos.x-startMousePos.x;
      height = mousePos.y-startMousePos.y;
      var circle = new Path2D();
      circle.arc(startMousePos.x, startMousePos.y, parseInt(Math.sqrt(width*width+height*height)),0, 2 * Math.PI);
      ctx.stroke(circle);
      break;
    case DrawTypeEnum.tri:
      var width;
      var height;
      ctx.putImageData(imgDataBeforeDraw,0,0);
      width = mousePos.x-startMousePos.x;
      height = mousePos.y-startMousePos.y;
      var ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(width,height);
      ctx.lineTo(startMousePos.x, startMousePos.y);
      ctx.lineTo(startMousePos.x+50, startMousePos.y);
      ctx.fill();
    break;
    }
    //console.log(startMousePos.x," ",startMousePos.y," ",lastMousePos.x," ",lastMousePos.y," ",mousePos.x," ",mousePos.y);
    lastMousePos = mousePos;
}

function colorListener(i) {
  var canvas = document.getElementById('art');
    var ctx = canvas.getContext('2d');
  document.getElementById(colors[i]).addEventListener('click', function() {
    document.getElementById(colors[currentColorsIndex]).style.border = nonselectedBorder;
  if (drawType!=DrawTypeEnum.eraser) {ctx.strokeStyle = ctx.fillStyle = colors[i];}
  currentColorsIndex = i;
  document.getElementById(colors[currentColorsIndex]).style.border = selectedBorder;
  }, false);
}

function fontSizeListener(i) {
  var canvas = document.getElementById('art');
  var ctx = canvas.getContext('2d');
  document.getElementById(sizeNames[i]).addEventListener('click', function() {
  document.getElementById(sizeNames[currentSizesIndex]).style.border = nonselectedBorder;
  ctx.lineWidth=size[i];
  currentSizesIndex = i;
  document.getElementById(sizeNames[currentSizesIndex]).style.border = selectedBorder;
  }, false);
}

function clearCanvas() {
  var canvas = document.getElementById('art');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeDrawType(type) {
   document.getElementById(drawType).style.border = nonselectedBorder;
   drawType = type;
   document.getElementById(drawType).style.border = selectedBorder;
   ctx.strokeStyle = lastStroke;
   switch(drawType){
    case DrawTypeEnum.line:
    case DrawTypeEnum.rect:
    case DrawTypeEnum.rect2:
    case DrawTypeEnum.oval:
    case DrawTypeEnum.oval2:
    case DrawTypeEnum.tri:
      document.body.style.cursor = 'crosshair';
      break;
    case DrawTypeEnum.text:
      document.body.style.cursor = 'text';
      break;
    case DrawTypeEnum.eraser:
      lastStroke = ctx.strokeStyle;
      document.body.style.cursor = 'grabbing';
      ctx.strokeStyle = "white";
      break;
   }
}

function undo(){
  var c=document.getElementById("art");
  var ctx=c.getContext("2d");
  var oldImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (imgDataStackBack.length>0) {
    var imgData = imgDataStackBack.pop();
    imgDataStackForward.push(oldImageData);
    ctx.putImageData(imgData,0,0);
  }
  else
  alert("Nothing Undo");
}
function redo(){
  var c=document.getElementById("art");
  var ctx=c.getContext("2d");
  var oldImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (imgDataStackForward.length>0) {
  var imgData = imgDataStackForward.pop();
  imgDataStackBack.push(oldImageData);
  ctx.putImageData(imgData,0,0);
  }
  else
  alert("Nothing Redo");
}

download_img = function(el) {
  var image = canvas.toDataURL("image/jpg");
  el.href = image;
}

document.getElementById('inp').onchange = function(e) {
    var img = new Image();
    img.onload = function(e){
    var canvas = document.getElementById('art');
    //this.width = canvas.width;
    //this.height = canvas.height ;
    var ctx = canvas.getContext('2d');
    //ctx.scale(this.width/canvas.width, this.height/canvas.height);
    ctx.drawImage(this, 0,0,canvas.width,canvas.height);
  };
  img.onerror = function(e){
    console.error("The provided file couldn't be loaded as an Image media");
  };
  img.src = URL.createObjectURL(this.files[0]);
};

function changeFontType(){
  myFont = document.getElementById("mySelect").value;
}

var slider = document.getElementById("myRange");
slider.oninput = function() {
  //console.log(this.value);
  myFontSize = this.value +"px";
}

var slider = document.getElementById("myFontWeight");
slider.oninput = function() {
  //console.log(this.value);
  myFontWeight = this.value ;
}