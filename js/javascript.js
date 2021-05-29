var player_colors = ["red_player", "green_player", "blue_player", "purple_player", "yellow_player"]

function createImage(src,id){
    var image = document.createElement("img");
    image.style.height = "30px";
    image.style.position = "absolute";
    image.style.left = "21px";
    image.style.top = "21px";
    image.setAttribute("src",src);
    image.setAttribute("id",id);
    document.getElementById('play-field').appendChild(image);
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
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
      createImage(src, id);
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
        this.current_player.movePlayer(random_num1+random_num2);
        
    }

  }


function createGame(){
    player1 = new Player("Виктор",15000,0);
    game = new Game(1,[player1]);
}
function startGame(){
    createGame();

}


