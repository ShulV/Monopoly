const player_bg_colors = ["#d32020","#07b354","#1e92eb","#a20dff","#dbde23",];
const player_border_colors = ["#862a2a","#177842","#2475b3","#6c1c9e","#9fa127",]
const players_colors = ["red","green","blue","purple","yellow"];
const players_ids = ["red_player", "green_player", "blue_player", "purple_player", "yellow_player"]
const player_prop_block_ids = ["player-red-block","player-green-block","player-blue-block","player-purple-block","player-yellow-block",]
const class_color_name = ["red-text", "green-text", "blue-text", "purple-text", "yellow-text"]
const field_names = ["Start","Chanel","?","Hugo boss", "Tax income", "Audi","Adidas","?","Puma","Lacoste",
"Jail","Vkontakte","Rockstar games","Facebook","Twitter","Mercedes","Coca-cola","?","Pepsi","Fanta",
"Jackpot","American airlines","?","Lufthansa","British airways","Ford","McDonald's","BurgerKing","Rovio","KFC",
"GoToJail","Holiday Inn","Radisson","?","Novotel","Land rover","Tax luxury","Apple","?","Nokia"]
const percent_shift = [0,3.5,5.7,7.9,10.1,12.4,14.6,16.8,19,21.2,
    25,28.7,30.9,33,35.3,37.6,39.8,42,44.2,46.4,
    50,53.7,55.9,58.1,60.3,62.6,64.8,67,69.2,71.4,
    75,78.6,80.79,83,85.3,87.5,89.8,91.8,94.2,96.4];
const percent_single_field = 2.27272727;
const percent_single_and_half_field = 3.40919091;

var game;

function addPlayersBlock(player_number, player_list){
    for(let i=0; i<player_number;i++){
        let div = document.createElement("div");
        div.setAttribute("class","player-block");
        div.setAttribute("id",player_prop_block_ids[i]);
        //name
        let name_span = document.createElement("span");
        name_span.setAttribute("class","name-text");
        let name_text = document.createTextNode(player_list[i].name);
        name_span.appendChild(name_text);
        div.appendChild(name_span);
        //money
        let money_span = document.createElement("span");
        money_span.setAttribute("class","money-text");
        let money_text = document.createTextNode(player_list[i].money);
        money_span.appendChild(money_text);
        div.appendChild(money_span);
        //timer
        let timer_span = document.createElement("span");
        timer_span.setAttribute("id","timer-text"+i);
        timer_span.setAttribute("class","timer-text");
        let timer_text = document.createTextNode(game.remainingTime);
        timer_span.appendChild(timer_text);
        timer_span.style.display = "none";
        div.appendChild(timer_span);

        if (i==0){
            timer_span.style.display = "flex";
            div.classList.add("active");
        }
        document.getElementById('players-block').appendChild(div);
    }
    
}

