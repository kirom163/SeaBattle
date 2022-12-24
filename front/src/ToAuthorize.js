
if (document.querySelector("#authorize")!=null)
document.getElementById("authorize").onclick=function(){
    console.log('try to login');
    window.location.href="authorize.html";
}
if (document.querySelector("#exittt")!=null)
document.getElementById("exittt").onclick=function(){
    console.log('try to exit')
    window.location.href="exit";
}
//if (document.querySelector("#loading_strat")!=null)
document.getElementById("loading_strat").onclick=function(){
    console.log('try to load')
    window.location.href="loados";
}
console.log('try to something');
