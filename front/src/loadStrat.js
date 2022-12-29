function sendUser(id){
    let user=JSON.stringify({date:id});
    
    let request = new XMLHttpRequest();
    request.open("POST", "/loados_y", true);   
    request.setRequestHeader("Content-Type", "application/json");
    console.log('wat loadstrat loados_y')
    request.addEventListener("load", function () {
 
   
console.log('some actions');  
window.location.href="/index";  }
      ) 
 request.send(user);
}
function redirect(){//переадресация назад с загруженной расстановкой
  window.location.href="/loados_x";
}


console.log('load')

document.querySelectorAll(".loadx").forEach(i=>i.addEventListener("click",event=>{//выбираем все кнопки загрузить и их id
    console.log(event.target.innerText);
    console.log(event.target.id);
    sendUser(event.target.id)
}))



document.getElementById("exec").onclick=function(){//кнопка отмена
  console.log('try to load')
  window.location.href="/index";
}