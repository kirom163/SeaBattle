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
  let correctConnection=false;
  function checkConnect(){
    connectionsql.connect(function(err){
        if (err) {
            correctConnection=false;
          return console.error("Ошибка: " + err.message);
        }
        else{
            correctConnection=true;
          console.log("Подключение к серверу MySQL успешно установлено");
        }
  });
}

console.log(correctConnection)
checkConnect(correctConnection);
console.log(correctConnection);
let userName='nf';
let isLogging=false;


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

app.post("/logos", jsonParser, function (request, response) {
   
let part=JSON.stringify(request.body.ships);
let cart=JSON.stringify(request.body.shots);
//let bart=JSON.stringify(request.body.matrix);

checkConnect();
if(correctConnection&&isLogging){
    Datex=new Date();
    connectionsql.query('insert into database1.battlefield values ("'+userName+'","'+Datex+'",'+"'"+part+"','"+cart+"');",
    function(err,results,fields){
       console.log(err,'-error');
    
    })
}})

app.post("/loados", jsonParser, function (request, response) {
checkConnect();
if(correctConnection&&isLogging){
    Datex=new Date();
    connectionsql.query('select login,time,ships,shots from database1.battlefield where login="'+userName+'"',
    function(err,results,fields){
        console.log(err,'-error loaded');
        console.log('loading ships',results[0].ships);


        let a=results[0].ships;
        console.log('loading ships a',results[0].ships);
        response.json({login:results[0].login,time:results[0].time,ships:a,shots:results[0].shots});
    })
    console.log("werify");
}})


app.post("/save_battle", jsonParser, function (request, response) {
   
    let rang_ai=JSON.stringify(request.body.rang_ai);
    let ships_ai=JSON.stringify(request.body.ships_ai);
    let shots_ai=JSON.stringify(request.body.shots_ai);
    let ships_pl=JSON.stringify(request.body.ships_pl);
    let shots_pl=JSON.stringify(request.body.shots_pl);
   
    checkConnect();
    if(correctConnection&&isLogging){
        Datex=new Date();
        connectionsql.query('insert into database1.ai_battlefield values ("'+userName+'","'+Datex+'",'+"'"+rang_ai+"','"+ships_ai+"','"+shots_ai+"','"+ships_pl+"','"+shots_pl+"');",
        function(err,results,fields){
           console.log(err,'-error');
         
         
        })
    }})
  app.post("/load_battle", jsonParser, function (request, response) {
        checkConnect();
        if(correctConnection&&isLogging){
            Datex=new Date();
            connectionsql.query('select * from database1.ai_battlefield where login_ai="'+userName+'"',
            function(err,results,fields){
                console.log(err,'-error loaded');
              //  console.log('loading ships',results[0].ships);
        
        
                //let a=results[0].ships;
                //console.log('loading ships a',results[0].ships);
                response.json({login_ai:results[0].login_ai,time_ai:results[0].time_ai,rang_ai:results[0].rang_ai,ships_ai:results[0].ships_ai,shots_ai:results[0].shots_ai,ships_pl:results[0].ships_pl,shots_pl:results[0].shots_pl});
            })
            console.log("werify");
        }})
app.post("/auth", jsonParser, function (request, response) {
let correctUserx=false;
let countUserx=-1;
//console.log('-----s---',request.body);
let user=request.body.user;
let password=request.body.password;
console.log(user,password);
checkConnect();
console.log(correctConnection,'-connect to base')
if(correctConnection){
    connectionsql.query('select * from database1.logins where logins.login="'+user+'"',
    function(err,results,fields){
        console.log(err,'-error');
     //   console.log(results,'results-connection');
      //  console.log(results.length,'-count');
        countUserx=results.length;
   if(countUserx===1)   {console.log(results[0].login,'-login')
        if (results[0].login===user&&results[0].password===password){
            isLogging=true;
            correctUserx=true;
            userName=user;
            console.log("success login");
            response.json({correctUser:correctUserx,countUser:countUserx,correctConnection:correctConnection})
        }else{
            isLogging=false;
            correctUserx=false;
            userName='n';
            console.log('wrong login');
            response.json({correctUser:correctUserx,countUser:countUserx,correctConnection:correctConnection})
        }
    }else{
        isLogging=false;
        correctUserx=false;
        userName='n';
        console.log('no login');
        response.json({correctUser:correctUserx,countUser:countUserx,correctConnection:correctConnection})
    }
}

    )}else{
        isLogging=false;
        correctUserx=false;
        userName='n';
        console.log('no connect to base');
        response.json({correctUser:correctUserx,countUser:countUserx,correctConnection:correctConnection}) 
    }
    ;

});
app.post("/reg", jsonParser, function (request, response) {
    let correctUserx=false;
    let countUserx=-1;
    console.log('-----r---',request.body);
    let user=request.body.user;
    let password=request.body.password;
    console.log(user,password);
    checkConnect();
    console.log(correctConnection,'-connect to base')
    if(correctConnection){
        connectionsql.query('select * from database1.logins where logins.login="'+user+'"',
        function(err,results,fields){
            console.log(err,'-error');
            console.log(results,'results-connection');
            console.log(results.length,'-count');
            countUserx=results.length;
            let try_reg=false;
       if(countUserx===1){console.log(results[0].login,'-reg')
       
        isLogging=false;
        correctUserx=false;
        userName='n';
        console.log('wrong reg');
        response.json({correctUser:correctUserx,countUser:countUserx,correctConnection:correctConnection});

       }else{

        connectionsql.query('insert into database1.logins values ("'+user+'", "'+password+'");',function(err,results,fields){
            console.log(err,'-error');
            console.log(results,'results-connection');
            console.log(results.length,'-count');
        });

         isLogging=true;
        correctUserx=true;
        userName=user;
        console.log('success reg');
        response.json({correctUser:correctUserx,countUser:countUserx,correctConnection:correctConnection});
       }
    })}});
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





 