document.getElementById("exec").onclick=function(){//кнопка отмена
    console.log('try to loadBattle')
    document.getElementById("crack").remove();
  

}



document.querySelectorAll(".loadx").forEach(i=>i.addEventListener("click",event=>{//выбираем все кнопки загрузить и их id
    console.log(event.target.innerText);
    console.log(event.target.id);
    let user=JSON.stringify({date:event.target.id});
    let request = new XMLHttpRequest();
    request.open("POST", "/load_battle_ai", true);   
    request.setRequestHeader("Content-Type", "application/json");
    console.log('wat')
    request.addEventListener("load", function () {
console.log('some actions on loadx');  
const loadBatButtonNULL = document.querySelector('[data-type="load_battleNULL"]');//загрузка сохраненной битвы


      }) 
 request.send(user);

// let buttonVX=document.getElementById('loadNULL').submit;
//console.log('buttonVX');
 document.getElementById("crack").remove();
}))








