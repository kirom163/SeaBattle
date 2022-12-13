//зависимости
const express = require('express');
const session = require('express-session');////FireFox ругается
const PartyManager = require('./src/PartyManager');
const pm = new PartyManager();
const jsonParser = express.json();

const mysql = require("mysql2");
const { query } = require('express');
const connectionsql = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "database1",
    password: "1111"
  });
  connectionsql.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });

let userName='nf';
let isLogging=false;

//Добавил чтоб firefox не ругался
console.log(session);
//
//создание приложения экспресс
const app = express();
app.set('view engine','hbs');
const dn=__dirname.length
const dirk=__dirname.slice(0,dn-5);
app.set('views', dirk +'/views');
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

//парсер данных формы
const urlencodedParser = express.urlencoded({extended: false});
app.get("/authorize(.html)?", function (request, response) {
    response.render('authorize.hbs');
});
app.get("/registration(.html)?", function (request, response) {
    response.render("registration.hbs");
});
function avs(request,response){
        console.log(userName,isLogging,'-метаданные входа');
        response.render("index.hbs",{userName:userName,isLogging:isLogging});
}

app.get("/index(.html)?",jsonParser, avs);
app.get("/",jsonParser, avs);
app.post("/index(.html)?",jsonParser, avs)

//проверить правильность прихода запроса, может не на ту страницу отправляет
app.post("/auth", jsonParser, function (request, response) {
let correctUserx=false;
console.log('-----s---',request.body);
let user=request.body.user;
let password=request.body.password;
console.log(user,password);
    connectionsql.query('select * from database1.logins where logins.login="'+user+'" and logins.password="'+password+'"',
    function(err,results,fields){
        console.log(err,'-error');
        console.log(results,'results-connection');
        console.log(results.fieldCount,'-count');
        console.log(results[0].login,'-login')
        if (results[0].login===user&&results[0].password===password){
            isLogging=true;
            correctUserx=true;
            userName=user;
            console.log("success login");
            response.json({correctUser:correctUserx})
        }else{
            isLogging=false;
            correctUserx=false;
            userName='n';
            console.log('wrong login');
            response.json({correctUser:correctUserx})
        }
    });

});
app.get("/exit", jsonParser, function (request, response) {
   
    console.log(userName,isLogging,'-метаданные выхода');
    userName='nf';
    isLogging=false;
    response.render("index.hbs",{userName:userName,isLogging:isLogging});
})
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
   
});





 