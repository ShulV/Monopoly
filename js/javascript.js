
const player_colors = ["red_player", "green_player", "blue_player", "purple_player", "yellow_player"]
const class_color_name = ["red-text", "green-text", "blue-text", "purple-text", "yellow-text"]

function setFieldParams(){
    // 1,11,21,31 - угловые поля
    let root = document.querySelector(':root');
    let cell_size = getComputedStyle(root).getPropertyValue('--cell-size');
    let float_cell_size = parseFloat(cell_size);
    let left_offset_cell_size = 2*float_cell_size;
    let top_offset_cell_size = 2*float_cell_size;
    // play-cell-1, play-cell-2, ...
    for(let i=1; i<41;i++){
        let cell_class_name = "play-cell-" + String(i)
        let cell_elem = document.getElementById(cell_class_name);
        
        // угловые
        if (i==1 || i==11 || i==21 || i==31){
            cell_elem.style.width = String(float_cell_size*2)+"%";
            cell_elem.style.height = String(float_cell_size*2)+"%"; 
            if (i==1){
                cell_elem.style.top = "0";
                cell_elem.style.left = "0";
                continue; 
            }    
            if (i==11){
                cell_elem.style.top = "0";
                cell_elem.style.right = "0";
                continue; 
            } 
            if (i==21){
                cell_elem.style.bottom = "0";
                cell_elem.style.right = "0";
                continue; 
            } 
            if (i==31){
                cell_elem.style.bottom = "0";
                cell_elem.style.left = "0";
                continue; 
            } 
        }
        // верхняя линия
        if (i>1 && i<11 ){
            cell_elem.style.top = "0";
            cell_elem.style.left = String(left_offset_cell_size)+"%";
            cell_elem.style.width = String(float_cell_size)+"%";
            cell_elem.style.height = String(float_cell_size*2)+"%";
            left_offset_cell_size += float_cell_size;
            continue; 
        }
        // правая линия
        if (i>11 && i<21 ){
            cell_elem.style.right = "0";
            cell_elem.style.top = String(top_offset_cell_size)+"%";
            cell_elem.style.width = String(float_cell_size*2)+"%";
            cell_elem.style.height = String(float_cell_size)+"%";
            top_offset_cell_size += float_cell_size;
            continue; 
        }
        // нижняя линия
        if (i>21 && i<31 ){
            cell_elem.style.bottom = "0";
            left_offset_cell_size -= float_cell_size;
            cell_elem.style.left = String(left_offset_cell_size)+"%";
            cell_elem.style.width = String(float_cell_size)+"%";
            cell_elem.style.height = String(float_cell_size*2)+"%";
            continue;             
        }
        // левая линия
        if (i>31 && i<41 ){
            cell_elem.style.left = "0";
            top_offset_cell_size -= float_cell_size;
            cell_elem.style.top = String(top_offset_cell_size)+"%";
            cell_elem.style.width = String(float_cell_size*2)+"%";
            cell_elem.style.height = String(float_cell_size)+"%";
            continue; 
        }
        
    }
}

