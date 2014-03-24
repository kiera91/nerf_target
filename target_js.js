var xPosition = [];
var backLayer;
var animals = [];

window.onload = function() {
    var t = window;
    var text;
    var attempts = 0;
    var score = 0;
    var stage;
    var cow;
    var screenwidth = $(window).width();
    var screenheight = $(window).height();
    var canvas = $('#theCanvas')[0];
    var context = canvas.getContext('2d');
    var images = [];    
    var configFile;
    var currentLevel = 0;
    var loopCount;
    var target;

    function init()
    {
        context.canvas.height = screenheight;
        context.canvas.width = screenwidth      

        $('#theCanvas').mousedown(function (e) {
            var theCanvas = this;
            canvasHit(e, theCanvas)
        }); 

        setupGame();           
        gameLoop();
    }

    function canvasHit(e, theCanvas)
    {        
        // var c = theCanvas.getContext('2d');

        attempts += 1;

        if(checkIfHit(e, theCanvas))
        {
            score += 1;
        }

        if(attempts == 3)
        {
            if(score == 3) {
                playAudio("ohyeah.mp3");
            }
            else if(score == 0) {
                playAudio("nooo.ogg");
            }
            restartGame();
        }
    }

    function gameLoop() {
        var t = window;
        canvas.width = canvas.width;

        loopCount++;

        window.requestAnimationFrame(gameLoop);
        context.fillStyle = "red";
        context.font = "bold 30px Arial";
        context.fillText("Target: " + target, 10, 30);
        context.fillText("Score: " + score + "/" + attempts, 10, 60);

        for(var i = 0; i < animals.length; i++) {
            animal = animals[i];

            animal.x += animal.xunits;
            animal.y += animal.yunits;

            //left or right
            if (animal.x > (screenwidth - animal.width)) {
                animal.angle = 180 - animal.angle;
            } else if(animal.x <= 0){
                animal.angle = 180 - animal.angle;
                flipped = true;
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

    function setupGame() {
        loopCount = 0;

        screenwidth = $(window).width();
        screenheight = $(window).height();

        $.getJSON("config.json", function(json) {
            config = json;

            for (var i = 0; i < config.levels[currentLevel].animals.length; i++) {
                target = config.levels[currentLevel].maxClicks;

                var levelAnimal = config.levels[currentLevel].animals[i];
                var configAnimal = config.animals[levelAnimal.name];

                images[i] = new Image();
                images[i].src = configAnimal.image;
                images[i].onload = drawAnimal(configAnimal, levelAnimal);
            }            
        });
    }

    function drawAnimal(configAnimal, levelAnimal) {
        var angle = Math.floor(Math.random() * 360);
        var radians = angle * Math.PI / 180;
        var animal = {
            x: 1,
            y: 1,
            height: parseInt(configAnimal.height),
            width: parseInt(configAnimal.width),
            speed: levelAnimal.speed,
            angle: angle,
            xunits: Math.cos(radians) * levelAnimal.speed,
            yunits: Math.sin(radians) * levelAnimal.speed,
            sound: configAnimal.sound,
            name: levelAnimal.name
        };
        
        animal.x = Math.floor((Math.random() * ((screenwidth - animal.width) - animal.width)) + animal.width);
        animal.y = Math.floor((Math.random() * ((screenheight - animal.height) - animal.height)) + animal.height);
        
        animals.push(animal);
    }

    init();
}

function playAudio(audiofile)
{
    var sound = new Audio("sounds/" + audiofile);
    sound.play();
}

function findPos(obj) {
    var curleft = 0, curtop = 0;

    if (obj.offsetParent) {
        do 
        {
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
    // check reverse order as the last animal added to canvas is at the front
    for (var i = animals.length - 1; i >= 0; i--) {
        if (mouseX >= animals[i].x && mouseX <= (animals[i].x + animals[i].width) &&
            mouseY >= animals[i].y && mouseY <= (animals[i].y + animals[i].height)) {            
            var imgd = c.getImageData(mouseX, mouseY, theCanvas.width, theCanvas.height);
            var alpha = imgd.data[3];

            if (alpha != 0) {
                playAudio(animals[i].sound);
                return true;
            }
            else {
                return false;
            }
        }
    }
}