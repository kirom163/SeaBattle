//зависимости
const express = require('express');
const session = require('express-session');////FireFox ругается
const PartyManager = require('./src/PartyManager');
const pm = new PartyManager();
const jsonParser = express.json();
const hbs=require('hbs');

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

hbs.registerHelper('compare',function(value){
    if(value===1){
        return new hbs.SafeString("Рядовой");
    }
    if(value===2){
        return new hbs.SafeString("Лейтенант");
    }
    if(value===3){
        return new hbs.SafeString("Адмирал");
    }
    
    })



console.log(correctConnection)
checkConnect(correctConnection);
console.log(correctConnection);
let userName='nf';
let isLogging=false;
let rasst=[];
let isRas=false;
let isMenuLoadBattle=false;
let somemenu=[];
let dateL=null;

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
        console.log(userName,isLogging,isMenuLoadBattle,'-метаданные входа');
        let g;
        let menl=somemenu;
        if(isMenuLoadBattle){
g=true;
somemenu=[];
isMenuLoadBattle=false;

        }else{
            g=false;
        }
        response.render("index.hbs",{userName:userName,isLogging:isLogging,isMenuLoadBattle:g,time_op:menl});
        
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
       console.log(err,'-error_logos_save_strat?');
    
    })
}})

app.get("/loados", jsonParser, function (request, response) {
checkConnect();
if(correctConnection&&isLogging){
    Datex=new Date();
    connectionsql.query('select time from database1.battlefield where login="'+userName+'"',
    function(err,results,fields){
        console.log(err,'-error date');
      // console.log('loading date',results[0].ships);

//console.log(results);
       // let a=results[0].ships;
        //console.log('loading ships a',results[0].ships);
        response.render('load_strat.hbs',{date:results,userName:userName,isLogging:isLogging});
    })
    
}})


app.post("/loados_y", jsonParser, function (request, response) {
    checkConnect();
    if(correctConnection&&isLogging){
        Datex=new Date();
        connectionsql.query('select login,time,ships,shots from database1.battlefield where login="'+userName+'" and time="'+request.body.date+'"',
        function(err,results,fields){
            console.log(err,'-error loaded');
            console.log('loading ships',results[0].ships);
    
    
rasst=results[0];
isRas=true;
            let a=results[0].ships;
            console.log('loading ships a');
            response.render('index',{login:results[0].login,time:results[0].time,ships:a,shots:results[0].shots});
        })
        
    }})
app.post("/loados_x", jsonParser, function (request, response) {
    checkConnect();
    if(correctConnection&&isLogging&&isRas){
        Datex=new Date();
        connectionsql.query('select login,time,ships,shots from database1.battlefield where login="'+userName+'" and time="'+request.body.date+'"',
        function(err,results,fields){
            console.log(err,'-error loaded');
            console.log('loading ships',results[0].ships);
    
    
rasst=results[0];
isRas=true;
            let a=results[0].ships;
            console.log('loading ships a');
            response.render('index',{login:results[0].login,time:results[0].time,ships:a,shots:results[0].shots});
        })
        
    }})
    app.get("/loados_x", jsonParser, function (request, response) {
        checkConnect();
        let fg=isRas;
        if(correctConnection&&isLogging&&isRas){
      

            
                console.log('try to rast');
                response.json({isRas:fg,login:rasst.login,time:rasst.time,ships:rasst.ships,shots:rasst.shots});
                isRas=false;
            }else{
                response.json({isRas:false});
            }
        }
            )
            
        


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
           console.log(err,'_save_battle_server?');
         response.json({awaiter:0});
         
        })
    }})
    app.post("/load_battle_ai", jsonParser, function (request, response) {
        checkConnect();
        if(correctConnection&&isLogging){

            let date=JSON.stringify(request.body.date);
            console.log("is date loading battle server",date);

            dateL=date;
            connectionsql.query('select * from database1.ai_battlefield where login_ai="'+userName+'" and time_ai='+dateL+'',
            function(err,results,fields){
                console.log(err,'-error loaded');
                console.log('result in load battle server_ai')
                response.json({login_ai:results[0].login_ai,time_ai:results[0].time_ai,rang_ai:results[0].rang_ai,ships_ai:results[0].ships_ai,shots_ai:results[0].shots_ai,ships_pl:results[0].ships_pl,shots_pl:results[0].shots_pl});
            })


        }})
  app.post("/load_battle", jsonParser, function (request, response) {
        checkConnect();
        if(correctConnection&&isLogging){
            Datex=new Date();
            console.log('this dateL',dateL);
            connectionsql.query('select * from database1.ai_battlefield where login_ai="'+userName+'" and time_ai='+dateL+'',
            function(err,results,fields){
                console.log(err,'-error loaded');
                console.log('result in load battle server',results)
                response.json({login_ai:results[0].login_ai,time_ai:results[0].time_ai,rang_ai:results[0].rang_ai,ships_ai:results[0].ships_ai,shots_ai:results[0].shots_ai,ships_pl:results[0].ships_pl,shots_pl:results[0].shots_pl});
            })
            console.log("werify");
        }})


        app.post("/load_menu_battle", jsonParser, function (request, response) {
            checkConnect();
            if(correctConnection&&isLogging){
                Datex=new Date();
                connectionsql.query('select time_ai,rang_ai from database1.ai_battlefield where login_ai="'+userName+'"',
                function(err,results,fields){
                    console.log(err,'-error loaded battle');

                   // console.log('hehehe',request.body.aps);
                    isMenuLoadBattle=true;
                    somemenu=results;
                   console.log('some try/-')
                    response.json({time_op:results,isMenuLoadBattle:isMenuLoadBattle});
                  //  isMenuLoadBattle=false;
                })
                console.log("/load_menu_battle");
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





 