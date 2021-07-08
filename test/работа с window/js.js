
function closeWindow(){
    popup.close();
    history.go(-5);
}
function showLocationInfo(){
  document.write("Строка запроса: " + location.href + "<br />");
document.write("Путь к ресурсу: " + location.pathname + "<br />");
document.write("Схема: " + location.origin + "<br />");
document.write("Протокол: " + location.protocol + "<br />");
document.write("Порт: " + location.port + "<br />");
document.write("Хост: " + location.host + "<br />");
document.write("Имя хоста: " + location.hostname + "<br />");
document.write("Хэш: " + location.hash + "<br />");
document.write("Поиск: " + location.search + "<br />");

}

var popup = window.open('https://microsoft.com', 'Microsoft', 'width=400, height=400, resizable=yes');
setTimeout(closeWindow, 1000);
showLocationInfo();
document.write("В истории " + history.length + " станиц");
// history.back(); // перемещение назад

