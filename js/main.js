const playerBgColors = ["#d32020","#07b354","#1e92eb","#a20dff","#dbde23",];
const playerBorderColors = ["#862a2a","#177842","#2475b3","#6c1c9e","#9fa127",];
const playersColors = ["red","green","blue","purple","yellow"];
const playersIds = ["red-player", "green-player", "blue-player", "purple-player", "yellow-player"];
const playerPropBlockIds = ["player-red-block","player-green-block","player-blue-block","player-purple-block","player-yellow-block",];
const classColorName = ["red-text", "green-text", "blue-text", "purple-text", "yellow-text"];
const fieldNames = ["Start","Chanel","?","Hugo boss", "Tax income", "Audi","Adidas","?","Puma","Lacoste",
"Jail","Vkontakte","Rockstar games","Facebook","Twitter","Mercedes","Coca-cola","?","Pepsi","Fanta",
"Jackpot","American airlines","?","Lufthansa","British airways","Ford","McDonald's","BurgerKing","Rovio","KFC",
"GoToJail","Holiday Inn","Radisson","?","Novotel","Land rover","Tax luxury","Apple","?","Nokia"];
const rentMessages = ["Стройте филиалы, чтобы увеличить ренту.", 
"Рента зависит и от количества Разработчиков игр, которыми вы владеете.",
"Рента зависит от количества Автомобилей, которыми вы владеете."];
const monopolyNames = ["Автомобили","Парфюмерия","Одежда","Веб-сервисы","Напитки","Авиалинии","Рестораны","Отели","Электроника","Разработчики игр"];
const normalMonopolyRentList = [
[250,500,1000,2000],
[20,100,300,900,1600,2500],[60,300,900,2700,4000,5500],
[100,500,1500,4500,6250,7500],[140,700,2000,5500,7500,9500],
[180,900,2500,7000,8750,10500],[220,1100,3300,8000,9750,11500],
[260,1300,3900,9000,11000,12750],[350,1750,5000,11000,13000,15000],
[100,250]];
const lastMonopolyRentList = [[250,500,1000,2000],
[40,200,600,1800,3200,4500],[80,400,1000,3000,4500,6000],
[120,600,1800,5000,7000,9000],[160,800,2200,6000,8000,10000],
[200,1000,3000,7500,9250,11000],[240,1200,3600,8500,10250,12000],
[280,1500,4500,10000,12000,14000],[500,2000,6000,14000,17000,20000],
[100,250]];
const fieldCost = [null,600,null,600, null, 2000,1000,null,1000,1200,
null,1400,1500,1400,1600,2000,1800,null,1800,2000,
null,2200,null,2200,2400,2000,2600,2600,1500,2800,
null,3000,3000,null,3200,2000,null,3500,null,4000];

const fieldUpgradePrices = [null,500,500,750,1000,1250,1500,1750,2000,null];

const percentShift = [0,3.5,5.7,7.9,10.1,12.4,14.6,16.8,19,21.2,
    25,28.7,30.9,33,35.3,37.6,39.8,42,44.2,46.4,
    50,53.7,55.9,58.1,60.3,62.6,64.8,67,69.2,71.4,
    75,78.6,80.79,83,85.3,87.5,89.8,91.8,94.2,96.4];
const percentSingleField = 2.27272727;
const percentSingleAndHalfField = 3.40919091;

let game;
let fields = [];
let rollDiceModal;
let buyFieldModal;


function addPlayersBlock(playerNumber, playerList){
    for(let i=0; i<playerNumber;i++){
        let div = document.createElement("div");
        div.setAttribute("class","player-block");
        div.setAttribute("id",playerPropBlockIds[i]);
        //name
        let nameSpan = document.createElement("span");
        nameSpan.setAttribute("class","name-text");
        let nameText = document.createTextNode(playerList[i].name);
        nameSpan.appendChild(nameText);
        div.appendChild(nameSpan);
        //money
        let moneySpan = document.createElement("span");
        moneySpan.setAttribute("class","money-text");
        let moneyText = document.createTextNode(playerList[i].money);
        moneySpan.appendChild(moneyText);
        div.appendChild(moneySpan);
        //timer
        let timerSpan = document.createElement("span");
        timerSpan.setAttribute("id","timer-text"+i);
        timerSpan.setAttribute("class","timer-text");
        let timerText = document.createTextNode(game.remainingTime);
        timerSpan.appendChild(timerText);
        timerSpan.style.display = "none";
        div.appendChild(timerSpan);

        if (i==0){
            timerSpan.style.display = "flex";
            div.classList.add("active");
        }
        document.getElementById('players-block').appendChild(div);
    }
    
}

