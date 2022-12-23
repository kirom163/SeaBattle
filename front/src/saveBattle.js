function sendUser(){
    let user=JSON.stringify({awaiter:0});
    
    let request = new XMLHttpRequest();
    //console.log(userName,userPassword);
    request.open("POST", "/logos", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
   // console.log(request);
   // console.log(request.response)
    
    //let receivedUser = JSON.parse(request.response);
    //console.log(receivedUser);
      }) 
 //request.send(user);
}


function redirect(){
  window.location.href="/logos";
}



let save_button=document.getElementById("saving");
save_button.addEventListener("click", function(){
sendUser();

});