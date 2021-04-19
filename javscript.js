var c = document.getElementById("my-canvas");
var ctx = c.getContext("2d");
var width = ctx.canvas.clientWidth;
var height = ctx.canvas.clientHeight;
var numOfLines = 50;
var gridSize = Math.floor(width / numOfLines);
var sideWidth = 7 * gridSize;
var carRadius = 4;
var gameOn = true;
var checkpoints1 = [false, false, false, false]
var checkpoints2 = [false, false, false, false]
var gameState = "input"; //input, display
var legalPosition = {}
// hashSet of all legal moves on map
var rec1 = false; //if player 1's move has been receieved
var rec2 = false; //if player 2's move has been received
var xstart = Math.floor(numOfLines * 0.75) * gridSize;
var yStart = Math.floor(numOfLines * 0.5) * gridSize;
var input1;
var input2;
var xvel1 = 0;
var yvel1 = 0;
var xvel2 = 0;
var yvel2 = 0;
var x1 = xstart;
var y1 = yStart;
var x2 = xstart + gridSize;

var y2 = yStart;

function drawGrid() {
    //draws vertical lines
    for (i = 0; i <= width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.lineWidth = .5;
        ctx.stroke();
    }

    //draws horizontal lines
    for (i = 0; i <= height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.lineWidth = .5;
        ctx.stroke();
    }

    //draws player 1
    ctx.beginPath();
    ctx.arc(x1, y1, carRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    //draws player 2
    ctx.beginPath();
    ctx.arc(x2, y2, carRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
}

var leftBound = (Math.floor(numOfLines * .20)) * gridSize;
var rightBound = Math.floor(numOfLines * .80) * gridSize;
var downPoint = Math.floor(numOfLines * .70) * gridSize;
var upPoint = Math.floor(numOfLines * .30) * gridSize;
var innerRad = (rightBound - leftBound - 2 * sideWidth) / 2;
var outerRad = (rightBound - leftBound) / 2;
var finishLine = Math.floor(numOfLines * .60) * gridSize;
function drawTrack() {
    //left side
    ctx.beginPath();
    ctx.moveTo(leftBound, downPoint);
    ctx.lineTo(leftBound, upPoint);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftBound + sideWidth, downPoint);
    ctx.lineTo(leftBound + sideWidth, upPoint);
    ctx.lineWidth = 2;
    ctx.stroke();

    //right side
    ctx.beginPath();
    ctx.moveTo(rightBound, downPoint);
    ctx.lineTo(rightBound, upPoint);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightBound - sideWidth, downPoint);
    ctx.lineTo(rightBound - sideWidth, upPoint);
    ctx.lineWidth = 2;
    ctx.stroke();

    //bottom of track
    ctx.beginPath();
    ctx.arc((rightBound + leftBound) / 2, downPoint, outerRad, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((rightBound + leftBound) / 2, downPoint, innerRad, 0, Math.PI);
    ctx.stroke();

    //top of track
    ctx.beginPath();
    ctx.arc((rightBound + leftBound) / 2, upPoint, outerRad, Math.PI, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((rightBound + leftBound) / 2, upPoint, innerRad, Math.PI, 2 * Math.PI);
    ctx.stroke();

    //finish line
    ctx.beginPath();
    ctx.moveTo(rightBound, yStart - gridSize);
    ctx.lineTo(rightBound - sideWidth, yStart - gridSize);
    ctx.stroke();
}

//function checks collision with the different walls
function isLegalPosition(x, y) {
    var middlex = ((rightBound + leftBound) / 2);
    var dx = x - middlex;
    var botDist = Math.sqrt(Math.pow(dx, 2) + Math.pow(y - downPoint, 2));
    var topDist = Math.sqrt(Math.pow(dx, 2) + Math.pow(y - upPoint, 2));

    //checks left outer wall
    if (x <= leftBound) {
        return true;
    }
    //checks right outer wall
    if (x >= rightBound) {
        return true;
    }
    //checks the bottom inner curve
    if (botDist <= innerRad && (y >= downPoint)) {
        return true;
    }
    //checks the bottom outer curve
    if (botDist >= outerRad && y >= downPoint) {
        return true;
    }
    //checks the top inner curve
    if (topDist <= innerRad && (y <= upPoint)) {
        return true;
    }
    //checks the top outer curve
    if (topDist >= outerRad && y <= upPoint) {
        return true;
    }
    //checks right inner wall
    if (x <= rightBound - sideWidth && x >= middlex && (y >= upPoint) && (y <= downPoint)) {
        return true;

    }
    //checks left inner wall
    if (x >= leftBound + sideWidth && x <= middlex && (y >= upPoint) && (y <= downPoint)) {
        return true;
    }
    return false;
}

function isLegalMove(x, y) {
    var hash = [x.toString(), y.toString()].join();
    return legalPosition[hash]
}

function updateCar(oldx, oldy, x, y, color) {
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, carRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function inputHandler(e) {
    var evtobj = window.event ? event : e;
    var unicode = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
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
        if (rec1) {
            document.getElementById("status1").style.backgroundColor = 'green';
        }
        if (rec2) {
            document.getElementById("status2").style.backgroundColor = 'green';
        }
        if (rec1 && rec2) {
            setTimeout(reset, 300);
        }
    }
}
function reset() {
    gameState = "display";
    document.getElementById("status1").style.backgroundColor = 'grey';
    document.getElementById("status2").style.backgroundColor = 'grey';
}

function buildCollisionHashSet() {
    // iterates through all points to construct set of valid points
    for (x = 0; x <= width; x += gridSize) {
        for (y = 0; y <= height; y += gridSize) {
            var hash = [x.toString(), y.toString()].join();
            legalPosition[hash] = !isLegalPosition(x, y);
        }
    }
}

function generateCrashNoise() {
    crashNoises = ["WHAMOO", "KABLOOIE", "Nice try", "KATHUNK", "THUNKO", "KRUMPH", "Ouch", "Yikes"]
    randomIndex = Math.floor(Math.random() * crashNoises.length)
        return crashNoises[randomIndex]
}

function updateCheckpoints(x, y, checkpointArr) {
    var middleX = ((rightBound + leftBound) / 2);
    if (x < middleX && y < yStart) {
        checkpointArr[0] = true
    }
    if (x < middleX && y > yStart && checkpointArr[0]) {
        checkpointArr[1] = true
    }
    if (x > middleX && y > yStart && checkpointArr[1]) {
        checkpointArr[2] = true
    }

    if (x > middleX && y < yStart && checkpointArr[2]) {
        checkpointArr[3] = true
    }
}

function checkWinStatus() {
    if (checkpoints1[3] && checkpoints2[3]) {
        alert("Oh my god. We have a tie!")
    } else if (checkpoints1[3]) {
        alert("Player 1 wins! I guess they're just BETTER. I hear the McLaren race team is hiring!")
    } else if (checkpoints2[3]) {
        alert("Player 2 wins! They must be BUILT DIFFERENT. Have you considered going pro?")
    }
}

document.onkeypress = inputHandler;
drawGrid();
drawTrack();
buildCollisionHashSet();
var col1 = false;
var col2 = false;
var cheater1 = true;
var cheater2 = true;

function run() {
    if (gameState == "input") {
        input1 = "";
        input2 = "";
    }
    if (gameState == "display") {
        var oldx1 = x1;
        var oldy1 = y1;
        var oldx2 = x2;
        var oldy2 = y2;
        var newx1 = x1 + xvel1 * gridSize;
        var newy1 = y1 + yvel1 * gridSize;
        var newx2 = x2 + xvel2 * gridSize;
        var newy2 = y2 + yvel2 * gridSize;

        if (isLegalMove(newx1, newy1)) {
            x1 = newx1;
            y1 = newy1;
            updateCar(oldx1, oldy1, x1, y1, "red");
            rec1 = false;
        } else {
            alert(generateCrashNoise() + "! Player 1 crashed! They lost their next turn and their position and speed were reset.");
            updateCar(oldx1, oldy1, newx1, newy1, "orange");
            xvel1 = 0;
            yvel1 = 0;
            document.getElementById("status1").style.backgroundColor = 'orange';
        }
        if (isLegalMove(newx2, newy2)) {
            x2 = newx2;
            y2 = newy2;
            updateCar(oldx2, oldy2, x2, y2, "blue");
            rec2 = false;
        } else {
            alert(generateCrashNoise() + "! Player 2 crashed! They lost their next turn and their position and speed were reset.");
            updateCar(oldx2, oldy2, newx2, newy2, "orange");
            xvel2 = 0;
            yvel2 = 0;
            document.getElementById("status2").style.backgroundColor = 'orange';
        }
        updateCheckpoints(x1, y1, checkpoints1)
        updateCheckpoints(x2, y2, checkpoints2)
        checkWinStatus()
        gameState = "input";
    }
}

setInterval(run, 10);
