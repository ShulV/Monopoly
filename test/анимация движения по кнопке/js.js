const INPUT = document.querySelector('input');
const BLOCK = document.querySelector('.block');
const H = document.querySelector('h1');
const PATH = document.querySelector('.path');

// const update = e => {
//   BLOCK.style.setProperty('--distance', e.target.value);
//   H.innerHTML = `offset-distance: ${e.target.value}%;`;
// };

INPUT.addEventListener('input', update);

function randomInteger(min, max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

// функция выдает путь по квадрату относительно размера экрана пользователя
function setScalablePath(){
  // "M10 10 h 180 v 180 h -180 Z"
  // M x y - установка координат карандаша
  // h - горизональная линия x+10 (H - абсолютное значение 10)
  // v - вертикальная линия y+10 (V - абсолютное значение 10)
  // Z - линия в от последней точки до начальной

  // получение пути
  let scale_path = "";
  let rect = document.getElementById("container");
  let rect_style = getComputedStyle(rect);
  let path_size = parseInt(rect_style.height,10);
  
  let margin_left_top = Math.trunc(path_size * 1/13 / 2);
  path_size -= 2*margin_left_top;
  scale_path = "M"+String(margin_left_top)+" "+String(margin_left_top)+
  " h "+path_size+" v "+path_size+" h "+(-path_size)+" Z";
  
  // установка параметров для пути и svg
  PATH.setAttribute('d', scale_path);
  scale_path = "'"+scale_path+"'"
  BLOCK.style.setProperty('--path', scale_path);
}


function rollTheDice() {
  let random_num1 = randomInteger(1, 6);
  let random_num2 = randomInteger(1, 6);
  document.getElementById('dice1-result-text').textContent = "На 1-ом кубике выпало: " + String(random_num1);
  document.getElementById('dice2-result-text').textContent = "На 2-ом кубике выпало: " + String(random_num2);
  //this.current_player.movePlayer(random_num1+random_num2);
  
  // Берём стили с помощью "getComputedStyle()", а не через "style", потому что, 
  // на момент первого запуска, в "style" у BLOCK отсутствует значение "--distance"
  let current_len = +getComputedStyle(BLOCK).getPropertyValue('--distance');
  
  current_len += random_num1 + random_num2; // % 100
  // Убираем "деление по модулю" из строки, что находиться выше, и используем 
  // его только там, где это необходимо. Например, для вывода в консоль:
  console.log('Прогресс текущей игры:', current_len % 100);
  // Также это может быть полезным, для вычисления количества полных циклов:
  console.log('Игра №:', Math.trunc(current_len / 100) + 1);

  BLOCK.style.setProperty('--distance', current_len);
  H.innerHTML = `offset-distance: ${ (current_len)}%;`;
}

