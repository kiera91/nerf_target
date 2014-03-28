var animals = [];
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
var config;
var currentLevel = 0;
var loopCount;
var speedMult = 1;
var target;
var gameRunning = false;

function init()
{
    $('#beginning').css('display', 'none');
    context.canvas.height = screenheight;
    context.canvas.width = screenwidth      

    // $('#theCanvas').mousedown(function (e) {
    //     var theCanvas = this;
    //     canvasHit(e, theCanvas)
    //     return false;
    // }); 

    canvas.addEventListener("touchstart", function(e) {
        console.log("touched")
        var theCanvas = this;
        canvasHit(e, theCanvas)
    });

    $.getJSON("config.json", function(json) {
        config = json;
        setupGame();   
        gameLoop();   
    });
}

function setupGame()
 {
    $('#end').css('display', 'none');

    loopCount = 0;

    screenwidth = $(window).width();
    screenheight = $(window).height();        

    for (var i = 0; i < config.levels[currentLevel].animals.length; i++) {
        target = config.levels[currentLevel].maxClicks;

        var levelAnimal = config.levels[currentLevel].animals[i];
        var configAnimal = config.animals[levelAnimal.name];

        images[i] = new Image();
        images[i].src = configAnimal.image;
        images[i].onload = drawAnimal(configAnimal, levelAnimal);
    }

    gameRunning = true;
}

function gameLoop() {
    var t = window;
    canvas.width = canvas.width;

    loopCount++;
	
    window.requestAnimationFrame(gameLoop);
    context.fillStyle = "red";
    context.font = "bold 30px Arial";

    if(config.levels[currentLevel].mode == "removeall") {
        context.fillText("Allowed Attempts: " + target, 10, 30);
    } else {
        context.fillText("Target: " + target, 10, 30);
    }        
    context.fillText("Score: " + score + "/" + attempts, 10, 60);

    randomanimal = Math.floor(Math.random() * animals.length);

    for(var i = 0; i < animals.length; i++) {
        //animal = animals[i];

        animals[i].x += animals[i].xunits;
        animals[i].y += animals[i].yunits;

        //left or right
        if (animals[i].x > (screenwidth - animals[i].width)) {
            animals[i].angle = 180 - animals[i].angle;
        } else if(animals[i].x <= 0){
            animals[i].angle = 180 - animals[i].angle;
            flipped = true;
        }
        
        // up or down
        if (animals[i].y  > (screenheight - animals[i].height) || animals[i].y <= 0) {
            animals[i].angle = 360 - animals[i].angle;
        }
					
		if (loopCount % 200 == 0 && i == randomanimal) {
			if (animals[i].speed == 1) {
				speedMult = speedMult * Math.floor(Math.random() * 5) + 2;
				console.log("Faster! "  + speedMult + "x " + animals[i].name);
				console.log(randomanimal);
				animals[i].speed *= speedMult;
			}
			else {
				//speedMult = 1;
				animals[i].speed /= animals[i].speed;
				//animals[i].speed = animals[i].speed * speedMult;
				console.log("Slower... " + animals[i].name);
			}
			loopCount = 1;
			speedMult = 1;
			console.log(randomanimal);
		}

		animals[i].radians = animals[i].angle * Math.PI / 180;
		animals[i].xunits = Math.cos(animals[i].radians) * (animals[i].speed);
		animals[i].yunits = Math.sin(animals[i].radians) * (animals[i].speed);

        if(config.levels[currentLevel].mode == "removeall" && animals[i].hit) 
            continue;
        
        context.drawImage(images[i], animals[i].x, animals[i].y, animals[i].width, animals[i].height);			
    }       
}

function restartGame()
{
    score = 0;
    attempts = 0;
    animals=[];
    $('#end').css('display','inline-block');
    //setupGame();
}

function canvasHit(e, theCanvas)
{        
    e.preventDefault();
    // if(e.which == 3)
    // {
    //     console.log("which 3");
    // }
    // var c = theCanvas.getContext('2d');

    if(!gameRunning)
        return;

    attempts += 1;


    score += checkIfHit(e, theCanvas);
    // if(checkIfHit(e, theCanvas))
    // {
    //     score += 1;
    // }

    var allHit = false;
    if(config.levels[currentLevel].mode == "removeall")
    {
        allHit = true;
        for(var x=0; x < animals.length; x++)
        {
            if(!animals[x].hit)
            {
                allHit = false;
                break;
            }                
        }        
    }

    var timeOut = 1000;
    if(attempts == config.levels[currentLevel].maxClicks || allHit)
    {        
        gameRunning = false;
        if(score == config.levels[currentLevel].maxClicks || 
            (allHit && attempts == animals.length)) {
            setTimeout(function() {
                playAudio("ohyeah.mp3")
            }, timeOut);
        }
        else if(score == 0) {
            setTimeout(function() {
                playAudio("nooo.ogg")
            }, timeOut);
        }
        setTimeout(function() {
            restartGame()
        }, timeOut);
    }    
}

function drawAnimal(configAnimal, levelAnimal)
{
    var angle = Math.floor(Math.random() * 360);
    var radians = angle * Math.PI / 180;
    var animal = {
        x: 1,
        y: 1,
        height: parseInt(configAnimal.height)*levelAnimal.scale,
        width: parseInt(configAnimal.width)*levelAnimal.scale,
        speed: levelAnimal.speed,
        angle: angle,
        xunits: Math.cos(radians) * levelAnimal.speed,
        yunits: Math.sin(radians) * levelAnimal.speed,
        sound: configAnimal.sound,
        name: levelAnimal.name,
        hit: false
    };
    
    animal.x = Math.floor((Math.random() * ((screenwidth - animal.width) - animal.width)) + animal.width);
    animal.y = Math.floor((Math.random() * ((screenheight - animal.height) - animal.height)) + animal.height);
    
    animals.push(animal);
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
    var hitCount = 0;
    var pos = findPos(theCanvas);
    // var mouseX = e.pageX - pos.x;
    // var mouseY = e.pageY - pos.y;
    var mouseX = e.touches[ e.touches.length -1 ].pageX - pos.x;
    var mouseY = e.touches[ e.touches.length -1 ].pageY - pos.y;
    var c = theCanvas.getContext('2d');
    // check reverse order as the last animal added to canvas is at the front
    for (var i = animals.length - 1; i >= 0; i--) {
        if (mouseX >= animals[i].x && mouseX <= (animals[i].x + animals[i].width) &&
            mouseY >= animals[i].y && mouseY <= (animals[i].y + animals[i].height)) {            
            var imgd = c.getImageData(mouseX, mouseY, theCanvas.width, theCanvas.height);
            var alpha = imgd.data[3];

            if (alpha != 0) {
                animals[i].hit = true;
                playAudio(animals[i].sound);
                hitCount++;
            }
            else {
                // return false;
            }
        }
    }

    return hitCount;
}