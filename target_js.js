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
    var configFile;
    var currentLevel = 0;
    var loopCount;
	var speedMult = 1;
    var target;

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

        setupGame();      
		gameLoop();
    }

    function canvasHit(e, theCanvas)
    {        
        e.preventDefault();
        if(e.which == 3)
        {
            console.log("which 3");
        }
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
        
            
			
			randomanimal = Math.floor(Math.random() * animals.length);
						
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

            context.drawImage(images[i], animals[i].x, animals[i].y);
			
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

    function setupGame()
     {
        $('#end').css('display', 'none');

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

    function drawAnimal(configAnimal, levelAnimal)
    {
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
                playAudio(animals[i].sound);
                return true;
            }
            else {
                return false;
            }
        }
    }
}