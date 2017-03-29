var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var width = ctx.canvas.clientWidth;
var height = ctx.canvas.clientHeight;
var numOfLines = 30;
var gridSize = Math.floor(width / numOfLines);
var gameOn = true;
var gameState = "input"; //input, display
var rec1 = false; //if player 1's move has been receieved
var rec2 = false; //if player 2's move has been received
var xstart = Math.floor(numOfLines*.75) * gridSize;
var ystart = Math.floor(numOfLines*0.5) * gridSize;
var input1;
var input2;
var xvel1 = 0;
var yvel1 = 0;
var xvel2 = 0;
var yvel2 = 0;
var x1 = xstart;
var y1 = ystart;
var x2 = xstart + gridSize;
var y2 = ystart;


function drawGrid() {
    //draws vertical lines
    for (i = 0; i <= width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }

    //draws horizontal lines
    for (i = 0; i <= height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.arc(x1, y1, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x2, y2, 2, 0, 2 * Math.PI);
    ctx.fill();
}

function updateCars(oldx, oldy, oldx2, oldy2){
    
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(oldx2, oldy2);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x1, y1, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x2, y2, 2, 0, 2 * Math.PI);
    ctx.fill();
}

function inputHandler(e){
    var evtobj = window.event? event : e;
    var unicode = evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var actualkey = String.fromCharCode(unicode);
    if (gameState === "input") {
        if (rec1 === false) {
            switch (actualkey) {
            case "w":
                input1 = "n";
                yvel1--;
                rec1 = true;
                break;
            case "a":
                input1 = "w";
                xvel1--;
                rec1 = true;
                break;
            case "s":
                input1 = "s";
                yvel1++;
                rec1 = true;
                break;
            case "d":
                input1 = "e";
                xvel1++;
                rec1 = true;
                break;
            case "q":
                input1 = "nw";
                xvel1--;
                yvel1--;
                rec1 = true;
                break;
            case "e":
                input1 = "ne";
                xvel1++;
                yvel1--;
                rec1 = true;
                break;
            case "z":
                input1 = "sw";
                xvel1--;
                yvel1++;
                rec1 = true;
                break;
            case "c":
                xvel1++;
                yvel1++;
                input1 = "se";
                rec1 = true;
                break;
            }
            document.getElementById("move1").innerHTML = input1;
        }
        if (rec2 === false) {
            switch (actualkey) {
            case "i":
                input2 = "n"; 
                yvel2--;
                rec2 = true;
                break;
            case "j":
                input2 = "w";
                xvel2--;
                rec2 = true;
                break;
            case "k":
                input2 = "s";
                yvel2++;
                rec2 = true;
                break;
            case "l":
                input2 = "e";
                xvel2++;
                rec2 = true;
                break;
            case "u":
                input2 = "nw";
                xvel2--;
                yvel2--;
                rec2 = true;
                break;
            case "o":
                input2 = "ne";
                xvel2++;
                yvel2--;
                rec2 = true;
                break;
            case "m":
                input2 = "sw";
                xvel2--;
                yvel2++;
                rec2 = true;
                break;
            case ".":
                input2 = "se";
                xvel2++;
                yvel2++;
                rec2 = true;
                break;
            }
            document.getElementById("move2").innerHTML = input2;
        }
        if(rec1 && rec2){
            gameState = "display";
        }
        document.getElementById("state").innerHTML = gameState;
    }
}
document.onkeypress = inputHandler;
drawGrid();

function run(){
    if (gameState === "input") {
        input1 = "";
        input2 = "";
    }
    if (gameState === "display"){
        var oldx = x1;
        var oldy = y1;
        var oldx2 = x2;
        var oldy2 = y2;
        
        x1 += xvel1 * gridSize;
        y1 += yvel1 * gridSize;
        x2 += xvel2 * gridSize;
        y2 += yvel2 * gridSize;
        
        updateCars(oldx,oldy,oldx2,oldy2);
        
        rec1 = false;
        rec2 = false;
        
        gameState = "input";
    }
}

setInterval(run, 10);

/*
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(20, 20);
ctx.stroke();

ctx.beginPath();
ctx.arc(100, 100, 20, 0, 2 * Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.arc(250, 250, 1, 0, 2 * Math.PI);
ctx.fill();
*/