function setFieldParams(){
    // 1,11,21,31 - угловые поля
    let root = document.querySelector(':root');
    let cell_size = getComputedStyle(root).getPropertyValue('--cell-size');
    let float_cell_size = parseFloat(cell_size);
    let left_offset_cell_size = 2*float_cell_size;
    let top_offset_cell_size = 2*float_cell_size;

    // play-cell-1, play-cell-2, ..
    for(let i=1; i<=40;i++){
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

function createPlayer(id,player_number){
    var circle = document.createElement("div");
    circle.style.height = "25px";
    circle.style.width = "25px";
    circle.style.position = "absolute";
    circle.style.left = "0px";
    circle.style.top = "0px";
    circle.style.border = " 2px solid " + player_border_colors[player_number];
    circle.style.borderRadius = "50%";
    circle.style.background = player_bg_colors[player_number];
    // circle.style.boxShadow = "20px 20px 50px 0px rgba(0, 0, 0, 1);"
    circle.setAttribute("id",id);
    circle.setAttribute("class",id);
    //circle.style.zIndex = 999999;
    document.getElementById('play-field').appendChild(circle);
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function doScrollDown(scroll_block_name) {
    document.getElementById(scroll_block_name).scrollTop = 999999;
}

// функция выдает путь по квадрату относительно размера экрана пользователя
function setScalablePath(player_num){
    let players = [];
    for(let i=0;i<player_num;i++){
        players[i] = document.querySelector('.'+players_ids[i]);
    // "M10 10 h 180 v 180 h -180 Z"
    // M x y - установка координат карандаша
    // h - горизональная линия x+10 (H - абсолютное значение 10)
    // v - вертикальная линия y+10 (V - абсолютное значение 10)
    // Z - линия в от последней точки до начальной
  
    // получение пути
    let scale_path = "";
    let rect = document.getElementById("play-field");
    let rect_style = getComputedStyle(rect);
    let field_size = parseInt(rect_style.height);
    
    let margin_left_top = Math.trunc(field_size * 0.071);//

    let path_size = field_size-2*margin_left_top;//14% ширина/высота углового поля
    
    scale_path = "M"+String(margin_left_top)+" "+String(margin_left_top)+
    " h "+path_size+" v "+path_size+" h "+(-path_size)+" Z";
    
    // установка параметров для пути и svg
    // PATH.setAttribute('d', scale_path);
    scale_path = "'"+scale_path+"'";
    players[i].style.setProperty('--path1', scale_path);
    };
    
};

class Player{

    constructor(name, money, number) {
      this.name = name;
      this.money = money;
      this.place = 0;
      this.number = number;
      this.color = players_colors[number];
      this.id = players_ids[number];
      this.current_field = 1;
      this.current_lap = 0;
      this.fields_passed_number = 0;
    //   let src = "images/" + String(this.color) + ".png";
      let id = String(this.id);
      createPlayer(id,number);
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
        this.curNonLosersNumber = player_number;
        this.player_list = player_list;
        this.current_player = this.player_list[0]; 
        this.players_queue = []; //очередь игроков  
        this.maxMovingTime=60; //максимальное время хода
        this.remainingTime = this.maxMovingTime; //оставшееся время таймера
        this.timerId; //таймер
        this.startTime=0; //время старта таймера
        

        for(let i=0;i<player_number;i++){
            this.players_queue.push(player_list[i]);
        }  
      }
      
    rollTheDice(){
        //получение двух случайных чисел
        let random_num1 = randomInteger(1, 6);
        let random_num2 = randomInteger(1, 6);
        let random_sum = random_num1 + random_num2;
        this.movePlayer(random_sum);
        
        //console.table(this.players_queue);
        
        this.addRollDiceMessage(class_color_name[this.current_player.number],random_num1,random_num2);

        this.players_queue.shift();
        this.players_queue.push(this.current_player);

        this.current_player = this.players_queue[0];

        this.updatePlayersBlock();
        
        clearInterval(this.timerId);

        let cur_player_number = this.players_queue[0].number;
        this.startTimer(cur_player_number);
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

    startTimer(cur_player_number){
        this.startTime = new Date().getTime();//время старта в милисекундах
        this.timerId  = setInterval(
            ()=>{
        let curTime = new Date().getTime();
        let remainingTime = this.maxMovingTime - Math.floor((curTime - this.startTime)/1000);
        

        let timer_span = document.getElementById("timer-text"+cur_player_number);
        timer_span.textContent = remainingTime;

        if(remainingTime==0){
            alert("Время хода вышло!");
            clearInterval(this.timerId);
        }
            }, 1000);
        
    }

    movePlayer(random_sum){
        let player_number = this.current_player.number;

        this.current_player.fields_passed_number += random_sum;
        this.current_player.current_lap = Math.floor(this.current_player.fields_passed_number/40);
        
        //изменение параметров фишки (анимация)
        let player = document.querySelector('.'+players_ids[player_number]);
        let cur_len = getComputedStyle(player).getPropertyValue('--distance'+(player_number+1));

        this.current_player.current_field = this.current_player.fields_passed_number % 40 + 1
        let cur_field = this.current_player.current_field;

        cur_len = this.current_player.current_lap*100+percent_shift[cur_field-1];
        player.style.setProperty('--distance'+(player_number+1), cur_len);
    }

    updatePlayersBlock(){
        this.updateMoneyText();
        this.updateTimerText();
        this.updateBackground();        
    }

    updateBackground(){
        let prev_player_number = this.players_queue[this.player_number-1].number;
        let cur_player_number = this.players_queue[0].number;
        let prev_div = document.getElementById(player_prop_block_ids[prev_player_number]);
        prev_div.classList.remove("active");
        let cur_div = document.getElementById(player_prop_block_ids[cur_player_number]);
        cur_div.classList.add("active");

    }

    updateMoneyText(){
        for(let i=0; i<this.player_number;i++){
            let div = document.getElementById(player_prop_block_ids[i]);
            let money_span = div.querySelector(".money-text");
            money_span.textContent = this.player_list[i].money; 
        }
    }

    updateTimerText(){
        let prev_player_number = this.players_queue[this.player_number-1].number;
        let cur_player_number = this.players_queue[0].number;
        let timer_span = document.getElementById("timer-text"+prev_player_number);
        timer_span.textContent = this.maxMovingTime;
        timer_span.style.display = "none";
        let cur_timer_span = document.getElementById("timer-text"+cur_player_number);
        cur_timer_span.style.display = "flex";
    }

}

  
function createGame(player_num,player_data){
    let players = [];
    for(let i=0;i<player_num;i++){
        players[i] = new Player(player_data[i][0],player_data[i][1],player_data[i][2]);
    }
    
    game = new Game(player_num,players);
}

function startGame(){
    let player_num = 5;
    let player_data = [["Victor",15000,0],["ILON MASK",15000,1],["Гена",15000,2],["Галкин",15000,3],["Семён",15000,4]];
    createGame(player_num, player_data);
    addPlayersBlock(player_num,game.player_list);
    setScalablePath(player_num);
    setFieldParams();
    game.startTimer(0);
}


