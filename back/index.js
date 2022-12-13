//зависимости
const express = require('express');
const session = require('express-session');////FireFox ругается
const PartyManager = require('./src/PartyManager');
const pm = new PartyManager();
const jsonParser = express.json();

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
    if(request.body.userbName!=null){
        userName=request.body.userbName;
        isLogging=true;
        }else{
            isLogging=false;
            userName='n';
        }
        console.log(userName);
        response.render("index.hbs",{userName,isLogging});
}

app.get("/index(.html)?",jsonParser, avs);
app.get("/",jsonParser, avs);
app.post("/index(.html)?",jsonParser, avs)

//проверить правильность прихода запроса, может не на ту страницу отправляет
app.post("/auth", urlencodedParser, function (request, response) {

response.json({correctUser: false})


    /*console.log("succsesful post-auth\n ////////");
  if(!request.body) return response.sendStatus(400);
 
   // console.log(request);
    console.log('///////////////////////////////////////////////');
    console.log(request.query.s,request.body.userLogin,request.body.userPass);
    console.log('///////////////////////////////////////////');
    //console.log(request.headers);
    console.log('/////////////////////////////////////////');
    //console.log(request.body);
    request.send('3');
   // response.send(+`${request.body.userLogin} - ${request.body.userPass}`);
if (request.query.s===1){
}
if (request.query.s===2){
//registration
}
if(request.query.pass!=null){

    let f;
    connectionsql.query("Select * from database1.logins where logins.login='"+request.query.name+ "'",
    function (err, results, fields) {
        console.log(err);
        console.log(results);
       f=results
    if (f[0].password===request.query.pass){
        response.render("index.hbs");
        console.log('succesful');
    }else{
        console.log('not succesful');
        response.render("authorize.hbs");
    } ;  
})
/*
for(let [name, value] of url.searchParams) {
  alert(`${name}=${value}`); // q=test me!, далее tbs=qdr:y
}
}*/

});




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


/////////////////////////////подключение сервера к базе данных MySQL
//база данных локальная, поэтому у вас работать запросы к ней скорее всего не будут, ток если её уже вешать на сторонний сервер////
const mysql = require("mysql2");
const { query } = require('express');
  
const connectionsql = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "database1",
  password: "1111"
});
module.exports.VSQL=connectionsql;
// тестирование подключения
 connectionsql.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });


 