const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

class Symbols {
    static X = new Symbols('X');
    static O = new Symbols('O');
    static E = new Symbols('E');
    
    constructor(symbol) {
        this.symbol = symbol;
    }
}

class Game {
    status = [];
    movesCounter;
    playerTurn = Symbols.X;

    acceptMove(x, y) {
        this.status[x][y] = this.playerTurn;
        if (this.playerTurn == Symbols.X) {
            this.playerTurn = Symbols.O;
        } else {
            this.playerTurn = Symbols.X;
        }
        this.movesCounter++;
    }

    start() {
        this.playerTurn = Symbols.X;
        this.movesCounter = 0;
        this.status = [
            [Symbols.E, Symbols.E, Symbols.E],
            [Symbols.E, Symbols.E, Symbols.E],
            [Symbols.E, Symbols.E, Symbols.E]
        ];
    }

    arrayGame() {
        let array = [];
        for (let i = 0; i < this.status.length; i++) {
            for (let j = 0; j < this.status[i].length; j++) {
                array.push(this.status[i][j]);
            }
        }
        return array;
    }
}

const players = {};

const game = new Game();
game.start();



app.use('/', express.static(__dirname + '/frontend/'));

io.on('connection', (socket) => {
    players[socket.id] = { socket: socket, symbol: playerCount() === 0 ? Symbols.X : Symbols.O };
    socket.emit('update', dataToSend(socket.id));
    socket.on('disconnect', () => {
        delete players[socket.id];
    });
    
    socket.on('select', (coords) => {
        const x = coords.x;
        const y = coords.y;
        if (game.status[x][y] == Symbols.E
            && game.playerTurn == players[socket.id].symbol) {
            game.acceptMove(x,y);
            io.emit('update', dataToSend(socket.id));
            
            
            // if (checkWin(game)) {
            //     io.emit('win', players[socket.id].symbol);
            // }
            // else if (playerCount() === 2) {
            //     io.emit('draw');
            // }
        }
    });
    
    socket.on('restart', () => {
        game.start();
        io.emit('update', dataToSend(socket.id));
    });
    
    console.log(Object.keys(players));
});

function playerCount() {
    return Object.keys(players).length;
}

function dataToSend(id) {
    return {
        symbol: players[id].symbol,
        status: game.arrayGame()
    };
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});

