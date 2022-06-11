class Game {
    constructor(symbol, status) {
        this.symbol = symbol;
        this.status = status;
    }
    
    reDraw() {
        for (let i = 0; i < this.status.length; i++) {
            if (this.status[i].symbol == 'X') {
                $("button#b"+i).addClass("cross-bg");
            } else if (this.status[i].symbol == 'O') {
                $("button#b"+i).addClass("circle-bg");
            } else {
                $("button#b"+i).removeClass("cross-bg");
                $("button#b"+i).removeClass("circle-bg");
            }
        }
    }
}

const buttonsToCoords = {
    "b0": {x:0, y:0},
    "b1": {x:0, y:1},
    "b2": {x:0, y:2},
    "b3": {x:1, y:0},
    "b4": {x:1, y:1},
    "b5": {x:1, y:2},
    "b6": {x:2, y:0},
    "b7": {x:2, y:1},
    "b8": {x:2, y:2}
}
const socket = io();

$("div > button").on("click", function() {
    socket.emit('select', {x: buttonsToCoords[$(this).attr("id")].x, y: buttonsToCoords[$(this).attr("id")].y});
});

socket.on('update', (data) => {
    const game = new Game(data.symbol, data.status);
    $("h2").text("You are: " + game.symbol.symbol);
    game.reDraw();
});

$("#restart").on("click", function() {
    socket.emit('restart');
});