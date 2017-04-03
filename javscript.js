var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var width = ctx.canvas.clientWidth;
var height = ctx.canvas.clientHeight;
var numOfLines = 50;
var gridSize = Math.floor(width / numOfLines);
var sideWidth = 7*gridSize;
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
var innerRad = (rightBound-leftBound-2*sideWidth)/2;
var outerRad =  (rightBound-leftBound)/2;
var finishLine = Math.floor(numOfLines*.60)*gridSize;
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
    
    //finish line
    ctx.beginPath();
    ctx.moveTo(rightBound, ystart-gridSize);
    ctx.lineTo(rightBound-sideWidth, ystart-gridSize);
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
        alert("1");
        return lineIntersect(oldx, oldy, x, y, leftBound, upPoint, leftBound, downPoint);
    }
    //checks right outer wall
    if(x>=rightBound){
        alert("2");
        return lineIntersect(oldx, oldy, x, y, rightBound, upPoint, rightBound, downPoint);
    }
    //checks the bottom inner curve
    if (botDist <= innerRad && (y>=downPoint))
    {
        alert("3");
        return [x, y];
    }
    //checks the bottom outer curve
    if(botDist >= outerRad && y>=downPoint){
        alert("4")
        return [x, y];
    }
    //checks the top inner curve
    if (topDist <= innerRad && (y<=upPoint))
    {
        alert("5")
        return [x,y];
    }
    //checks the top outer curve
    if(topDist > outerRad && y<upPoint){
        alert("6")
        return [x,y];
    }
    //checks right inner wall
    if(x<=rightBound-sideWidth && x>=middlex && (y>=upPoint) && (y<=downPoint)){
        alert("7")
        return lineIntersect(oldx, oldy, x, y, rightBound-sideWidth, upPoint, rightBound-sideWidth, downPoint);

    }
    //checks left inner wall
    if(x>=leftBound+sideWidth && x<=middlex && (y>=upPoint) && (y<=downPoint)){
        alert("8")
        return lineIntersect(oldx, oldy, x, y, leftBound+sideWidth, upPoint, leftBound+sideWidth, downPoint);
    }
    return [null,null];
}

//adapted from https://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function lineIntersect(oldx, oldy, newx, newy, startx, starty, endx, endy){
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false };
    denominator = ((endy - starty) * (newx - oldx)) - ((endx - startx) * (newy - oldy));
    if (denominator == 0) {
        return [null, null];
    }
    a = oldy - starty;
    b = oldx - startx;
    numerator1 = ((endx - startx) * a) - ((endy - starty) * b);
    numerator2 = ((newx - oldx) * a) - ((newy - oldy) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = oldx + (a * (newx - oldx));
    result.y = oldy + (a * (newy - oldy));
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a >= 0 && a <= 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b >= 0 && b <= 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    if(result.onLine1 && result.onLine2){
        return [result.x,result.y];
    }
    else{
        return [null,null];
    }
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
        }
        if(rec1){
            document.getElementById("status1").style.backgroundColor = 'green';
        }
        if(rec2){
            document.getElementById("status2").style.backgroundColor = 'green';
        }
        if(rec1 && rec2){
            setTimeout(reset, 300);   
        }
    }
}
function reset(){
    gameState = "display";
    document.getElementById("status1").style.backgroundColor = 'grey';   
    document.getElementById("status2").style.backgroundColor = 'grey';
}
document.onkeypress = inputHandler;
drawGrid();
drawTrack();
var col1 = false;
var col2 = false;
var cheater1 = true;
var cheater2 = true;

function run(){
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
        var crashPos1 = collision(oldx1, oldy1, newx1, newy1);
        var crashPos2 = collision(oldx2, oldy2, newx2, newy2);

        if(crashPos1[0] == null && crashPos1[1] == null){
            x1 = newx1;
            y1 = newy1;
            updateCar(oldx1, oldy1, x1, y1, "red");
            rec1 = false;
        }
        else{
            alert("player 1 crashed at " + crashPos1[0] + " , " + crashPos1[1]);
            updateCar(oldx1, oldy1, crashPos1[0], crashPos1[1], "orange");
            xvel1 = 0;
            yvel1 = 0;
            document.getElementById("status1").style.backgroundColor = 'orange';   
        }
        if(crashPos2[0] == null && crashPos2[1] == null){
            x2 = newx2;
            y2 = newy2;
            updateCar(oldx2, oldy2, x2, y2, "blue");
            rec2 = false;
        }
        else{
            alert("player 2 crashed at " + crashPos2[0] + " , " + crashPos2[1]);
            updateCar(oldx2, oldy2, crashPos2[0], crashPos2[1], "orange");
            xvel2 = 0;
            yvel2 = 0;
            document.getElementById("status2").style.backgroundColor = 'orange';
        }
        gameState = "input";
    }
}

setInterval(run, 10);
