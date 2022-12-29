function sendUser(){
    let user=JSON.stringify({awaiter:0});
    
    let request = new XMLHttpRequest();
    //console.log(userName,userPassword);
    request.open("POST", "/logos", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
			let receivedUser = JSON.parse(request.response);
   if(!receivedUser.correctConnection){alert('Ошибка:11 Отсутствует соединение с базой данных, обратитесь к администратору');}else{}
 
      }) 

}


function redirect(){
  window.location.href="/logos";
}



let save_button=document.getElementById("saving");
save_button.addEventListener("click", function(){
sendUser();

});