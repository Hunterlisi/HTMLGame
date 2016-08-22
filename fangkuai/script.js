/**
 * Created by lisi- on 2016-08-14.
 */
var e_canvas = document.getElementById('play_screen');
var ctx = e_canvas.getContext('2d');
var WIDTH = 10;
var HEIGHT = 20;
var PIXEL_WIDTH = e_canvas.width;
var PIXEL_HEIGHT = e_canvas.height;
var block_size = Math.ceil(PIXEL_WIDTH / WIDTH);
var border_width = 1;


var i = [
    [0, 0, 0, -1, 0, -2, 0, -3],
    [-1, -1, 0, -1, 1, -1, 2, -1]
];
var o = [
    [0, 0, 1, 0, 0, -1, 1, -1]
];
var t = [
    [0, -1, 1, -1, 2, -1, 1, -2],
    [1, -2, 1, -1, 1, 0, 2, -1],
    [0, -1, 1, -1, 2, -1, 1, 0],
    [0, -1, 1, -1, 1, -2, 1, 0]
];
var l = [
    [0, 0, 0, -1, 1, -1, 2, -1],
    [0, -2, 1, 0, 1, -1, 1, -2],
    [0, -1, 1, -1, 2, -1, 2, -2],
    [0, -2, 0, -1, 0, 0, 1, 0]
];
var j = [
    [2, 0, 0, -1, 1, -1, 2, -1],
    [0, 0, 1, 0, 1, -1, 1, -2],
    [0, -2, 0, -1, 1, -1, 2, -1],
    [0, 0, 0, -1, 0, -2, 1, -2]
];
var z = [
    [0, 0, 0, -1, 1, -1, 1, -2],
    [0, -1, 1, -1, 1, 0, 2, 0]
];
var s = [
    [0, -2, 0, -1, 1, -1, 1, 0],
    [0, 0, 1, 0, 1, -1, 2, -1]
];
// var shapes = [i];
var shapes = [i, o, t, l, j, z, s];

var colors = ['red', 'green', 'yellow', '#0d2ed0', 'purple', 'orange', 'blue'];
var X = 4;
var Y = 0;
var shapeList; // 存储当前和下一个
var curIndex = 0; //形状“角度编号”
var level = 1;
var score = 0;
var time_tick;
document.body.onkeydown = function (e) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'up'
    };
    if (typeof keys[e.keyCode] != 'undefined') {
        control(keys[e.keyCode]);
    }
};
var Board = {
    matrix: {},
    color: function (x, y, color) {
        if (arguments.length > 2)
            this.matrix[[x, y]] = color;
        return this.matrix[[x, y]];
    },
    isFull: function (y) {//第y行是否被填满
        for (var i = 0; i < 10; i++) {
            if (!this.matrix[[i, y]])
                return false;
        }
        return true;
    },
    addShape: function () {//将当前图形添加到画板
        var shape = shapes[shapeList[0]][curIndex];
        for (var i = 0; i < 8; i += 2) {
            this.color(shape[i] + X, shape[i + 1] + Y, colors[shapeList[0]]);
        }
    }
};

function control(key) {
    var shape = shapes[shapeList[0]][curIndex];
    var tempShape = [];
    var isInBoard = true;
    var x = X;
    var y = Y;
    switch (key) {
        case 'left':
            for (var i = 0; i < 8; i += 2) {//检测是否出左右边界
                if (X + shape[i] - 1 < 0 || Board.color(x + shape[i] - 1, y + shape[i + 1]))
                    isInBoard = false
            }
            if (isInBoard)
                --X;
            break;
        case 'right':
            for (var i = 0; i < 8; i += 2) {//检测是否出左右边界
                if (X + shape[i] + 1 > 9 || Board.color(x + shape[i] + 1, y + shape[i + 1]))
                    isInBoard = false
            }
            if (isInBoard)
                ++X;
            break;
        case 'up':
            tempShape = shapes[shapeList[0]][getNextState()];
            shape = tempShape;
            for (var i = 0; i < 8; i += 2) {//检测是否出左右边界
                if (Board.color(x + shape[i], y + shape[i + 1]) || X + shape[i] + 1 > 9 || X + shape[i] - 1 < 0)
                    isInBoard = false
            }
            if (isInBoard)
                curIndex = getNextState();
            break;
        case 'down':
            dropDown();
            break;
    }
}
function getNextState() {//获取下一个形态索引
    var tempIndex = curIndex + 1;
    if (tempIndex >= shapes[shapeList[0]].length)
        return 0;
    else
        return tempIndex;

}
function drawBlock(x, y, color) {
    ctx.lineWidth = border_width;
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.fillRect(x * block_size, y * block_size, block_size, block_size);
    ctx.strokeRect(x * block_size, y * block_size, block_size, block_size);
}

