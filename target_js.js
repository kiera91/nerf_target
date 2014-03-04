/*

    LEVEL 1 - 3 still circles on canvas.

*/

var paused = false;
// Array to store x pos to stop overlap
var xPosition = [];


window.onload = function() {
  
    var maxSize = 8;
    var minSize = 5;
    var maxSpeed = maxSize + 20;
    var balls = [];
    var radius = 24;
    var numBalls = 1;
    var shape;
    var text;
    var attempts = 0;
    var score = 0;
    var stage;
    var backLayer;
    var hit = false;
    var screenwidth = $( window ).width();
    var screenheight = $( window ).height();

    setupGame();

    // load the ball image and create the Kinetic.Shape
    function mouseDownTrigger() {
        hit = true;
    }

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);
        backLayer.draw();
    }

    function restartGame(){
        score = 0;
        attempts = 0;
        stage.removeChildren();
        balls=[];
        setupGame();
    }

    function playAudio(audiofile)
    {
        var sound = new Audio("sounds/" + audiofile);
        console.log(sound);
        sound.play();
    }

    function setupGame(){

        stage = new Kinetic.Stage({
            container: 'container',
            width: screenwidth,
            height: screenheight,
        });

        backLayer = new Kinetic.Layer();

        text = new Kinetic.Text({
            x: 10,
            y: 10,
            fontFamily: 'Calibri',
            fontSize: 24,
            text: 'Score: 0',
            fill: 'black'
        });

        for (var i = 0; i < numBalls; i++) {
            var speed = maxSpeed - radius;
            var x = Math.floor(Math.random()*((screenwidth-100) - 100)+100);
            checkOverlap(x);
            xPosition[i] = x;
            var y = Math.floor(Math.random()*((screenheight-100) - 100)+100);
            //console.log("x: " + x);
            //console.log("y: " + y);
            var angle = Math.floor(Math.random() * 360);
            var radians = angle * Math.PI / 180;
            var ball = {
                x: x,
                y: y,
                radius: radius,
                speed: speed,
                angle: angle,
                xunits: Math.cos(radians) * speed,
                yunits: Math.sin(radians) * speed
            };
            balls.push(ball);
        }        

        for(var i = 0; i < balls.length; i++)
        {
            console.log("1: " + i);
           // (function() {
                var x = balls[i].x;
                var y = balls[i].y;
                console.log("1.5 " + i);
                var shape = new Kinetic.Shape({
                    sceneFunc: function (context) {
                        console.log("2: " + i);

                        console.log("3: " + i);
                        context.beginPath();
                        context.fillStyle="#0000ff";
                
                        // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
                        context.arc(x,y,100,0,Math.PI*2,true); 
                        context.closePath();
                        context.fill();
                   
                        var ball;
                        ball = balls[i];
                        console.log(i);
                        console.log(balls);
                        ball.x += ball.xunits;
                        ball.y += ball.yunits;
                        if (ball.x + ball.radius * 2 > cw || ball.x < 0) {
                            ball.angle = 180 - ball.angle;
                        } else if (ball.y + ball.radius * 2 > ch || ball.y < 0) {
                            ball.angle = 360 - ball.angle;
                        }
                        ball.radians = ball.angle * Math.PI / 180;
                        ball.xunits = Math.cos(ball.radians) * ball.speed;
                        ball.yunits = Math.sin(ball.radians) * ball.speed;
                        
                        context.closePath();
                        context.fillStrokeShape(this);
                    },
                    opacity: 0.8,
                    fill: '#00D2AF',
                    stroke: 'black',
                    strokeWidth: 4,
                    draggable:true,
                    name:'shape'
                });
                setTimeout(1000000)
                shape.on('mousedown', function() {
                    mouseDownTrigger();
                });
      
                console.log("done")
                backLayer.add(shape);
                
          //  }());
     
        }
            backLayer.add(text);
            stage.add(backLayer);
            stage.getContent().addEventListener('mousedown', function(e) {
                   
                if(!paused)
                {
                    attempts+=1;

                    if(hit == true)
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
                            playAudio("topscore.ogg");
                        }
                        else if(score == 0){
                            console.log('nooooo');
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
    $.each(xPosition, function(index, value){
        value=parseInt(value);
        if(current <= value+100 || current >= value-100)
        {
            console.log('current: ' + current)
            console.log('value: ' + value + " " + value+100)
            console.log('OVERLAP');
        }
    });
}
