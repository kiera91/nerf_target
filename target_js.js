/*

    LEVEL 1 - 3 still circles on canvas.

*/

var paused = false;
// Array to store x pos to stop overlap
var xPosition = [];
var backLayer;
var balls = [];

window.onload = function() {

    var t = window;
    var radius = 150;
    var numBalls = 3;
    var text;
    var attempts = 0;
    var score = 0;
    var stage;
    var cow;
    var hit = false;
    var screenwidth = $( window ).width();
    var screenheight = $( window ).height();

    var image = new Image();
    image.src = "images/cow.png";
    image.onload = function () {
        setupGame();    
    }  
    
    function gameLoop() {
        var t = window;

        window.requestAnimationFrame(gameLoop);

        //update cows and draw layer
        t.backLayer.clear();
        for(var i = 0; i < balls.length; i++)
        {
            var myInt = i;
            ball = balls[myInt];
            var x = balls[myInt].x;
            var y = balls[myInt].y;

            ball.x += ball.xunits;
            ball.y += ball.yunits;

            //left or right
            if (ball.x > (screenwidth - ball.radius)) {
                ball.angle = 180 - ball.angle;
                ball.cow.setScale({x:1});
            }else if(ball.x < ball.radius){
                ball.angle = 180 - ball.angle;
                ball.cow.setScale({x:-1});
            }
             
            // up or down
            if (ball.y  > (screenheight - ball.radius) || ball.y < ball.radius) {
                ball.angle = 360 - ball.angle;
            }
        
            ball.radians = ball.angle * Math.PI / 180;
            ball.xunits = Math.cos(ball.radians) * ball.speed;
            ball.yunits = Math.sin(ball.radians) * ball.speed;
            ball.cow.setPosition({x:ball.x, y:ball.y});
        }
        t.backLayer.draw();
    }

    function restartGame(){
        score = 0;
        attempts = 0;
        stage.removeChildren();
        balls=[];
        setupGame();
    }

    function setDirection(object)
    {

    }

    function playAudio(audiofile)
    {
        var sound = new Audio("sounds/" + audiofile);
        sound.play();
    }

    function setupGame(){

        stage = new Kinetic.Stage({
            container: 'container',
            width: screenwidth,
            height: screenheight,
            listening: true
        });

        t.backLayer = new Kinetic.Layer();
        stage.add(t.backLayer);

        text = new Kinetic.Text({
            x: 10,
            y: 10,
            fontFamily: 'Calibri',
            fontSize: 24,
            text: 'Score: 0',
            fill: 'black'
        });

        t.backLayer.add(text);


        for (var i = 0; i < numBalls; i++) {
            var speed = 3;
            var x = Math.floor((Math.random() * ((screenwidth - radius) - radius)) + radius);
            var y = Math.floor((Math.random() * ((screenheight - radius) - radius)) + radius);

            var angle = Math.floor(Math.random() * 360);
            var radians = angle * Math.PI / 180;
            var ball = {
                x: x,
                y: y,
                height: 158,
                width: 191,
                radius: radius,
                speed: speed,
                angle: angle,
                xunits: Math.cos(radians) * speed,
                yunits: Math.sin(radians) * speed,
                cow: null
            };

            ball.cow =  new Kinetic.Rect({
                        x: 250,
                        y: 40,
                        width:191,
                        height:158,
                        fillPatternImage: image
                        // fill: '#FF0000'
                    });

            t.backLayer.add(ball.cow);
            if((angle >= 0 && angle < 90) || (angle >= 270 && angle <= 360))
            {
                ball.cow.setScale({x:-1});
            }
            else if((angle >= 90 && angle < 180) || (angle >= 180 && angle < 270))
            {
                ball.cow.setScale({x:1});
            }
            balls.push(ball);
        }     
    
    $('#container canvas').mousedown(function (e) {
        var theCanvas = this;
        if(!paused)
        {
            attempts+=1;
            if(checkIfHit(e, theCanvas))
            {
                hit = false;
                score+=1;
                text.setText('Score: ' + score);
                backLayer.draw();
            }

            if(attempts == 3)
            {
                if(score == 3)
                {
                    playAudio("ohyeah.mp3");
                }
                else if(score == 0){
                    playAudio("nooo.ogg");
                }
                restartGame();
            }
        }
        else{
            hit = false;
        }  
    });     
    // GO!
    gameLoop();
    }
}

function findPos(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            x: curleft,
            y: curtop
        };
    }
    return undefined;
}

function checkIfHit(e, theCanvas)
{
    var pos = findPos(theCanvas);
    var mouseX = e.pageX - pos.x;
    var mouseY = e.pageY - pos.y;
    var c = theCanvas.getContext('2d');
    for (var i = 0; i < balls.length; i++) {
      if (mouseX >= balls[i].x && mouseX <= (balls[i].x + balls[i].width) ) {
            var imgd = c.getImageData(mouseX, mouseY, theCanvas.width, theCanvas.height);
            var alpha = imgd.data[(mouseY*theCanvas.width+mouseX)*4+3];
            if(alpha != 0){
                return true
            }
            else{
                return false;
            }
      }
    }
}

function setPaused()
{
    if(paused){
        paused = false;
        $('#paused').prop('value', 'Pause Game');;
    }
    else{
        paused = true;
        $('#paused').prop('value', 'Carry On');
    }
        
}

function checkOverlap(current)
{
    console.log("current1: " + current)
    $.each(xPosition, function(index, value){
        value = value + 100;
        console.log("v: " + value)
        value1 = value - 100;
        if(current <= value && current >= value1)
        {
            console.log('current: ' + current)
            console.log('OVERLAP');
        }
    });
}
