let a=this.URL
a.get(name)
let x=document.createElement('h2');
x.textContent(name);

/*Допустим, мы хотим создать URL-адрес с заданными параметрами, например, https://google.com/search?query=JavaScript.

Мы можем указать их в строке:

new URL('https://google.com/search?query=JavaScript')



Так что для этого есть свойство url.searchParams – объект типа URLSearchParams.

Он предоставляет удобные методы для работы с параметрами:

    append(name, value) – добавить параметр по имени,
    delete(name) – удалить параметр по имени,
    get(name) – получить параметр по имени,
*/