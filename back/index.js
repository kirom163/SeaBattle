//зависимости
const express = require('express');
const session = require('express-session');
//создание приложения экспресс
const app = express();
const http = require('http').createServer(app);
//регистрация сокет приложения
const io = require('socket.io')(http);
const port = 3000;
//настройка сессий
app.set('trust proxy', 1);
app.use(session({
    secret: 's3Cur3',
    name: 'sessionId'
}));
//настройка статики
app.use(express.static('./../front/'));
//поднятие сервера
http.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
//список ожидающих случайных игроков
const waitingRandom = new Set;
//прослушивание сокет соединений
io.on('connection', (socket) => {
    io.emit('playerCount', io.engine.clientsCount);

    socket.on('disconnect', () => {
        io.emit('playerCount', io.engine.clientsCount)

        if (waitingRandom.has(socket)) {
            waitingRandom.delete(socket);
        }
    });

    socket.on('findRandomOpponent', () => {
        waitingRandom.add(socket);
        socket.emit("statusChange", 'randomFinding');
    })
});