function createPlayer(id){
    var circle = document.createElement("div");
    circle.style.height = "25px";
    circle.style.width = "25px";
    circle.style.position = "absolute";
    circle.style.left = "0px";
    circle.style.top = "0px";
    circle.style.border = " 2px solid #862a2a"
    circle.style.borderRadius = "50%";
    circle.style.background = "#d32020";
    // circle.style.boxShadow = "20px 20px 50px 0px rgba(0, 0, 0, 1);"
    circle.setAttribute("id",id);
    circle.setAttribute("class",id);
    circle.style.zIndex = 999999;
    document.getElementById('play-field').appendChild(circle);
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
// функция выдает путь по квадрату относительно размера экрана пользователя
function setScalablePath(){
    RED_PLAYER = document.querySelector('.red_player');
    // "M10 10 h 180 v 180 h -180 Z"
    // M x y - установка координат карандаша
    // h - горизональная линия x+10 (H - абсолютное значение 10)
    // v - вертикальная линия y+10 (V - абсолютное значение 10)
    // Z - линия в от последней точки до начальной
  
    // получение пути
    let scale_path = "";
    let rect = document.getElementById("play-field");
    let rect_style = getComputedStyle(rect);
    let field_size = parseInt(rect_style.height,10);
    
    let margin_left_top = Math.trunc(field_size * 0.071);//

    let path_size = field_size-2*margin_left_top;//14% ширина/высота углового поля
    
    scale_path = "M"+String(margin_left_top)+" "+String(margin_left_top)+
    " h "+path_size+" v "+path_size+" h "+(-path_size)+" Z";
    
    // установка параметров для пути и svg
    // PATH.setAttribute('d', scale_path);
    scale_path = "'"+scale_path+"'"
    RED_PLAYER.style.setProperty('--path1', scale_path);
  }


class Player{

    constructor(name, money, number) {
      this.name = name;
      this.money = money;
      this.place = 0;
      this.number = number;
      this.color = player_colors[number];
      this.near_left_wall = true;
      this.near_right_wall = false;
      this.near_top_wall = true;
      this.near_bottom_wall = false;
    //   let src = "images/" + String(this.color) + ".png";
      let id = String(this.color);
      createPlayer(id);
    }
    
    changePositionX(player_id, x){
        document.getElementById(player_id).style.left = x+"px";
    }
    changePositionY(player_id, y){
        document.getElementById(player_id).style.top = y+"px";

    }
    
  
  }

  class Game {
    constructor(player_number,player_list) {
        this.player_number = player_number;
        this.player_list = player_list;
        this.current_player = this.player_list[0];
        //sdthis.create_asset_fields();
        
      }
      
    create_asset_fields(){
        let x = 0;
        let y = 0;
        let asset_field_id;
        for(let i=1;i<=9;i++){
            asset_field_id = "play-cell-"+String(i);
            document.getElementById(asset_field_id).style.left = (i-1)*72+"px";
            //document.getElementById(asset_field_id).textContent = i;
        }
        for(let i=1;i<=9;i++){
            asset_field_id = "play-cell-"+String(i+9);
            document.getElementById(asset_field_id).style.top = (i-1)*72+"px";
            document.getElementById(asset_field_id).style.left = 720-72+"px";
            //document.getElementById(asset_field_id).textContent = i+9;
        }
        for(let i=1;i<=9;i++){
            asset_field_id = "play-cell-"+String(i+18);
            document.getElementById(asset_field_id).style.top = 720-72+"px";
            document.getElementById(asset_field_id).style.left = 720-72-(i-1)*72+"px";
            //document.getElementById(asset_field_id).textContent = i+18;
        }
        for(let i=1;i<=9;i++){
            asset_field_id = "play-cell-"+String(i+27);
            document.getElementById(asset_field_id).style.top = 720-72-(i-1)*72+"px";
            //document.getElementById(asset_field_id).textContent = i+27;
        }
    }

    rollTheDice(){
        //получение двух случайных чисел
        let random_num1 = randomInteger(1, 6);
        let random_num2 = randomInteger(1, 6);
        //изменение параметров фишки (анимация)
        let current_len = +getComputedStyle(RED_PLAYER).getPropertyValue('--distance1');
        current_len += random_num1 + random_num2; // % 100
        // console.log('Прогресс текущей игры:', current_len % 100);
        // console.log('Игра №:', Math.trunc(current_len / 100) + 1);
        RED_PLAYER.style.setProperty('--distance1', current_len);
        // H.innerHTML = `offset-distance: ${ (current_len)}%;`;
        //вывод в чат
        addRollDiceMessage("ИМЯ ИГРОКА",class_color_name[0],random_num1,random_num2);
    }

  }


function createGame(){
    player1 = new Player("Виктор",15000,0);
    game = new Game(1,[player1]);
}
function startGame(){
    createGame();
    setScalablePath();
    setFieldParams();
}

// function addRollDiceMessage(player_name,color_class,num1,num2){
//     var par = document.createElement("p");
//     var name_text = document.createElement("span");
//     name_text.setAttribute("class",color_class);
//     var text = document.createTextNode(player_name);
//     name_text.appendChild(text);
//     par.appendChild(name_text);
//     text = document.createTextNode(" выбрасывает "+String(num1)+":"+String(num2));
//     par.appendChild(text);
//     document.getElementById('chat-block').appendChild(par);
// }
