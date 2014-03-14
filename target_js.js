/*

    LEVEL 1 - 3 still circles on canvas.

*/

var paused = false;
// Array to store x pos to stop overlap
var xPosition = [];
var backLayer;
var animals = [];

window.onload = function() {

    var t = window;
    var numAnimals = 3;
    var text;
    var attempts = 0;
    var score = 0;
    var stage;
    var cow;
    var hit = false;
    var screenwidth = $( window ).width();
    var screenheight = $( window ).height();
    var canvas = $('#theCanvas')[0];
    var context = canvas.getContext('2d');
    var images = [];
    
    var configFile;
    var currentLevel = 0;

    function init()
    {
        context.canvas.height = screenheight;
        context.canvas.width = screenwidth      

        $('#theCanvas').mousedown(function (e) {
            var theCanvas = this;
            canvasHit(e, theCanvas)
        }); 

        setupGame();    
    }

    function canvasHit(e, theCanvas)
    {
        
        var c = theCanvas.getContext('2d');

        if(!paused)
        {
            attempts+=1;
            if(checkIfHit(e, theCanvas))
            {
                hit = false;
                score+=1;
                console.log(score)
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
    }

    function gameLoop() {
        var t = window;
        canvas.width = canvas.width;

        window.requestAnimationFrame(gameLoop);
        context.fillStyle = "red";
        context.font = "bold 42px Arial";
        context.fillText("Score: " + score, 10, 40);
        //update cows and draw layer

        for(var i = 0; i < animals.length; i++)
        {
            var myInt = i;
            animal = animals[myInt];
            var x = animals[myInt].x;
            var y = animals[myInt].y;

            animal.x += animal.xunits;
            animal.y += animal.yunits;

            //left or right
            if (animal.x > (screenwidth - animal.width)) {
                animal.angle = 180 - animal.angle;
              //  animal.cow.setScale({x:1});
            }else if(animal.x <= 0){
                animal.angle = 180 - animal.angle;
                flipped = true;
              // animal.cow.setScale({x:-1});
            }
            
            // up or down
            if (animal.y  > (screenheight - animal.height) || animal.y <= 0) {
                animal.angle = 360 - animal.angle;
            }
        
            animal.radians = animal.angle * Math.PI / 180;
            animal.xunits = Math.cos(animal.radians) * animal.speed;
            animal.yunits = Math.sin(animal.radians) * animal.speed;
            context.drawImage(images[i], animal.x, animal.y);

        }

    }

    function restartGame(){
        score = 0;
        attempts = 0;
        animals=[];
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
        $.getJSON("config.json", function(json) {
            config = json;

            // console.log(config);

            for (var i = 0; i < config.levels[currentLevel].animals.length; i++) {
                // var speed = 0.9;
                var levelAnimal = config.levels[currentLevel].animals[i];
                var configAnimal = config.animals[levelAnimal.name];
                
                console.log(configAnimal);

                images[i] = new Image();
                images[i].src = configAnimal.image;
                images[i].onload = drawAnimal(configAnimal, levelAnimal);
            }
            gameLoop();
        });
    }

    function drawAnimal(configAnimal, levelAnimal) {
    console.log(configAnimal);
    console.log(levelAnimal);
    // image.src = config.animals[config.levels[currentLevel].animals[i].name].image;

    var angle = Math.floor(Math.random() * 360);
    var radians = angle * Math.PI / 180;
    var animal = {
        x: 0,
        y: 0,
        height: 158,
        width: 191,
        speed: levelAnimal.speed,
        angle: angle,
        xunits: Math.cos(radians) * levelAnimal.speed,
        yunits: Math.sin(radians) * levelAnimal.speed
    };
    
    animal.x = Math.floor((Math.random() * ((screenwidth - animal.width) - animal.width)) + animal.width);
    animal.y = Math.floor((Math.random() * ((screenheight - animal.height) - animal.height)) + animal.height);
    

    //if((angle >= 0 && angle < 90) || (angle >= 270 && angle <= 360))
    //{
    //    animal.cow.setScale({x:-1});
    //}
    //else if((angle >= 90 && angle < 180) || (angle >= 180 && angle < 270))
    //{
    //    animal.cow.setScale({x:1});
    //}
    animals.push(animal);
}

    init()
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
    for (var i = 0; i < animals.length; i++) {
        console.log("here")
      if (mouseX >= animals[i].x && mouseX <= (animals[i].x + animals[i].width) ) {
            console.log("hit")
            var imgd = c.getImageData(mouseX, mouseY, theCanvas.width, theCanvas.height);
            var alpha = imgd.data[3];
            console.log(alpha)

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
