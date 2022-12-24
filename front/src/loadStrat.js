function sendUser(id){
    let user=JSON.stringify({date:id});
    
    let request = new XMLHttpRequest();
    //console.log(userName,userPassword);
    request.open("POST", "/loados_y", true);   
    request.setRequestHeader("Content-Type", "application/json");
    console.log('wat')
    request.addEventListener("load", function () {
   
console.log('some actions');  
window.location.href="/index";  
   // let receivedUser = JSON.parse(request.response);
      }) 
 request.send(user);
}
function redirect(){
  window.location.href="/loados_x";
}


console.log('load')

document.querySelectorAll(".loadx").forEach(i=>i.addEventListener("click",event=>{
    console.log(event.target.innerText);
    console.log(event.target.id);
    sendUser(event.target.id)
}))



document.getElementById("exec").onclick=function(){
  console.log('try to load')
  window.location.href="/index";
}