var myGamePiece;
var myObstacles = [];
var myScore;
var myGameScore;
var myGameEnd;
var myGameResume;
display = document.getElementById('outputDiv');

// Start the game by pressing the start button on the home page
function startGame() {
    document.getElementById("outputDiv").innerHTML = "";
    myGamePiece = new component(55, 55, "#00AFB9", 50, 200);
    myScore = new component("40px", "Consolas", "black", 500, 70, "text");
    myGameScore = new component("50px", "Consolas", "red", 500, 320, "text")
    myGameEnd = new component("70px", "Courier New", "black", 500, 260, "text")
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1000;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 30);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
            ctx.textAlign = "center";
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    if (myGameArea.keys && myGameArea.keys[82]) {
        myGameArea.stop();
        myGameArea.clear();
        startGame();
        return;
    } else {
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;
        var x, height, gap, minHeight, maxHeight, minGap, maxGap;
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePiece.crashWith(myObstacles[i])) {
                myGameArea.clear();
                myGameEnd.text = "GAME ENDED";
                myGameScore.text = "Your score is " + myGameArea.frameNo;
                myGameEnd.update();
                myGameScore.update();
                return;
            } else {
                if (myGameArea.keys && myGameArea.keys[37]) {
                    myGamePiece.speedX = -2;
                }
                if (myGameArea.keys && myGameArea.keys[39]) {
                    myGamePiece.speedX = 2;
                }
                if (myGameArea.keys && myGameArea.keys[38]) {
                    myGamePiece.speedY = -2;
                }
                if (myGameArea.keys && myGameArea.keys[40]) {
                    myGamePiece.speedY = 2;
                }
                // Hold spacebar to pause
                if (myGameArea.keys && myGameArea.keys[32]) {
                    return;
                }
            }
        }
        myGameArea.clear();
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(80)) {
            x = myGameArea.canvas.width;
            minHeight = 50;
            maxHeight = 300;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = 70;
            maxGap = 150;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            myObstacles.push(new component(35, height, "#0081A7", x, 0));
            myObstacles.push(new component(35, x - height - gap, "#0081A7", x, height + gap));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -3;
            myObstacles[i].update();
        }
        myScore.text = "SCORE: " + myGameArea.frameNo;
        myScore.update();
        myGamePiece.newPos();
        myGamePiece.update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function clearmove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

