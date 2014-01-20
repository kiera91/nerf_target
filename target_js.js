/*

    LEVEL 1 - 3 still circles on canvas.

*/


window.onload = function() {
  
// var numBalls = 2;
// var maxSize = 8;
// var minSize = 5;
// var maxSpeed = maxSize + 20;
// var balls = [];
// var radius = 24;


// this is a custom Kinetic.Shape
var shape;
var text;
var attempts = 0;
var score = 0;
var stage;
var backLayer;
var hit = false;

// for (var i = 0; i < numBalls; i++) {
//     var speed = maxSpeed - radius;
//     var angle = Math.floor(Math.random() * 360);
//     var radians = angle * Math.PI / 180;
//     var ball = {
//         x: (cw - radius) / 2,
//         y: (ch - radius) / 2,
//         radius: radius,
//         speed: speed,
//         angle: angle,
//         xunits: Math.cos(radians) * speed,
//         yunits: Math.sin(radians) * speed
//     }

   
//     balls.push(ball);
// }

// load the ball image and create the Kinetic.Shape
function mouseDownTrigger() {
    hit = true;
}


    stage = new Kinetic.Stage({
        container: 'container',
        width: 1024,
        height: 1000,
    });

    backLayer = new Kinetic.Layer();

    for(var i = 1; i < 2; i++){
        (function() {

        text = new Kinetic.Text({
            x: 10,
            y: 10,
            fontFamily: 'Calibri',
            fontSize: 24,
            text: 'Score: 0',
            fill: 'black'
        });

        shape = new Kinetic.Shape({
        
            sceneFunc: function (context) {

                context.beginPath();
                context.fillStyle="#0000ff";
                // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
                context.arc(100,100,20,0,Math.PI*2,true); 
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
            name:'shape'
        });

        
        
        shape.on('mousedown', function() {
            mouseDownTrigger();
        });
  


        backLayer.add(text);
        backLayer.add(shape);
        stage.add(backLayer);
    }());

    
        stage.getContent().addEventListener('mousedown', function(e) {
               
            attempts+=1;

            if(hit == true){
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
       
        
        // stage.on('mousedown', function(evt) {
        //     console.log(this.attrs);
        //     if (this.attrs.name == 'backLayer') {
        //         console.log('yessss');
        //         // $.each(layer.get('.box'), function(index, box) {
        //         //     box.setScale(1);
        //         // });
        //         // layer.draw();
        //     }
        // });
    }

     // move node to top layer for fast drag and drop

    // GO!
   gameLoop();

// RAF used to repeatedly redraw the custom shape
function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    backLayer.clear();
    shape.draw();
    text.draw();
}

function restartGame(){
    score = 0;
    attempts = 0;
    setupGame();
}

function setupGame(){
    alert('pooy');
}


}