function setFieldParams(){
    // 1,11,21,31 - угловые поля
    let root = document.querySelector(':root');
    let cellSize = getComputedStyle(root).getPropertyValue('--cell-size');
    let floatCellSize = parseFloat(cellSize);
    let leftOffsetCellSize = 2*floatCellSize;
    let topOffsetCellSize = 2*floatCellSize;

    // play-cell-1, play-cell-2, ..
    for(let i=1; i<=40;i++){
        let cellClassName = "play-cell-" + String(i)
        let cellElem = document.getElementById(cellClassName);
        
        // угловые
        if (i==1 || i==11 || i==21 || i==31){
            cellElem.style.width = String(floatCellSize*2)+"%";
            cellElem.style.height = String(floatCellSize*2)+"%"; 
            if (i==1){
                cellElem.style.top = "0";
                cellElem.style.left = "0";
                continue; 
            }    
            if (i==11){
                cellElem.style.top = "0";
                cellElem.style.right = "0";
                continue; 
            } 
            if (i==21){
                cellElem.style.bottom = "0";
                cellElem.style.right = "0";
                continue; 
            } 
            if (i==31){
                cellElem.style.bottom = "0";
                cellElem.style.left = "0";
                continue; 
            } 
        }

        cellElem.style.width = String(floatCellSize*2)+"%";
        cellElem.style.height = String(floatCellSize)+"%";

        // верхняя линия
        if (i>1 && i<11 ){
            cellElem.style.top = String(floatCellSize*2)+"%";
            cellElem.style.left = String(leftOffsetCellSize)+"%";
            leftOffsetCellSize += floatCellSize;
            continue; 
        }
        // правая линия
        if (i>11 && i<21 ){
            cellElem.style.right = "0";
            cellElem.style.top = String(topOffsetCellSize)+"%";
            topOffsetCellSize += floatCellSize;
            continue; 
        }
        // нижняя линия
        if (i>21 && i<31 ){
            cellElem.style.bottom = "-"+String(floatCellSize)+"%";
            leftOffsetCellSize -= floatCellSize;
            cellElem.style.left = String(leftOffsetCellSize)+"%";
            continue;             
        }
        // левая линия
        if (i>31 && i<41 ){
            cellElem.style.left = "0";
            topOffsetCellSize -= floatCellSize;
            cellElem.style.top = String(topOffsetCellSize)+"%";
            continue; 
        }
        
    }
    // chat-block
    let chatBlock = document.getElementById('chat-block');
    chatBlock.style.top = String(floatCellSize*2)+"%";
    chatBlock.style.left = String(floatCellSize*2)+"%";
    chatBlock.style.height = String(floatCellSize*9)+"%";
    chatBlock.style.width = String(floatCellSize*9)+"%";
    // modal-block
    // 5% отступы относительно чат-блока
    let chatBlockWidth = chatBlock.clientWidth;
    let modalWidth = chatBlockWidth*0.9; //без боковых отступов
    let modalHeight = Math.floor(modalWidth / 3);
    let modalBlocks = document.getElementsByClassName('modal-block');
    for(let i=0; i<modalBlocks.length;i++){
        modalBlocks[i].style.width = modalWidth+"px";
        modalBlocks[i].style.height = modalHeight+"px";
        modalBlocks[i].style.marginTop = String(floatCellSize*2+3)+"%";
    }
    
}

function createFields(){
    for(let i=0;i<40;i++){
        let fieldNum = i+1;
        let monopolyNum = getMonopolyNumber(fieldNum);
        let name = fieldNames[i];
        let cost = fieldCost[i];
        if (cost){
            if(monopolyNum==0){
                //авто
                fields[i] = new CarField(name,cost,fieldNum,monopolyNum);
            }
            else if (monopolyNum==9){
                //гейм дев
                fields[i] = new GameDevsField(name,cost,fieldNum,monopolyNum);
            }
            else {
                //прокач. моны
                let rentList;
                if(isLastField(fieldNum)) rentList = lastMonopolyRentList[monopolyNum];
                else rentList = normalMonopolyRentList[monopolyNum];
                fields[i] = new ImprovableField(name,cost,fieldNum,monopolyNum,rentList);
            }
        }
        else fields[i] = null; //спец поле  
    }
}

