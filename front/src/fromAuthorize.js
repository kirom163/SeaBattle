function sendUser(userName,userPassword){
    let user=JSON.stringify({user:userName,password:userPassword});
    let request = new XMLHttpRequest();
    console.log(userName,userPassword);
    request.open("POST", "/auth", true);   
    request.setRequestHeader("Content-Type", "application/json");



    request.addEventListener("load", function () {

    console.log(request);
    console.log(request.response)
    console.log(request.response.correctUser)
    console.log(request.response)
    let receivedUser = JSON.parse(request.response);
    console.log(receivedUser);
    if(receivedUser.correctUser===true){
      redirect();
    }else{
      alert('Вы ввели неправильный логин или пароль');
    }
 });


 request.send(user);
}

function check_correct(userName,password){
  //здесь должна быть проверка на корректный пароль и пользователя, тип адэкватно записан или это хрень на 2 буквы
  return true;
}
function redirect(){
    window.location.href="/index";
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
      if(check_correct(name,password)){
        sendUser(name,password)
      }else{
        alert('неправильный логин или пароль')
      }


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




