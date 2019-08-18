let winningColour = "rgb(70, 130, 180)";
let previousColour = winningColour;
let gameOver = false;

let square = [];
let levels = [];


init();

function init(){
    
    DifficultyLevel.currentLevel = 1;
    DifficultyLevel.levelAmount = $("#stripe .level").length;
    const maxLevel = DifficultyLevel.levelAmount - 1;
    if(DifficultyLevel.currentLevel < 0 || DifficultyLevel.currentLevel > maxLevel) {
        console.log("Initialise difficulty level to any number between 0 and " + maxLevel)
        DifficultyLevel.currentLevel = 0;
    }


   let activeSquares =  (DifficultyLevel.currentLevel + 1) * 3;
   checkWindowSize();
   generateDiffLevels(maxLevel);
   generateLevel(activeSquares);
   generateCallbacks();

}

function generateDiffLevels(max){
    for (let i = 0; i <= max; i++)
    {
        levels.push(new DifficultyLevel(i, (i+1)*3))
    }
}

function generateLevel(activeAmount) {

    $("#reset").text("NEW COLORS");
    $("#feedback").text("");
    $(".jumbotron").css("background-color", winningColour);

    generateSquareElements(activeAmount);
    for (let i = 0; i < activeAmount; i++)
    {
            let stringColour = generateRandCol();
            square[i] = new Square(i, stringColour, true);
            square[i].setColor();
    }
    getWinner(activeAmount);
    resetButtons(false);
}

function generateSquareElements(activeAmount) {
    $(".square").stop(false, true);

    let squaresAmount = $(".square").length;
    let diff = activeAmount - squaresAmount; 
    if(diff > 0)
        addSquareElements(diff);

    else if (diff < 0) {
        diff = Math.abs(diff);
        deleteSquareElements(diff, squaresAmount);
    }
}

function addSquareElements(amountToDel) {
    for(let i = 0; i < amountToDel; i++)
    {
        let newSquare = ("<div class='square'></div>")
        $(newSquare).hide().appendTo(".container").fadeIn("fast");
    }
}

function deleteSquareElements(amountToDel, squareAmount) {
    for(let i = 0; i < amountToDel; i++)
    {
        $(".square").eq(squareAmount-1 - i).css("background-color", "rgb(35, 35, 35)");
        $(".square").eq(squareAmount-1 - i).fadeOut(400, function() {
            $(this).remove();
        });
    }
    
}

function generateRandCol() {
   
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return ("rgb(" + r + ", " + g + ", " + b + ")");
}



function DifficultyLevel(level, active) {

    this.buttonID = level;
    this.activeSquaresLvl = active;
    this.button = $(".level").eq(level);

    this.changeLevel = function(lastLevel) {
        let selected = this.button.hasClass("selected");
        if(!selected)
        {
            gameOver = false;
            activeSquares = this.activeSquaresLvl;
            $(".level").eq(lastLevel).removeClass("selected");
            $(".level").eq(lastLevel + DifficultyLevel.levelAmount).removeClass("selected");
            DifficultyLevel.currentLevel = this.buttonID;
            $(".level").eq(this.buttonID + DifficultyLevel.levelAmount).addClass("selected");
            this.button.addClass("selected");
            generateLevel(activeSquares);
        }   
    }
}

function Square(id, colour, active) {
    this.colour = colour;
    this.active = active;
    this.winner = false;
    this.sqr =  $(".square").eq(id);
    
    this.setColor = function() {
        if(!gameOver)
            this.sqr.css("background-color", this.colour);
        else
            this.sqr.css("background-color", winningColour);
    }
    this.checkWin = function() {
        if(!this.winner)
        {
            $("#feedback").text("Try Again!");
            this.sqr.css("background-color", "rgb(35, 35, 35)");
            this.active = false;
        }
        else
            gameWon(levels[DifficultyLevel.currentLevel].activeSquaresLvl);
    }
    this.reset = function() {
        this.colour = "rgb(35, 35, 35)";
        this.sqr.css("background-color", "rgb(35, 35, 35)");
        this.active = false;
    }
}

function getWinner(activeAmount){
    let random = Math.floor(Math.random() * activeAmount);
    square[random].winner = true;
    previousColour = winningColour;
    winningColour = square[random].colour;
    $("#rgbText").text(winningColour);
}

function gameWon(activeAmount) {

    $("#reset").text("PLAY AGAIN?");
    $("#feedback").text("Correct!");
    $(".jumbotron").css("background-color", winningColour);
    gameOver = true;

    for (let i = 0; i < activeAmount; i++)
    {
        square[i].setColor();
    }

    resetButtons(true);
}

function resetButtons(won) {
    let colour = (won) ? winningColour : previousColour;
    $("button").css("background-color", "rgb(255, 255, 255)");
    $("button").css("color", colour);
    $(".selected").css("background-color", colour);
    $(".selected").css("color", "rgb(255, 255, 255)");
}

function checkWindowSize() {

    let bodyWidth = $("body").width();
    if(bodyWidth < 575)
    {
        screenWidth = bodyWidth;
        $("#stripe .level").addClass("hidden");
        $("#menuButton").removeClass("hidden");  
        $("#menuButton").addClass("displayMenuBttn");          
    }
    else
    {
        $("#stripe .level").removeClass("hidden");
        $("#menuButton").removeClass("displayMenuBttn");  
        $("#menuButton").addClass("hidden");             
    }

}


function generateCallbacks() {
    $(".container").on("click", ".square", function() {
        let no = $(this).index();
        if(!gameOver && square[no].active)
            square[no].checkWin();
    });
    
    $("#reset").on("click", function() {
        gameOver = false;
        generateLevel(levels[DifficultyLevel.currentLevel].activeSquaresLvl);
    });
    

    $(".menu").on("click", ".level", function() {
        let no = $(this).index(".level");
        no = no % DifficultyLevel.levelAmount;
        levels[no].changeLevel(DifficultyLevel.currentLevel);
    });

    
    $("button").on("mouseenter", function() {
        if(!gameOver)
        {
            $(this).css("background-color", previousColour);
            $(this).css("color", "rgb(255, 255, 255)");
        }
        else
        {
            $(this).css("background-color", winningColour);
            $(this).css("color", "rgb(255, 255, 255)");       
        }
    });
    
    $("button").on("mouseleave", function() {
        if($(this).hasClass("selected")) {
            
        }
        else if(!gameOver)
        {
            $(this).css("background-color", "rgb(255, 255, 255)");
            $(this).css("color", previousColour);
        }
        else
        {
            $(this).css("background-color", "rgb(255, 255, 255)");
            $(this).css("color", winningColour);       
        }
    });    

    $("#menuButton").on("click", function() {
        $("#dropdown").slideToggle();
    });

    $("#dropdown .level").on("click", function() {
        $("#dropdown").slideToggle();
    });

    $( window ).resize(function() {
        checkWindowSize();
    });
}