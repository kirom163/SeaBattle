//const mysql = require("mysql");  этот код-серверная часть

document.getElementById("cancel-to-index").onclick=function(){
    window.location.href="index.html";
}
////////////////////////////////////////


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "database1",
  password: "1111"

});
connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });
///////////////////////
///////////////////////
connection.end(function(err) {
    if (err) {
      return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение закрыто");
  });

/////////////////////////
let login=document.querySelector("#user-login");
let pass=document.querySelector("#user-pass");
let button=document.querySelector("#toValidate");
/////использованы 2 разных способа прослушки, сверху одна, снизу чуть другая

button.addEventListener("click", function(){
    let name=login.value;
    let password=pass.value;
    let error=false;
    let sum_error="";
    if (name===""){
        error=true;
        sum_error+="не введен логин\n";
    }
    if (password===""){
        error=true;
        sum_error+="не введен пароль";
    }
    if (error){
        
        alert(sum_error);
    }else{
////все подключение к БД
       
//конец подключения
    }



}

)





