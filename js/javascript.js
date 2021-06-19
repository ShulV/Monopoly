
const player_colors = ["red_player", "green_player", "blue_player", "purple_player", "yellow_player"]
const class_color_name = ["red-text", "green-text", "blue-text", "purple-text", "yellow-text"]
const field_names = ["Start","Chanel","?","Hugo boss", "Tax income", "Audi","Adidas","?","Puma","Lacoste",
"Jail","Vkontakte","Rockstar games","Facebook","Twitter","Mercedes","Coca-cola","?","Pepsi","Fanta",
"Jackpot","American airlines","?","Lufthansa","British airways","Ford","McDonald's","BurgerKing","Rovio","KFC",
"GoToJail","Hollday Inn","Radisson","?","Novotel","Land rover","Tax luxury","Apple","?","Nokia"]
const percent_single_field = 2.2727;
const percent_single_and_half_field = 3.4091;
function setFieldParams(){
    // 1,11,21,31 - угловые поля
    let root = document.querySelector(':root');
    let cell_size = getComputedStyle(root).getPropertyValue('--cell-size');
    let float_cell_size = parseFloat(cell_size);
    let left_offset_cell_size = 2*float_cell_size;
    let top_offset_cell_size = 2*float_cell_size;

    // play-cell-1, play-cell-2, ..
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

        cell_elem.style.width = String(float_cell_size*2)+"%";
        cell_elem.style.height = String(float_cell_size)+"%";

        // верхняя линия
        if (i>1 && i<11 ){
            cell_elem.style.top = String(float_cell_size*2)+"%";
            console.log(String(float_cell_size*2)+"%");
            cell_elem.style.left = String(left_offset_cell_size)+"%";
            left_offset_cell_size += float_cell_size;
            continue; 
        }
        // правая линия
        if (i>11 && i<21 ){
            cell_elem.style.right = "0";
            cell_elem.style.top = String(top_offset_cell_size)+"%";
            top_offset_cell_size += float_cell_size;
            continue; 
        }
        // нижняя линия
        if (i>21 && i<31 ){
            cell_elem.style.bottom = "-"+String(float_cell_size)+"%";
            left_offset_cell_size -= float_cell_size;
            cell_elem.style.left = String(left_offset_cell_size)+"%";
            continue;             
        }
        // левая линия
        if (i>31 && i<41 ){
            cell_elem.style.left = "0";
            top_offset_cell_size -= float_cell_size;
            cell_elem.style.top = String(top_offset_cell_size)+"%";
            continue; 
        }
        
    }
    // chat-block
    let chat_block = document.getElementById('chat-block');
    chat_block.style.top = String(float_cell_size*2)+"%";
    chat_block.style.left = String(float_cell_size*2)+"%";
    chat_block.style.height = String(float_cell_size*9)+"%";
    chat_block.style.width = String(float_cell_size*9)+"%";
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
function doScrollDown(scroll_block_name) {
    document.getElementById(scroll_block_name).scrollTop = 9999;
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
      this.current_field = 1;
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

    rollTheDice(){ //TODO исправить, чтобы накопление погрешности не портило позиционирование

        //получение двух случайных чисел
        let random_num1 = randomInteger(1, 6);
        let random_num2 = randomInteger(1, 6);
        let random_sum = random_num1 + random_num2;
        //изменение параметров фишки (анимация)
        let current_len = +getComputedStyle(RED_PLAYER).getPropertyValue('--distance1');
        // if(random_sum == 12){
        //     if 
        // }
        
        // логика отслеживания прохода через углы, там движение на 1.5 ширины игрового поля
        let cur_field = this.current_player.current_field;
        let next_cur_field = cur_field +random_sum;
        //если игрок начинает движение из любой угловой клетки
        if ( cur_field == 1 || cur_field ==11 || cur_field ==21|| cur_field ==31){
            if (random_sum < 10) {
                current_len += percent_single_and_half_field + percent_single_field * (random_sum-1);
            }
            else if (random_sum == 10) {
                current_len += 2*percent_single_and_half_field + percent_single_field * (random_sum-2);
            }
            else {
                current_len += 3*percent_single_and_half_field + percent_single_field * (random_sum-3);
            }
            console.log("из угла");
        }
        else if( next_cur_field == 1 || next_cur_field ==11 || next_cur_field ==21|| next_cur_field ==31){
            if (random_sum < 10) {
                current_len += percent_single_and_half_field + percent_single_field * (random_sum-1);
            }
            else if (random_sum == 10) {
                current_len += 2*percent_single_and_half_field + percent_single_field * (random_sum-2);
            }
            else {
                current_len += 3*percent_single_and_half_field + percent_single_field * (random_sum-3);
            }
            console.log("в угол");
        }
        else if(Math.ceil((next_cur_field)/10) - Math.ceil(cur_field/10) > 0) {
            current_len += 2*percent_single_and_half_field + percent_single_field * (random_sum-2);
            console.log("переход");
        }
        else {
            current_len += percent_single_field * random_sum;
            console.log("нет перехода");
        }


        this.current_player.current_field += random_sum ;
        this.current_player.current_field %= 40;
        if (this.current_player.current_field == 0) this.current_player.current_field = 1;


        // console.log("current_field = ", cur_field);
        // console.log("current_len = " + current_len);
        // console.log("игрок на поле: " + this.current_player.current_field);
        // console.log('Прогресс текущей игры:', current_len % 100);
        // console.log('Игра №:', Math.trunc(current_len / 100) + 1);
        RED_PLAYER.style.setProperty('--distance1', current_len);
        //вывод в чат
        this.addRollDiceMessage(class_color_name[0],random_num1,random_num2);
    }
    addRollDiceMessage(color_class,num1,num2){
        var par = document.createElement("p");
        var name_text = document.createElement("span");
        name_text.setAttribute("class",color_class);
        var text = document.createTextNode(this.current_player.name);
        name_text.appendChild(text);
        par.appendChild(name_text);
        let field_num = this.current_player.current_field;
        
        let msg_text = " выбрасывает "+String(num1)+":"+String(num2) + " и попадает на поле '" + field_names[field_num-1] + "'";
        text = document.createTextNode(msg_text);
  
        par.appendChild(text);
        document.getElementById('chat-block').appendChild(par);
        doScrollDown('chat-block');
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


