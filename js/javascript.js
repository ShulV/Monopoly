
var player_colors = ["red_player", "green_player", "blue_player", "purple_player", "yellow_player"]




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
    alert(margin_left_top);
    let path_size = field_size-2*margin_left_top;//14% ширина/высота углового поля
    
    scale_path = "M"+String(margin_left_top)+" "+String(margin_left_top)+
    " h "+path_size+" v "+path_size+" h "+(-path_size)+" Z";
    
    // установка параметров для пути и svg
    // PATH.setAttribute('d', scale_path);
    scale_path = "'"+scale_path+"'"
    RED_PLAYER.style.setProperty('--path1', scale_path);
    alert(scale_path);
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
      let src = "images/" + String(this.color) + ".png";
      let id = String(this.color);
      createPlayer(id);
    }
    
    changePositionX(player_id, x){
        document.getElementById(player_id).style.left = x+"px";
    }
    changePositionY(player_id, y){
        document.getElementById(player_id).style.top = y+"px";

    }
    

    // movePlayer(cell_number){
    //     let player_id = this.color
        
    //     for(let i=0;i < cell_number;i++) {
    //         let player_x = document.getElementById(player_id).offsetLeft;
    //         let player_y = document.getElementById(player_id).offsetTop;
    //         //если игрок в верхней линии клеток, но не в последней
    //         if (this.near_top_wall && !this.near_right_wall){
    //             let player_xn = player_x + 72;
    //             this.changePositionX(player_id, player_xn);
    //             if(player_xn > 72*9) this.near_right_wall = true;    
    //             else if(player_xn > 72) this.near_left_wall = false;   
    //             continue;
    //         }
    //         //если игрок в правой линии клеток, но не в последней
    //         if (this.near_right_wall && !this.near_bottom_wall){
    //             let player_yn = player_y + 72;
    //             this.changePositionY(player_id, player_yn);
    //             if(player_yn > 72*9) this.near_bottom_wall = true;    
    //             else if(player_yn > 72) this.near_top_wall = false;                 
    //             continue;
    //         }
    //         //если игрок в нижней линии клеток, но не в последней
    //         if (this.near_bottom_wall && !this.near_left_wall){
    //             let player_xn = player_x - 72;
    //             this.changePositionX(player_id, player_xn);
    //             if(player_xn < 72) this.near_left_wall = true;    
    //             else if(player_xn < 72*9) this.near_right_wall = false;                 
    //             continue;
    //         }
    //         //если игрок в ЛЕВОЙ линии клеток, но не в последней
    //         if (this.near_left_wall && !this.near_top_wall){
    //             let player_yn = player_y - 72;
    //             this.changePositionY(player_id, player_yn);
    //             if(player_yn < 72) this.near_top_wall = true;    
    //             else if(player_yn < 72*9) this.near_bottom_wall = false;                 
    //             continue;
    //         }
    //     }
                
    // }
  
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
        let random_num1 = randomInteger(1, 6);
        let random_num2 = randomInteger(1, 6);
        let result_msg = String(random_num1);
        result_msg += " " + String(random_num2);
        document.getElementById('dice1-result-text').textContent= "На 1-ом кубике выпало: " + String(random_num1);
        document.getElementById('dice2-result-text').textContent= "На 2-ом кубике выпало: " + String(random_num2);
        // Берём стили с помощью "getComputedStyle()", а не через "style", потому что, 
        // на момент первого запуска, в "style" у BLOCK отсутствует значение "--distanceN"
        let current_len = +getComputedStyle(RED_PLAYER).getPropertyValue('--distance1');
  
        current_len += random_num1 + random_num2; // % 100
        // // Убираем "деление по модулю" из строки, что находиться выше, и используем 
        // // его только там, где это необходимо. Например, для вывода в консоль:
        console.log('Прогресс текущей игры:', current_len % 100);
        // // Также это может быть полезным, для вычисления количества полных циклов:
        console.log('Игра №:', Math.trunc(current_len / 100) + 1);

        RED_PLAYER.style.setProperty('--distance1', current_len);
        // H.innerHTML = `offset-distance: ${ (current_len)}%;`;
    }

  }


function createGame(){
    player1 = new Player("Виктор",15000,0);
    game = new Game(1,[player1]);
}
function startGame(){
    createGame();
    setScalablePath();
}


