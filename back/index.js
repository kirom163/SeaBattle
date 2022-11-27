//зависимости
const express = require('express');
const session = require('express-session');
const PartyManager = require('./src/PartyManager');
const pm = new PartyManager();
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

//прослушивание сокет соединений
io.on('connection', (socket) => {
    pm.connection(socket);

    io.emit('playerCount', io.engine.clientsCount);
    //Отключение соединения
    socket.on('disconnect', () => {
        pm.disconnect(socket);
        io.emit('playerCount', io.engine.clientsCount)
    });
    //Поиск случайного оппонента
    /*
    socket.on('findRandomOpponent', () => {
        socket.emit("statusChange", 'randomFinding');
        pm.playRandom(socket);
    })
    */
});