function drawShape() {
    var curShapeIndex = shapeList[0];
    var shape = shapes[curShapeIndex][curIndex];
    var color = colors[curShapeIndex];
    ctx.clearRect(0, 0, WIDTH * block_size, HEIGHT * block_size);
    for (var i = 0; i < 20; i++) {//行y
        for (var j = 0; j < 10; j++) {//列x
            if (Board.color(j, i))
                drawBlock(j, i, Board.color(j, i));
        }
    }
    for (var i = 0; i < 8; i += 2) {
        drawBlock(X + shape[i], Y + shape[i + 1], color);
    }
}
function isAtBottom(shape) {
    for (var i = 0; i < 8; i += 2) {
        if (Board.color(X + shape[i], Y + shape[i + 1] + 1)) {
            Board.addShape();
            return true
        }
    }
    for (var i = 1; i < 8; i += 2) {//检查是否到底
        if (shape[i] + Y >= 19) {
            Board.addShape();
            return true
        }
    }

    return false
}

function dropDown() {
    if (!isAtBottom(shapes[shapeList[0]][curIndex])) {
        ++Y;
    }
    else {
        clearLines();
        if (gameOver()) {
            var rs = confirm('游戏结束，是否重新开始？');
            if (rs)
                newGame();
            else
            {
                clearInterval(time_tick);
                return;
            }
        } else {
            X = 4;
            Y = 0;
            curIndex = 0;
            generShape();
        }
    }

    drawShape();
}

function gameOver() {//触底之后有部分方块的Y值小于0,触底在调用时判断了
    var shape = shapes[shapeList[0]][curIndex];
    for (var i = 1; i < 8; i += 2) {
        if (Y + shape[i] <= 0) {
            return true
        }
    }
    return false
}

function generShape() {//产生当前和下一个形状
    var len = shapes.length;
    if (shapeList) {
        shapeList[0] = shapeList[1];
        shapeList[1] = Math.floor(Math.random() * len);
    }
    else {
        shapeList = [];
        shapeList[0] = Math.floor(Math.random() * len);
        shapeList[1] = Math.floor(Math.random() * len);
    }
    drawNextShape();
}
function drawNextShape() {
    var next_canvas = document.getElementById('next_sharp').getContext('2d');
    next_canvas.clearRect(0, 0, 120, 120);
    var shape = shapes[shapeList[1]][0];
    var color = colors[shapeList[1]];
    for (var i = 0; i < 8; i += 2) {//绘制提示形状
        next_canvas.lineWidth = border_width;
        next_canvas.fillStyle = color;
        next_canvas.strokeStyle = 'white';
        next_canvas.fillRect((shape[i] + 2) * block_size / 1.5, (shape[i + 1] + 3.5) * block_size / 1.5, block_size / 1.5, block_size / 1.5);
        next_canvas.strokeRect((shape[i] + 2) * block_size / 1.5, (shape[i + 1] + 3.5) * block_size / 1.5, block_size / 1.5, block_size / 1.5);
    }
}

function clearLines() {
    var lines = 0;
    for (var i = 0; i < 20; i++) {//行y
        if (Board.isFull(i)) {
            for (var c = i; c > 0; c--) {
                for (var j = 0; j < 10; j++) {//列x
                    Board.color(j, c, Board.color(j, c - 1));
                }
            }
            ++lines;
        }
    }
    setScore(lines);
}
var e_score = document.getElementById('score').lastChild;
function setScore(l) {
    if (l != 0) {
        score += Math.pow(2, l - 1) * 100;
        e_score.innerText = score;
    }

}
function newGame() {
    X = 4;
    Y = 0;
    score = 0;
    Board.matrix = {};
    shapeList = null; // 存储当前和下一个
    curIndex = 0; //形状“角度编号”
    level = 1;
    generShape();
    clearInterval(time_tick);
    time_tick = setInterval(dropDown, 250);
}

function game_control() {
    var btn = document.getElementById('btn-start');
    btn.value = '重新开始';
    newGame();
}