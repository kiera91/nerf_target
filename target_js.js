/*

    LEVEL 1 - 3 still circles on canvas.

*/

var paused = false;
// Array to store x pos to stop overlap
var xPosition = [];
var backLayer;

window.onload = function() {

    var t = window;
    var balls = [];
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

    // load the ball image and create the Kinetic.Shape
    function mouseDownCowTrigger() {
        hit = true;
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

            if (ball.x > (screenwidth - ball.radius) || ball.x < ball.radius) {
                ball.angle = 180 - ball.angle;
            }
             
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
            var speed = 0.9;
            var x = Math.floor((Math.random() * ((screenwidth - radius) - radius)) + radius);
            var y = Math.floor((Math.random() * ((screenheight - radius) - radius)) + radius);

            var angle = Math.floor(Math.random() * 360);
            var radians = angle * Math.PI / 180;
            var ball = {
                x: x,
                y: y,
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
                    });

            ball.cow.on('mousedown touchstart', function(e) {
                var x = mousePos.x;
                var y = mousePos.y;
                var node = e.targetNode;
                var nodeID = node.getName();
                if (nodeID !== 'bg') {
                    target = node;
                } else {
                    target = empty;
                }
                // if (isTransparentUnderMouse(hitCow, e))
                // {
                //     console.log("IT IS TRANSPARENT")
                // }
                // else{
                //     console.log("SOMETHING")
                //     mouseDownCowTrigger();
                // }
            });

            t.backLayer.add(ball.cow);

            balls.push(ball);
        }     
    
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

// var isTransparentUnderMouse = function (target, evnt) {
//     var l = 0, p = 0;
//     var theShape = evnt.targetNode;
//     console.log(theShape)
//     if (target.offsetParent) {
//         var ele = target;
//         do {
//             l += ele.offsetLeft;
//             p += ele.offsetTop;
//         } while (ele = ele.offsetParent);
//     }
//     var x = evnt.x - l;
//     var y = evnt.y - p;
//     var imgdata = target.getContext('2d').getImageData(x, y, 1, 1).data;
//     console.log(imgdata)
//     if (
//         imgdata[0] == 0 &&
//         imgdata[1] == 0 &&
//         imgdata[2] == 0 &&
//         imgdata[3] == 0
//     ){
//         return true;
//     }
//     return false;
// };

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