class ModalWindow{
    //объект игры всегда должен называться game
    /*
    modalType - строка
    0 - "rollDice" - бросить кубики (h-"Ваш ход",b-"Какой-то совет",f-1:"бросить кубики")
    1 - "buyField" - купить поле/аукцион (h-"Покупаем?",b-"Если вы откажетесь от покупки, то поле будет выставлено на общий аукцион",f-1:"купить за 100к",2:"на аукцион")
    2 - "payPlayerRent" - заплатить аренду (h-"Заплатите аренду.",b-"Попадая на чужие поля, вы должны выплачивать арнеду его владельцу",f-1:"заплатить 100к")
    3 - "payBankRent" - заплатить банку (h-"Заплатите банку.",b-"Вы можете получить деньги, продав филиалы или заложив фирму - для этого кликните на неё.",f-1:"заплатить 100к")
    4 - "auction" - аукцион (h-"На аукционе fieldName!",b-"Вы можете либо поднять ставку на 100к, либо покинуть аукцион.",f-1:"Поднять до 3100к", 2:"отказаться")
    */
    constructor(modalType){
        let isOneButton = true;
        this.btnText2 = null;
        this.btnId2 = null;
        this.btnFuncName2 = null;
        this.headerId = "modal-header-"+modalType;
        this.bodyId = "modal-body-"+modalType;
        this.footerId = "modal-footer-"+modalType;
        switch(modalType) {
            case 'rollDice':
                this.modalName = "roll-the-dice-modal";
                this.headerText = "Ваш ход!";
                this.bodyText = "Совет.";
                this.btnText1 = "Бросить кубики";
                this.btnId1 = "modal-btn-roll-dice";
                this.btnFuncName1 = "game.rollTheDice()"
                break;
            case 'buyField':
                this.modalName = "buy-field-modal";
                this.headerText = "Заплатите аренду.";
                this.bodyText = "Попадая на чужие поля, вы должны выплачивать арнеду его владельцу.";
                let sum = 100; //TODO
                this.btnText1 = "Купить за " + sum + "k";
                this.btnText2 = "На аукцион.";
                this.btnId1 = "modal-btn-buy-field";
                this.btnId2 = "modal-btn-refuse";
                this.btnFuncName1 = "game.currentPlayer.buyField()"
                this.btnFuncName2 = "game.currentPlayer.refuseBuyField()"
                isOneButton = false;
                break;
            //TODO
            case 'payPlayerRent':
                break;
            case 'payBankRent':
                break;
            case 'auction':
                break;
            default:
                break;
          }
        this.modalElement = this.createModalWindowElem(isOneButton);
    }
    createModalWindowElem(isOneButton){
        const modal = document.createElement('div');
        modal.classList.add("modal-block");
        modal.setAttribute('id',this.modalName);
        modal.insertAdjacentHTML('afterbegin',`
            
                <div id=${this.headerId}>
                    <span>${this.headerText}</span>
                </div>
                <div id=${this.bodyId}>
                    <p>${this.bodyText}</p>
                </div>
                <div id=${this.footerId}>
                    <div id=${this.btnId1} class="modal-btn modal-small-btn" onclick=${this.btnFuncName1}>
                        <span>${this.btnText1}</span>
                    </div>
                    <div id=${this.btnId2} class="modal-btn modal-small-btn" onclick=${this.btnFuncName2}>
                        <span>${this.btnText2}</span>
                    </div>
                </div>
            `);

        document.getElementById("play-field").appendChild(modal);

        if(isOneButton) this.deleteSecondButton();

        document.getElementById(this.modalName).classList.add(this.modalName);
        document.getElementById(this.headerId).classList.add("modal-header");
        document.getElementById(this.bodyId).classList.add("modal-body");
        document.getElementById(this.footerId).classList.add("modal-footer");
        
        let btn1 = document.getElementById(this.btnId1);
        btn1.classList.add(this.btnId1);
        btn1.classList.add("modal-btn");
        return modal;
    }
    deleteSecondButton(){
        let btn2 = document.getElementById(this.btnId2);
        document.getElementById(this.footerId).removeChild(btn2);
        document.getElementById(this.btnId1).classList.remove("modal-small-btn");
    }
    open(){
        document.getElementById(this.modalName).classList.add("open");
    }
    close(){
        document.getElementById(this.modalName).classList.remove("open");
    }
}



function createModals(game){
    rollDiceModal = new ModalWindow("rollDice",game);
    buyFieldModal = new ModalWindow("buyField",game);
}


