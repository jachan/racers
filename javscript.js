var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var width = ctx.canvas.clientWidth;
var height = ctx.canvas.clientHeight;
var numOfLines = 50;
var gridSize = Math.floor(width / numOfLines);
var gameOn = true;
var gameState = "input"; //input, display
var rec1 = false; //if player 1's move has been receieved
var rec2 = false; //if player 2's move has been received
var xstart = Math.floor(numOfLines*0.75) * gridSize;
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
        ctx.lineWidth=.5;
        ctx.stroke();
    }

    //draws horizontal lines
    for (i = 0; i <= height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.lineWidth=.5;
        ctx.stroke();
    }
    
    //draws player 1
    ctx.beginPath();
    ctx.arc(x1, y1, 2, 0, 2 * Math.PI);
    ctx.fillStyle="red";
    ctx.fill();
    
    //draws player 2
    ctx.beginPath();
    ctx.arc(x2, y2, 2, 0, 2 * Math.PI);
    ctx.fillStyle="blue";
    ctx.fill();
}

var leftBound = (Math.floor(numOfLines*.20))*gridSize;
var rightBound = Math.floor(numOfLines*.80)*gridSize;
var downPoint = Math.floor(numOfLines*.70)*gridSize;
var upPoint = Math.floor(numOfLines*.30)*gridSize;
var sideWidth = 6*gridSize;
var innerRad = (rightBound-leftBound-2*sideWidth)/2;
var outerRad =  (rightBound-leftBound)/2;
function drawTrack(){
    //left side
    ctx.beginPath();
    ctx.moveTo(leftBound, downPoint);
    ctx.lineTo(leftBound, upPoint);
    ctx.lineWidth=2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(leftBound + sideWidth, downPoint);
    ctx.lineTo(leftBound + sideWidth, upPoint);
    ctx.lineWidth=2;
    ctx.stroke();
    
    //right side
    ctx.beginPath();
    ctx.moveTo(rightBound, downPoint);
    ctx.lineTo(rightBound, upPoint);
    ctx.lineWidth=2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(rightBound - sideWidth, downPoint);
    ctx.lineTo(rightBound - sideWidth, upPoint);
    ctx.lineWidth=2;
    ctx.stroke();
    
    //bottom of track
    ctx.beginPath();
    ctx.arc((rightBound+leftBound)/2, downPoint, outerRad, 0, Math.PI);
    ctx.stroke();
 
    ctx.beginPath();
    ctx.arc((rightBound+leftBound)/2, downPoint, innerRad, 0, Math.PI);
    ctx.stroke();
    
    //top of track
    ctx.beginPath();
    ctx.arc((rightBound+leftBound)/2, upPoint, outerRad, Math.PI, 2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((rightBound+leftBound)/2, upPoint, innerRad, Math.PI, 2*Math.PI);
    ctx.stroke();
}

//function checks collision with the different walls
//function returns the intersection of the wall with the path
function collision(oldx, oldy, x, y){
    var middlex = ((rightBound+leftBound)/2);
    var dx = x-middlex;
    var botDist = Math.sqrt(Math.pow(dx,2) + Math.pow(y-downPoint,2));
    var topDist = Math.sqrt(Math.pow(dx,2) + Math.pow(y-upPoint,2));

    //checks left outer wall
    if(x<=leftBound){
        return true;
    }
    //checks right outer wall
    if(x>=rightBound){
        return true;
    }
    //checks the bottom inner curve
    if (botDist <= innerRad && (y>=downPoint))
    {
        return true;
    }
    //checks the bottom outer curve
    if(botDist >= outerRad && y>=downPoint){
        return true;
    }
    //checks the top inner curve
    if (topDist <= innerRad && (y<=upPoint))
    {
        return true;
    }
    //checks the top outer curve
    if(topDist > outerRad && y<upPoint){
        return true;
    }
    //checks right inner wall
    if(x<=rightBound-sideWidth && x>=middlex && (y>upPoint) && (y<downPoint)){
        return true;
    }
    //checks left inner wall
    if(x>=leftBound+sideWidth && x<=middlex && (y>upPoint) && (y<downPoint)){
       return true; 
    }
    return false;
}


function updateCar(oldx, oldy, x, y, color){
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(x, y);
    ctx.strokeStyle=color;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle=color;
    ctx.fill();
}

function inputHandler(e){
    var evtobj = window.event? event : e;
    var unicode = evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var actualkey = String.fromCharCode(unicode);
    if (gameState === "input") {
        if (!rec1) {
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
                input1 = "noaccel";
                rec1 = true;
                break;
            case "x":
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
        if (!rec2) {
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
                input2 = "noaccel";
                rec2 = true;
                break;
            case ",":
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
    }
}
document.onkeypress = inputHandler;
drawGrid();
drawTrack();
var col1 = false;
var col2 = false;
function run(){
    document.getElementById("state").innerHTML = gameState;
    if (gameState == "input") {
        input1 = "";
        input2 = "";
    }
    if (gameState == "display"){
        var oldx1 = x1;
        var oldy1 = y1;
        var oldx2 = x2;
        var oldy2 = y2;
        var newx1 = x1 + xvel1 * gridSize;
        var newy1 = y1 + yvel1 * gridSize;
        var newx2 = x2 + xvel2 * gridSize;
        var newy2 = y2 + yvel2 * gridSize;
        if(!collision(oldx1, oldx2, newx1, newy1)){
            x1 = newx1;
            y1 = newy1;
            updateCar(oldx1, oldy1, x1, y1, "red");
            rec1 = false;
        }
        else{
            alert("player 1 crashed at " + newx1 + " , " + newy1);
            updateCar(oldx1, oldy1, newx1, newy1, "orange");
            xvel1 = 0;
            yvel1 = 0;
        }
        if(!collision(oldx2, oldy2, newx2, newy2)){
            x2 = newx2;
            y2 = newy2;
            updateCar(oldx2, oldy2, x2, y2, "blue");
            rec2 = false;
        }
        else{
            alert("player 2 crashed at " + newx2 + " , " + newy2);
            updateCar(oldx2, oldy2, newx2, newy2, "orange");
            xvel2 = 0;
            yvel2 = 0;
        }
        gameState = "input";
    }
}

setInterval(run, 10);