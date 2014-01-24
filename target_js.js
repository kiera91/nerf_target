/*

    LEVEL 1 - 3 still circles on canvas.

*/

window.onload = function() {
  
    var maxSize = 8;
    var minSize = 5;
    var maxSpeed = maxSize + 20;
    var balls = [];
    var radius = 24;
    var numBalls = 2;
    var shape;
    var text;
    var attempts = 0;
    var score = 0;
    var stage;
    var backLayer;
    var hit = false;

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

    function setupGame(){
        stage = new Kinetic.Stage({
            container: 'container',
            width: 1024,
            height: 1000,
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
            var x = Math.floor((Math.random()*1024)+1);
            var y = Math.floor((Math.random()*1000)+1);
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

        for(var i = 0; i < balls.length; i++){
            (function() {
                var x = balls[i].x;
                var y = balls[i].y;
                var shape = new Kinetic.Shape({
                    sceneFunc: function (context) {

                        context.beginPath();
                        context.fillStyle="#0000ff";
                
                        // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
                        context.arc(x,y,100,0,Math.PI*2,true); 
                        context.closePath();
                        context.fill();
                   
                        // var ball;
                        //     ball = balls[i];
                        //     ball.x += ball.xunits;
                        //     ball.y += ball.yunits;
                        //     if (ball.x + ball.radius * 2 > cw || ball.x < 0) {
                        //         ball.angle = 180 - ball.angle;
                        //     } else if (ball.y + ball.radius * 2 > ch || ball.y < 0) {
                        //         ball.angle = 360 - ball.angle;
                        //     }
                        //     ball.radians = ball.angle * Math.PI / 180;
                        //     ball.xunits = Math.cos(ball.radians) * ball.speed;
                        //     ball.yunits = Math.sin(ball.radians) * ball.speed;
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
      
                shape.on('mousedown', function() {
                    mouseDownTrigger();
                });
      
                
                backLayer.add(shape);
                
            }());
     
        }
            backLayer.add(text);
            stage.add(backLayer);
            stage.getContent().addEventListener('mousedown', function(e) {
                   
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
                    restartGame();
                }
            });     
        // GO!
    gameLoop();
    }
}