function createPlayer(id,playerNumber){
    let circle = document.createElement("div");
    circle.style.height = "25px";
    circle.style.width = "25px";
    circle.style.position = "absolute";
    circle.style.left = "0px";
    circle.style.top = "0px";
    circle.style.border = " 2px solid " + playerBorderColors[playerNumber];
    circle.style.borderRadius = "50%";
    circle.style.background = playerBgColors[playerNumber];
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

function doScrollDown(scrollBlockName) {
    document.getElementById(scrollBlockName).scrollTop = 999999;
}

function getMonopolyNumber(fieldNum){
    let fl = parseInt(fieldNum);
    if (fl == 1 || fl == 11 || fl == 21 || fl == 31){
        return null; //угловое поле
    }
    if (fl == 3 || fl == 8 || fl == 18 || fl == 23 || fl == 34 || fl == 39){
        return null; //поле "?"
    }
    if (fl == 5 || fl == 37) {
        return null; //налоговые поля
    }
    if (fl == 6 || fl == 16 || fl == 26 ||  fl == 36){
        return 0; //мона автомобилей
    }
    if (fl == 13 || fl == 29){
        return 9; //мона разработчиков игр
    }
    if (fl < 5) {
        return 1; //мона парфюмерии
    }
    if (fl < 11) {
        return 2; //мона одежды
    }
    if (fl < 16) {
        return 3; //мона веб-сервисов
    }
    if (fl < 21) {
        return 4; //мона напитков
    }
    if (fl < 26) {
        return 5; //мона авиалиний
    }
    if (fl < 31) {
        return 6; //мона ресторанов
    }
    if (fl < 36) {
        return 7; //мона отелей
    }
    else return 8; //мона электроники
}

function isLastField(fieldNum){
    let fl = fieldNum;
    if(fl==4 || fl == 10 || fl == 15|| fl == 20 || 
        fl == 25 || fl == 30 || fl == 35 || fl == 40) return true;
    return false
}

// функция выдает путь по квадрату относительно размера экрана пользователя
function setScalablePath(playerNum){
    let players = [];
    for(let i=0;i<playerNum;i++){
        players[i] = document.querySelector('.'+playersIds[i]);
    // "M10 10 h 180 v 180 h -180 Z"
    // M x y - установка координат карандаша
    // h - горизональная линия x+10 (H - абсолютное значение 10)
    // v - вертикальная линия y+10 (V - абсолютное значение 10)
    // Z - линия в от последней точки до начальной
  
    // получение пути
    let scalePath = "";
    let rect = document.getElementById("play-field");
    let rectStyle = getComputedStyle(rect);
    let fieldSize = parseInt(rectStyle.height);
    
    let marginLeftTop = Math.trunc(fieldSize * 0.071);//

    let pathSize = fieldSize-2*marginLeftTop;//14% ширина/высота углового поля
    
    scalePath = "M"+String(marginLeftTop)+" "+String(marginLeftTop)+
    " h "+pathSize+" v "+pathSize+" h "+(-pathSize)+" Z";
    
    // установка параметров для пути и svg
    // PATH.setAttribute('d', scalePath);
    scalePath = "'"+scalePath+"'";
    players[i].style.setProperty('--path1', scalePath);
    };
    
};

class Field {
    constructor(name,cost,fieldNum,monopolyNum){
        this.fieldName = name;
        
        
        this.cost = cost;
        this.deposit = this.cost / 2;
        this.buyback = this.deposit * 1.2;
        this.fieldNum = fieldNum;
        this.monopolyNum = monopolyNum;
        this.rentLevel = 0;

        if(monopolyNum == 0) this.rentMessage = rentMessages[2];
        else if(monopolyNum == 9) this.rentMessage = rentMessages[1];
        else this.rentMessage = rentMessages[0];

        this.owner = null;
        this.isMonopoly = false;
    }

    getRent(){

    }
}

class ImprovableField extends Field{
    constructor(name,cost,fieldNum,monopolyNum,rentList){
        super(name,cost,fieldNum,monopolyNum);
        this.rentList = rentList;
        this.upgradePrice = fieldUpgradePrices[monopolyNum];
        //rentLevel [0..5] max=5
    }
}

class GameDevsField extends Field{
    constructor(name,cost,fieldNum,monopolyNum){
        super(name,cost,fieldNum,monopolyNum);
        this.multiplierRentList = normalMonopolyRentList[9];
        //rentLevel [0..1] max=1
    }
}

class CarField extends Field{
    constructor(name,cost,fieldNum,monopolyNum){
        super(name,cost,fieldNum,monopolyNum);
        this.rentList = normalMonopolyRentList[0];
        //rentLevel [0..3] max=3
    }
}

class Player{

    constructor(name, money, number) {
      this.name = name;
      this.money = money;
      this.place = 0;
      this.number = number;
      this.color = playersColors[number];
      this.id = playersIds[number];
      this.currentFieldNum = 1;
      this.currentFieldObj = fields[0];
      this.currentLap = 0;
      this.fieldsPassedNumber = 0;
      this.isLoser;
      this.purchasedFields = [];
    //   let src = "images/" + String(this.color) + ".png";
      let id = String(this.id);
      createPlayer(id,number);
    }
    
    buyField(){
        buyFieldModal.close();
    }

    refuseBuyField(){
        buyFieldModal.close();
    }
  
  }

class Game {
    constructor(playerNumber,playerList) {
        this.playerNumber = playerNumber;
        this.curNonLosersNumber = playerNumber;
        this.playerList = playerList;
        this.currentPlayer = this.playerList[0]; 
        this.playersQueue = []; //очередь игроков  
        this.maxMovingTime=5; //максимальное время хода
        this.remainingTime = this.maxMovingTime; //оставшееся время таймера
        this.timerId; //таймер
        this.startTime=0; //время старта таймера
        

        for(let i=0;i<playerNumber;i++){
            this.playersQueue.push(playerList[i]);
        }  
      }
      
    rollTheDice(){
        rollDiceModal.close();
        //получение двух случайных чисел
        let randomNum1 = randomInteger(1, 6);
        let randomNum2 = randomInteger(1, 6);
        let randomSum = randomNum1 + randomNum2;
        this.movePlayer(randomSum);
        
        // console.table(this.playersQueue);
        
        this.addRollDiceMessage(randomNum1,randomNum2);
        let curField = fields[this.currentPlayer.currentFieldNum-1]
        if(curField && !curField.owner){
            this.addGotOnFieldMessage();
            buyFieldModal.open();
        }

        this.playersQueue.shift();
        this.playersQueue.push(this.currentPlayer);

        this.currentPlayer = this.playersQueue[0];

        this.updatePlayersBlock();
        
        clearInterval(this.timerId);

        let curPlayerNumber = this.playersQueue[0].number;
        
        rollDiceModal.open();
        this.startTimer(curPlayerNumber);
    }

    playerLose(){
        clearInterval(this.timerId);
        this.addSurrenderMessage();
        this.playersQueue.shift();
        this.playersQueue.push(this.currentPlayer);
        this.currentPlayer = this.playersQueue[0];
        this.updatePlayersBlock();
        
        
        let playerLoser = this.playersQueue.pop();
        playerLoser.isLoser = true;


        let circle = document.getElementById(playerLoser.id);
        document.getElementById('play-field').removeChild(circle);
        let playerLoserBlock = document.getElementById(playerPropBlockIds[playerLoser.number]);
        playerLoserBlock.classList.add("player-is-loser");

        this.curNonLosersNumber--;
        if (this.curNonLosersNumber == 1) {
            this.playerWin();
            return;
        }
        this.startTimer(this.currentPlayer.number);
    }

    playerWin(){
        let winnerName = this.playersQueue[0].name;
        alert(winnerName + " Победил!");
    }

    addRollDiceMessage(num1,num2){
        let colorClass = classColorName[this.currentPlayer.number];
        let par = document.createElement("p");
        let nameText = document.createElement("span");
        nameText.setAttribute("class",colorClass);
        let text = document.createTextNode(this.currentPlayer.name);
        nameText.appendChild(text);
        par.appendChild(nameText);
        let fieldNum = this.currentPlayer.currentFieldNum;
        
        let msgText = " выбрасывает "+String(num1)+":"+String(num2);
        text = document.createTextNode(msgText);
  
        par.appendChild(text);
        document.getElementById('chat-block').appendChild(par);
        doScrollDown('chat-block');
        
    }

    addGotOnFieldMessage(){
        let colorClass = classColorName[this.currentPlayer.number];
        let par = document.createElement("p");
        let nameText = document.createElement("span");
        nameText.setAttribute("class",colorClass);
        let text = document.createTextNode(this.currentPlayer.name);
        nameText.appendChild(text);
        par.appendChild(nameText);
        let fieldNum = this.currentPlayer.currentFieldNum;
        
        let msgText = " попадает на поле " + fieldNames[fieldNum-1] + " и задумывается о покупке";
        text = document.createTextNode(msgText);
  
        par.appendChild(text);
        document.getElementById('chat-block').appendChild(par);
        doScrollDown('chat-block');
    }

    addSurrenderMessage(){
        let colorClass = classColorName[this.currentPlayer.number];
        let par = document.createElement("p");
        let nameText = document.createElement("span");
        nameText.setAttribute("class",colorClass);
        let text = document.createTextNode(this.currentPlayer.name);
        nameText.appendChild(text);
        par.appendChild(nameText);
        let fieldNum = this.currentPlayer.currentFieldNum;
        
        let msgText = " сдаётся";
        text = document.createTextNode(msgText);
  
        par.appendChild(text);
        document.getElementById('chat-block').appendChild(par);
        doScrollDown('chat-block');
    }

    startTimer(curPlayerNumber){
        this.startTime = new Date().getTime();//время старта в милисекундах
        this.timerId  = setInterval(
            ()=>{
        let curTime = new Date().getTime();
        let remainingTime = this.maxMovingTime - Math.floor((curTime - this.startTime)/1000);
        

        let timerSpan = document.getElementById("timer-text"+curPlayerNumber);
        timerSpan.textContent = remainingTime;

        if(remainingTime==0){
            this.playerLose();
            
        }
            }, 1000);
        
    }

    movePlayer(randomSum){
        // console.table(this);
        let playerNumber = this.currentPlayer.number;

        this.currentPlayer.fieldsPassedNumber += randomSum;
        this.currentPlayer.currentLap = Math.floor(this.currentPlayer.fieldsPassedNumber/40);
        
        //изменение параметров фишки (анимация)
        let player = document.querySelector('.'+playersIds[playerNumber]);
        let curLen = getComputedStyle(player).getPropertyValue('--distance'+(playerNumber+1));

        this.currentPlayer.currentFieldNum = this.currentPlayer.fieldsPassedNumber % 40 + 1
        let curFieldNum = this.currentPlayer.currentFieldNum;

        curLen = this.currentPlayer.currentLap*100+percentShift[curFieldNum-1];
        player.style.setProperty('--distance'+(playerNumber+1), curLen);


        // console.log(this.playersQueue);
    }

    updatePlayersBlock(){
        this.updateMoneyText();
        this.updateTimerText();
        this.updateBackground();        
    }

    updateBackground(){
        let prevPlayerNumber = this.playersQueue[this.curNonLosersNumber-1].number;
        // console.log("prev=" + prevPlayerNumber);
        let curPlayerNumber = this.playersQueue[0].number;
        // console.log("cur=" + curPlayerNumber);
        let prevDiv = document.getElementById(playerPropBlockIds[prevPlayerNumber]);
        prevDiv.classList.remove("active");
        let curDiv = document.getElementById(playerPropBlockIds[curPlayerNumber]);
        curDiv.classList.add("active");

    }

    updateMoneyText(){
        for(let i=0; i<this.curNonLosersNumber;i++){
            let playerNum = this.playersQueue[i].number;
            let div = document.getElementById(playerPropBlockIds[playerNum]);
            let moneySpan = div.querySelector(".money-text");
            moneySpan.textContent = this.playersQueue[i].money; 
        }
    }

    updateTimerText(){
        let prevPlayerNumber = this.playersQueue[this.curNonLosersNumber-1].number;
        let curPlayerNumber = this.playersQueue[0].number;
        let timerSpan = document.getElementById("timer-text"+prevPlayerNumber);
        timerSpan.textContent = this.maxMovingTime;
        timerSpan.style.display = "none";
        let curTimerSpan = document.getElementById("timer-text"+curPlayerNumber);
        curTimerSpan.style.display = "flex";
    }

}

function createGame(playerNum,playerData){
    let players = [];
    for(let i=0;i<playerNum;i++){
        players[i] = new Player(playerData[i][0],playerData[i][1],playerData[i][2]);
    }
    
    game = new Game(playerNum,players);
}

function startGame(){
    let playerNum = 5;
    let playerData = [["Victor",15000,0],["ILON MASK",15000,1],["Гена",15000,2],["Галкин",15000,3],["Семён",15000,4]];
    createGame(playerNum, playerData);
    createFields();
    // console.table(fields);
    addPlayersBlock(playerNum,game.playerList);

    createModals();
    setScalablePath(playerNum);
    setFieldParams();
    rollDiceModal.open();
    game.startTimer(0);
}


