function sendUser(userName,userPassword){
    let user=JSON.stringify({userbName:''});
    let request = new XMLHttpRequest();
    request.open("POST", "/auth", true);   
    request.setRequestHeader("Content-Type", "application/json");
   // const jsonParser = express.json();
    request.addEventListener("load", function () {
    // получаем и парсим ответ сервера
  //  console.log(responce);
    console.log(request);
    console.log(request.response)
    // let receivedUser = JSON.parse(this.response);
   //  console.log(receivedUser.JSON," JSON");
    // console.log(receivedUser)
    // return false;            рпорп
    // console.log(receivedUser.userName, "-", receivedUser.userAge);   // смотрим ответ сервера
 });
 request.send(user);
}
function redirect(){
    window.location.href="authorize.html";
}


document.getElementById("cancel-to-index").onclick=function(){
    window.location.href="index.html";
}

/////////////////////////
let login=document.querySelector("#user-login");
let pass=document.querySelector("#user-pass");
let button=document.querySelector("#toValidate");
let button2=document.querySelector("#toReg");


let form=document.getElementById('log');
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
      if(true){
        sendUser(name,password)
        //redirect()
      }else{
        alert('неправильный логин или пароль')
      }
//let str='/authorize?s=1&';
//str=str+'name='+login.value+'&'+'pass='+pass.value;
//console.log(str)
//window.close(this.window);
//window.open(str);

}

})
button2.addEventListener("click", function(){
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
let str='/registration?s=2&';
str=str+'name='+login.value+'&'+'pass='+pass.value;

console.log(str)
//this.window.
//window.close(this.window);
window.open(str);

}})

let button3=document.querySelector("#toRege");
if (button3!=null){
button3.addEventListener("click", function(){
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
let str='/registration?s=2&';
str=str+'name='+login.value+'&'+'pass='+pass.value;

console.log(str)
//this.window.
//window.close(this.window);
window.open(str);

}})
}




